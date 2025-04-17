import * as fs from "fs";
import path from "path";
import converterConfig, {
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
  PATH_INPUT = path.join(__dirname, "../view");
  PATH_OUTPUT = path.join(__dirname, "../view-converted");

  walkDir(dir: string) {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        this.walkDir(fullPath); // 🌀 Đệ quy nếu là folder
      } else {
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

    fs.writeFileSync(path.replace(this.PATH_INPUT, this.PATH_OUTPUT), content);

    console.log("✅ Done: ", path);
  }

  handleDelete(content: string) {
    deleteRules.forEach((dr) => {
      const regex = new RegExp(dr.detected, "g");
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

            console.log({
              i,
              m,
            });

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
      const regex = new RegExp(er.detected, "g");
      content = content.replace(regex, er.dataReplaced!);
    });

    return content;
  }

  handleMove(content: string) {
    return content;
  }

  handleWrap(content: string) {
    return content;
  }

  run() {
    this.walkDir(this.PATH_INPUT);
    deleteRules.forEach((d) => {});
  }
}

const app = new Converter();
app.run();
