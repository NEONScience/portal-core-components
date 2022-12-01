"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
_core.default.registerLanguage('javascript', _javascript.default);
_core.default.registerLanguage('json', _json.default);
_core.default.registerLanguage('typescript', _typescript.default);
var useStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (
    // eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      root: {
        margin: muiTheme.spacing(2, 0),
        '& code': {
          padding: "".concat(muiTheme.spacing(0, 2), " !important")
        }
      }
    })
  );
});
/**
 * Syntax highlighter component based on:
 * https://github.com/bvaughn/react-highlight.js
 */
var SyntaxHighlight = function SyntaxHighlight(props) {
  var classes = useStyles(_Theme.default);
  var children = props.children,
    language = props.language,
    style = props.style;
  var codeRef = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    var element = codeRef.current;
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
var _default = SyntaxHighlight;
exports.default = _default;