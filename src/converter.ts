import dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
import * as converterConfig from "./configs";
import { IRuleConfig, IRuleConfigType, regexParser } from "./configs/utils";
dotenv.config();

declare global {
  interface String {
    replaceClasses(pattern: string | RegExp, replacement: string): string;
  }
}

String.prototype.replaceClasses = function (pattern, classes: string) {
  let result = this.toString();
  const matches = this.match(pattern);
  matches?.forEach((matched) => {
    let replacer = matched;
    const isHasClass = /class="[^"]*"/.test(replacer);
    if (isHasClass) {
      replacer = replacer.replace(/class="([^"]*)"/g, `class="${classes}"`);
    } else {
      replacer = replacer.replace(
        /<\w+/g,
        (str) => `${str} class="${classes}"`
      );
    }
    result = result.replace(matched, replacer);
  });

  return result;
};

class Converter {
  PATH_INPUT = process.env.PATH_INPUT!;
  PATH_OUTPUT = process.env.PATH_OUTPUT!;
  PATH_MATCH = `compl.jsp$`;
  CONFIGS = ["common", "compl"];
  WRITABLE = true;

  deleteRules: IRuleConfig[] = [];
  editRules: IRuleConfig[] = [];
  moveRules: IRuleConfig[] = [];
  wrapRules: IRuleConfig[] = [];

  init() {
    const configs = [];
    for (const key in converterConfig) {
      if (this.CONFIGS.includes(key)) {
        configs.push(...converterConfig[key as keyof typeof converterConfig]);
      }
    }

    configs.forEach((item) => {
      switch (item.type) {
        case IRuleConfigType.DELETE:
          this.deleteRules.push(item);
          break;
        case IRuleConfigType.EDIT:
          this.editRules.push(item);
          break;
        case IRuleConfigType.MOVE:
          this.moveRules.push(item);
          break;
        case IRuleConfigType.WRAP:
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
      } else if (new RegExp(this.PATH_MATCH).test(fullPath)) {
        this.convertFile(fullPath); // 📄 Gọi callback nếu là file
      }
    });
  }

  convertFile(path: string) {
    let content = fs.readFileSync(path, "utf8");
    content = this.handleDelete(content);
    content = this.handleEdit(content);
    content = this.handleMove(content);
    content = this.handleWrap(content);

    if (!this.WRITABLE) return;

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
          if (p > position) {
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
      const regex = regexParser(er.detected);
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
    });

    return content;
  }

  handleMove(content: string) {
    return content;
  }

  handleWrap(content: string) {
    this.wrapRules.forEach((er) => {
      const [openWrap] = (er.dataReplaced as string).split(/%content%|\$\d/);

      const regexOpen = regexParser(
        openWrap.replace(regexParser("%space%*"), "%space%*")
      );

      if (regexOpen.test(content)) return;

      const regex = regexParser(er.detected);

      content = content.replace(regex, (_, ...matchers) => {
        const content = matchers.find(
          (m) => m?.replace && m?.replace(regexParser("%space%+"), "")
        );
        return (er.dataReplaced as string).replace(/%content%|\$\d/, content);
      });
    });

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
}

const app = new Converter();
app.run();
