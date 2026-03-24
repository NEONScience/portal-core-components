"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _htmlReactParser = _interopRequireDefault(require("html-react-parser"));
var _styles = require("@mui/styles");
var _Skeleton = _interopRequireDefault(require("@mui/material/Skeleton"));
var _remoteAssetsMap = _interopRequireDefault(require("../../remoteAssetsMap/remoteAssetsMap"));
var _drupalFooter = _interopRequireDefault(require("../../remoteAssets/drupal-footer.html"));
var _NeonContext = _interopRequireWildcard(require("../NeonContext/NeonContext"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _defaultProps = require("../../util/defaultProps");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DRUPAL_FOOTER_HTML = _remoteAssetsMap.default.DRUPAL_FOOTER_HTML.KEY;
const useStyles = (0, _styles.makeStyles)(theme => ({
  footerContainer: {
    '& .footer-bottom__wrapper': {
      background: '#4B372E'
    }
  }
}));
const defaultProps = {
  drupalCssLoaded: false,
  showSkeleton: false
};
const NeonFooter = inProps => {
  const props = (0, _defaultProps.resolveProps)(defaultProps, inProps);
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
  const renderFallback = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("footer", {
    id: "footer",
    className: classes.footerContainer,
    children: (0, _htmlReactParser.default)(_drupalFooter.default)
  });
  switch (renderMode) {
    case 'loading':
      if (!showSkeleton) {
        return renderFallback();
      }
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("footer", {
        id: "footer",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
          variant: "rectangular",
          height: "300px",
          width: "100%"
        })
      });
    case 'drupal':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("footer", {
        id: "footer",
        children: (0, _htmlReactParser.default)(footerHTML)
      });
    case 'drupal-fallback':
    default:
      return renderFallback();
  }
};
NeonFooter.propTypes = {
  drupalCssLoaded: _propTypes.default.bool,
  showSkeleton: _propTypes.default.bool
};
var _default = exports.default = NeonFooter;