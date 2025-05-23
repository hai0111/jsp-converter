import dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
import * as converterConfig from "./configs";
import { IRuleConfig, ERuleConfigType, regexParser } from "./configs/utils";
dotenv.config();

declare global {
  interface String {
    replaceClasses(pattern: string | RegExp, replacement: string): string;
  }
}

String.prototype.replaceClasses = function (pattern, classes: string) {
  let result = this.toString();

  result = result.replace(pattern, (str) => {
    let replacer = str;
    const isHasClass = /class="[^"]*"/.test(replacer);
    if (isHasClass) {
      replacer = replacer.replace(/class="([^"]*)"/g, `class="${classes}"`);
    } else {
      replacer = replacer.replace(
        /<\w+/g,
        (str) => `${str} class="${classes}"`
      );
    }
    return replacer;
  });

  return result;
};

class Converter {
  PATH_INPUT = process.env.PATH_INPUT!;
  PATH_OUTPUT = process.env.PATH_OUTPUT!;
  PATH_MATCH = /(\\list\\index|\\list).jsp$/;
  CONFIGS: (keyof typeof converterConfig)[] = ["common", "list"];
  WRITABLE = true;

  deleteRules: IRuleConfig[] = [];
  editRules: IRuleConfig[] = [];
  moveRules: IRuleConfig[] = [];
  wrapRules: IRuleConfig[] = [];

  init() {
    const configs = [];
    for (const key in converterConfig) {
      if (this.CONFIGS.includes(key as keyof typeof converterConfig)) {
        configs.push(...converterConfig[key as keyof typeof converterConfig]);
      }
    }

    configs.forEach((item) => {
      switch (item.type) {
        case ERuleConfigType.DELETE:
          this.deleteRules.push(item);
          break;
        case ERuleConfigType.EDIT:
          this.editRules.push(item);
          break;
        case ERuleConfigType.MOVE:
          this.moveRules.push(item);
          break;
        case ERuleConfigType.WRAP:
          this.wrapRules.push(item);
          break;
      }
    });
  }

  walkDir(dir: string) {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        this.walkDir(fullPath); // 🌀 Đệ quy nếu là folder
      } else if (this.PATH_MATCH.test(fullPath)) {
        this.convertFile(fullPath); // 📄 Gọi callback nếu là file
      }
    });
  }

  convertFile(path: string) {
    let content = fs.readFileSync(path, "utf8");

    if (!this.WRITABLE) {
      this.testRegex(content);
      return;
    }

    content = this.handleDelete(content);
    content = this.handleEdit(content);
    content = this.handleWrap(content);
    content = this.handleMove(content);
    content = this.handleEditWithPath(content, path);
    content = this.handleCleanUp(content);

    try {
      fs.writeFileSync(
        path.replace(this.PATH_INPUT, this.PATH_OUTPUT),
        content
      );
    } catch {
      fs.mkdirSync(
        path.replace(this.PATH_INPUT, this.PATH_OUTPUT).replace(/[\w\.]+$/, ""),
        { recursive: true }
      );

      fs.writeFileSync(
        path.replace(this.PATH_INPUT, this.PATH_OUTPUT),
        content
      );
    }

    console.log("✅ Done: ", path);
  }

  handleDelete(content: string) {
    this.deleteRules.forEach((dr) => {
      const regex = regexParser(dr.detected);
      const openTags = content.match(regex);

      openTags?.forEach((ot) => {
        let position: number;
        content = content.replace(ot, (_, p) => {
          position = p;
          return "";
        });
        const ct = "</" + ot.match(/\w+/)![0] + ">";
        const _ot = "<" + ot.match(/\w+/)![0];
        const regex = `${_ot}|${ct}`;
        let i = 1;
        content = content.replace(regexParser(regex), (m, p) => {
          if (p >= position) {
            if (m.startsWith("</")) i--;
            else i++;

            if (!i) return "";
          }
          return m;
        });
      });
    });

    return content;
  }

  handleEdit(content: string) {
    this.editRules.forEach((er) => {
      let isLeftover = true;
      const regex = regexParser(er.detected);
      do {
        if (
          typeof er.dataReplaced === "string" &&
          er.dataReplaced.includes("class:")
        ) {
          const classes = er.dataReplaced.replace("class:", "");
          content = content.replaceClasses(regex, classes);
          return;
        }
        content = content.replace(
          regex,
          this.getReplacer(er.dataReplaced) as any
        );
        isLeftover = regex.test(content);
      } while (isLeftover && er.isNested);
    });

    return content;
  }

  handleMove(content: string) {
    this.moveRules.forEach((mr) => {
      const regex = regexParser(mr.detected);
      const matchers = content.match(regex);
      let removed = false;
      matchers?.forEach((m) => {
        if (regexParser(mr.dataReplaced as string).test(content)) {
          if (!removed && !mr.keepOriginOnMove) {
            content = content.replace(m, "");
            removed = true;
          }
          content = content.replace(regexParser(mr.dataReplaced as string), m);
        }
      });
    });

    return content;
  }

  handleEditWithPath(content: string, path: string) {
    const parentPath = path.match(/(?<=view\\)\w+/)?.[0] || "";

    content = content.replace(
      '<c:import url="/WEB-INF/view/common/asis/menu.jsp"/>',
      `<c:import url="/WEB-INF/view/common/asis/menu.jsp">
        <c:param name="activeTab" value="${parentPath}"/>
    </c:import>`
    );
    return content;
  }

  handleWrap(content: string) {
    this.wrapRules.forEach((wr) => {
      const [openWrap] = (wr.dataReplaced as string).split(/%content%|\$\d/);

      const regexOpen = regexParser(
        openWrap.replace(regexParser("%space%*"), "%space%*")
      );

      if (regexOpen.test(content)) return;

      const regex = regexParser(wr.detected);

      content = content.replace(regex, (_, ...matchers) => {
        const content = matchers.find(
          (m) => m?.replace && m?.replace(regexParser("%space%+"), "")
        );
        return (wr.dataReplaced as string).replace(/%content%|\$\d/, content);
      });
    });

    return content;
  }

  handleCleanUp(content: string) {
    content = content.replace(regexParser("(\n(\r\\s\t+)?)+"), "\n");
    return content;
  }

  getReplacer(replacer: IRuleConfig["dataReplaced"]) {
    if (!replacer) return "";
    else if (typeof replacer === "string") return replacer;
    return (_: string, ...params: any[]) => {
      params.pop();
      params.pop();
      return replacer(_, ...params);
    };
  }

  run() {
    this.init();
    if (new RegExp(/\w+\.\w+$/).test(this.PATH_INPUT))
      this.convertFile(this.PATH_INPUT); // 📄 Gọi callback nếu là file
    else this.walkDir(this.PATH_INPUT);
  }
  testRegex(content: string) {
    const regex = this.PATH_MATCH;
  }
}

const app = new Converter();
app.run();
