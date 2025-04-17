import * as fs from "fs";
import path from "path";
import converterConfig, {
  after,
  before,
  IRuleConfig,
  IRuleConfigType,
} from "./convert-config";

const deleteRules: IRuleConfig[] = [];
const editRules: IRuleConfig[] = [];
const moveRules: IRuleConfig[] = [];
const wrapRules: IRuleConfig[] = [];

converterConfig.forEach((item) => {
  switch (item.type) {
    case IRuleConfigType.DELETE:
      ``;
      deleteRules.push(item);
      break;
    case IRuleConfigType.EDIT:
      editRules.push(item);
      break;
    case IRuleConfigType.MOVE:
      moveRules.push(item);
      break;
    case IRuleConfigType.WRAP:
      wrapRules.push(item);
      break;
  }
});

class Converter {
  PATH_INPUT = `E:\\converter\\view`;
  PATH_OUTPUT = `E:\\converter\\view-converted`;
  PATH_MATCH = `compl.jsp$`;

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

    // console.log("✅ Done: ", path);
  }

  handleDelete(content: string) {
    deleteRules.forEach((dr) => {
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
        let i = 1;
        content = content.replace(new RegExp(`${_ot}|${ct}`, "g"), (m, p) => {
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
    editRules.forEach((er) => {
      const regex = this.regexParser(er.detected);
      content = content.replace(regex, er.dataReplaced!);
    });

    return content;
  }

  handleMove(content: string) {
    return content;
  }

  handleWrap(content: string) {
    wrapRules.forEach((er) => {
      const regex = this.regexParser(er.detected);
      content = content.replace(regex, er.dataReplaced!);
    });

    return content;
  }

  regexParser(rgx: string) {
    rgx = rgx.replace(/%before%/g, `(${before})`);
    rgx = rgx.replace(/%after%/g, `(${after})`);
    return new RegExp(rgx, "g");
  }

  run() {
    this.walkDir(this.PATH_INPUT);
    deleteRules.forEach((d) => {});
  }
}

const app = new Converter();
app.run();
