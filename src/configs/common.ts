import { anyRgx, IRuleConfig, IRuleConfigType, regexParser } from "./utils";

const rulesConfig: IRuleConfig[] = [
  {
    type: IRuleConfigType.DELETE,
    detected: `<(dl|dt|dd)>`,
  },
  {
    type: IRuleConfigType.DELETE,
    detected: `<div[^>]*content_main[^>]*">`,
  },
  {
    type: IRuleConfigType.DELETE,
    detected: `<div class="clear"></div>`,
  },
  {
    type: IRuleConfigType.EDIT,
    detected: `<c:import[^>]*head_google_font.jsp[^>]*>`,
    dataReplaced: "",
  },
  {
    type: IRuleConfigType.EDIT,
    detected: `&nbsp;`,
    dataReplaced: "",
  },
  {
    type: IRuleConfigType.EDIT,
    detected: "btn_\\d+",
    dataReplaced: "btn btn--font-size-16 btn--font-weight-700",
  },
  // {
  //   type: IRuleConfigType.EDIT,
  //   detected: `<[%!]--(${anyRgx})+?--%?>`,
  //   dataReplaced: "",
  // },
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
    type: IRuleConfigType.EDIT,
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
];

export default rulesConfig;
