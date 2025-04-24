import { anyRgx, IRuleConfig, ERuleConfigType, spaceRgx } from "./utils";

const rulesConfig: IRuleConfig[] = [
  {
    type: ERuleConfigType.DELETE,
    detected: `<div[^>]*msg_box_compl[^>]*>`,
  },
  {
    type: ERuleConfigType.DELETE,
    detected: `<div[^>]*submit_area[^>]*>`,
  },
  {
    type: ERuleConfigType.EDIT,
    detected: `<p>(?=%space%*<spring:message%any%+</p>)`,
    dataReplaced: `<p class="asis-content__complete__txt">`,
  },
  {
    type: ERuleConfigType.EDIT,
    detected: `(%before%*<p class="asis-content__complete__txt">)`,
    dataReplaced: `
    <img src="\${f:url('/dist/images/icons/CheckCircleBrokenIcon.svg')}" alt=""
                     width="48" height="48" class="asis-content__complete__icon">
                     $1`,
  },
  {
    type: ERuleConfigType.WRAP,
    detected: `(?<=<c:import[^>]*section_title[^>]*>%any%+</c:import>)(%any%+)(?=<!-- footer start -->)`,
    dataReplaced: ` 
      <main class="asis-main asis-main--yellow">
          <div class="asis-content__wrapper">
              <div class="asis-content asis-content--complete">
                %content%
              </div>
          </div>
      </main>
      `,
  },
  {
    type: ERuleConfigType.WRAP,
    detected: `((%before%*<input[^>]*href[^>]*>%after%*)+)`,
    dataReplaced: ` 
      <div class="asis-content__complete__btn">
        %content%
      </div>
      `,
  },
];

export default rulesConfig;
