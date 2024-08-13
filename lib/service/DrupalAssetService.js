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
        const relativeUrlRegex = /(?<relative>url\(["'](?<relativePathSegments>\.\.\/\.\.\/\.\.\/\.\.\/|\.\.\/\.\.\/\.\.\/|\.\.\/\.\.\/|\.\.\/)(?<path>images\/.+)["']\))/;
        const matchesRelative = relativeUrlRegex.exec(match);
        if ((0, _typeUtil.exists)(matchesRelative) && matchesRelative.length > 0 && (0, _typeUtil.exists)(matchesRelative.groups) && (0, _typeUtil.isStringNonEmpty)(matchesRelative.groups?.relative) && (0, _typeUtil.isStringNonEmpty)(matchesRelative.groups?.path)) {
          const replaceRelative = matchesRelative.groups?.relative;
          const replaceRelativePath = matchesRelative.groups?.path;
          const replaceWith = `url("${_NeonEnvironment.default.getWebHost()}/themes/custom/neon/${replaceRelativePath}")`;
          scrubbedContent = scrubbedContent.replace(replaceRelative, replaceWith);
          shouldCommentMatch = false;
        }
      }
      if (shouldCommentMatch) {
        const replacement = match.endsWith('}') ? `/* ${match.slice(0, -1)} */ }` : `/* ${match} */`;
        scrubbedContent = scrubbedContent.replace(match, replacement);
      }
    });
    return scrubbedContent;
  }
};
var _default = exports.default = DrupalAssetService;