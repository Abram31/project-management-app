"use strict";
exports.__esModule = true;
exports.DescriptionProject = void 0;
var react_1 = require("react");
var DescriptionProject_module_scss_1 = require("./DescriptionProject.module.scss");
var react_i18next_1 = require("react-i18next");
exports.DescriptionProject = function () {
    var t = react_i18next_1.useTranslation().t;
    return (react_1["default"].createElement("div", { className: DescriptionProject_module_scss_1["default"].description_project },
        react_1["default"].createElement("div", { className: DescriptionProject_module_scss_1["default"].img }),
        react_1["default"].createElement("div", { className: DescriptionProject_module_scss_1["default"].description },
            react_1["default"].createElement("h3", { className: DescriptionProject_module_scss_1["default"].description_title }, t('ProjectManagementSystem')),
            react_1["default"].createElement("p", { className: DescriptionProject_module_scss_1["default"].description_text }, t('descriptionProject')))));
};
