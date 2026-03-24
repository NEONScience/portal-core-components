"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _styles = require("@mui/styles");
var _core = _interopRequireDefault(require("highlight.js/lib/core"));
var _javascript = _interopRequireDefault(require("highlight.js/lib/languages/javascript"));
var _json = _interopRequireDefault(require("highlight.js/lib/languages/json"));
var _typescript = _interopRequireDefault(require("highlight.js/lib/languages/typescript"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _defaultProps = require("../../util/defaultProps");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
_core.default.registerLanguage('javascript', _javascript.default);
_core.default.registerLanguage('json', _json.default);
_core.default.registerLanguage('typescript', _typescript.default);
const useStyles = (0, _styles.makeStyles)(muiTheme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  root: {
    margin: muiTheme.spacing(2, 0),
    '& code': {
      padding: `${muiTheme.spacing(0, 2)} !important`
    }
  }
}));
const defaultProps = {
  language: 'typescript',
  style: undefined
};

/**
 * Syntax highlighter component based on:
 * https://github.com/bvaughn/react-highlight.js
 */
const SyntaxHighlight = inProps => {
  const props = (0, _defaultProps.resolveProps)(defaultProps, inProps);
  const classes = useStyles(_Theme.default);
  const {
    children,
    language,
    style
  } = props;
  const codeRef = (0, _react.useRef)(undefined);
  (0, _react.useEffect)(() => {
    const element = codeRef.current;
    if (!element) {
      return;
    }
    _core.default.highlightElement(element);
  }, [codeRef]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("pre", {
    className: classes.root,
    style: style,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("code", {
      ref: codeRef,
      className: language,
      children: children
    })
  });
};
var _default = exports.default = SyntaxHighlight;