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
      '(?<=searchListCnt >= 0%any%+<div class="asis-content__list__header__right">\n)',
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
    type: ERuleConfigType.EDIT,
    detected: `(?<!searchListCnt >= 0%any%+)<table[^>]*>%any%+?</table>`,
    dataReplaced: (str) => {
      str = str.replaceClasses(
        regexParser("(<table[^>])%class%?([^>]*>)"),
        "form-table"
      );

      str = str.replace(
        regexParser(
          "<tr>%space%*<td[^>]*tbl_header txt_center[^>]*>([^<]*)</td>%space%*</tr>"
        ),
        '<div class="form-table__title">$2</div>'
      );

      str = str.replaceClasses(
        regexParser("<tr[^>]*[^>]*>"),
        "form-table__row"
      );

      str = str.replaceClasses(
        regexParser("<td[^>]*tbl_header[^>]*>"),
        "form-table__label"
      );
      str = str.replaceClasses(
        regexParser("<td((?![^>]*form-table__label)[^>])*>"),
        "form-table__control"
      );

      str = str.replace(regexParser("</(table|tr|td)>"), "</div>");
      str = str.replace(regexParser("<(table|tr|td)"), "<div");
      return str;
    },
  },
  {
    type: ERuleConfigType.EDIT,
    detected: `(?<=searchListCnt >= 0%any%+)<table[^>]*>%any%+?</table>`,
    dataReplaced: (str) => {
      str = str.replaceClasses(regexParser("<table[^>]*>"), "table");

      str = str.replaceClasses(regexParser("<thead[^>]*>"), "table__thead");

      str = str.replaceClasses(regexParser("<tbody[^>]*>"), "table__tbody");

      str = str.replaceClasses(
        regexParser("(?<=<thead[^>]*>%any%*)<tr[^>]*>(?=%any%*</thead>)"),
        "table__thead__row"
      );

      str = str.replaceClasses(
        regexParser("(?<!<thead[^>]*>%any%*)<tr[^>]*>(?!%any%*</thead>)"),
        "table__tbody__row"
      );

      str = str.replaceClasses(
        regexParser("<th [^>]*>"),
        "table__column table__column--border-right"
      );

      str = str.replaceClasses(
        regexParser("<td[^>]*>"),
        "table__column table__column--border-right"
      );
      str = str.replaceClasses(
        regexParser(
          "<t[dh][^>]*>(?=((?<!%any%*?</t[dh]>)%any%)*</t[dh]>%after%*</tr>)"
        ),
        "table__column"
      );

      return str;
    },
  },
];

export default ruleConfigs;
