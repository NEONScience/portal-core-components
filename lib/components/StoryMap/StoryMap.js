"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@material-ui/core/styles");
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _OpenInNew = _interopRequireDefault(require("@material-ui/icons/OpenInNew"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _FullWidthVisualization = _interopRequireDefault(require("../FullWidthVisualization/FullWidthVisualization"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
const StoryMap = props => {
  const {
    url,
    title
  } = props;
  const classes = useStyles(_Theme.default);
  const iframeRef = (0, _react.useRef)(null);
  return /*#__PURE__*/_react.default.createElement(_FullWidthVisualization.default, {
    vizRef: iframeRef,
    minWidth: MIN_IFRAME_WIDTH,
    deriveHeightFromWidth: "auto",
    "data-selenium": "story-map-container"
  }, /*#__PURE__*/_react.default.createElement("iframe", {
    src: url,
    title: title || 'Neon Story Map',
    ref: iframeRef,
    frameBorder: "0",
    marginHeight: "0",
    marginWidth: "0",
    style: {
      minWidth: "".concat(MIN_IFRAME_WIDTH, "px"),
      minHeight: "".concat(MIN_IFRAME_WIDTH, "px")
    }
  }), /*#__PURE__*/_react.default.createElement(_Link.default, {
    href: url,
    target: "_blank",
    className: classes.openInNewLink
  }, /*#__PURE__*/_react.default.createElement(_OpenInNew.default, {
    className: classes.openInNewIcon
  }), "Open in New Window"));
};
StoryMap.propTypes = {
  url: _propTypes.default.string.isRequired,
  title: _propTypes.default.string
};
StoryMap.defaultProps = {
  title: null
};
const WrappedStoryMap = _Theme.default.getWrappedComponent(StoryMap);
var _default = exports.default = WrappedStoryMap;