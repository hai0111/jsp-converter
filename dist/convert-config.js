"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaceRgx = exports.anyRgx = exports.IRuleConfigType = void 0;
var IRuleConfigType;
(function (IRuleConfigType) {
    IRuleConfigType[IRuleConfigType["DELETE"] = 0] = "DELETE";
    IRuleConfigType[IRuleConfigType["EDIT"] = 1] = "EDIT";
    IRuleConfigType[IRuleConfigType["MOVE"] = 2] = "MOVE";
    IRuleConfigType[IRuleConfigType["WRAP"] = 3] = "WRAP";
})(IRuleConfigType || (exports.IRuleConfigType = IRuleConfigType = {}));
exports.anyRgx = /(.|\n|\s)/;
exports.spaceRgx = /(\n|\s)/;
const rulesConfig = [
    {
        type: IRuleConfigType.DELETE,
        detected: `<(dl|dt|dd)>`,
    },
    {
        type: IRuleConfigType.DELETE,
        detected: `<div id="content_main">`,
    },
    {
        type: IRuleConfigType.EDIT,
        detected: 'PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"',
        dataReplaced: "",
    },
    {
        type: IRuleConfigType.EDIT,
        detected: "/WEB-INF/view/common/",
        dataReplaced: "/WEB-INF/view/common/asis/",
    },
    {
        type: IRuleConfigType.EDIT,
        detected: `<img[^>]*img_mark[^>]*>\s*\r\n +([^ ].+(?=\r))`,
        dataReplaced: `<c:import url="/WEB-INF/view/common/asis/section_title.jsp">
                                        <c:param name="title" value="$1" />
                                    </c:import>`,
    },
];
exports.default = rulesConfig;
