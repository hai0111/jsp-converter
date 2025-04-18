import { anyRgx, IRuleConfig, IRuleConfigType, spaceRgx } from "./utils";

const rulesConfig: IRuleConfig[] = [
  {
    type: IRuleConfigType.DELETE,
    detected: `<(dl|dt|dd)>`,
  },
  {
    type: IRuleConfigType.DELETE,
    detected: `<div[^>]*content_main[^>]*>`,
  },
  {
    type: IRuleConfigType.EDIT,
    detected: `&nbsp;`,
    dataReplaced: "",
  },
  {
    type: IRuleConfigType.EDIT,
    detected: `<[%!]--(${anyRgx})+?--%?>`,
    dataReplaced: "",
  },
  {
    type: IRuleConfigType.EDIT,
    detected:
      'PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"',
    dataReplaced: "",
  },
  {
    type: IRuleConfigType.EDIT,
    detected: "/WEB-INF/view/common/",
    dataReplaced: "/WEB-INF/view/common/asis/",
  },
];

export default rulesConfig;
