import { anyRgx, IRuleConfig, IRuleConfigType, spaceRgx } from "./utils";

const rulesConfig: IRuleConfig[] = [
  {
    type: IRuleConfigType.DELETE,
    detected: `<(dl|dt|dd)>`,
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
    detected: "/WEB-INF/view/common/",
    dataReplaced: "/WEB-INF/view/common/asis/",
  },
  {
    type: IRuleConfigType.EDIT,
    detected:
      '<img[^>]*img_mark[^>]*>([^<]*)(%space%*<div class="back_button_area">%any%*</div>)?',
    dataReplaced: (str, ...matches) => {
      const [title] = matches;
      return `
          <c:import url="/WEB-INF/view/common/asis/section_title.jsp">
            <c:param name="title" value="${title.trim()} \${ complModeName } 完了"/>
          </c:import>
      `;
    },
  },
];

export default rulesConfig;

/* <img src="/rms/images/mark2.gif" width="13px" height="15px" class="img_mark">物件請求分割（相殺設定）
                <div class="back_button_area">
                    <input class="btn_100" type="button"
                           onclick="location.href='${ f:url('/billproperty/checklist') }?property_contract_id=${ f:h(propertyContractId) }&bill_month=${bill_month}'"
                           value="物件請求へ" name="goBack">
                </div> */
