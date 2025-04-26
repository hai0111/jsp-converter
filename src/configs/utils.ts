export enum ERuleConfigType {
  DELETE,
  EDIT,
  MOVE,
  WRAP,
}
export interface IRuleConfig {
  type: ERuleConfigType;
  isNested?: boolean;
  keepOriginOnMove?: boolean;
  detected: string;
  dataReplaced?: ((match: string, ...substring: string[]) => string) | string;
}

export const classRgx = 'class="[^"]*"';
export const spaceRgx = "[\n\\s\t\r]";
export const anyRgx = "[\\s\\S]";
export const before = `(?:<c:[^>]+((?<!/)>)|<[%!]--((?<!${anyRgx}--%?>)${anyRgx})+?--%?>|&nbsp;|${spaceRgx})`;
export const after = `(?:</c:[^>]+>|<[%!]--((?<!${anyRgx}--%?>)${anyRgx})+?--%?>|&nbsp;|${spaceRgx})`;

export const regexParser = (rgx: string) => {
  rgx = rgx.replace(/%class%/g, classRgx);
  rgx = rgx.replace(/%space%/g, spaceRgx);
  rgx = rgx.replace(/%any%/g, anyRgx);
  rgx = rgx.replace(/%before%/g, before);
  rgx = rgx.replace(/%after%/g, after);
  return new RegExp(rgx, "g");
};
