import { anyRgx, IRuleConfig, IRuleConfigType, spaceRgx } from "./utils";

const rulesConfig: IRuleConfig[] = [
  {
    type: IRuleConfigType.DELETE,
    detected: `<div[^>]*msg_box_compl[^>]*>`,
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
