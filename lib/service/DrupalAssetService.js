"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment"));
var _typeUtil = require("../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DrupalAssetService = {
  cleanCss: function (content) {
    let replaceRelativeUrlsWithRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let scrubbedContent = content;
    if (!(0, _typeUtil.isStringNonEmpty)(scrubbedContent)) {
      return scrubbedContent;
    }
    const matches = scrubbedContent.match(/^(.*url\(["']((?!data|https)).*)$/mg);
    if (!(0, _typeUtil.exists)(matches)) {
      return scrubbedContent;
    }
    matches.forEach(match => {
      let shouldCommentMatch = true;
      if (replaceRelativeUrlsWithRoot) {
        var _groups, _groups2;
        const relativeUrlRegex = /(?<relative>url\(["'](?<relativePathSegments>\.\.\/\.\.\/\.\.\/\.\.\/|\.\.\/\.\.\/\.\.\/|\.\.\/\.\.\/|\.\.\/)(?<path>images\/.+)["']\))/;
        const matchesRelative = relativeUrlRegex.exec(match);
        if ((0, _typeUtil.exists)(matchesRelative) && matchesRelative.length > 0 && (0, _typeUtil.exists)(matchesRelative.groups) && (0, _typeUtil.isStringNonEmpty)((_groups = matchesRelative.groups) === null || _groups === void 0 ? void 0 : _groups.relative) && (0, _typeUtil.isStringNonEmpty)((_groups2 = matchesRelative.groups) === null || _groups2 === void 0 ? void 0 : _groups2.path)) {
          var _groups3, _groups4;
          const replaceRelative = (_groups3 = matchesRelative.groups) === null || _groups3 === void 0 ? void 0 : _groups3.relative;
          const replaceRelativePath = (_groups4 = matchesRelative.groups) === null || _groups4 === void 0 ? void 0 : _groups4.path;
          const replaceWith = "url(\"".concat(_NeonEnvironment.default.getWebHost(), "/themes/custom/neon/").concat(replaceRelativePath, "\")");
          scrubbedContent = scrubbedContent.replace(replaceRelative, replaceWith);
          shouldCommentMatch = false;
        }
      }
      if (shouldCommentMatch) {
        const replacement = match.endsWith('}') ? "/* ".concat(match.slice(0, -1), " */ }") : "/* ".concat(match, " */");
        scrubbedContent = scrubbedContent.replace(match, replacement);
      }
    });
    return scrubbedContent;
  }
};
var _default = exports.default = DrupalAssetService;