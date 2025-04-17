<%@page pageEncoding="UTF-8" %>
    <%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
            <%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
                <%@taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
                    <%@taglib prefix="spring" uri="http://www.springframework.org/tags" %>
                        <%@taglib prefix="f" uri="http://sastruts.seasar.org/functions" %>
                            <!DOCTYPE html
                                >
                            <html lang="ja">

                            <head>
                                <c:import url="/WEB-INF/view/common/asis/head_inc.jsp" />
                                <script type="text/javascript" src="${f:url('/js/common_util.js')}"></script>
                                <title>
                                    JPMC 社内システムサイト 物件請求（家主・JP請求） ${ complModeName } 完了
                                </title>
                            </head>

                            <body>
                                <div id="contents">
                                    <!-- header start -->
                                    <c:import url="/WEB-INF/view/common/asis/header.jsp" />
                                    <!-- header stop -->

                                    <!-- main_menu start -->
                                    <c:import url="/WEB-INF/view/common/asis/menu.jsp" />
                                    <!-- main_menu stop -->

                                    
                                        
                                            
                                                <c:import url="/WEB-INF/view/common/asis/section_title.jsp">
                                        <c:param name="title" value="物件請求（家主・JP請求） ${ complModeName } 完了" />
                                    </c:import>
                                            
                                            
                                                <div class="msg_box_compl">
                                                    <p>
                                                        <spring:message code="message.compl_msg"
                                                            arguments="${ complModeName }" />
                                                    </p>
                                                    <input type="button" class="btn_100" value="物件請求に戻る"
                                                        onclick="location.href='${ f:url('/billproperty/checklist') }?property_contract_id=${ complPropertyContractId }&bill_month=${ complBillMonth }'" />
                                                    <input type="button" class="btn_100" value="一覧に戻る"
                                                        onclick="location.href='${ f:url('/billproperty/checklist/list') }'" />
                                                </div>
                                            
                                        
                                    

                                    <!-- footer start -->
                                    <c:import url="/WEB-INF/view/common/asis/footer.jsp" />
                                    <!-- footer end -->
                                </div>
                            </body>

                            </html>