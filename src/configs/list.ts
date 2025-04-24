import { IRuleConfig, ERuleConfigType, regexParser } from "./utils";

const ruleConfigs: IRuleConfig[] = [
  {
    type: ERuleConfigType.WRAP,
    detected:
      "(?<=<c:import[^>]*section_title[^>]*>%any%*?</c:import>)(%any%+?)(?=(<!-- footer start -->)?%space%*<c:import[^>]*footer[^>]*>)",
    dataReplaced: ` 
    <main class="asis-main">
        <div class="asis-content asis-content--list">
          %content%
        </div>
    </main>
        `,
  },
  {
    type: ERuleConfigType.EDIT,
    detected: '<div class="header_title">%any%+?</div>',
    dataReplaced: (str) => {
      const input = str.match(regexParser("<input[^>]*>"))?.[0] || "";

      let p = str.match(regexParser("<p[^>]*>(%any%+?)</p>"))?.[0] || "";
      p = p.replace(
        regexParser("<p[^>]*>(%any%+?)</p>"),
        `
        <div class="asis-content__list__header">
          <div class="asis-content__list__header__left">
                          <h2 class="heading heading--14">$1</h2>
                      </div>
                    </div>`
      );

      return `
      ${p}
      <div class="asis-content__list__header__right">\n
      ${input}
      </div>
      `;
    },
  },
  {
    type: ERuleConfigType.MOVE,
    detected: '<ul class="pagination">%any%+?</ul>',
    dataReplaced: '(?<=<div class="asis-content__list__header__right">\n)',
  },
  {
    type: ERuleConfigType.EDIT,
    detected:
      "<div[^>]*form-table__row[^>]*>%space%*?<div[^>]*form-table__control[^>]*>(%any%*?)</div>%space%*?</div>%space%*?</div>",
    dataReplaced: `</div>

                <div class="asis-content__search-form__btn-block layout--justify-center">
                    $1
                </div>`,
  },
];

export default ruleConfigs;
