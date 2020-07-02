"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _uniqueId = _interopRequireDefault(require("lodash/uniqueId"));

var _styles = require("@material-ui/core/styles");

var _Checkbox = _interopRequireDefault(require("@material-ui/core/Checkbox"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _FormControlLabel = _interopRequireDefault(require("@material-ui/core/FormControlLabel"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _LinearProgress = _interopRequireDefault(require("@material-ui/core/LinearProgress"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));

var _ArrowDropDown = _interopRequireDefault(require("@material-ui/icons/ArrowDropDown"));

var _ArrowLeft = _interopRequireDefault(require("@material-ui/icons/ArrowLeft"));

var _Height = _interopRequireDefault(require("@material-ui/icons/Height"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _SiteMapContext = _interopRequireDefault(require("./SiteMapContext"));

var _SiteMapFilters = _interopRequireDefault(require("./SiteMapFilters"));

var _SiteMapLeaflet = _interopRequireDefault(require("./SiteMapLeaflet"));

var _SiteMapTable = _interopRequireDefault(require("./SiteMapTable"));

var _SiteMapUtils = require("./SiteMapUtils");

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

var progressId = "sitemap-progress-".concat((0, _uniqueId.default)());
var boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    outerContainer: {
      width: '100%',
      position: 'relative'
    },
    contentContainer: {
      width: '100%',
      height: '0px',
      // Necessary to set a fixed aspect ratio from props (using paddingBottom)
      position: 'relative',
      backgroundColor: theme.colors.NEON_BLUE[200],
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      boxShadow: boxShadow
    },
    contentPaper: {
      position: 'absolute',
      width: '70%',
      top: '50%',
      transform: 'translate(0%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(3),
      borderRadius: '2px'
    },
    featuresContainer: {
      backgroundColor: theme.palette.grey[100],
      height: '100%',
      position: 'absolute',
      zIndex: 1000,
      top: '0px',
      right: '0px',
      boxShadow: '-3px 0 5px 0px rgba(0,0,0,0.5)',
      padding: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      overflowY: 'auto'
    },
    featureIcon: {
      width: '28px',
      height: '28px',
      marginRight: theme.spacing(1)
    },
    featureOptionFormControlLabel: {
      width: '100%',
      paddingRight: theme.spacing(1),
      margin: 0,
      '& > span:nth-child(2)': {
        width: '100%'
      },
      '&:hover, &:focus': {
        backgroundColor: theme.palette.grey[100]
      }
    },
    featureOptionLabel: {
      display: 'flex',
      alignItems: 'center'
    },
    popper: {
      marginLeft: theme.spacing(5),
      marginTop: theme.spacing(0.5),
      zIndex: 1001,
      '& > div': {
        margin: 0,
        padding: theme.spacing(1, 1.5),
        fontSize: '0.85rem',
        fontWeight: 300,
        backgroundColor: theme.palette.grey[800]
      },
      '& a': {
        color: theme.palette.grey[100]
      }
    },
    resizeButton: {
      backgroundColor: '#fff',
      position: 'absolute',
      zIndex: 999,
      bottom: '0px',
      right: '0px',
      width: '26px',
      height: '26px',
      padding: 'unset',
      borderRadius: '2px 0px 2px 0px',
      border: "1px solid ".concat(theme.colors.LIGHT_BLUE[500]),
      cursor: 'grab',
      '&:hover, &:active': {
        color: theme.colors.LIGHT_BLUE[400],
        borderColor: theme.colors.LIGHT_BLUE[400],
        backgroundColor: theme.palette.grey[50]
      },
      '&:active': {
        cursor: 'row-resize !important'
      },
      '& svg': {
        fontSize: '1.15rem !important'
      }
    },
    resizeBorder: {
      position: 'absolute',
      border: "3px solid ".concat(theme.colors.LIGHT_BLUE[500]),
      top: '0px',
      left: '0px',
      width: '100%',
      zIndex: 998,
      display: 'none'
    }
  };
});

var SiteMapContainer = function SiteMapContainer(props) {
  var classes = useStyles(_Theme.default);
  var _props$unusableVertic = props.unusableVerticalSpace,
      unusableVerticalSpace = _props$unusableVertic === void 0 ? 0 : _props$unusableVertic;

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      neonContextState = _NeonContext$useNeonC2[0];

  var _SiteMapContext$useSi = _SiteMapContext.default.useSiteMapContext(),
      _SiteMapContext$useSi2 = _slicedToArray(_SiteMapContext$useSi, 2),
      state = _SiteMapContext$useSi2[0],
      dispatch = _SiteMapContext$useSi2[1]; // console.log('CONTAINER STATE:', state);


  var isLoading = state.overallFetch.expected !== state.overallFetch.completed;
  var aspectRatio = state.aspectRatio,
      view = state.view.current;
  var contentDivProps = {
    className: classes.contentContainer,
    style: {
      paddingBottom: "".concat((aspectRatio.currentValue || 0.75) * 100, "%")
    }
  };
  var featuresRef = (0, _react.useRef)(null);
  var contentDivRef = (0, _react.useRef)(null);
  var resizeBorderRef = (0, _react.useRef)(null);
  var resizeButtonRef = (0, _react.useRef)(null);
  /**
     Vertical Resize Hooks
  */

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      resizeDragging = _useState2[0],
      setResizeDragging = _useState2[1];

  var _useState3 = (0, _react.useState)(null),
      _useState4 = _slicedToArray(_useState3, 2),
      dragStartY = _useState4[0],
      setDragStartY = _useState4[1];

  var dragDeltaY = (0, _react.useRef)(null);
  var resizeVerticallyDragStart = (0, _react.useCallback)(function (event) {
    if (!resizeBorderRef.current || !contentDivRef.current) {
      return;
    }

    setDragStartY(event.clientY);
    setResizeDragging(true);
    dragDeltaY.current = 0;
    resizeBorderRef.current.style.display = 'block';
    resizeBorderRef.current.style.height = "".concat(contentDivRef.current.clientHeight, "px");
  }, [setDragStartY, setResizeDragging, dragDeltaY]);
  var resizeVerticallyDrag = (0, _react.useCallback)(function (event) {
    if (!resizeDragging || !resizeBorderRef.current || dragStartY === null || event.clientY === 0) {
      return;
    }

    dragDeltaY.current = event.clientY - dragStartY;
    var newHeight = Math.max(contentDivRef.current.clientHeight + dragDeltaY.current, _SiteMapUtils.MIN_CONTAINER_HEIGHT);
    resizeBorderRef.current.style.height = "".concat(newHeight, "px");
  }, [resizeDragging, dragStartY, dragDeltaY]);
  var resizeVerticallyDragEnd = (0, _react.useCallback)(function () {
    var finalHeight = Math.max(contentDivRef.current.clientHeight + dragDeltaY.current, _SiteMapUtils.MIN_CONTAINER_HEIGHT);
    setDragStartY(null);
    setResizeDragging(false);
    dragDeltaY.current = null;
    resizeBorderRef.current.style.display = 'none';
    resizeButtonRef.current.blur();
    var newAspectRatio = finalHeight / aspectRatio.widthReference;
    dispatch({
      type: 'setAspectRatio',
      aspectRatio: newAspectRatio,
      widthReference: aspectRatio.widthReference
    });
  }, [aspectRatio.widthReference, dispatch, setDragStartY, setResizeDragging, dragDeltaY]);
  /**
     Effect - Register event listener to dynamically adjust aspect ratio from viewport dimensions
  */

  (0, _react.useLayoutEffect)(function () {
    var handleResize = function handleResize() {
      var newAspectRatio = aspectRatio.isDynamic ? (0, _SiteMapUtils.getDynamicAspectRatio)(unusableVerticalSpace) : aspectRatio.currentValue;
      dispatch({
        type: 'setAspectRatio',
        aspectRatio: newAspectRatio,
        widthReference: contentDivRef.current ? contentDivRef.current.clientWidth : 0
      });
    };

    if (!aspectRatio.isDynamic || aspectRatio.currentValue !== null) {
      return function () {};
    }

    handleResize();

    if (!aspectRatio.isDynamic || aspectRatio.resizeEventListenerInitialized) {
      return function () {};
    }

    window.addEventListener('resize', handleResize);
    dispatch({
      type: 'setAspectRatioResizeEventListenerInitialized'
    });
    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, [unusableVerticalSpace, aspectRatio, dispatch]);
  /**
     Effect - Monitor all click events and close the features pane if open and clicked outside
  */

  (0, _react.useEffect)(function () {
    if (!state.filters.features.open || !featuresRef.current) {
      return function () {};
    }

    var handleClick = function handleClick(event) {
      if (featuresRef.current && !featuresRef.current.contains(event.target)) {
        dispatch({
          type: 'setFilterFeaturesOpen',
          open: false
        });
      }
    };

    document.addEventListener('click', handleClick);
    return function () {
      document.removeEventListener('click', handleClick);
    };
  }, [state.filters.features.open, featuresRef, dispatch]);
  /**
     Effect - If NeonContext Data is now available and has not been hydrated into state then do so.
  */

  (0, _react.useEffect)(function () {
    if (state.neonContextHydrated || !(neonContextState.isFinal && !neonContextState.hasError)) {
      return;
    }

    dispatch({
      type: 'hydrateNeonContextData',
      neonContextData: neonContextState.data
    });
  }, [state.neonContextHydrated, neonContextState.isFinal, neonContextState.hasError, neonContextState.data, dispatch]);
  var containerProps = {
    className: classes.outerContainer,
    'aria-busy': isLoading ? 'true' : 'false',
    'data-selenium': 'siteMap-container'
  };
  /**
     Render - Loading Sites
  */

  if (!neonContextState.isFinal) {
    return /*#__PURE__*/_react.default.createElement("div", containerProps, /*#__PURE__*/_react.default.createElement("div", _extends({
      ref: contentDivRef
    }, contentDivProps), /*#__PURE__*/_react.default.createElement(_Paper.default, {
      className: classes.contentPaper
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      component: "h3",
      gutterBottom: true
    }, "Loading Sites..."), /*#__PURE__*/_react.default.createElement(_CircularProgress.default, null))));
  }
  /**
     Render - Error (sites did not loaded)
  */


  if (neonContextState.hasError) {
    return /*#__PURE__*/_react.default.createElement("div", containerProps, /*#__PURE__*/_react.default.createElement("div", _extends({
      ref: contentDivRef
    }, contentDivProps), /*#__PURE__*/_react.default.createElement(_Paper.default, {
      className: classes.contentPaper
    }, /*#__PURE__*/_react.default.createElement(_Warning.default, {
      fontSize: "large",
      color: "error"
    }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      component: "h3",
      style: {
        marginTop: _Theme.default.spacing(1)
      }
    }, "Unable to load sites: ".concat(neonContextState.fetches.sites.error)))));
  }
  /**
     Render - Vertical resize Elements
  */


  var renderVerticalResizeButton = function renderVerticalResizeButton() {
    return /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      draggable: true,
      type: "button",
      ref: resizeButtonRef,
      title: "Resize ".concat(view === _SiteMapUtils.VIEWS.MAP ? 'map' : 'table', " vertically"),
      className: classes.resizeButton,
      onDragStart: resizeVerticallyDragStart,
      onDrag: resizeVerticallyDrag,
      onDragEnd: resizeVerticallyDragEnd
    }, /*#__PURE__*/_react.default.createElement(_Height.default, {
      fontSize: "small"
    }));
  };
  /**
     Render - Single Feature Option
  */


  var renderFeatureOption = function renderFeatureOption(key) {
    if (!_SiteMapUtils.FEATURES[key]) {
      return null;
    }

    var feature = _SiteMapUtils.FEATURES[key];
    var featureName = feature.name,
        iconSvg = feature.iconSvg,
        featureShape = feature.featureShape,
        _feature$style = feature.style,
        featureStyle = _feature$style === void 0 ? {} : _feature$style;

    var handleChange = function handleChange(event) {
      dispatch({
        type: 'setFilterFeatureVisibility',
        feature: key,
        visible: event.target.checked
      });
    };

    var icon = null;

    if (iconSvg) {
      icon = /*#__PURE__*/_react.default.createElement("img", {
        alt: featureName,
        src: iconSvg,
        className: classes.featureIcon
      });
    } else if (featureShape === 'Circle') {
      var circleProps = {
        cx: 14,
        cy: 14,
        r: 8,
        style: {
          fill: featureStyle.color ? "".concat(featureStyle.color, "88") : 'none',
          stroke: featureStyle.color || null,
          strokeWidth: 3
        }
      };
      icon = /*#__PURE__*/_react.default.createElement("svg", {
        width: "28",
        height: "28",
        className: classes.featureIcon
      }, /*#__PURE__*/_react.default.createElement("circle", circleProps));
    } else if (featureShape === 'Polyline') {
      var polylineProps = {
        points: '1.5,21.5 15,18.5 13,9.5 26.5,6.5',
        style: {
          fill: 'none',
          stroke: featureStyle.color || null,
          strokeWidth: 3,
          strokeLinejoin: 'bevel'
        }
      };
      icon = /*#__PURE__*/_react.default.createElement("svg", {
        width: "28",
        height: "28",
        className: classes.featureIcon
      }, /*#__PURE__*/_react.default.createElement("polyline", polylineProps));
    } else if (featureShape === 'Polygon') {
      var rectProps = {
        width: 25,
        height: 15,
        x: 1.5,
        y: 6.5,
        rx: 3,
        style: {
          fill: featureStyle.color || null,
          stroke: featureStyle.color || null,
          strokeWidth: 2.5,
          fillOpacity: 0.2,
          strokeOpacity: 0.85,
          strokeLinecap: 'round',
          strokeDasharray: featureStyle.dashArray || null
        }
      };
      icon = /*#__PURE__*/_react.default.createElement("svg", {
        width: "28",
        height: "28",
        className: classes.featureIcon
      }, /*#__PURE__*/_react.default.createElement("rect", rectProps));
    }

    var allChildren = [];
    var visibleChildren = [];
    var indeterminate = false;
    var collapsed = false;
    var label = null;
    var tooltip = feature.description || null;

    if (feature.type === _SiteMapUtils.FEATURE_TYPES.GROUP) {
      collapsed = state.filters.features.collapsed.has(key);
      var collapseTitle = "".concat(collapsed ? 'Expand' : 'Collapse', " ").concat(feature.name);
      allChildren = Object.keys(_SiteMapUtils.FEATURES).filter(function (f) {
        return _SiteMapUtils.FEATURES[f].parent === key;
      });
      allChildren.sort(function (a, b) {
        var _FEATURES$a = _SiteMapUtils.FEATURES[a],
            aType = _FEATURES$a.type,
            aName = _FEATURES$a.name;
        var _FEATURES$b = _SiteMapUtils.FEATURES[b],
            bType = _FEATURES$b.type,
            bName = _FEATURES$b.name;

        if (aType !== bType && (aType === _SiteMapUtils.FEATURE_TYPES.GROUP || bType === _SiteMapUtils.FEATURE_TYPES.GROUP)) {
          return bType === _SiteMapUtils.FEATURE_TYPES.GROUP ? -1 : 1;
        }

        return aName < bName ? -1 : 1;
      });
      visibleChildren = allChildren.filter(function (f) {
        return state.filters.features.visible[f];
      });
      indeterminate = visibleChildren.length > 0 && visibleChildren.length < allChildren.length;
      label = /*#__PURE__*/_react.default.createElement("div", {
        className: classes.featureOptionLabel,
        style: {
          justifyContent: 'space-between'
        }
      }, /*#__PURE__*/_react.default.createElement("span", {
        style: {
          fontWeight: 600
        }
      }, feature.name), /*#__PURE__*/_react.default.createElement(_IconButton.default, {
        size: "small",
        title: collapseTitle,
        "aria-label": collapseTitle,
        onClick: function onClick(event) {
          event.preventDefault(); // We use a setTimeout here so the icon doesn't change before the click event bubbles
          // Without it the target of the click event is an SVG that no longer exists in the
          // DOM tree, and is thus not contained in the features container, and is thus seen as
          // a click outside that will close the features container, when we know it's not.

          window.setTimeout(function () {
            dispatch({
              type: "setFilterFeature".concat(collapsed ? 'Expanded' : 'Collapsed'),
              feature: key
            });
          }, 0);
        }
      }, collapsed ? /*#__PURE__*/_react.default.createElement(_ArrowLeft.default, {
        fontSize: "inherit"
      }) : /*#__PURE__*/_react.default.createElement(_ArrowDropDown.default, {
        fontSize: "inherit"
      })));
    } else {
      label = /*#__PURE__*/_react.default.createElement("div", {
        className: classes.featureOptionLabel
      }, icon, /*#__PURE__*/_react.default.createElement("span", null, feature.name));
    }

    var formControl = /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
      key: key,
      label: label,
      "aria-label": tooltip,
      className: classes.featureOptionFormControlLabel,
      control: /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
        checked: state.filters.features.visible[key],
        onChange: handleChange,
        color: "secondary",
        indeterminate: indeterminate
      })
    });

    return /*#__PURE__*/_react.default.createElement("div", {
      key: key,
      style: {
        width: '100%'
      }
    }, tooltip ? /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      title: tooltip,
      placement: "bottom-start",
      PopperProps: {
        className: classes.popper
      },
      TransitionComponent: function TransitionComponent(_ref) {
        var children = _ref.children;
        return children;
      } // set no transition by mock component

    }, formControl) : formControl, !allChildren.length || collapsed ? null : /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginLeft: _Theme.default.spacing(3)
      }
    }, allChildren.filter(function (f) {
      return state.filters.features.available[f];
    }).map(renderFeatureOption)));
  };
  /**
     Render - Progress Indicator
  */


  var renderProgress = function renderProgress() {
    var progress = !isLoading || state.overallFetch.expected === 0 ? 0 : Math.floor(state.overallFetch.completed / state.overallFetch.expected * 10) * 10;
    var style = isLoading ? {} : {
      opacity: 0
    };
    var variant = 'determinate';

    if (isLoading && state.overallFetch.pendingHierarchy > 0) {
      variant = 'query';
    }

    return /*#__PURE__*/_react.default.createElement(_LinearProgress.default, {
      id: progressId,
      variant: variant,
      value: progress,
      style: style
    });
  };
  /**
     Render - Full Component
  */
  // MuiButtonBase-root MuiIconButton-root makeStyles-resizeButton-201 MuiIconButton-colorPrimary


  return /*#__PURE__*/_react.default.createElement("div", _extends({}, containerProps, {
    "aria-describedby": progressId
  }), state.filters.position === 'top' ? /*#__PURE__*/_react.default.createElement(_SiteMapFilters.default, null) : null, /*#__PURE__*/_react.default.createElement("div", _extends({
    ref: contentDivRef
  }, contentDivProps), view === _SiteMapUtils.VIEWS.MAP ? /*#__PURE__*/_react.default.createElement(_SiteMapLeaflet.default, null) : null, view === _SiteMapUtils.VIEWS.TABLE ? /*#__PURE__*/_react.default.createElement(_SiteMapTable.default, null) : null, renderVerticalResizeButton(), !state.filters.features.open ? null : /*#__PURE__*/_react.default.createElement("div", {
    ref: featuresRef,
    className: classes.featuresContainer
  }, Object.keys(_SiteMapUtils.FEATURES).filter(function (f) {
    return state.filters.features.available[f] && !_SiteMapUtils.FEATURES[f].parent;
  }).map(renderFeatureOption))), renderProgress(), state.filters.position === 'bottom' ? /*#__PURE__*/_react.default.createElement(_SiteMapFilters.default, null) : null, /*#__PURE__*/_react.default.createElement("div", {
    ref: resizeBorderRef,
    className: classes.resizeBorder
  }));
};

SiteMapContainer.propTypes = {
  unusableVerticalSpace: _propTypes.default.number
};
SiteMapContainer.defaultProps = {
  unusableVerticalSpace: 0
};
var _default = SiteMapContainer;
exports.default = _default;