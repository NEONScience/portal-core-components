"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _uniqueId = _interopRequireDefault(require("lodash/uniqueId"));

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Chip = _interopRequireDefault(require("@material-ui/core/Chip"));

var _Checkbox = _interopRequireDefault(require("@material-ui/core/Checkbox"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _FormControlLabel = _interopRequireDefault(require("@material-ui/core/FormControlLabel"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _List = _interopRequireDefault(require("@material-ui/core/List"));

var _ListItem = _interopRequireDefault(require("@material-ui/core/ListItem"));

var _ListItemIcon = _interopRequireDefault(require("@material-ui/core/ListItemIcon"));

var _ListItemSecondaryAction = _interopRequireDefault(require("@material-ui/core/ListItemSecondaryAction"));

var _ListItemText = _interopRequireDefault(require("@material-ui/core/ListItemText"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _ToggleButton = _interopRequireDefault(require("@material-ui/lab/ToggleButton"));

var _ToggleButtonGroup = _interopRequireDefault(require("@material-ui/lab/ToggleButtonGroup"));

var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Zoom = _interopRequireDefault(require("@material-ui/core/Zoom"));

var _HelpOutline = _interopRequireDefault(require("@material-ui/icons/HelpOutline"));

var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));

var _Error = _interopRequireDefault(require("@material-ui/icons/Error"));

var _ExpandLess = _interopRequireDefault(require("@material-ui/icons/ExpandLess"));

var _ExpandMore = _interopRequireDefault(require("@material-ui/icons/ExpandMore"));

var _VisibilityOff = _interopRequireDefault(require("@material-ui/icons/VisibilityOff"));

var _Visibility = _interopRequireDefault(require("@material-ui/icons/Visibility"));

var _ArrowDropDown = _interopRequireDefault(require("@material-ui/icons/ArrowDropDown"));

var _ArrowLeft = _interopRequireDefault(require("@material-ui/icons/ArrowLeft"));

var _Height = _interopRequireDefault(require("@material-ui/icons/Height"));

var _Toc = _interopRequireDefault(require("@material-ui/icons/Toc"));

var _NotInterested = _interopRequireDefault(require("@material-ui/icons/NotInterested"));

var _Done = _interopRequireDefault(require("@material-ui/icons/Done"));

var _Cancel = _interopRequireDefault(require("@material-ui/icons/Cancel"));

var _Remove = _interopRequireDefault(require("@material-ui/icons/Remove"));

var _Delete = _interopRequireDefault(require("@material-ui/icons/Delete"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _SiteMapContext = _interopRequireDefault(require("./SiteMapContext"));

var _SiteMapLeaflet = _interopRequireDefault(require("./SiteMapLeaflet"));

var _SiteMapTable = _interopRequireDefault(require("./SiteMapTable"));

var _SiteMapUtils = require("./SiteMapUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    ':root': {
      fontSize: '24px'
    },
    outerContainer: {
      zIndex: 0,
      width: '100%',
      position: 'relative'
    },
    contentContainer: {
      width: '100%',
      height: '0px',
      // Necessary to set a fixed aspect ratio from props (using paddingBottom)
      position: 'relative',
      backgroundColor: _Theme.default.colors.NEON_BLUE[200],
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
    legendContainer: {
      backgroundColor: theme.palette.grey[100],
      height: 'calc(100% - 84px)',
      borderBottomLeftRadius: '4px',
      borderTopLeftRadius: '4px',
      position: 'absolute',
      zIndex: 1000,
      top: '48px',
      right: '0px',
      boxShadow: '-3px 0 5px 0px rgba(0,0,0,0.5)',
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      overflowY: 'auto',
      '& span.MuiCheckbox-root': {
        marginLeft: '-9px'
      }
    },
    legendContainerFullscreen: {
      top: '56px',
      height: 'calc(100% - 92px)'
    },
    legendDivider: {
      width: '100%',
      borderBottomColor: theme.palette.grey[300],
      borderWidth: '0px 0px 1px 0px',
      margin: theme.spacing(2.5, 0)
    },
    legendSection: {
      width: '100%'
    },
    legendSectionTitleContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    legendSectionTitle: {
      fontWeight: 600
    },
    featureIcon: {
      width: '28px',
      height: '28px',
      marginRight: theme.spacing(1)
    },
    legendOptionFormControlLabel: {
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
    legendOptionLabel: {
      display: 'flex',
      alignItems: 'center'
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
      border: "1px solid ".concat(_Theme.default.colors.LIGHT_BLUE[500]),
      cursor: 'grab',
      '&:hover, &:active': {
        color: _Theme.default.colors.LIGHT_BLUE[400],
        borderColor: _Theme.default.colors.LIGHT_BLUE[400],
        backgroundColor: theme.palette.grey[50]
      },
      '&:active': {
        cursor: 'row-resize !important'
      },
      '& svg': {
        fontSize: '17px !important'
      }
    },
    resizeBorder: {
      position: 'absolute',
      border: "3px solid ".concat(_Theme.default.colors.LIGHT_BLUE[500]),
      top: '0px',
      left: '0px',
      width: '100%',
      zIndex: 998,
      display: 'none'
    },
    viewLegendButtonsContainer: {
      display: 'flex',
      position: 'absolute',
      zIndex: 401,
      top: '0px',
      right: '0px'
    },
    viewLegendButtonsContainerFullscreen: {
      top: '8px',
      right: '8px'
    },
    mapTableToggleButtonGroup: {
      borderRadius: '0px 0px 2px 2px',
      backgroundColor: 'white',
      '& button': {
        borderTopLeftRadius: '0px !important',
        borderTopRightRadius: '0px !important'
      }
    },
    mapTableToggleButtonGroupFullscreen: {
      borderRadius: '2px',
      backgroundColor: 'white'
    },
    legendButton: {
      border: "1px solid ".concat(_Theme.default.palette.primary.main),
      borderRadius: '0px 0px 0px 2px'
    },
    legendButtonFullscreen: {
      border: "1px solid ".concat(_Theme.default.palette.primary.main)
    },
    unselectablesButton: {
      border: "1px solid ".concat(_Theme.default.palette.primary.main),
      borderRadius: '0px 0px 2px 2px'
    },
    unselectablesButtonFullscreen: {
      border: "1px solid ".concat(_Theme.default.palette.primary.main)
    },
    selectionSummaryContainer: {
      position: 'absolute',
      left: '8px',
      bottom: '8px',
      zIndex: 400
    },
    selectionSummary: {
      position: 'absolute',
      bottom: theme.spacing(6),
      overflowY: 'auto',
      borderRadius: theme.spacing(2.5),
      '& .MuiListItemText-primary': {
        fontWeight: 600
      },
      '& .MuiListItem-secondaryAction': {
        paddingRight: theme.spacing(9)
      },
      '& .MuiListItemIcon-root': {
        minWidth: 'unset'
      },
      '& .MuiListItemSecondaryAction-root': {
        right: theme.spacing(3)
      }
    },
    selectionSummaryValid: {
      border: "1px solid ".concat(theme.palette.secondary.main),
      backgroundColor: theme.palette.grey[50]
    },
    selectionSummaryInvalid: {
      border: "1px solid ".concat(theme.palette.error.light),
      backgroundColor: theme.palette.error.light
    },
    summaryFeatureIcon: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      marginRight: theme.spacing(1.5),
      filter: 'drop-shadow(0px 0px 1.5px #000000bb)'
    },
    selectionChip: {
      opacity: 1,
      fontSize: theme.spacing(2),
      height: theme.spacing(5),
      borderRadius: theme.spacing(2.5),
      padding: theme.spacing(0, 1),
      '& .MuiChip-label': {
        padding: theme.spacing(0, 2)
      }
    },
    selectionChipError: {
      backgroundColor: theme.palette.error.light,
      fontWeight: 600,
      '& .MuiChip-icon': {
        color: theme.palette.error.dark
      }
    },
    overlayLegendContainer: {
      margin: theme.spacing(0.5, 0, 2, 3.5)
    },
    overlayLegendItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '6px',
      cursor: 'help'
    },
    overlayLegendSwatch: {
      width: '36px',
      height: '12px',
      border: '1px solid black',
      marginRight: theme.spacing(1.5),
      marginBottom: '-1px',
      display: 'inline-block'
    },
    overlayLegendItemTooltipTitle: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px'
    },
    overlayLegendCategory: {
      marginBottom: '6px',
      '& span.MuiTypography-caption': {
        fontWeight: 600
      }
    }
  };
});

var SiteMapContainer = function SiteMapContainer(props) {
  var classes = useStyles(_Theme.default);
  var _props$unusableVertic = props.unusableVerticalSpace,
      unusableVerticalSpace = _props$unusableVertic === void 0 ? 0 : _props$unusableVertic,
      mapUniqueId = props.mapUniqueId;

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      neonContextState = _NeonContext$useNeonC2[0];

  var _SiteMapContext$useSi = _SiteMapContext.default.useSiteMapContext(),
      _SiteMapContext$useSi2 = _slicedToArray(_SiteMapContext$useSi, 2),
      state = _SiteMapContext$useSi2[0],
      dispatch = _SiteMapContext$useSi2[1]; // console.log('SITEMAP STATE:', state);


  var isLoading = state.overallFetch.expected !== state.overallFetch.completed;
  var progressId = "sitemap-progress-".concat((0, _uniqueId.default)());
  var filters = state.filters,
      fullscreen = state.fullscreen,
      aspectRatio = state.aspectRatio,
      featureData = state.featureData,
      view = state.view.current,
      tableFullHeight = state.table.fullHeight,
      _state$selection = state.selection,
      selection = _state$selection.set,
      selectionActive = _state$selection.active,
      selectableItems = _state$selection.validSet,
      selectionValid = _state$selection.valid,
      selectionLimit = _state$selection.limit,
      hideUnselectable = _state$selection.hideUnselectable,
      showSummary = _state$selection.showSummary,
      manualLocationData = state.manualLocationData;
  var contentDivProps = {
    className: classes.contentContainer,
    style: tableFullHeight ? {
      height: 'auto',
      overflow: 'auto'
    } : {
      paddingBottom: "".concat((aspectRatio.currentValue || 0.75) * 100, "%")
    }
  };
  var legendRef = (0, _react.useRef)(null);
  var containerDivRef = (0, _react.useRef)(null);
  var contentDivRef = (0, _react.useRef)(null);
  var resizeBorderRef = (0, _react.useRef)(null);
  var resizeButtonRef = (0, _react.useRef)(null);
  var belowMd = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm'));
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
    var handleResize = (0, _debounce.default)(function () {
      var newAspectRatio = aspectRatio.isDynamic ? (0, _SiteMapUtils.getDynamicAspectRatio)(unusableVerticalSpace) : aspectRatio.currentValue;

      if (fullscreen && containerDivRef.current && contentDivRef.current) {
        var boundingClientRect = contentDivRef.current.getBoundingClientRect();
        var targetHeight = Math.max(window.innerHeight - boundingClientRect.y - 1, 0);
        var targetWidth = boundingClientRect.height + boundingClientRect.y > window.innerHeight ? window.innerWidth : contentDivRef.current.clientWidth;
        newAspectRatio = targetHeight / targetWidth;
        containerDivRef.current.style.height = "calc(100vh - ".concat(boundingClientRect.y, "px)");
        containerDivRef.current.style.overflowY = 'hidden';
      }

      dispatch({
        type: 'setAspectRatio',
        aspectRatio: newAspectRatio,
        widthReference: contentDivRef.current ? contentDivRef.current.clientWidth : 0
      });
    }, 10);

    if ((!aspectRatio.isDynamic || aspectRatio.currentValue !== null) && !fullscreen) {
      return function () {};
    }

    handleResize();

    if ((!aspectRatio.isDynamic || aspectRatio.resizeEventListenerInitialized) && !fullscreen) {
      return function () {};
    }

    window.addEventListener('resize', handleResize);
    dispatch({
      type: 'setAspectRatioResizeEventListenerInitialized'
    });
    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, [unusableVerticalSpace, aspectRatio, fullscreen, dispatch]);
  /**
     Effect - Monitor all click events and close the legend pane if open and clicked outside
     and not in the content area (map or table)
  */

  (0, _react.useEffect)(function () {
    if (!state.filters.legendOpen || !legendRef.current) {
      return function () {};
    }

    var handleClick = function handleClick(event) {
      if (legendRef.current && !legendRef.current.contains(event.target) && contentDivRef.current && !contentDivRef.current.contains(event.target)) {
        dispatch({
          type: 'setLegendOpen',
          open: false
        });
      }
    };

    document.addEventListener('click', handleClick);
    return function () {
      document.removeEventListener('click', handleClick);
    };
  }, [state.filters.legendOpen, legendRef, contentDivRef, dispatch]);
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
    ref: containerDivRef,
    className: classes.outerContainer,
    'aria-busy': isLoading ? 'true' : 'false',
    'data-selenium': 'siteMap-container',
    id: mapUniqueId
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
     Render - Map/Table Toggle Button Group
  */


  var renderMapTableToggleButtonGroup = function renderMapTableToggleButtonGroup() {
    var _viewTooltips;

    if (state.view.current === _SiteMapUtils.VIEWS.SPLIT) {
      return null;
    }

    var viewTooltips = (_viewTooltips = {}, _defineProperty(_viewTooltips, _SiteMapUtils.VIEWS.MAP, 'Show the observatory map'), _defineProperty(_viewTooltips, _SiteMapUtils.VIEWS.TABLE, 'Show a table of all locations currently visible in the map'), _viewTooltips);
    return /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
      exclusive: true,
      color: "primary",
      variant: "outlined",
      value: view,
      onChange: function onChange(event, newView) {
        return dispatch({
          type: 'setView',
          view: newView
        });
      },
      className: fullscreen ? classes.mapTableToggleButtonGroupFullscreen : classes.mapTableToggleButtonGroup
    }, Object.keys(_SiteMapUtils.VIEWS).filter(function (key) {
      return key !== _SiteMapUtils.VIEWS.SPLIT;
    }).map(function (key) {
      return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        key: key,
        title: viewTooltips[key],
        enterDelay: 500,
        enterNextDelay: 200,
        placement: fullscreen ? 'bottom-end' : 'top-end'
      }, /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
        value: key,
        selected: state.view.current === key,
        "data-selenium": "sitemap-viewButton-".concat(key)
      }, key));
    }));
  };
  /**
     Render - Legend Button
  */


  var renderLegendButton = function renderLegendButton() {
    var buttonStyle = filters.legendOpen ? {} : {
      backgroundColor: 'white'
    };
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        borderRadius: '2px',
        marginLeft: _Theme.default.spacing(1)
      }
    }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      enterDelay: 500,
      enterNextDelay: 200,
      title: "".concat(filters.legendOpen ? 'Hide' : 'Show', " the legend"),
      placement: fullscreen ? 'bottom-end' : 'top-end'
    }, /*#__PURE__*/_react.default.createElement(_Button.default, {
      color: "primary",
      style: buttonStyle,
      variant: filters.legendOpen ? 'contained' : 'outlined',
      endIcon: filters.legendOpen ? /*#__PURE__*/_react.default.createElement(_ExpandLess.default, null) : /*#__PURE__*/_react.default.createElement(_ExpandMore.default, null),
      "data-selenium": "sitemap-legendButton",
      className: fullscreen ? classes.legendButtonFullscreen : classes.legendButton,
      onClick: function onClick() {
        dispatch({
          type: 'setLegendOpen',
          open: !filters.legendOpen
        });
      }
    }, belowMd ? /*#__PURE__*/_react.default.createElement(_Toc.default, {
      style: {
        fontSize: '20px'
      }
    }) : 'Legend')));
  };
  /**
     Render - Unselectables Button
  */


  var renderUnselectablesButton = function renderUnselectablesButton() {
    if (!selectionActive || !selectableItems) {
      return null;
    }

    var buttonStyle = hideUnselectable ? {
      backgroundColor: 'white'
    } : {};
    var items = selectionActive.toLowerCase().replace('_', '');
    var title = "Click to ".concat(hideUnselectable ? 'show' : 'hide', " ").concat(items, " that are not selectable");
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        borderRadius: '2px',
        marginRight: _Theme.default.spacing(1)
      }
    }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      enterDelay: 500,
      enterNextDelay: 200,
      title: title,
      placement: fullscreen ? 'bottom-end' : 'top-end'
    }, /*#__PURE__*/_react.default.createElement(_Button.default, {
      color: "primary",
      style: buttonStyle,
      variant: hideUnselectable ? 'outlined' : 'contained',
      startIcon: hideUnselectable ? /*#__PURE__*/_react.default.createElement(_VisibilityOff.default, null) : /*#__PURE__*/_react.default.createElement(_Visibility.default, null),
      "data-selenium": "sitemap-unselectablesButton",
      "aria-label": title,
      className: fullscreen ? classes.unselectablesButtonFullscreen : classes.unselectablesButton,
      onClick: function onClick() {
        dispatch({
          type: 'setHideUnselectable',
          hideUnselectable: !hideUnselectable
        });
      }
    }, belowMd ? /*#__PURE__*/_react.default.createElement(_NotInterested.default, {
      style: {
        fontSize: '20px'
      }
    }) : 'Unselectable')));
  };
  /**
     Helper Functions - Selection Summary
  */


  var getSelectedItemFeatureKey = function getSelectedItemFeatureKey(item) {
    if (!selectionActive) {
      return null;
    }

    return Object.keys(featureData[selectionActive]).find(function (key) {
      return Object.keys(featureData[selectionActive][key]).includes(item);
    }) || null;
  };

  var getSelectedItemIcon = function getSelectedItemIcon(item) {
    if (!selectionActive) {
      return null;
    }

    var featureKey = getSelectedItemFeatureKey(item);

    if (!featureKey) {
      return null;
    }

    return _SiteMapUtils.FEATURES[featureKey].iconSvg || null;
  };

  var getSelectedItemDescription = function getSelectedItemDescription(item) {
    if (!selectionActive) {
      return null;
    }

    var featureKey = getSelectedItemFeatureKey(item);

    if (!featureKey) {
      return null;
    }

    switch (selectionActive) {
      case _SiteMapUtils.FEATURE_TYPES.SITES.KEY:
        return featureData[selectionActive][featureKey][item].description;

      case _SiteMapUtils.FEATURE_TYPES.STATES.KEY:
      case _SiteMapUtils.FEATURE_TYPES.DOMAINS.KEY:
        return featureData[selectionActive][featureKey][item].name;

      default:
        return null;
    }
  };
  /**
     Render - Selection Summary
  */


  var renderSelectionSummary = function renderSelectionSummary() {
    if (!selectionActive) {
      return null;
    }

    var unit = _SiteMapUtils.FEATURE_TYPES[selectionActive].unit || '';
    var units = _SiteMapUtils.FEATURE_TYPES[selectionActive].units || '';
    var plural = selection.size !== 1;
    var title = "".concat(selection.size ? selection.size.toString() : 'No', " ").concat(plural ? units : unit, " selected");

    var icon = /*#__PURE__*/_react.default.createElement(_Remove.default, null);

    var color = 'default';

    if (selection.size) {
      if (selectionValid) {
        icon = /*#__PURE__*/_react.default.createElement(_Done.default, null);
        color = 'secondary';
      } else {
        icon = /*#__PURE__*/_react.default.createElement(_Error.default, null);
      }
    }

    var limit = null;

    if (Number.isFinite(selectionLimit)) {
      limit = "".concat(selectionLimit, " required");
    }

    if (Array.isArray(selectionLimit)) {
      if (selectionLimit[0] === 1) {
        limit = "select up to ".concat(selectionLimit[1]);
      } else {
        limit = "min ".concat(selectionLimit[0], "; max ").concat(selectionLimit[1]);
      }
    }

    var summaryContainerStyle = {};

    if (view === _SiteMapUtils.VIEWS.MAP) {
      summaryContainerStyle.left = '108px';
    }

    var chipClassName = !selection.size || selectionValid ? classes.selectionChip : "".concat(classes.selectionChip, " ").concat(classes.selectionChipError);
    var summaryValidClass = selection.size && selectionValid ? classes.selectionSummaryValid : classes.selectionSummaryInvalid;
    var summaryClass = "".concat(classes.selectionSummary, " ").concat(summaryValidClass);
    var maxHeight = 72 * 3;

    if (contentDivRef && contentDivRef.current) {
      maxHeight = Math.max((contentDivRef.current.clientHeight || 0) - 72 * 2, 72 * 3);
      maxHeight -= maxHeight % 72;
    }

    maxHeight = Math.min(maxHeight, selection.size * 72);
    var summaryStyle = {
      maxHeight: "".concat(maxHeight + 1, "px")
    };
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.selectionSummaryContainer,
      style: summaryContainerStyle
    }, /*#__PURE__*/_react.default.createElement(_Zoom.default, {
      in: showSummary,
      mountOnEnter: true,
      unmountOnExit: true
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: summaryClass,
      style: summaryStyle
    }, /*#__PURE__*/_react.default.createElement(_List.default, {
      dense: true
    }, _toConsumableArray(selection).sort().map(function (selectedItem) {
      var src = getSelectedItemIcon(selectedItem);
      var remove = "Remove ".concat(selectedItem, " from selection");
      return /*#__PURE__*/_react.default.createElement(_ListItem.default, {
        key: selectedItem
      }, !src ? null : /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement("img", {
        alt: selectedItem,
        src: src,
        className: classes.summaryFeatureIcon
      })), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
        primary: selectedItem,
        secondary: getSelectedItemDescription(selectedItem)
      }), /*#__PURE__*/_react.default.createElement(_ListItemSecondaryAction.default, null, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        title: remove,
        enterDelay: 500,
        enterNextDelay: 200,
        placement: "right"
      }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
        edge: "end",
        "aria-label": remove,
        onClick: function onClick() {
          return dispatch({
            type: 'toggleItemSelected',
            item: selectedItem
          });
        }
      }, /*#__PURE__*/_react.default.createElement(_Delete.default, null)))));
    })))), /*#__PURE__*/_react.default.createElement(_Chip.default, {
      icon: icon,
      color: color,
      label: limit ? "".concat(title, " (").concat(limit, ")") : title,
      "aria-label": "Current selection status",
      className: chipClassName,
      onClick: function onClick() {
        return dispatch({
          type: 'toggleSelectionSummary',
          showSummary: !showSummary
        });
      },
      deleteIcon: /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        enterDelay: 500,
        enterNextDelay: 200,
        title: "Deselect all"
      }, /*#__PURE__*/_react.default.createElement(_Cancel.default, null)),
      onDelete: selection.size ? function () {
        return dispatch({
          type: 'updateSelectionSet',
          selection: new Set()
        });
      } : function () {}
    }));
  };
  /**
     Render - Vertical resize Elements
  */


  var renderVerticalResizeButton = function renderVerticalResizeButton() {
    if (fullscreen || view === _SiteMapUtils.VIEWS.TABLE && tableFullHeight) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      placement: "left",
      enterDelay: 500,
      enterNextDelay: 200,
      title: "Resize ".concat(view === _SiteMapUtils.VIEWS.TABLE ? 'table' : 'map', " vertically")
    }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      draggable: true,
      type: "button",
      ref: resizeButtonRef,
      className: classes.resizeButton,
      onDragStart: resizeVerticallyDragStart,
      onDrag: resizeVerticallyDrag,
      onDragEnd: resizeVerticallyDragEnd
    }, /*#__PURE__*/_react.default.createElement(_Height.default, {
      fontSize: "small"
    })));
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
        featureStyle = _feature$style === void 0 ? {} : _feature$style,
        description = feature.description,
        descriptionFromParentDataFeatureKey = feature.descriptionFromParentDataFeatureKey,
        parentDataFeatureKey = feature.parentDataFeatureKey,
        dataSource = feature.dataSource; // Special case: do not include any features with a dataSource of MANUAL_LOCATIONS if
    // manualLocationData is not also defined

    if (dataSource === _SiteMapUtils.FEATURE_DATA_SOURCES.MANUAL_LOCATIONS && !manualLocationData) {
      return null;
    }

    var handleChange = function handleChange(event) {
      dispatch({
        type: 'setLegendFeatureOptionVisibility',
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
    var tooltip = null;

    if (description) {
      tooltip = description;
    }

    if (descriptionFromParentDataFeatureKey && parentDataFeatureKey && _SiteMapUtils.FEATURES[parentDataFeatureKey]) {
      tooltip = _SiteMapUtils.FEATURES[parentDataFeatureKey].description || null;
    }

    if (feature.type === _SiteMapUtils.FEATURE_TYPES.GROUP.KEY) {
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

        if (aType !== bType && (aType === _SiteMapUtils.FEATURE_TYPES.GROUP.KEY || bType === _SiteMapUtils.FEATURE_TYPES.GROUP.KEY)) {
          return bType === _SiteMapUtils.FEATURE_TYPES.GROUP.KEY ? -1 : 1;
        }

        return aName < bName ? -1 : 1;
      });
      visibleChildren = allChildren.filter(function (f) {
        return state.filters.features.visible[f];
      });
      indeterminate = visibleChildren.length > 0 && visibleChildren.length < allChildren.length;
      label = /*#__PURE__*/_react.default.createElement("div", {
        className: classes.legendOptionLabel,
        style: {
          justifyContent: 'space-between'
        }
      }, /*#__PURE__*/_react.default.createElement("span", {
        style: {
          fontWeight: 500
        }
      }, feature.name), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        title: collapseTitle,
        enterDelay: 500,
        enterNextDelay: 200
      }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
        size: "small",
        "aria-label": collapseTitle,
        style: {
          margin: _Theme.default.spacing(0, -2, 0, 1)
        },
        onClick: function onClick(event) {
          event.preventDefault(); // We use setTimeout here so the icon doesn't change before the click event bubbles.
          // Without it the target of the click event is an SVG that no longer exists in the
          // DOM tree (thus not contained in the features container, thus seen as a click
          // outside that will close the features container, when we know it's not).

          window.setTimeout(function () {
            dispatch({
              type: "setLegendFeatureOption".concat(collapsed ? 'Expanded' : 'Collapsed'),
              feature: key
            });
          }, 0);
        }
      }, collapsed ? /*#__PURE__*/_react.default.createElement(_ArrowLeft.default, {
        fontSize: "inherit"
      }) : /*#__PURE__*/_react.default.createElement(_ArrowDropDown.default, {
        fontSize: "inherit"
      }))));
    } else {
      label = /*#__PURE__*/_react.default.createElement("div", {
        className: classes.legendOptionLabel
      }, icon, /*#__PURE__*/_react.default.createElement("span", null, feature.name));
    }

    var formControl = /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
      key: key,
      label: label,
      "aria-label": tooltip,
      className: classes.legendOptionFormControlLabel,
      control: /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
        checked: state.filters.features.visible[key],
        onChange: handleChange,
        color: "primary",
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
      enterDelay: 500,
      enterNextDelay: 200,
      placement: "bottom-start",
      TransitionComponent: function TransitionComponent(_ref) {
        var children = _ref.children;
        return children;
      } // set no transition by mock component

    }, formControl) : formControl, !allChildren.length ? null : /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginLeft: _Theme.default.spacing(3),
        display: collapsed ? 'none' : 'block'
      }
    }, allChildren.filter(function (f) {
      return state.filters.features.available[f];
    }).map(renderFeatureOption)));
  };
  /**
     Render - Single Overlay Legend
  */


  var renderOverlayLegend = function renderOverlayLegend(legend) {
    var renderItem = function renderItem(legendKey) {
      var _legend$legendKey = legend[legendKey],
          itemName = _legend$legendKey.name,
          itemColor = _legend$legendKey.color,
          itemDescription = _legend$legendKey.description;

      var swatch = /*#__PURE__*/_react.default.createElement("div", {
        className: classes.overlayLegendSwatch,
        style: {
          backgroundColor: itemColor
        }
      });

      var itemLabel = /*#__PURE__*/_react.default.createElement("div", {
        key: legendKey,
        className: classes.overlayLegendItem
      }, swatch, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "caption"
      }, itemName));

      return itemDescription ? /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        key: legendKey,
        title: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
          className: classes.overlayLegendItemTooltipTitle
        }, swatch, /*#__PURE__*/_react.default.createElement("b", null, itemName)), itemDescription),
        enterDelay: 500,
        enterNextDelay: 200,
        placement: "left",
        TransitionComponent: function TransitionComponent(_ref2) {
          var children = _ref2.children;
          return children;
        }
      }, itemLabel) : itemLabel;
    };

    if (!Object.keys(legend).some(function (legendKey) {
      return legend[legendKey].category;
    })) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: classes.overlayLegendContainer
      }, Object.keys(legend).map(renderItem));
    }

    var otherCategory = 'Other';
    var categories = Object.keys(legend).reduce(function (acc, cur) {
      acc.add(legend[cur].category || otherCategory);
      return acc;
    }, new Set());
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.overlayLegendContainer
    }, Array.from(categories).map(function (category, idx) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
        key: category
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: classes.overlayLegendCategory,
        style: {
          marginTop: idx ? '8px' : '0px'
        }
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "caption"
      }, category)), Object.keys(legend).filter(function (legendKey) {
        return legend[legendKey].category === category || !legend[legendKey].category && category === otherCategory;
      }).map(renderItem));
    }));
  };
  /**
     Render - Single Overlay Option
  */


  var renderOverlayOption = function renderOverlayOption(key) {
    var _OVERLAYS$key = _SiteMapUtils.OVERLAYS[key],
        title = _OVERLAYS$key.title,
        tooltip = _OVERLAYS$key.description,
        legend = _OVERLAYS$key.legend;

    var handleChange = function handleChange(event) {
      dispatch({
        type: 'setMapOverlayVisibility',
        overlay: key,
        visible: event.target.checked
      });
    };

    var collapsed = true;
    var label = null;

    if (legend) {
      collapsed = !state.filters.overlays.expanded.has(key);
      var collapseTitle = "".concat(collapsed ? 'Expand' : 'Collapse', " ").concat(title, " Legend");
      label = /*#__PURE__*/_react.default.createElement("div", {
        className: classes.legendOptionLabel,
        style: {
          justifyContent: 'space-between'
        }
      }, /*#__PURE__*/_react.default.createElement("span", {
        style: {
          fontWeight: 500
        }
      }, title), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        title: collapseTitle,
        enterDelay: 500,
        enterNextDelay: 200,
        placement: "top"
      }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
        size: "small",
        "aria-label": collapseTitle,
        style: {
          margin: _Theme.default.spacing(0, -2, 0, 1)
        },
        onClick: function onClick(event) {
          event.preventDefault(); // We use setTimeout here so the icon doesn't change before the click event bubbles.
          // Without it the target of the click event is an SVG that no longer exists in the
          // DOM tree (thus not contained in the features container, thus seen as a click
          // outside that will close the features container, when we know it's not).

          window.setTimeout(function () {
            dispatch({
              type: "setLegendOverlayOption".concat(collapsed ? 'Expanded' : 'Collapsed'),
              overlay: key
            });
          }, 0);
        }
      }, collapsed ? /*#__PURE__*/_react.default.createElement(_ArrowLeft.default, {
        fontSize: "inherit"
      }) : /*#__PURE__*/_react.default.createElement(_ArrowDropDown.default, {
        fontSize: "inherit"
      }))));
    } else {
      label = /*#__PURE__*/_react.default.createElement("div", {
        className: classes.legendOptionLabel
      }, /*#__PURE__*/_react.default.createElement("span", null, title));
    }

    var formControl = /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
      key: key,
      label: label,
      "aria-label": tooltip,
      className: classes.legendOptionFormControlLabel,
      control: /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
        checked: state.map.overlays.has(key),
        onChange: handleChange,
        color: "primary"
      })
    });

    return /*#__PURE__*/_react.default.createElement("div", {
      key: key,
      style: {
        width: '100%'
      }
    }, tooltip ? /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      title: tooltip,
      enterDelay: 500,
      enterNextDelay: 200,
      placement: "bottom-start",
      TransitionComponent: function TransitionComponent(_ref3) {
        var children = _ref3.children;
        return children;
      } // set no transition by mock component

    }, formControl) : formControl, collapsed || !legend ? null : renderOverlayLegend(legend));
  };
  /**
     Render - Legend - NEON Observatory Features
  */


  var renderLegendNEONObservatoryFeatures = function renderLegendNEONObservatoryFeatures() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.legendSection
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.legendSectionTitleContainer
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      className: classes.legendSectionTitle
    }, "NEON Observatory Features")), Object.keys(_SiteMapUtils.FEATURES).filter(function (f) {
      return state.filters.features.available[f] && !_SiteMapUtils.FEATURES[f].parent;
    }).filter(function (f) {
      return !_SiteMapUtils.FEATURES[f].generalLegendGroup;
    }).map(renderFeatureOption));
  };
  /**
     Render - Legend - Overlays
  */


  var renderLegendOverlays = function renderLegendOverlays() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, Object.keys(_SiteMapUtils.OVERLAY_GROUPS).map(function (groupKey) {
      var _OVERLAY_GROUPS$group = _SiteMapUtils.OVERLAY_GROUPS[groupKey],
          title = _OVERLAY_GROUPS$group.title,
          description = _OVERLAY_GROUPS$group.description;
      return /*#__PURE__*/_react.default.createElement("div", {
        key: groupKey,
        className: classes.legendSection
      }, /*#__PURE__*/_react.default.createElement("hr", {
        className: classes.legendDivider
      }), /*#__PURE__*/_react.default.createElement("div", {
        className: classes.legendSectionTitleContainer
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "h6",
        className: classes.legendSectionTitle
      }, title), !description ? null : /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        title: description
      }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
        size: "small",
        style: {
          margin: _Theme.default.spacing(0, -0.75, 0, 1)
        },
        "aria-label": "".concat(title, " layer group description")
      }, /*#__PURE__*/_react.default.createElement(_HelpOutline.default, {
        style: {
          fontSize: '1rem'
        }
      })))), Object.keys(_SiteMapUtils.OVERLAYS).filter(function (o) {
        return _SiteMapUtils.OVERLAYS[o].group === groupKey;
      }).map(renderOverlayOption));
    }));
  };
  /**
     Render - Legend - General Features
  */


  var renderLegendGeneralFeatures = function renderLegendGeneralFeatures() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.legendSection
    }, /*#__PURE__*/_react.default.createElement("hr", {
      className: classes.legendDivider
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.legendSectionTitleContainer
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      className: classes.legendSectionTitle
    }, "General Features")), Object.keys(_SiteMapUtils.FEATURES).filter(function (f) {
      return state.filters.features.available[f] && !_SiteMapUtils.FEATURES[f].parent;
    }).filter(function (f) {
      return _SiteMapUtils.FEATURES[f].generalLegendGroup;
    }).map(renderFeatureOption));
  };
  /**
     Render - Full Component
  */


  var legendContainerClassName = classes.legendContainer;
  var viewLegendButtonsContainerClassName = classes.viewLegendButtonsContainer;

  if (fullscreen) {
    /* eslint-disable max-len */
    legendContainerClassName = "".concat(classes.legendContainer, " ").concat(classes.legendContainerFullscreen);
    viewLegendButtonsContainerClassName = "".concat(classes.viewLegendButtonsContainer, " ").concat(classes.viewLegendButtonsContainerFullscreen);
    /* eslint-enable max-len */
  }

  var ret = /*#__PURE__*/_react.default.createElement("div", _extends({}, containerProps, {
    "aria-describedby": progressId
  }), /*#__PURE__*/_react.default.createElement("div", _extends({
    ref: contentDivRef
  }, contentDivProps), view === _SiteMapUtils.VIEWS.MAP || view === _SiteMapUtils.VIEWS.SPLIT ? /*#__PURE__*/_react.default.createElement(_SiteMapLeaflet.default, null) : null, view === _SiteMapUtils.VIEWS.TABLE ? /*#__PURE__*/_react.default.createElement(_SiteMapTable.default, null) : null, renderVerticalResizeButton(), /*#__PURE__*/_react.default.createElement("div", {
    ref: legendRef,
    className: legendContainerClassName,
    style: {
      display: state.filters.legendOpen ? 'flex' : 'none'
    }
  }, renderLegendNEONObservatoryFeatures(), renderLegendOverlays(), renderLegendGeneralFeatures()), /*#__PURE__*/_react.default.createElement("div", {
    className: viewLegendButtonsContainerClassName
  }, renderUnselectablesButton(), renderMapTableToggleButtonGroup(), renderLegendButton()), renderSelectionSummary()), fullscreen ? null : /*#__PURE__*/_react.default.createElement("div", {
    ref: resizeBorderRef,
    className: classes.resizeBorder
  }), view === _SiteMapUtils.VIEWS.SPLIT ? /*#__PURE__*/_react.default.createElement(_SiteMapTable.default, null) : null);

  return ret;
};

SiteMapContainer.propTypes = {
  unusableVerticalSpace: _propTypes.default.number,
  mapUniqueId: _propTypes.default.number
};
SiteMapContainer.defaultProps = {
  unusableVerticalSpace: 0,
  mapUniqueId: 0
};
var _default = SiteMapContainer;
exports.default = _default;