"use strict";

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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
const useStyles = (0, _styles.makeStyles)(theme => ({
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
    boxShadow
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
}));
const SiteMapContainer = props => {
  const classes = useStyles(_Theme.default);
  const {
    unusableVerticalSpace = 0,
    mapUniqueId
  } = props;
  const [neonContextState] = _NeonContext.default.useNeonContextState();
  const [state, dispatch] = _SiteMapContext.default.useSiteMapContext();
  const isLoading = state.overallFetch.expected !== state.overallFetch.completed;
  const progressId = "sitemap-progress-".concat((0, _uniqueId.default)());
  const {
    filters,
    fullscreen,
    aspectRatio,
    featureData,
    view: {
      current: view
    },
    table: {
      fullHeight: tableFullHeight
    },
    selection: {
      set: selection,
      active: selectionActive,
      validSet: selectableItems,
      valid: selectionValid,
      limit: selectionLimit,
      hideUnselectable,
      showSummary
    },
    manualLocationData
  } = state;
  const contentDivProps = {
    className: classes.contentContainer,
    style: tableFullHeight ? {
      height: 'auto',
      overflow: 'auto'
    } : {
      paddingBottom: "".concat((aspectRatio.currentValue || 0.75) * 100, "%")
    }
  };
  const legendRef = (0, _react.useRef)(null);
  const containerDivRef = (0, _react.useRef)(null);
  const contentDivRef = (0, _react.useRef)(null);
  const resizeBorderRef = (0, _react.useRef)(null);
  const resizeButtonRef = (0, _react.useRef)(null);
  const belowMd = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm'));

  /**
     Vertical Resize Hooks
  */
  const [resizeDragging, setResizeDragging] = (0, _react.useState)(false);
  const [dragStartY, setDragStartY] = (0, _react.useState)(null);
  const dragDeltaY = (0, _react.useRef)(null);
  const resizeVerticallyDragStart = (0, _react.useCallback)(event => {
    if (!resizeBorderRef.current || !contentDivRef.current) {
      return;
    }
    setDragStartY(event.clientY);
    setResizeDragging(true);
    dragDeltaY.current = 0;
    resizeBorderRef.current.style.display = 'block';
    resizeBorderRef.current.style.height = "".concat(contentDivRef.current.clientHeight, "px");
  }, [setDragStartY, setResizeDragging, dragDeltaY]);
  const resizeVerticallyDrag = (0, _react.useCallback)(event => {
    if (!resizeDragging || !resizeBorderRef.current || dragStartY === null || event.clientY === 0) {
      return;
    }
    dragDeltaY.current = event.clientY - dragStartY;
    const newHeight = Math.max(contentDivRef.current.clientHeight + dragDeltaY.current, _SiteMapUtils.MIN_CONTAINER_HEIGHT);
    resizeBorderRef.current.style.height = "".concat(newHeight, "px");
  }, [resizeDragging, dragStartY, dragDeltaY]);
  const resizeVerticallyDragEnd = (0, _react.useCallback)(() => {
    const finalHeight = Math.max(contentDivRef.current.clientHeight + dragDeltaY.current, _SiteMapUtils.MIN_CONTAINER_HEIGHT);
    setDragStartY(null);
    setResizeDragging(false);
    dragDeltaY.current = null;
    resizeBorderRef.current.style.display = 'none';
    resizeButtonRef.current.blur();
    const newAspectRatio = finalHeight / aspectRatio.widthReference;
    dispatch({
      type: 'setAspectRatio',
      aspectRatio: newAspectRatio,
      widthReference: aspectRatio.widthReference
    });
  }, [aspectRatio.widthReference, dispatch, setDragStartY, setResizeDragging, dragDeltaY]);

  /**
     Effect - Register event listener to dynamically adjust aspect ratio from viewport dimensions
  */
  (0, _react.useLayoutEffect)(() => {
    const handleResize = (0, _debounce.default)(() => {
      let newAspectRatio = aspectRatio.isDynamic ? (0, _SiteMapUtils.getDynamicAspectRatio)(unusableVerticalSpace) : aspectRatio.currentValue;
      if (fullscreen && containerDivRef.current && contentDivRef.current) {
        const boundingClientRect = contentDivRef.current.getBoundingClientRect();
        const targetHeight = Math.max(window.innerHeight - boundingClientRect.y - 1, 0);
        const targetWidth = boundingClientRect.height + boundingClientRect.y > window.innerHeight ? window.innerWidth : contentDivRef.current.clientWidth;
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
      return () => {};
    }
    handleResize();
    if ((!aspectRatio.isDynamic || aspectRatio.resizeEventListenerInitialized) && !fullscreen) {
      return () => {};
    }
    window.addEventListener('resize', handleResize);
    dispatch({
      type: 'setAspectRatioResizeEventListenerInitialized'
    });
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [unusableVerticalSpace, aspectRatio, fullscreen, dispatch]);

  /**
     Effect - Monitor all click events and close the legend pane if open and clicked outside
     and not in the content area (map or table)
  */
  (0, _react.useEffect)(() => {
    if (!state.filters.legendOpen || !legendRef.current) {
      return () => {};
    }
    const handleClick = event => {
      if (legendRef.current && !legendRef.current.contains(event.target) && contentDivRef.current && !contentDivRef.current.contains(event.target)) {
        dispatch({
          type: 'setLegendOpen',
          open: false
        });
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [state.filters.legendOpen, legendRef, contentDivRef, dispatch]);

  /**
     Effect - If NeonContext Data is now available and has not been hydrated into state then do so.
  */
  (0, _react.useEffect)(() => {
    if (state.neonContextHydrated || !(neonContextState.isFinal && !neonContextState.hasError)) {
      return;
    }
    dispatch({
      type: 'hydrateNeonContextData',
      neonContextData: neonContextState.data
    });
  }, [state.neonContextHydrated, neonContextState.isFinal, neonContextState.hasError, neonContextState.data, dispatch]);
  const containerProps = {
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
  const renderMapTableToggleButtonGroup = () => {
    if (state.view.current === _SiteMapUtils.VIEWS.SPLIT) {
      return null;
    }
    const viewTooltips = {
      [_SiteMapUtils.VIEWS.MAP]: 'Show the observatory map',
      [_SiteMapUtils.VIEWS.TABLE]: 'Show a table of all locations currently visible in the map'
    };
    return /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
      exclusive: true,
      color: "primary",
      variant: "outlined",
      value: view,
      onChange: (event, newView) => dispatch({
        type: 'setView',
        view: newView
      }),
      className: fullscreen ? classes.mapTableToggleButtonGroupFullscreen : classes.mapTableToggleButtonGroup
    }, Object.keys(_SiteMapUtils.VIEWS).filter(key => key !== _SiteMapUtils.VIEWS.SPLIT).map(key => /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      key: key,
      title: viewTooltips[key],
      enterDelay: 500,
      enterNextDelay: 200,
      placement: fullscreen ? 'bottom-end' : 'top-end'
    }, /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
      value: key,
      selected: state.view.current === key,
      "data-selenium": "sitemap-viewButton-".concat(key)
    }, key))));
  };

  /**
     Render - Legend Button
  */
  const renderLegendButton = () => {
    const buttonStyle = filters.legendOpen ? {} : {
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
      onClick: () => {
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
  const renderUnselectablesButton = () => {
    if (!selectionActive || !selectableItems) {
      return null;
    }
    const buttonStyle = hideUnselectable ? {
      backgroundColor: 'white'
    } : {};
    const items = selectionActive.toLowerCase().replace('_', '');
    const title = "Click to ".concat(hideUnselectable ? 'show' : 'hide', " ").concat(items, " that are not selectable");
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
      onClick: () => {
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
  const getSelectedItemFeatureKey = item => {
    if (!selectionActive) {
      return null;
    }
    return Object.keys(featureData[selectionActive]).find(key => Object.keys(featureData[selectionActive][key]).includes(item)) || null;
  };
  const getSelectedItemIcon = item => {
    if (!selectionActive) {
      return null;
    }
    const featureKey = getSelectedItemFeatureKey(item);
    if (!featureKey) {
      return null;
    }
    return _SiteMapUtils.FEATURES[featureKey].iconSvg || null;
  };
  const getSelectedItemDescription = item => {
    if (!selectionActive) {
      return null;
    }
    const featureKey = getSelectedItemFeatureKey(item);
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
  const renderSelectionSummary = () => {
    if (!selectionActive) {
      return null;
    }
    const unit = _SiteMapUtils.FEATURE_TYPES[selectionActive].unit || '';
    const units = _SiteMapUtils.FEATURE_TYPES[selectionActive].units || '';
    const plural = selection.size !== 1;
    const title = "".concat(selection.size ? selection.size.toString() : 'No', " ").concat(plural ? units : unit, " selected");
    let icon = /*#__PURE__*/_react.default.createElement(_Remove.default, null);
    let color = 'default';
    if (selection.size) {
      if (selectionValid) {
        icon = /*#__PURE__*/_react.default.createElement(_Done.default, null);
        color = 'secondary';
      } else {
        icon = /*#__PURE__*/_react.default.createElement(_Error.default, null);
      }
    }
    let limit = null;
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
    const summaryContainerStyle = {};
    if (view === _SiteMapUtils.VIEWS.MAP) {
      summaryContainerStyle.left = '108px';
    }
    const chipClassName = !selection.size || selectionValid ? classes.selectionChip : "".concat(classes.selectionChip, " ").concat(classes.selectionChipError);
    const summaryValidClass = selection.size && selectionValid ? classes.selectionSummaryValid : classes.selectionSummaryInvalid;
    const summaryClass = "".concat(classes.selectionSummary, " ").concat(summaryValidClass);
    let maxHeight = 72 * 3;
    if (contentDivRef && contentDivRef.current) {
      maxHeight = Math.max((contentDivRef.current.clientHeight || 0) - 72 * 2, 72 * 3);
      maxHeight -= maxHeight % 72;
    }
    maxHeight = Math.min(maxHeight, selection.size * 72);
    const summaryStyle = {
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
    }, [...selection].sort().map(selectedItem => {
      const src = getSelectedItemIcon(selectedItem);
      const remove = "Remove ".concat(selectedItem, " from selection");
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
        onClick: () => dispatch({
          type: 'toggleItemSelected',
          item: selectedItem
        })
      }, /*#__PURE__*/_react.default.createElement(_Delete.default, null)))));
    })))), /*#__PURE__*/_react.default.createElement(_Chip.default, {
      icon: icon,
      color: color,
      label: limit ? "".concat(title, " (").concat(limit, ")") : title,
      "aria-label": "Current selection status",
      className: chipClassName,
      onClick: () => dispatch({
        type: 'toggleSelectionSummary',
        showSummary: !showSummary
      }),
      deleteIcon: /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        enterDelay: 500,
        enterNextDelay: 200,
        title: "Deselect all"
      }, /*#__PURE__*/_react.default.createElement(_Cancel.default, null)),
      onDelete: selection.size ? () => dispatch({
        type: 'updateSelectionSet',
        selection: new Set()
      }) : () => {}
    }));
  };

  /**
     Render - Vertical resize Elements
  */
  const renderVerticalResizeButton = () => {
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
  const renderFeatureOption = key => {
    if (!_SiteMapUtils.FEATURES[key]) {
      return null;
    }
    const feature = _SiteMapUtils.FEATURES[key];
    const {
      name: featureName,
      iconSvg,
      featureShape,
      style: featureStyle = {},
      description,
      descriptionFromParentDataFeatureKey,
      parentDataFeatureKey,
      dataSource
    } = feature;
    // Special case: do not include any features with a dataSource of MANUAL_LOCATIONS if
    // manualLocationData is not also defined
    if (dataSource === _SiteMapUtils.FEATURE_DATA_SOURCES.MANUAL_LOCATIONS && !manualLocationData) {
      return null;
    }
    const handleChange = event => {
      dispatch({
        type: 'setLegendFeatureOptionVisibility',
        feature: key,
        visible: event.target.checked
      });
    };
    let icon = null;
    if (iconSvg) {
      icon = /*#__PURE__*/_react.default.createElement("img", {
        alt: featureName,
        src: iconSvg,
        className: classes.featureIcon
      });
    } else if (featureShape === 'Circle') {
      const circleProps = {
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
      const polylineProps = {
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
      const rectProps = {
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
    let allChildren = [];
    let visibleChildren = [];
    let indeterminate = false;
    let collapsed = false;
    let label = null;
    let tooltip = null;
    if (description) {
      tooltip = description;
    }
    if (descriptionFromParentDataFeatureKey && parentDataFeatureKey && _SiteMapUtils.FEATURES[parentDataFeatureKey]) {
      tooltip = _SiteMapUtils.FEATURES[parentDataFeatureKey].description || null;
    }
    if (feature.type === _SiteMapUtils.FEATURE_TYPES.GROUP.KEY) {
      collapsed = state.filters.features.collapsed.has(key);
      const collapseTitle = "".concat(collapsed ? 'Expand' : 'Collapse', " ").concat(feature.name);
      allChildren = Object.keys(_SiteMapUtils.FEATURES).filter(f => _SiteMapUtils.FEATURES[f].parent === key);
      allChildren.sort((a, b) => {
        const {
          type: aType,
          name: aName
        } = _SiteMapUtils.FEATURES[a];
        const {
          type: bType,
          name: bName
        } = _SiteMapUtils.FEATURES[b];
        if (aType !== bType && (aType === _SiteMapUtils.FEATURE_TYPES.GROUP.KEY || bType === _SiteMapUtils.FEATURE_TYPES.GROUP.KEY)) {
          return bType === _SiteMapUtils.FEATURE_TYPES.GROUP.KEY ? -1 : 1;
        }
        return aName < bName ? -1 : 1;
      });
      visibleChildren = allChildren.filter(f => state.filters.features.visible[f]);
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
        onClick: event => {
          event.preventDefault();
          // We use setTimeout here so the icon doesn't change before the click event bubbles.
          // Without it the target of the click event is an SVG that no longer exists in the
          // DOM tree (thus not contained in the features container, thus seen as a click
          // outside that will close the features container, when we know it's not).
          window.setTimeout(() => {
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
    const formControl = /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
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
      TransitionComponent: _ref => {
        let {
          children
        } = _ref;
        return children;
      } // set no transition by mock component
    }, formControl) : formControl, !allChildren.length ? null : /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginLeft: _Theme.default.spacing(3),
        display: collapsed ? 'none' : 'block'
      }
    }, allChildren.filter(f => state.filters.features.available[f]).map(renderFeatureOption)));
  };

  /**
     Render - Single Overlay Legend
  */
  const renderOverlayLegend = legend => {
    const renderItem = legendKey => {
      const {
        name: itemName,
        color: itemColor,
        description: itemDescription
      } = legend[legendKey];
      const swatch = /*#__PURE__*/_react.default.createElement("div", {
        className: classes.overlayLegendSwatch,
        style: {
          backgroundColor: itemColor
        }
      });
      const itemLabel = /*#__PURE__*/_react.default.createElement("div", {
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
        TransitionComponent: _ref2 => {
          let {
            children
          } = _ref2;
          return children;
        }
      }, itemLabel) : itemLabel;
    };
    if (!Object.keys(legend).some(legendKey => legend[legendKey].category)) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: classes.overlayLegendContainer
      }, Object.keys(legend).map(renderItem));
    }
    const otherCategory = 'Other';
    const categories = Object.keys(legend).reduce((acc, cur) => {
      acc.add(legend[cur].category || otherCategory);
      return acc;
    }, new Set());
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.overlayLegendContainer
    }, Array.from(categories).map((category, idx) => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
      key: category
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.overlayLegendCategory,
      style: {
        marginTop: idx ? '8px' : '0px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, category)), Object.keys(legend).filter(legendKey => legend[legendKey].category === category || !legend[legendKey].category && category === otherCategory).map(renderItem))));
  };

  /**
     Render - Single Overlay Option
  */
  const renderOverlayOption = key => {
    const {
      title,
      description: tooltip,
      legend
    } = _SiteMapUtils.OVERLAYS[key];
    const handleChange = event => {
      dispatch({
        type: 'setMapOverlayVisibility',
        overlay: key,
        visible: event.target.checked
      });
    };
    let collapsed = true;
    let label = null;
    if (legend) {
      collapsed = !state.filters.overlays.expanded.has(key);
      const collapseTitle = "".concat(collapsed ? 'Expand' : 'Collapse', " ").concat(title, " Legend");
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
        onClick: event => {
          event.preventDefault();
          // We use setTimeout here so the icon doesn't change before the click event bubbles.
          // Without it the target of the click event is an SVG that no longer exists in the
          // DOM tree (thus not contained in the features container, thus seen as a click
          // outside that will close the features container, when we know it's not).
          window.setTimeout(() => {
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
    const formControl = /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
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
      TransitionComponent: _ref3 => {
        let {
          children
        } = _ref3;
        return children;
      } // set no transition by mock component
    }, formControl) : formControl, collapsed || !legend ? null : renderOverlayLegend(legend));
  };

  /**
     Render - Legend - NEON Observatory Features
  */
  const renderLegendNEONObservatoryFeatures = () => /*#__PURE__*/_react.default.createElement("div", {
    className: classes.legendSection
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.legendSectionTitleContainer
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    className: classes.legendSectionTitle
  }, "NEON Observatory Features")), Object.keys(_SiteMapUtils.FEATURES).filter(f => state.filters.features.available[f] && !_SiteMapUtils.FEATURES[f].parent).filter(f => !_SiteMapUtils.FEATURES[f].generalLegendGroup).map(renderFeatureOption));

  /**
     Render - Legend - Overlays
  */
  const renderLegendOverlays = () => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, Object.keys(_SiteMapUtils.OVERLAY_GROUPS).map(groupKey => {
    const {
      title,
      description
    } = _SiteMapUtils.OVERLAY_GROUPS[groupKey];
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
    })))), Object.keys(_SiteMapUtils.OVERLAYS).filter(o => _SiteMapUtils.OVERLAYS[o].group === groupKey).map(renderOverlayOption));
  }));

  /**
     Render - Legend - General Features
  */
  const renderLegendGeneralFeatures = () => /*#__PURE__*/_react.default.createElement("div", {
    className: classes.legendSection
  }, /*#__PURE__*/_react.default.createElement("hr", {
    className: classes.legendDivider
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.legendSectionTitleContainer
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    className: classes.legendSectionTitle
  }, "General Features")), Object.keys(_SiteMapUtils.FEATURES).filter(f => state.filters.features.available[f] && !_SiteMapUtils.FEATURES[f].parent).filter(f => _SiteMapUtils.FEATURES[f].generalLegendGroup).map(renderFeatureOption));

  /**
     Render - Full Component
  */
  let legendContainerClassName = classes.legendContainer;
  let viewLegendButtonsContainerClassName = classes.viewLegendButtonsContainer;
  if (fullscreen) {
    /* eslint-disable max-len */
    legendContainerClassName = "".concat(classes.legendContainer, " ").concat(classes.legendContainerFullscreen);
    viewLegendButtonsContainerClassName = "".concat(classes.viewLegendButtonsContainer, " ").concat(classes.viewLegendButtonsContainerFullscreen);
    /* eslint-enable max-len */
  }
  const ret = /*#__PURE__*/_react.default.createElement("div", _extends({}, containerProps, {
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
var _default = exports.default = SiteMapContainer;