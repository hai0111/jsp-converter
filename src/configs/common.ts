import { anyRgx, IRuleConfig, IRuleConfigType, regexParser } from "./utils";

const rulesConfig: IRuleConfig[] = [
  {
    type: IRuleConfigType.DELETE,
    detected: `<(dl|dt|dd)>`,
  },
  {
    type: IRuleConfigType.DELETE,
    detected: `<div class="clear"></div>`,
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
    detected: "btn_\\d+",
    dataReplaced: "btn",
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
    detected: '<div id="contents">',
    dataReplaced: '<div id="contents" class="asis-layout">',
  },
  {
    type: IRuleConfigType.EDIT,
    detected: "/WEB-INF/view/common/(?!asis)",
    dataReplaced: "/WEB-INF/view/common/asis/",
  },
  {
    type: IRuleConfigType.EDIT,
    detected:
      '<img[^>]*img_mark[^>]*>([^<]*)(%space%*<div class="back_button_area">%any%*?</div>)?%space%*<br class="clear">',
    dataReplaced: (str, ...matches) => {
      const [title, buttonDiv] = matches;
      let href: string | undefined;
      let buttonLabel: string | undefined;
      if (buttonDiv) {
        href = buttonDiv.match(/(?<=href=')[^"]*(?='")/)?.[0];
        buttonLabel = buttonDiv.match(/(?<=value=")[^"]*(?=")/)?.[0];
      }
      return `
          <c:import url="/WEB-INF/view/common/asis/section_title.jsp">
            <c:param name="title" value="${title.trim()}"/>
            ${href ? `<c:param name="backPath" value="${href}"/>` : ""}
            ${
              buttonLabel
                ? `<c:param name="backTitle" value="${buttonLabel}"/>`
                : ""
            }
          </c:import>
      `;
    },
  },
  {
    type: IRuleConfigType.EDIT,
    detected: `<table[^>]*class="comm_tbl[ \\w]+"[^>]*>%any%+?</table>`,
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
];

export default rulesConfig;
