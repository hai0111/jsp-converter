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
    detected: "<div[^>*]header_title[^>*]>%any%+?</div>",
    dataReplaced: (str) => {
      const input = str.match(regexParser("<input[^>]*>"))?.[0] || "";

      let p = str.match(regexParser("<p[^>]*>(%any%+?)</p>"))?.[0] || "";
      p = p.replace(
        regexParser("<p[^>]*>(%any%+?)</p>"),
        `
          <div class="asis-content__list__header__left">
                          <h2 class="heading heading--14">$1</h2>
                      </div>
                      `
      );

      return `
      <div class="asis-content__list__header">
        ${p}
        <div class="asis-content__list__header__right">\n
        ${input}
        </div>
      </div>
      `;
    },
  },
  {
    type: ERuleConfigType.MOVE,
    detected: '<ul class="pagination">%any%+?</ul>',
    dataReplaced:
      '(?<=(?:searchListCnt >= 0|pagerTotal > 0)%any%+<div class="asis-content__list__header__right">\n)',
  },
  {
    type: ERuleConfigType.MOVE,
    detected:
      '(?<=<ul class="pagination">%any%+?</ul>)%before%*<input[^>]*>%after%*',
    dataReplaced: '(?<=<div class="asis-content__list__footer">\n)',
    keepOriginOnMove: true,
  },
  {
    type: ERuleConfigType.MOVE,
    detected: '<ul class="pagination">%any%+?</ul>',
    dataReplaced: '(?<=<div class="asis-content__list__footer">\n)',
    keepOriginOnMove: true,
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
  {
    type: ERuleConfigType.WRAP,
    detected: "(<table[^>]*#table[^>]*>%any%*?</table>)",
    dataReplaced: `
    <div class="table__container">  
      %content%
    </div>
    <div class="asis-content__list__footer">
    </div>
  `,
  },
];

export default ruleConfigs;
