export enum IRuleConfigType {
  DELETE,
  EDIT,
  MOVE,
  WRAP,
}
export interface IRuleConfig {
  type: IRuleConfigType;
  detected: string;
  dataReplaced?: string;
}

export const spaceRgx = `\n|\s|\t|\r| `;
export const anyRgx = `[\\s\\S]`;
export const before = `(<c:[^>]+>|<[%!]--(${anyRgx})+--%?>|&nbsp;)(${spaceRgx})*`;
export const after = `(${spaceRgx})*(</c:[^>]+>|<[%!]--(${anyRgx})+--%?>|&nbsp;)`;
