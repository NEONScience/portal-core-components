"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _htmlReactParser = _interopRequireDefault(require("html-react-parser"));
var _styles = require("@material-ui/core/styles");
var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));
var _remoteAssetsMap = _interopRequireDefault(require("../../remoteAssetsMap/remoteAssetsMap"));
var _drupalFooter = _interopRequireDefault(require("../../remoteAssets/drupal-footer.html"));
var _NeonContext = _interopRequireWildcard(require("../NeonContext/NeonContext"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var DRUPAL_FOOTER_HTML = _remoteAssetsMap.default.DRUPAL_FOOTER_HTML.KEY;
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    footerContainer: {
      '& .footer-bottom__wrapper': {
        background: '#4B372E'
      }
    }
  };
});
var NeonFooter = function NeonFooter(props) {
  var drupalCssLoaded = props.drupalCssLoaded,
    showSkeleton = props.showSkeleton;
  var classes = useStyles(_Theme.default);
  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
    _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
    _NeonContext$useNeonC3 = _NeonContext$useNeonC2[0],
    neonContextIsActive = _NeonContext$useNeonC3.isActive,
    footerFetch = _NeonContext$useNeonC3.fetches[DRUPAL_FOOTER_HTML],
    footerHTML = _NeonContext$useNeonC3.html[DRUPAL_FOOTER_HTML];
  var renderMode = 'legacy';
  if (neonContextIsActive) {
    switch (footerFetch.status) {
      case _NeonContext.FETCH_STATUS.SUCCESS:
        renderMode = footerHTML && drupalCssLoaded ? 'drupal' : 'loading';
        break;
      case _NeonContext.FETCH_STATUS.ERROR:
        renderMode = drupalCssLoaded ? 'drupal-fallback' : 'loading';
        break;
      default:
        if (!_NeonEnvironment.default.fetchDrupalAssets) {
          renderMode = 'drupal-fallback';
        } else {
          renderMode = 'loading';
        }
        break;
    }
  }
  var renderFallback = function renderFallback() {
    return /*#__PURE__*/_react.default.createElement("footer", {
      id: "footer",
      className: classes.footerContainer
    }, (0, _htmlReactParser.default)(_drupalFooter.default));
  };
  switch (renderMode) {
    case 'loading':
      if (!showSkeleton) {
        return renderFallback();
      }
      return /*#__PURE__*/_react.default.createElement("footer", {
        id: "footer"
      }, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
        variant: "rect",
        height: "300px",
        width: "100%"
      }));
    case 'drupal':
      return /*#__PURE__*/_react.default.createElement("footer", {
        id: "footer"
      }, (0, _htmlReactParser.default)(footerHTML));
    case 'drupal-fallback':
    default:
      return renderFallback();
  }
};
NeonFooter.propTypes = {
  drupalCssLoaded: _propTypes.default.bool,
  showSkeleton: _propTypes.default.bool
};
NeonFooter.defaultProps = {
  drupalCssLoaded: false,
  showSkeleton: false
};
var _default = NeonFooter;
exports.default = _default;