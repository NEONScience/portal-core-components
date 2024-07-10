"use strict";

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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DRUPAL_FOOTER_HTML = _remoteAssetsMap.default.DRUPAL_FOOTER_HTML.KEY;
const useStyles = (0, _styles.makeStyles)(theme => ({
  footerContainer: {
    '& .footer-bottom__wrapper': {
      background: '#4B372E'
    }
  }
}));
const NeonFooter = props => {
  const {
    drupalCssLoaded,
    showSkeleton
  } = props;
  const classes = useStyles(_Theme.default);
  const [{
    isActive: neonContextIsActive,
    fetches: {
      [DRUPAL_FOOTER_HTML]: footerFetch
    },
    html: {
      [DRUPAL_FOOTER_HTML]: footerHTML
    }
  }] = _NeonContext.default.useNeonContextState();
  let renderMode = 'legacy';
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
  const renderFallback = () => /*#__PURE__*/_react.default.createElement("footer", {
    id: "footer",
    className: classes.footerContainer
  }, (0, _htmlReactParser.default)(_drupalFooter.default));
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
var _default = exports.default = NeonFooter;