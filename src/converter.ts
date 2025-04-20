import * as fs from "fs";
import path from "path";
import {
  after,
  anyRgx,
  before,
  IRuleConfig,
  IRuleConfigType,
  spaceRgx,
} from "./configs/utils";
import * as converterConfig from "./configs";
import dotenv from "dotenv";
dotenv.config();

class Converter {
  PATH_INPUT = process.env.PATH_INPUT!;
  PATH_OUTPUT = process.env.PATH_OUTPUT!;
  PATH_MATCH = `compl.jsp$`;
  CONFIGS = ["common"];

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
    content = this.handleDelete(content, path);
    content = this.handleEdit(content);
    content = this.handleMove(content);
    content = this.handleWrap(content);

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

  handleDelete(content: string, path?: string) {
    this.deleteRules.forEach((dr) => {
      const regex = this.regexParser(dr.detected);
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
        content = content.replace(this.regexParser(regex), (m, p) => {
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
      const regex = this.regexParser(er.detected);
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
      const regex = this.regexParser(er.detected);
      content = content.replace(
        regex,
        this.getReplacer(er.dataReplaced) as any
      );
    });

    return content;
  }

  regexParser(rgx: string) {
    rgx = rgx.replace(/%before%/g, `(${before})`);
    rgx = rgx.replace(/%after%/g, `(${after})`);
    rgx = rgx.replace(/%space%/g, `(${spaceRgx})`);
    rgx = rgx.replace(/%any%/g, `(${anyRgx})`);
    return new RegExp(rgx, "g");
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
    if (new RegExp(this.PATH_MATCH).test(this.PATH_INPUT))
      this.convertFile(this.PATH_INPUT); // 📄 Gọi callback nếu là file
    else this.walkDir(this.PATH_INPUT);
  }
}

const app = new Converter();
app.run();
