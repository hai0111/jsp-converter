export enum IRuleConfigType {
  DELETE,
  EDIT,
  MOVE,
  WRAP,
}
export interface IRuleConfig {
  type: IRuleConfigType;
  detected: string | RegExp;
  dataReplaced?: string;
}

export const anyRgx = /(.|\n|\s)/;
export const spaceRgx = /(\n|\s)/;

const rulesConfig: IRuleConfig[] = [
  {
    type: IRuleConfigType.DELETE,
    detected: `<(dl|dt|dd)>`,
  },
  {
    type: IRuleConfigType.DELETE,
    detected: `<div id="content_main">`,
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
  {
    type: IRuleConfigType.EDIT,
    detected: `<img[^>]*img_mark[^>]*>\s*\r\n +([^ ].+(?=\r))`,
    dataReplaced: `<c:import url="/WEB-INF/view/common/asis/section_title.jsp">
                                        <c:param name="title" value="$1" />
                                    </c:import>`,
  },
];

export default rulesConfig;
