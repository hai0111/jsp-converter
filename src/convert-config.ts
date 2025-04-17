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
    type: IRuleConfigType.DELETE,
    detected: `<div[^>]*msg_box_compl[^>]*>`,
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
  {
    type: IRuleConfigType.EDIT,
    detected: `<img[^>]*img_mark[^>]*>(${spaceRgx})*(.+)`,
    dataReplaced: `<c:import url="/WEB-INF/view/common/asis/section_title.jsp">
                                        <c:param name="title" value="$2" />
                                    </c:import>`,
  },
  {
    type: IRuleConfigType.EDIT,
    detected: `<p>(?=(${anyRgx})+spring(${anyRgx})+</p>)`,
    dataReplaced: `<p class="asis-content__complete__txt">`,
  },
  {
    type: IRuleConfigType.WRAP,
    detected: `(((${spaceRgx})*?%before%*<input[^>]*href[^>]*>%after%*(${spaceRgx})*)+)`,
    dataReplaced: `
    <div class="asis-content__complete__btn">
      $1
    </div>
    `,
  },
  {
    type: IRuleConfigType.WRAP,
    detected: `(?<=<c:import[^>]*section_title[^>]*>(${anyRgx})+</c:import>)(${anyRgx}+)(?=<c:import[^>]*footer[^>]*>)`,
    dataReplaced: `
    <main class="asis-main asis-main--yellow">
        <div class="asis-content__wrapper">
            <div class="asis-content asis-content--complete">
              $2
            </div>
        </div>
    </main>
    `,
  },
];

export default rulesConfig;

console.log(``.match(new RegExp(`<p>(${anyRgx})+saÁ(${anyRgx})+</p>`)));
