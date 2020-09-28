"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _htmlReactParser = _interopRequireDefault(require("html-react-parser"));

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _NeonAuth = _interopRequireWildcard(require("../NeonAuth/NeonAuth"));

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

var _NeonContext = _interopRequireWildcard(require("../NeonContext/NeonContext"));

var _NeonLegacyHeader = _interopRequireDefault(require("./NeonLegacyHeader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HEADER_JS_URL = 'https://preview.neonscience.org/themes/custom/neon/build/components/header/header.js';
var AUTH_ELEMENT_ID = 'header__authentication-ui';
var useStyles = (0, _styles.makeStyles)(function (theme) {
  var _coreAuthContainer;

  return {
    skeletonHeader: {
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)'
    },
    coreAuthContainer: (_coreAuthContainer = {
      // common styles
      textAlign: 'right',
      position: 'absolute',
      zIndex: 10
    }, _defineProperty(_coreAuthContainer, theme.breakpoints.up('lg'), {
      padding: '0px',
      top: '-1px',
      right: '0px',
      '& :last-child': {
        borderRight: 'none',
        borderTopRightRadius: '0px',
        borderBottomRightRadius: '0px'
      },
      '& :first-child': {
        borderRight: 'none',
        borderTopLeftRadius: '0px'
      }
    }), _defineProperty(_coreAuthContainer, theme.breakpoints.down('md'), {
      padding: theme.spacing(1, 2),
      top: theme.spacing(1),
      right: theme.spacing(9)
    }), _coreAuthContainer),
    // These styles are gross. We need to rework the header coming from the Drupal site to make this
    // less necessary.
    unstickyHeader: {
      paddingTop: 'unset !important',
      '& > header': _defineProperty({
        position: 'unset !important',
        '& label[for="nav-trigger"]': {
          zIndex: '3 !important'
        },
        '& div.header__site-navigation': {
          zIndex: '2 !important'
        }
      }, theme.breakpoints.down('sm'), {
        '& .header__site-navigation': {
          display: 'none'
        },
        '& .nav-trigger:checked ~ .header__site-navigation': {
          display: 'block'
        }
      })
    }
  };
});
var NeonHeader = /*#__PURE__*/(0, _react.forwardRef)(function (props, headerRef) {
  var drupalCssLoaded = props.drupalCssLoaded,
      useCoreHeader = props.useCoreHeader,
      unstickyDrupalHeader = props.unstickyDrupalHeader;
  var classes = useStyles(_Theme.default);
  var belowLg = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('md'));

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      _NeonContext$useNeonC3 = _NeonContext$useNeonC2[0],
      neonContextIsActive = _NeonContext$useNeonC3.isActive,
      headerFetch = _NeonContext$useNeonC3.fetches.header,
      headerHTML = _NeonContext$useNeonC3.html.header,
      auth = _NeonContext$useNeonC3.auth;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      headerJsLoaded = _useState2[0],
      setHeaderJsLoaded = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      headerRenderDelayed = _useState4[0],
      setHeaderRenderDelayed = _useState4[1];

  var renderMode = 'legacy';

  if (!useCoreHeader && neonContextIsActive) {
    switch (headerFetch.status) {
      case _NeonContext.FETCH_STATUS.SUCCESS:
        renderMode = headerHTML && drupalCssLoaded && headerRenderDelayed ? 'drupal' : 'loading';
        break;

      case _NeonContext.FETCH_STATUS.ERROR:
        renderMode = 'legacy';
        break;

      default:
        renderMode = 'loading';
        break;
    }
  } // Load header.js only after initial delayed render of the drupal header is complete


  (0, _react.useLayoutEffect)(function () {
    if (renderMode !== 'drupal' || headerJsLoaded || !headerRenderDelayed || !drupalCssLoaded) {
      return;
    }

    setHeaderJsLoaded(true);
    var script = document.createElement('script');
    script.src = HEADER_JS_URL;
    document.body.appendChild(script);
  }, [headerJsLoaded, drupalCssLoaded, headerRenderDelayed, setHeaderJsLoaded, renderMode]); // Delay the rendering of the drupal header one render cycle to allow the CSS to propogate into
  // the environment. This prevents a "flash" of the unstyled menu in the drupal header on page load

  (0, _react.useLayoutEffect)(function () {
    if (!useCoreHeader && neonContextIsActive && headerHTML && drupalCssLoaded && !headerRenderDelayed) {
      var timeout = window.setTimeout(function () {
        return setHeaderRenderDelayed(true);
      }, 0);
      return function () {
        return window.clearTimeout(timeout);
      };
    }

    return function () {};
  }, [neonContextIsActive, useCoreHeader, headerHTML, drupalCssLoaded, headerRenderDelayed]); // Render Loading

  if (renderMode === 'loading') {
    return /*#__PURE__*/_react.default.createElement("header", {
      ref: headerRef,
      id: "header",
      className: classes.skeletonHeader
    }, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      height: "".concat(belowLg ? 60 : 125, "px"),
      width: "100%"
    }));
  } // Render Drupal


  if (renderMode === 'drupal') {
    var injectAuth = !auth.useCore ? null : {
      replace: function replace(domNode) {
        return (domNode.attribs || {}).id !== AUTH_ELEMENT_ID ? null : /*#__PURE__*/_react.default.createElement("div", {
          id: AUTH_ELEMENT_ID,
          className: classes.coreAuthContainer
        }, /*#__PURE__*/_react.default.createElement(_NeonAuth.default, {
          loginPath: _NeonEnvironment.default.getFullAuthPath('login'),
          logoutPath: _NeonEnvironment.default.getFullAuthPath('logout'),
          accountPath: _NeonEnvironment.default.route.buildAccountRoute(),
          loginType: _NeonAuth.NeonAuthType.REDIRECT,
          logoutType: _NeonAuth.NeonAuthType.SILENT,
          displayType: _NeonAuth.NeonAuthDisplayType.MENU
        }));
      }
    };
    return /*#__PURE__*/_react.default.createElement("header", {
      ref: headerRef,
      id: "header",
      className: unstickyDrupalHeader ? classes.unstickyHeader : null
    }, (0, _htmlReactParser.default)(headerHTML, injectAuth));
  } // Render Legacy


  return /*#__PURE__*/_react.default.createElement(_NeonLegacyHeader.default, _extends({}, props, {
    ref: headerRef
  }));
});
NeonHeader.propTypes = _extends({}, _NeonLegacyHeader.default.propTypes, {
  drupalCssLoaded: _propTypes.default.bool,
  useCoreHeader: _propTypes.default.bool,
  unstickyDrupalHeader: _propTypes.default.bool
});
NeonHeader.defaultProps = _extends({}, _NeonLegacyHeader.default.defaultProps, {
  drupalCssLoaded: false,
  useCoreHeader: false,
  unstickyDrupalHeader: true
});
var _default = NeonHeader;
exports.default = _default;