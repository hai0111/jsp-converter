import { IRuleConfig, ERuleConfigType, regexParser } from "./utils";

const ruleConfigs: IRuleConfig[] = [
  {
    type: ERuleConfigType.WRAP,
    detected:
      "(?<=<c:import[^>]*section_title[^>]*>%any%*?</c:import>)(%any%*)(?=(<!-- footer start -->)?%space%*<c:import[^>]*footer[^>]*>)",
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
    detected: '(?<=<div class="header_title">%any%+?)<p>(%any%+?)</p>',
    dataReplaced: `<div class="asis-content__list__header__left">
                        <h2 class="heading heading--14">$1</h2>
                    </div>
    `,
  },
  {
    type: ERuleConfigType.EDIT,
    detected: '<div class="header_title">%any%+?</div>',
    dataReplaced: (str) => {
      const input = str.match(regexParser("<input[^>]*>"))?.[0] || "";

      let p = str.match(regexParser("<p[^>]*>(%any%+?)</p>"))?.[0] || "";
      console.log(p);

      p = p.replace(
        regexParser("<p[^>]*>(%any%+?)</p>"),
        `<div class="asis-content__list__header__left">
                        <h2 class="heading heading--14">$1</h2>
                    </div>`
      );
      return `
      ${p}
      ${input}
      `;
    },
  },
];

export default ruleConfigs;

/* 
<div class="header_title">
            <input type="button" value="新規登録" class="btn_150 btn_new"
                   onclick="location.href='${f:url('/ledger/masterlease/renewal')}'">
            <p>検索結果</p>
          </div>

          <div class="pager itemname_list_pager">

            <c:if test="${pagerHasPrev}">
              <a href="${f:url("/ledger/masterlease/renewal/list/search")}?p=${f:h(p) - 1}${f:h(search_params)}">&lt;&lt;</a>
            </c:if>

            &nbsp;${f:h(pagerFrom)}-${f:h(pagerTo)} 件 / ${f:h(pagerTotal)} 件中&nbsp;

            <c:if test="${pagerHasNext}">
              <a href="${f:url("/ledger/masterlease/renewal/list/search")}?p=${f:h(p) + 1}${f:h(search_params)}">&gt;&gt;</a>
            </c:if>

          */

/* <div class="asis-content__list__header__left">
                        <h2 class="heading heading--14">検索結果</h2>
                    </div>
                    <div class="asis-content__list__header__right">
                        <ul class="pagination">
                            <c:if test="${pagerHasPrev}">

                                <li class="pagination__item pagination__item--prev">
                                    <a class="pagination__item__link"
                                       href="${f:url("/ledger/masterlease/renewal/list/search")}?p=${f:h(p) - 1}${f:h(search_params)}">&lt;</a>
                                </li>

                            </c:if>
                            <li class="pagination__item pagination__item--asis-counter">
                                    ${f:h(pagerFrom)}-${f:h(pagerTo)} 件 / ${f:h(pagerTotal)} 件中
                            </li>
                            <c:if test="${pagerHasNext}">
                                <li class="pagination__item pagination__item--next">
                                    <a class="pagination__item__link"
                                       href="${f:url("/ledger/masterlease/renewal/list/search")}?p=${f:h(p) + 1}${f:h(search_params)}">&gt;</a>
                                </li>

                            </c:if>
                        </ul>
                        <input type="button" value="新規登録"
                               class="btn btn--tertiary btn--font-size-16 btn--font-weight-700 btn_new"
                               onclick="location.href='${f:url('/ledger/masterlease/renewal')}'">
                    </div> */
