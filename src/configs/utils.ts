export enum IRuleConfigType {
  DELETE,
  EDIT,
  MOVE,
  WRAP,
}
export interface IRuleConfig {
  type: IRuleConfigType;
  detected: string;
  dataReplaced?: ((match: string, ...substring: string[]) => string) | string;
}

export const classRgx = 'class="[^"]*"';
export const spaceRgx = `\n|\\s|\t|\r`;
export const anyRgx = `[\\s\\S]`;
export const before = `(<c:[^>]+>|<[%!]--(${anyRgx})+--%?>|&nbsp;)(${spaceRgx})*`;
export const after = `(${spaceRgx})*(</c:[^>]+>|<[%!]--(${anyRgx})+--%?>|&nbsp;)`;

export const regexParser = (rgx: string) => {
  rgx = rgx.replace(/%class%/g, `(${classRgx})`);
  rgx = rgx.replace(/%before%/g, `(${before})`);
  rgx = rgx.replace(/%after%/g, `(${after})`);
  rgx = rgx.replace(/%space%/g, `(${spaceRgx})`);
  rgx = rgx.replace(/%any%/g, `(${anyRgx})`);
  return new RegExp(rgx, "g");
};
