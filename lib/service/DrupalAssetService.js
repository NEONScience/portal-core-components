"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment"));
var _typeUtil = require("../util/typeUtil");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _wrapRegExp() { _wrapRegExp = function _wrapRegExp(re, groups) { return new BabelRegExp(re, void 0, groups); }; var _super = RegExp.prototype, _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = new RegExp(re, flags); return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype); } function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { var i = g[name]; if ("number" == typeof i) groups[name] = result[i];else { for (var k = 0; void 0 === result[i[k]] && k + 1 < i.length;) { k++; } groups[name] = result[i[k]]; } return groups; }, Object.create(null)); } return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) { result.groups = buildGroups(result, this); var indices = result.indices; indices && (indices.groups = buildGroups(indices, this)); } return result; }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if ("string" == typeof substitution) { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { var group = groups[name]; return "$" + (Array.isArray(group) ? group.join("$") : group); })); } if ("function" == typeof substitution) { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = arguments; return "object" != _typeof(args[args.length - 1]) && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args); }); } return _super[Symbol.replace].call(this, str, substitution); }, _wrapRegExp.apply(this, arguments); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var DrupalAssetService = {
  cleanCss: function cleanCss(content) {
    var replaceRelativeUrlsWithRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var scrubbedContent = content;
    if (!(0, _typeUtil.isStringNonEmpty)(scrubbedContent)) {
      return scrubbedContent;
    }
    var matches = scrubbedContent.match(/^(.*url\(["']((?!data|https)).*)$/mg);
    if (!(0, _typeUtil.exists)(matches)) {
      return scrubbedContent;
    }
    matches.forEach(function (match) {
      var shouldCommentMatch = true;
      if (replaceRelativeUrlsWithRoot) {
        var _groups2, _groups3;
        var relativeUrlRegex = /*#__PURE__*/_wrapRegExp(/(url\(["']\.\.\/\.\.\/\.\.\/\.\.\/(images\/.+)["']\))/, {
          relative: 1,
          path: 2
        });
        var matchesRelative = relativeUrlRegex.exec(match);
        if ((0, _typeUtil.exists)(matchesRelative) && matchesRelative.length > 0 && (0, _typeUtil.exists)(matchesRelative.groups) && (0, _typeUtil.isStringNonEmpty)((_groups2 = matchesRelative.groups) === null || _groups2 === void 0 ? void 0 : _groups2.relative) && (0, _typeUtil.isStringNonEmpty)((_groups3 = matchesRelative.groups) === null || _groups3 === void 0 ? void 0 : _groups3.path)) {
          var _groups4, _groups5;
          var replaceRelative = (_groups4 = matchesRelative.groups) === null || _groups4 === void 0 ? void 0 : _groups4.relative;
          var replaceRelativePath = (_groups5 = matchesRelative.groups) === null || _groups5 === void 0 ? void 0 : _groups5.path;
          var replaceWith = "url(\"".concat(_NeonEnvironment.default.getWebHost(), "/themes/custom/neon/").concat(replaceRelativePath, "\")");
          scrubbedContent = scrubbedContent.replace(replaceRelative, replaceWith);
          shouldCommentMatch = false;
        }
      }
      if (shouldCommentMatch) {
        var replacement = match.endsWith('}') ? "/* ".concat(match.slice(0, -1), " */ }") : "/* ".concat(match, " */");
        scrubbedContent = scrubbedContent.replace(match, replacement);
      }
    });
    return scrubbedContent;
  }
};
var _default = DrupalAssetService;
exports.default = _default;