import { ERuleConfigType, IRuleConfig, regexParser } from "./utils";

const ruleConfigs: IRuleConfig[] = [
  {
    type: ERuleConfigType.EDIT,
    detected: `<table[^>]((?![^>]*id)[^>])*>%any%+?</table>`,
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
    detected: `<table[^>]*id[^>]*>%any%+?</table>`,
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
