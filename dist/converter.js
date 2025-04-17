"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const convert_config_1 = __importStar(require("./convert-config"));
const deleteRules = [];
const editRules = [];
const moveRules = [];
const wrapRules = [];
convert_config_1.default.forEach((item) => {
    switch (item.type) {
        case convert_config_1.IRuleConfigType.DELETE:
            ``;
            deleteRules.push(item);
            break;
        case convert_config_1.IRuleConfigType.EDIT:
            editRules.push(item);
            break;
        case convert_config_1.IRuleConfigType.MOVE:
            moveRules.push(item);
            break;
        case convert_config_1.IRuleConfigType.WRAP:
            wrapRules.push(item);
            break;
    }
});
class Converter {
    constructor() {
        this.PATH_INPUT = path_1.default.join(__dirname, "../view");
        this.PATH_OUTPUT = path_1.default.join(__dirname, "../view-converted");
    }
    walkDir(dir) {
        fs.readdirSync(dir).forEach((file) => {
            const fullPath = path_1.default.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                this.walkDir(fullPath); // 🌀 Đệ quy nếu là folder
            }
            else {
                this.convertFile(fullPath); // 📄 Gọi callback nếu là file
            }
        });
    }
    convertFile(path) {
        let content = fs.readFileSync(path, "utf8");
        content = this.handleDelete(content);
        content = this.handleEdit(content);
        content = this.handleMove(content);
        content = this.handleWrap(content);
        fs.writeFileSync(path.replace(this.PATH_INPUT, this.PATH_OUTPUT), content);
        console.log("✅ Done: ", path);
    }
    handleDelete(content) {
        deleteRules.forEach((dr) => {
            const regex = new RegExp(dr.detected, "g");
            const openTags = content.match(regex);
            openTags === null || openTags === void 0 ? void 0 : openTags.forEach((ot) => {
                let position;
                content = content.replace(ot, (_, p) => {
                    position = p;
                    return "";
                });
                const ct = "</" + ot.match(/\w+/)[0] + ">";
                const _ot = "<" + ot.match(/\w+/)[0];
                let i = 1;
                content = content.replace(new RegExp(`${_ot}|${ct}`, "g"), (m, p) => {
                    if (p > position) {
                        if (m.startsWith("</"))
                            i--;
                        else
                            i++;
                        console.log({
                            i,
                            m,
                        });
                        if (!i)
                            return "";
                    }
                    return m;
                });
            });
        });
        return content;
    }
    handleEdit(content) {
        editRules.forEach((er) => {
            const regex = new RegExp(er.detected, "g");
            content = content.replace(regex, er.dataReplaced);
        });
        return content;
    }
    handleMove(content) {
        return content;
    }
    handleWrap(content) {
        return content;
    }
    run() {
        this.walkDir(this.PATH_INPUT);
        deleteRules.forEach((d) => { });
    }
}
const app = new Converter();
app.run();
