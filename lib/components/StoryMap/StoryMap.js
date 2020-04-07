"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var MIN_IFRAME_WIDTH = 240;
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
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
  };
});

var StoryMap = function StoryMap(props) {
  var url = props.url,
      _props$title = props.title,
      title = _props$title === void 0 ? 'NEON Story Map' : _props$title;
  var classes = useStyles(_Theme.default);
  var iframeRef = (0, _react.useRef)(null);
  return /*#__PURE__*/_react.default.createElement(_FullWidthVisualization.default, {
    vizRef: iframeRef,
    minWidth: MIN_IFRAME_WIDTH,
    deriveHeightFromWidth: "auto",
    "data-selenium": "story-map-container"
  }, /*#__PURE__*/_react.default.createElement("iframe", {
    src: url,
    title: title,
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

var WrappedStoryMap = _Theme.default.getWrappedComponent(StoryMap);

var _default = WrappedStoryMap;
exports.default = _default;