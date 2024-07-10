"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserAgentHeader = exports.default = void 0;
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));
var _typeUtil = require("./typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const getUserAgentHeader = component => {
  const appName = _NeonEnvironment.default.getReactAppName();
  const appVersion = _NeonEnvironment.default.getReactAppVersion();
  if (!(0, _typeUtil.isStringNonEmpty)(appName) || !(0, _typeUtil.isStringNonEmpty)(appVersion)) {
    return '';
  }
  return "".concat(appName, "/").concat(appVersion, " (").concat(component, ")");
};
exports.getUserAgentHeader = getUserAgentHeader;
const RequestUtil = {
  getUserAgentHeader
};
var _default = exports.default = RequestUtil;