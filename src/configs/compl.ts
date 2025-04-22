import { anyRgx, IRuleConfig, IRuleConfigType, spaceRgx } from "./utils";

const rulesConfig: IRuleConfig[] = [
  {
    type: IRuleConfigType.DELETE,
    detected: `<div[^>]*msg_box_compl[^>]*>`,
  },
  {
    type: IRuleConfigType.EDIT,
    detected: `<p>(?=%any%+spring%any%+</p>)`,
    dataReplaced: `<p class="asis-content__complete__txt">`,
  },
  {
    type: IRuleConfigType.WRAP,
    detected: `(%before%*<input[^>]%after%*)+`,
    dataReplaced: ` 
      <div class="asis-content__complete__btn">
        %content%
      </div>
      `,
  },
  {
    type: IRuleConfigType.WRAP,
    detected: `(?<=<c:import[^>]*section_title[^>]*>%any%+</c:import>)(%any%+)(?=<c:import[^>]*footer[^>]*>)`,
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
];

export default rulesConfig;
