<%@page pageEncoding="UTF-8" %>
    <%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
            <%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
                <%@taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
                    <%@taglib prefix="spring" uri="http://www.springframework.org/tags" %>
                        <%@taglib prefix="f" uri="http://sastruts.seasar.org/functions" %>
                            <!DOCTYPE html>
                            <html lang="ja">

                            <head>
                                <c:set var="mode_name" value="${compl_mode_name}" />
                                <c:import url="/WEB-INF/view/common/asis/head_inc.jsp" />

                                <title>JPMC 社内システムサイト 物件請求（家主・JP請求） ${ complModeName } 完了</title>
                                <c:import url="/WEB-INF/view/common/head_google_font.jsp" />
                            </head>

                            <body>
                                <div id="contents" class="asis-layout">
                                    <!-- header start -->
                                    <c:import url="/WEB-INF/view/common/asis/header.jsp" />
                                    <!-- header stop -->

                                    <!-- main_menu start -->
                                    <c:import url="/WEB-INF/view/common/asis/menu.jsp">
                                        <c:param name="activeTab" value="bill" />
                                    </c:import>
                                    <!-- main_menu end -->

                                    <c:import url="/WEB-INF/view/common/asis/section_title.jsp">
                                        <c:param name="title" value="物件請求（家主・JP請求） ${ complModeName } 完了" />
                                    </c:import>

                                    <main class="asis-main asis-main--yellow">
                                        <div class="asis-content__wrapper">
                                            <div class="asis-content asis-content--complete">
                                                <img src="${f:url('/dist/images/icons/CheckCircleBrokenIcon.svg')}"
                                                    alt="" width="48" height="48" class="asis-content__complete__icon">
                                                <p class="asis-content__complete__txt">
                                                    <spring:message code="message.compl_msg"
                                                        arguments="${ complModeName }" />
                                                </p>
                                                <div class="asis-content__complete__btn">
                                                    <input type="button"
                                                        class="btn btn--font-size-16 btn--font-weight-700"
                                                        value="物件請求に戻る"
                                                        onclick="location.href='${ f:url('/billproperty/checklist') }?property_contract_id=${ complPropertyContractId }&bill_month=${ complBillMonth }'">
                                                    <input type="button"
                                                        class="btn btn--font-size-16 btn--font-weight-700" value="一覧に戻る"
                                                        onclick="location.href='${ f:url('/billproperty/checklist/list') }'">
                                                </div>
                                            </div>
                                        </div>
                                    </main>
                                    <!-- footer start -->
                                    <c:import url="/WEB-INF/view/common/asis/footer.jsp" />
                                    <!-- footer end -->
                                </div>
                            </body>

                            </html>