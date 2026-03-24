"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _Link = _interopRequireDefault(require("@mui/material/Link"));
var _OpenInNew = _interopRequireDefault(require("@mui/icons-material/OpenInNew"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _FullWidthVisualization = _interopRequireDefault(require("../FullWidthVisualization/FullWidthVisualization"));
var _defaultProps = require("../../util/defaultProps");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const MIN_IFRAME_WIDTH = 240;
const useStyles = (0, _styles.makeStyles)(theme => ({
  openInNewLink: {
    display: 'block',
    width: '100%',
    textAlign: 'right',
    marginTop: theme.spacing(0.5),
    fontSize: '0.8rem'
  },
  openInNewIcon: {
    fontSize: '0.95rem',
    margin: theme.spacing(0, 0.5, -0.25, 0)
  }
}));
const defaultProps = {
  title: null
};
const StoryMap = inProps => {
  const props = (0, _defaultProps.resolveProps)(defaultProps, inProps);
  const {
    url,
    title
  } = props;
  const classes = useStyles(_Theme.default);
  const iframeRef = (0, _react.useRef)(null);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_FullWidthVisualization.default, {
    vizRef: iframeRef,
    minWidth: MIN_IFRAME_WIDTH,
    deriveHeightFromWidth: "auto",
    "data-selenium": "story-map-container",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("iframe", {
      src: url,
      title: title || 'Neon Story Map',
      ref: iframeRef,
      frameBorder: "0",
      marginHeight: "0",
      marginWidth: "0",
      style: {
        minWidth: `${MIN_IFRAME_WIDTH}px`,
        minHeight: `${MIN_IFRAME_WIDTH}px`
      }
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Link.default, {
      href: url,
      target: "_blank",
      className: classes.openInNewLink,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_OpenInNew.default, {
        className: classes.openInNewIcon
      }), "Open in New Window"]
    })]
  });
};
StoryMap.propTypes = {
  url: _propTypes.default.string.isRequired,
  title: _propTypes.default.string
};
const WrappedStoryMap = _Theme.default.getWrappedComponent(StoryMap);
var _default = exports.default = WrappedStoryMap;