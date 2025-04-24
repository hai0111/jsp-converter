import { anyRgx, IRuleConfig, ERuleConfigType, regexParser } from "./utils";

const rulesConfig: IRuleConfig[] = [
  {
    type: ERuleConfigType.DELETE,
    detected: `<(dl|dt|dd)>`,
  },
  {
    type: ERuleConfigType.DELETE,
    detected: `<div[^>]*content_main[^>]*">`,
  },
  {
    type: ERuleConfigType.EDIT,
    detected: `<br class="clear"/>`,
    dataReplaced: "",
  },
  {
    type: ERuleConfigType.EDIT,
    detected: `<c:import[^>]*head_google_font.jsp[^>]*>`,
    dataReplaced: "",
  },
  {
    type: ERuleConfigType.EDIT,
    detected: `msg_box_error_left(?=")`,
    dataReplaced: "msg_box_error_left alert alert--error",
  },
  {
    type: ERuleConfigType.EDIT,
    detected: `&nbsp;`,
    dataReplaced: "",
  },
  {
    type: ERuleConfigType.EDIT,
    detected: `<br class="clear">`,
    dataReplaced: "",
  },
  {
    type: ERuleConfigType.EDIT,
    detected: "btn_\\d+",
    dataReplaced: "btn btn--font-size-16 btn--font-weight-700",
  },
  // {
  //   type: ERuleConfigType.EDIT,
  //   detected: `<[%!]--(${anyRgx})+?--%?>`,
  //   dataReplaced: "",
  // },
  {
    type: ERuleConfigType.EDIT,
    detected:
      'PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"',
    dataReplaced: "",
  },
  {
    type: ERuleConfigType.EDIT,
    detected: '<div id="contents">',
    dataReplaced: '<div id="contents" class="asis-layout">',
  },
  {
    type: ERuleConfigType.EDIT,
    detected: "/WEB-INF/view/common/(?!asis)",
    dataReplaced: "/WEB-INF/view/common/asis/",
  },
  {
    type: ERuleConfigType.EDIT,
    detected:
      '<img[^>]*img_mark[^>]*>([^<]*)(%space%*<div class="back_button_area">%any%*?</div>)?',
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
    type: ERuleConfigType.MOVE,
    detected: "<c:import[^>]*section_title[^>]*>%any%+?</c:import>",
    dataReplaced: "(?<=<!-- main_menu stop -->)",
  },

  {
    type: ERuleConfigType.EDIT,
    detected: `<ol%any%*?</ol>`,
    dataReplaced: (str) => {
      str = str.replace(
        regexParser("<ol[^>]*>"),
        `<div class="stepper__container">
            <div class="stepper">`
      );
      str = str.replace(
        regexParser("</ol>"),
        `   </div>
         </div>`
      );

      let isBeforeCurrent = true;
      str = str.replace(regexParser("<li[^>]*>%any%*?</li>"), (li) => {
        if (li.includes("current")) {
          li = li.replaceClasses(
            /<li[^>]*>/,
            "stepper__item stepper__item--current"
          );
          isBeforeCurrent = false;
        } else if (isBeforeCurrent)
          li = li.replaceClasses(
            /<li[^>]*>/,
            "stepper__item stepper__item--completed"
          );
        else li = li.replaceClasses(/<li[^>]*>/, "stepper__item");

        li = li.replace(/<\/?(a|em)[^>]*>/g, "");
        return li;
      });

      str = str.replace(/li|ol/g, "div");

      return str;
    },
  },
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
  {
    type: ERuleConfigType.WRAP,
    detected: "(?<=<table[^>]*>)(%any%*?)(?=</table>)",
    dataReplaced: `
    <tbody class="table__tbody">  
      %content%
    </tbody>
  `,
  },

  /* <<------- Pagination */
  {
    type: ERuleConfigType.EDIT,
    detected: "(?<=<a(?:[^>])*>%space%*)&lt;&lt;",
    dataReplaced: "&lt;",
  },
  {
    type: ERuleConfigType.EDIT,
    detected: "(?<=<a(?:[^>])*>%space%*)&gt;&gt;",
    dataReplaced: "&gt;",
  },
  {
    type: ERuleConfigType.EDIT,
    detected: "<a(?:[^>])*>%space%*(&lt;|&gt;)%space%*</a>",
    dataReplaced: "class:pagination__item__link",
  },
  {
    type: ERuleConfigType.WRAP,
    detected: "(<a(?:[^>])*>%space%*&gt;&gt;%space%*</a>)",
    dataReplaced: `
    <li class="pagination__item pagination__item--next">
      %content%
    </li>
          `,
  },
  {
    type: ERuleConfigType.WRAP,
    detected: "(<a(?:[^>])*>%space%*&lt;&lt;%space%*</a>)",
    dataReplaced: `
    <li class="pagination__item pagination__item--prev">
        %content%
    </li>
          `,
  },
  {
    type: ERuleConfigType.WRAP,
    detected:
      "(?<=<c:if[^>]*pagerHasPrev[^>]*>%any%+?</c:if>)(%any%+?)(?=<c:if[^>]*pagerHasNext[^>]*>)",
    dataReplaced: `
    <li class="pagination__item pagination__item--asis-counter">
        %content%
      </li>
          `,
  },
  {
    type: ERuleConfigType.DELETE,
    detected: "<div[^>]*pager[^>]*>",
  },
  {
    type: ERuleConfigType.WRAP,
    detected:
      '(<c:if[^>]*pagerHasPrev[^>]*">%any%+?</c:if>%any%+?<c:if[^>]*pagerHasNext[^>]*>%any%+?</c:if>)',
    dataReplaced: `<ul class="pagination">
    %content%
    </ul>`,
  },
  /* Pagination------->>  */
];

export default rulesConfig;
