"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _styles = require("@material-ui/core/styles");
var _core = _interopRequireDefault(require("highlight.js/lib/core"));
var _javascript = _interopRequireDefault(require("highlight.js/lib/languages/javascript"));
var _json = _interopRequireDefault(require("highlight.js/lib/languages/json"));
var _typescript = _interopRequireDefault(require("highlight.js/lib/languages/typescript"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
_core.default.registerLanguage('javascript', _javascript.default);
_core.default.registerLanguage('json', _json.default);
_core.default.registerLanguage('typescript', _typescript.default);
const useStyles = (0, _styles.makeStyles)(muiTheme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  root: {
    margin: muiTheme.spacing(2, 0),
    '& code': {
      padding: "".concat(muiTheme.spacing(0, 2), " !important")
    }
  }
}));
/**
 * Syntax highlighter component based on:
 * https://github.com/bvaughn/react-highlight.js
 */
const SyntaxHighlight = props => {
  const classes = useStyles(_Theme.default);
  const {
    children,
    language,
    style
  } = props;
  const codeRef = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    const element = codeRef.current;
    if (!element) {
      return;
    }
    _core.default.highlightElement(element);
  }, [codeRef]);
  return /*#__PURE__*/_react.default.createElement("pre", {
    className: classes.root,
    style: style
  }, /*#__PURE__*/_react.default.createElement("code", {
    ref: codeRef,
    className: language
  }, children));
};
SyntaxHighlight.defaultProps = {
  language: 'typescript',
  style: undefined
};
var _default = exports.default = SyntaxHighlight;