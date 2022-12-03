"use strict";
exports.__esModule = true;
exports.AboutTeam = void 0;
var react_1 = require("react");
var AboutTeam_module_scss_1 = require("./AboutTeam.module.scss");
var members_1 = require("./members");
var react_i18next_1 = require("react-i18next");
exports.AboutTeam = function () {
    var t = react_i18next_1.useTranslation().t;
    return (react_1["default"].createElement("div", { className: AboutTeam_module_scss_1["default"].wrapper_about_team },
        react_1["default"].createElement("h3", { className: AboutTeam_module_scss_1["default"].title }, t('OurTeam')),
        react_1["default"].createElement("div", { className: AboutTeam_module_scss_1["default"].container }, Object.entries(members_1.members).map(function (item, index) {
            return (react_1["default"].createElement("div", { key: "" + (item[0] + index), className: AboutTeam_module_scss_1["default"].member },
                react_1["default"].createElement("img", { className: AboutTeam_module_scss_1["default"].photo, src: item[1].avatar, alt: "" }),
                react_1["default"].createElement("span", { className: AboutTeam_module_scss_1["default"].name }, item[1].name),
                react_1["default"].createElement("p", { className: AboutTeam_module_scss_1["default"].member_description }, item[1].description),
                react_1["default"].createElement("div", { className: AboutTeam_module_scss_1["default"].wrapper_social_links },
                    react_1["default"].createElement("a", { className: AboutTeam_module_scss_1["default"].link_github, href: item[1].gitHub }),
                    react_1["default"].createElement("a", { className: AboutTeam_module_scss_1["default"].link_linkedin, href: item[1].linkedIn }))));
        }))));
};
