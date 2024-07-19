"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _rxjs = require("rxjs");
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _Chip = _interopRequireDefault(require("@material-ui/core/Chip"));
var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _ListItem = _interopRequireDefault(require("@material-ui/core/ListItem"));
var _ListItemIcon = _interopRequireDefault(require("@material-ui/core/ListItemIcon"));
var _ListItemText = _interopRequireDefault(require("@material-ui/core/ListItemText"));
var _ListItemSecondaryAction = _interopRequireDefault(require("@material-ui/core/ListItemSecondaryAction"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _styles = require("@material-ui/core/styles");
var _SaveAlt = _interopRequireDefault(require("@material-ui/icons/SaveAlt"));
var _NeonApi = _interopRequireDefault(require("../NeonApi"));
var _SplitButton = _interopRequireDefault(require("../Button/SplitButton"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _WarningCard = _interopRequireDefault(require("../Card/WarningCard"));
var _DocumentParser = _interopRequireDefault(require("../../parser/DocumentParser"));
var _DocumentService = _interopRequireDefault(require("../../service/DocumentService"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const COMPONENT_XS_UPPER = 480;
const COMPONENT_SM_UPPER = 805;
const useStyles = (0, _styles.makeStyles)(muiTheme => (0, _styles.createStyles)({
  listItemContainer: {
    display: 'flex',
    overflow: 'auto'
  },
  listItem: {
    display: 'flex',
    wordBreak: 'break-word',
    paddingLeft: muiTheme.spacing(1),
    '& p': {
      marginTop: muiTheme.spacing(0.5),
      '& > span > span': {
        whiteSpace: 'nowrap'
      }
    }
  },
  listItemSecondarySpacer: {
    margin: muiTheme.spacing(0, 2),
    color: muiTheme.palette.grey[200]
  },
  listItemIcon: {
    minWidth: muiTheme.spacing(4),
    marginRight: muiTheme.spacing(1)
  },
  fileTypeChip: {
    marginRight: '5px',
    '&:last-child': {
      marginRight: '0px'
    }
  },
  fileTypeChipSelected: {
    marginRight: '5px',
    fontWeight: 500
  },
  variantFetchingLabel: {
    lineHeight: '24px'
  },
  variantFetchingProgress: {
    marginRight: '36px',
    marginLeft: '36px'
  },
  downloadErrorContainer: {
    marginTop: muiTheme.spacing(2)
  }
}));
const useListItemSecondaryActionStyles = (0, _styles.makeStyles)(muiTheme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  root: {
    display: 'flex',
    alignItems: 'center',
    position: 'unset',
    transform: 'unset',
    top: 'unset',
    right: 'unset',
    whiteSpace: 'nowrap'
  }
}));
var ActionTypes = /*#__PURE__*/function (ActionTypes) {
  ActionTypes["FETCH_VARIANTS_STARTED"] = "FETCH_VARIANTS_STARTED";
  ActionTypes["FETCH_VARIANTS_FAILED"] = "FETCH_VARIANTS_FAILED";
  ActionTypes["FETCH_VARIANTS_SUCCEEDED"] = "FETCH_VARIANTS_SUCCEEDED";
  ActionTypes["SET_SELECTED_VARIANT"] = "SET_SELECTED_VARIANT";
  ActionTypes["DOWNLOAD_IDLE"] = "DOWNLOAD_IDLE";
  ActionTypes["DOWNLOAD_STARTED"] = "DOWNLOAD_STARTED";
  ActionTypes["DOWNLOAD_FAILED"] = "DOWNLOAD_FAILED";
  return ActionTypes;
}(ActionTypes || {});
const ActionCreator = {
  fetchVariantsStarted: () => ({
    type: ActionTypes.FETCH_VARIANTS_STARTED
  }),
  fetchVariantsFailed: error => ({
    type: ActionTypes.FETCH_VARIANTS_FAILED,
    error
  }),
  fetchVariantsSucceeded: variants => ({
    type: ActionTypes.FETCH_VARIANTS_SUCCEEDED,
    variants
  }),
  setSelectedVariant: variant => ({
    type: ActionTypes.SET_SELECTED_VARIANT,
    variant
  }),
  downloadIdle: () => ({
    type: ActionTypes.DOWNLOAD_IDLE
  }),
  downloadStarted: () => ({
    type: ActionTypes.DOWNLOAD_STARTED
  }),
  downloadFailed: () => ({
    type: ActionTypes.DOWNLOAD_FAILED
  })
};
var FetchStatus = /*#__PURE__*/function (FetchStatus) {
  FetchStatus["AWAITING_CALL"] = "AWAITING_CALL";
  FetchStatus["FETCHING"] = "FETCHING";
  FetchStatus["ERROR"] = "ERROR";
  FetchStatus["SUCCESS"] = "SUCCESS";
  FetchStatus["IDLE"] = "IDLE";
  return FetchStatus;
}(FetchStatus || {});
const DEFAULT_STATE = {
  fetchVariants: {
    status: FetchStatus.IDLE,
    error: null
  },
  variants: [],
  selectedVariant: null,
  downloadStatus: FetchStatus.IDLE
};
const documentListItemReducer = (state, action) => {
  const newState = _extends({}, state);
  let fetchVariantFailedAction;
  let fetchVariantSucceededAction;
  let setSelectedVariantAction;
  switch (action.type) {
    case ActionTypes.FETCH_VARIANTS_STARTED:
      newState.fetchVariants.status = FetchStatus.FETCHING;
      return newState;
    case ActionTypes.FETCH_VARIANTS_FAILED:
      fetchVariantFailedAction = action;
      newState.fetchVariants.status = FetchStatus.ERROR;
      newState.fetchVariants.error = fetchVariantFailedAction.error;
      return newState;
    case ActionTypes.FETCH_VARIANTS_SUCCEEDED:
      fetchVariantSucceededAction = action;
      newState.fetchVariants.status = FetchStatus.SUCCESS;
      newState.variants = fetchVariantSucceededAction.variants;
      if (!(0, _typeUtil.exists)(newState.selectedVariant) && (0, _typeUtil.existsNonEmpty)(newState.variants)) {
        // eslint-disable-next-line prefer-destructuring
        newState.selectedVariant = newState.variants[0];
      }
      return newState;
    case ActionTypes.SET_SELECTED_VARIANT:
      setSelectedVariantAction = action;
      newState.selectedVariant = setSelectedVariantAction.variant;
      return newState;
    case ActionTypes.DOWNLOAD_IDLE:
      newState.downloadStatus = FetchStatus.IDLE;
      return newState;
    case ActionTypes.DOWNLOAD_STARTED:
      newState.downloadStatus = FetchStatus.FETCHING;
      return newState;
    case ActionTypes.DOWNLOAD_FAILED:
      newState.downloadStatus = FetchStatus.ERROR;
      return newState;
    default:
      return newState;
  }
};
const DocumentListItem = props => {
  const {
    id,
    document,
    makeDownloadableLink,
    enableDownloadButton,
    fetchVariants,
    enableVariantChips,
    containerComponent
  } = props;
  const classes = useStyles(_Theme.default);
  const listItemSecondaryActionClasses = useListItemSecondaryActionStyles(_Theme.default);
  const containerRef = (0, _react.useRef)();
  const [componentWidth, setComponentWidth] = (0, _react.useState)(0);
  let atComponentXs = false;
  let atComponentSm = false;
  if (componentWidth > 0) {
    atComponentXs = componentWidth <= COMPONENT_XS_UPPER;
    atComponentSm = componentWidth >= COMPONENT_XS_UPPER && componentWidth < COMPONENT_SM_UPPER;
  }
  const [state, dispatch] = (0, _react.useReducer)(documentListItemReducer, (0, _cloneDeep.default)(DEFAULT_STATE));
  const {
    fetchVariants: {
      status: fetchVariantStatus
    },
    variants: stateVariants,
    selectedVariant: stateSelectedVariant,
    downloadStatus
  } = state;
  const hasDocument = (0, _typeUtil.exists)(document);
  const hasProvidedVariants = hasDocument && (0, _typeUtil.existsNonEmpty)(document.variants);
  const isQsg = _DocumentService.default.isQuickStartGuide(document);
  const appliedFetchVariants = !hasProvidedVariants && fetchVariants === true;
  const requireVariantFetch = isQsg && appliedFetchVariants && fetchVariantStatus === FetchStatus.IDLE;
  (0, _react.useEffect)(() => {
    if (!hasDocument || !requireVariantFetch) {
      return;
    }
    const qsgParsedName = _DocumentService.default.parseQuickStartGuideName(document.name);
    if (!(0, _typeUtil.exists)(qsgParsedName)) {
      return;
    }
    const coercedParsedName = qsgParsedName;
    const variantObs = _NeonApi.default.getQuickStartGuideDetailObservable(coercedParsedName.matchedName, coercedParsedName.matchedVersion).pipe((0, _rxjs.map)(response => {
      if (!(0, _typeUtil.exists)(response) || !(0, _typeUtil.exists)(response.data)) {
        dispatch(ActionCreator.fetchVariantsFailed('Failed to fetch variants'));
        return (0, _rxjs.of)(false);
      }
      const qsgResponse = _DocumentParser.default.parseQuickStartGuideVersionResponse(response);
      if (!(0, _typeUtil.exists)(qsgResponse)) {
        dispatch(ActionCreator.fetchVariantsFailed('Failed to fetch variants'));
        return (0, _rxjs.of)(false);
      }
      const coercedQsgDocumentResponse = qsgResponse;
      const qsgDocuments = coercedQsgDocumentResponse.documents;
      const variantDocuments = _DocumentService.default.transformQuickStartGuideDocuments(qsgDocuments);
      if (!(0, _typeUtil.existsNonEmpty)(variantDocuments)) {
        dispatch(ActionCreator.fetchVariantsFailed('Failed to fetch variants'));
        return (0, _rxjs.of)(false);
      }
      dispatch(ActionCreator.fetchVariantsSucceeded(variantDocuments));
      return (0, _rxjs.of)(true);
    }), (0, _rxjs.catchError)(error => {
      dispatch(ActionCreator.fetchVariantsFailed(error));
      return (0, _rxjs.of)(false);
    }));
    dispatch(ActionCreator.fetchVariantsStarted());
    variantObs.subscribe();
  }, [hasDocument, requireVariantFetch, document]);
  const handleSelectedVariantChanged = (0, _react.useCallback)(selectedVariantCb => {
    dispatch(ActionCreator.setSelectedVariant(selectedVariantCb));
  }, [dispatch]);
  const handleDownloadIdle = (0, _react.useCallback)(() => {
    dispatch(ActionCreator.downloadIdle());
  }, [dispatch]);
  const handleDownloadStarted = (0, _react.useCallback)(() => {
    dispatch(ActionCreator.downloadStarted());
  }, [dispatch]);
  const handleDownloadFailed = (0, _react.useCallback)(() => {
    dispatch(ActionCreator.downloadFailed());
  }, [dispatch]);
  const handleResizeCb = (0, _react.useCallback)(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    if (container.clientWidth === componentWidth) {
      return;
    }
    setComponentWidth(container.clientWidth);
  }, [containerRef, componentWidth, setComponentWidth]);
  (0, _react.useLayoutEffect)(() => {
    const element = containerRef.current;
    if (!element) {
      return () => {};
    }
    handleResizeCb();
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResizeCb);
      return () => {
        window.removeEventListener('resize', handleResizeCb);
      };
    }
    let resizeObserver = new ResizeObserver(handleResizeCb);
    resizeObserver.observe(element);
    return () => {
      if (!resizeObserver) {
        return;
      }
      resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [containerRef, handleResizeCb]);
  if (!hasDocument) {
    return null;
  }
  const isFetchingVariants = fetchVariantStatus === FetchStatus.FETCHING;
  const appliedDocument = (0, _typeUtil.exists)(stateSelectedVariant) ? stateSelectedVariant : document;
  const appliedVariants = appliedFetchVariants ? stateVariants : document.variants;
  const hasAppliedVariants = (0, _typeUtil.existsNonEmpty)(appliedVariants);
  const isDownloading = downloadStatus === FetchStatus.FETCHING;
  const isDownloadError = downloadStatus === FetchStatus.ERROR;
  const documentType = _DocumentService.default.resolveDocumentType(appliedDocument);
  const {
    title: typeTitle,
    Icon: TypeIcon
  } = documentType;
  const typeTitleString = typeTitle(appliedDocument.type);
  const primary = (0, _typeUtil.isStringNonEmpty)(appliedDocument.description) ? appliedDocument.description : /*#__PURE__*/_react.default.createElement("i", null, "No description");
  const spacer = /*#__PURE__*/_react.default.createElement("span", {
    className: classes.listItemSecondarySpacer
  }, "|");
  const renderTypes = () => {
    if (!(enableVariantChips === true)) {
      return /*#__PURE__*/_react.default.createElement("span", {
        title: "file type: ".concat(typeTitleString)
      }, typeTitleString);
    }
    if (isFetchingVariants) {
      return /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "caption",
        className: classes.variantFetchingLabel
      }, "Determining variants...");
    }
    if (!hasAppliedVariants) {
      return /*#__PURE__*/_react.default.createElement(_Chip.default, {
        key: appliedDocument.name,
        variant: undefined,
        className: classes.fileTypeChipSelected,
        style: {
          marginRight: '0px'
        },
        component: "span",
        size: "small",
        label: typeTitleString
      });
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, appliedVariants.map((variant, index) => {
      const variantTypeTitleString = _DocumentService.default.getDocumentTypeTitle(variant);
      const isSelected = appliedDocument.name === variant.name;
      const isLast = index === appliedVariants.length - 1;
      return /*#__PURE__*/_react.default.createElement(_Chip.default, {
        key: variant.name,
        variant: isSelected ? undefined : 'outlined',
        className: isSelected ? classes.fileTypeChipSelected : classes.fileTypeChip,
        style: {
          marginRight: isLast ? '0px' : undefined
        },
        component: "span",
        size: "small",
        label: variantTypeTitleString,
        disabled: isDownloading || isDownloadError,
        onClick: event => {
          handleSelectedVariantChanged(variant);
        }
      });
    }));
  };
  const renderSecondaryItem = () => {
    let sizeDisplay = /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement("i", null, "n/a"));
    if (appliedDocument.size) {
      sizeDisplay = /*#__PURE__*/_react.default.createElement("span", {
        title: "file size: ".concat(_DocumentService.default.formatBytes(appliedDocument.size))
      }, _DocumentService.default.formatBytes(appliedDocument.size));
    }
    const fileNumber = /*#__PURE__*/_react.default.createElement("span", {
      style: {
        whiteSpace: 'break-spaces'
      },
      title: "file number: ".concat(appliedDocument.name)
    }, appliedDocument.name);
    if (atComponentSm || atComponentXs) {
      if (hasAppliedVariants) {
        return /*#__PURE__*/_react.default.createElement("span", null, fileNumber, /*#__PURE__*/_react.default.createElement("span", {
          style: {
            height: '5px',
            display: 'block'
          }
        }), renderTypes(), /*#__PURE__*/_react.default.createElement("span", {
          style: {
            height: '5px',
            display: 'block'
          }
        }), sizeDisplay);
      }
      return /*#__PURE__*/_react.default.createElement("span", null, fileNumber, /*#__PURE__*/_react.default.createElement("span", {
        style: {
          height: '5px',
          display: 'block'
        }
      }), renderTypes(), spacer, sizeDisplay);
    }
    return /*#__PURE__*/_react.default.createElement("span", null, renderTypes(), spacer, sizeDisplay, spacer, fileNumber);
  };
  const renderAction = () => {
    if (!(enableDownloadButton === true)) return null;
    if (isFetchingVariants) {
      return /*#__PURE__*/_react.default.createElement(_ListItemSecondaryAction.default, {
        classes: listItemSecondaryActionClasses
      }, /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
        size: 36,
        className: classes.variantFetchingProgress
      }));
    }
    if (atComponentXs) {
      return /*#__PURE__*/_react.default.createElement(_ListItemSecondaryAction.default, {
        classes: listItemSecondaryActionClasses
      }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        placement: "top",
        title: "Download ".concat(appliedDocument.name)
      }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
        color: "primary",
        disabled: isDownloading || isDownloadError,
        onClick: () => {
          handleDownloadStarted();
          _DocumentService.default.downloadDocument(appliedDocument, downloadDoc => handleDownloadIdle(), downloadDoc => handleDownloadFailed());
        }
      }, isDownloading ? /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
        size: 18
      }) : /*#__PURE__*/_react.default.createElement(_SaveAlt.default, {
        fontSize: "small"
      })))));
    }
    const button = !hasAppliedVariants ? /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "outlined",
      disabled: isDownloading || isDownloadError,
      startIcon: isDownloading ? /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
        size: 18
      }) : /*#__PURE__*/_react.default.createElement(_SaveAlt.default, {
        fontSize: "small"
      }),
      onClick: () => {
        handleDownloadStarted();
        _DocumentService.default.downloadDocument(appliedDocument, downloadDoc => handleDownloadIdle(), downloadDoc => handleDownloadFailed());
      }
    }, "Download") : /*#__PURE__*/_react.default.createElement(_SplitButton.default, {
      name: "".concat(appliedDocument.name, "-document-list-item-download-split-button"),
      selectedOption: "".concat(typeTitleString),
      selectedOptionDisplayCallback: selectedOption => "Download ".concat(selectedOption),
      options: appliedVariants.map(variant => _DocumentService.default.getDocumentTypeTitle(variant)),
      onClick: option => {
        const nextSelectedVariant = _DocumentService.default.findFirstByDocumentTypeTitle(appliedVariants, option);
        if ((0, _typeUtil.exists)(nextSelectedVariant)) {
          const coercedDownloadVariant = nextSelectedVariant;
          handleDownloadStarted();
          _DocumentService.default.downloadDocument(coercedDownloadVariant, downloadDoc => handleDownloadIdle(), downloadDoc => handleDownloadFailed());
        }
      },
      onChange: option => {
        const nextSelectedVariant = _DocumentService.default.findFirstByDocumentTypeTitle(appliedVariants, option);
        if ((0, _typeUtil.exists)(nextSelectedVariant)) {
          handleSelectedVariantChanged(nextSelectedVariant);
        }
      },
      buttonGroupProps: {
        size: 'small',
        variant: 'outlined',
        color: 'primary'
      },
      buttonMenuProps: {
        size: 'small',
        color: 'primary',
        disabled: isDownloading || isDownloadError
      },
      buttonProps: {
        size: 'small',
        color: 'primary',
        disabled: isDownloading || isDownloadError,
        startIcon: isDownloading ? /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
          size: 18
        }) : /*#__PURE__*/_react.default.createElement(_SaveAlt.default, {
          fontSize: "small"
        })
      }
    });
    return /*#__PURE__*/_react.default.createElement(_ListItemSecondaryAction.default, {
      classes: listItemSecondaryActionClasses
    }, button);
  };
  const renderDownloadError = () => {
    if (!isDownloadError) return null;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.downloadErrorContainer
    }, /*#__PURE__*/_react.default.createElement(_WarningCard.default, {
      title: "Document download is currently unavailable for \"".concat(appliedDocument.name, ".\""),
      onActionClick: () => handleDownloadIdle()
    }));
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ListItem.default, {
    ref: containerRef,
    key: id,
    className: classes.listItem,
    component: "div",
    ContainerComponent: containerComponent,
    ContainerProps: {
      className: classes.listItemContainer
    },
    title: makeDownloadableLink ? "Click to download ".concat(document.name) : undefined
    // @ts-ignore
    ,
    button: makeDownloadableLink,
    onClick: !makeDownloadableLink ? undefined : () => {
      handleDownloadStarted();
      _DocumentService.default.downloadDocument(appliedDocument, downloadDoc => handleDownloadIdle(), downloadDoc => handleDownloadFailed());
    }
  }, /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, {
    className: classes.listItemIcon
  }, /*#__PURE__*/_react.default.createElement(TypeIcon, null)), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
    primary: primary,
    secondary: renderSecondaryItem()
  }), renderAction()), renderDownloadError());
};
const WrappedDocumentListItem = _Theme.default.getWrappedComponent(DocumentListItem);
var _default = exports.default = WrappedDocumentListItem;