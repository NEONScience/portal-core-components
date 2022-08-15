"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var COMPONENT_XS_UPPER = 480;
var COMPONENT_SM_UPPER = 805;
var useStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (0, _styles.createStyles)({
    listItemContainer: {
      display: 'flex'
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
  });
});
var useListItemSecondaryActionStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (// eslint-disable-next-line implicit-arrow-linebreak
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
    })
  );
});
var ActionTypes;

(function (ActionTypes) {
  ActionTypes["FETCH_VARIANTS_STARTED"] = "FETCH_VARIANTS_STARTED";
  ActionTypes["FETCH_VARIANTS_FAILED"] = "FETCH_VARIANTS_FAILED";
  ActionTypes["FETCH_VARIANTS_SUCCEEDED"] = "FETCH_VARIANTS_SUCCEEDED";
  ActionTypes["SET_SELECTED_VARIANT"] = "SET_SELECTED_VARIANT";
  ActionTypes["DOWNLOAD_IDLE"] = "DOWNLOAD_IDLE";
  ActionTypes["DOWNLOAD_STARTED"] = "DOWNLOAD_STARTED";
  ActionTypes["DOWNLOAD_FAILED"] = "DOWNLOAD_FAILED";
})(ActionTypes || (ActionTypes = {}));

var ActionCreator = {
  fetchVariantsStarted: function fetchVariantsStarted() {
    return {
      type: ActionTypes.FETCH_VARIANTS_STARTED
    };
  },
  fetchVariantsFailed: function fetchVariantsFailed(error) {
    return {
      type: ActionTypes.FETCH_VARIANTS_FAILED,
      error: error
    };
  },
  fetchVariantsSucceeded: function fetchVariantsSucceeded(variants) {
    return {
      type: ActionTypes.FETCH_VARIANTS_SUCCEEDED,
      variants: variants
    };
  },
  setSelectedVariant: function setSelectedVariant(variant) {
    return {
      type: ActionTypes.SET_SELECTED_VARIANT,
      variant: variant
    };
  },
  downloadIdle: function downloadIdle() {
    return {
      type: ActionTypes.DOWNLOAD_IDLE
    };
  },
  downloadStarted: function downloadStarted() {
    return {
      type: ActionTypes.DOWNLOAD_STARTED
    };
  },
  downloadFailed: function downloadFailed() {
    return {
      type: ActionTypes.DOWNLOAD_FAILED
    };
  }
};
var FetchStatus;

(function (FetchStatus) {
  FetchStatus["AWAITING_CALL"] = "AWAITING_CALL";
  FetchStatus["FETCHING"] = "FETCHING";
  FetchStatus["ERROR"] = "ERROR";
  FetchStatus["SUCCESS"] = "SUCCESS";
  FetchStatus["IDLE"] = "IDLE";
})(FetchStatus || (FetchStatus = {}));

var DEFAULT_STATE = {
  fetchVariants: {
    status: FetchStatus.IDLE,
    error: null
  },
  variants: [],
  selectedVariant: null,
  downloadStatus: FetchStatus.IDLE
};

var documentListItemReducer = function documentListItemReducer(state, action) {
  var newState = _extends({}, state);

  var fetchVariantFailedAction;
  var fetchVariantSucceededAction;
  var setSelectedVariantAction;

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

var DocumentListItem = function DocumentListItem(props) {
  var id = props.id,
      document = props.document,
      makeDownloadableLink = props.makeDownloadableLink,
      enableDownloadButton = props.enableDownloadButton,
      fetchVariants = props.fetchVariants,
      enableVariantChips = props.enableVariantChips,
      containerComponent = props.containerComponent;
  var classes = useStyles(_Theme.default);
  var listItemSecondaryActionClasses = useListItemSecondaryActionStyles(_Theme.default);
  var containerRef = (0, _react.useRef)();

  var _useState = (0, _react.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      componentWidth = _useState2[0],
      setComponentWidth = _useState2[1];

  var atComponentXs = false;
  var atComponentSm = false;

  if (componentWidth > 0) {
    atComponentXs = componentWidth <= COMPONENT_XS_UPPER;
    atComponentSm = componentWidth >= COMPONENT_XS_UPPER && componentWidth < COMPONENT_SM_UPPER;
  }

  var _useReducer = (0, _react.useReducer)(documentListItemReducer, (0, _cloneDeep.default)(DEFAULT_STATE)),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var fetchVariantStatus = state.fetchVariants.status,
      stateVariants = state.variants,
      stateSelectedVariant = state.selectedVariant,
      downloadStatus = state.downloadStatus;
  var hasDocument = (0, _typeUtil.exists)(document);
  var hasProvidedVariants = hasDocument && (0, _typeUtil.existsNonEmpty)(document.variants);

  var isQsg = _DocumentService.default.isQuickStartGuide(document);

  var appliedFetchVariants = !hasProvidedVariants && fetchVariants === true;
  var requireVariantFetch = isQsg && appliedFetchVariants && fetchVariantStatus === FetchStatus.IDLE;
  (0, _react.useEffect)(function () {
    if (!hasDocument || !requireVariantFetch) {
      return;
    }

    var qsgParsedName = _DocumentService.default.parseQuickStartGuideName(document.name);

    if (!(0, _typeUtil.exists)(qsgParsedName)) {
      return;
    }

    var coercedParsedName = qsgParsedName;

    var variantObs = _NeonApi.default.getQuickStartGuideDetailObservable(coercedParsedName.matchedName, coercedParsedName.matchedVersion).pipe((0, _operators.map)(function (response) {
      if (!(0, _typeUtil.exists)(response) || !(0, _typeUtil.exists)(response.data)) {
        dispatch(ActionCreator.fetchVariantsFailed('Failed to fetch variants'));
        return (0, _rxjs.of)(false);
      }

      var qsgResponse = _DocumentParser.default.parseQuickStartGuideVersionResponse(response);

      if (!(0, _typeUtil.exists)(qsgResponse)) {
        dispatch(ActionCreator.fetchVariantsFailed('Failed to fetch variants'));
        return (0, _rxjs.of)(false);
      }

      var coercedQsgDocumentResponse = qsgResponse;
      var qsgDocuments = coercedQsgDocumentResponse.documents;

      var variantDocuments = _DocumentService.default.transformQuickStartGuideDocuments(qsgDocuments);

      if (!(0, _typeUtil.existsNonEmpty)(variantDocuments)) {
        dispatch(ActionCreator.fetchVariantsFailed('Failed to fetch variants'));
        return (0, _rxjs.of)(false);
      }

      dispatch(ActionCreator.fetchVariantsSucceeded(variantDocuments));
      return (0, _rxjs.of)(true);
    }), (0, _operators.catchError)(function (error) {
      dispatch(ActionCreator.fetchVariantsFailed(error));
      return (0, _rxjs.of)(false);
    }));

    dispatch(ActionCreator.fetchVariantsStarted());
    variantObs.subscribe();
  }, [hasDocument, requireVariantFetch, document]);
  var handleSelectedVariantChanged = (0, _react.useCallback)(function (selectedVariantCb) {
    dispatch(ActionCreator.setSelectedVariant(selectedVariantCb));
  }, [dispatch]);
  var handleDownloadIdle = (0, _react.useCallback)(function () {
    dispatch(ActionCreator.downloadIdle());
  }, [dispatch]);
  var handleDownloadStarted = (0, _react.useCallback)(function () {
    dispatch(ActionCreator.downloadStarted());
  }, [dispatch]);
  var handleDownloadFailed = (0, _react.useCallback)(function () {
    dispatch(ActionCreator.downloadFailed());
  }, [dispatch]);
  var handleResizeCb = (0, _react.useCallback)(function () {
    var container = containerRef.current;

    if (!container) {
      return;
    }

    if (container.clientWidth === componentWidth) {
      return;
    }

    setComponentWidth(container.clientWidth);
  }, [containerRef, componentWidth, setComponentWidth]);
  (0, _react.useLayoutEffect)(function () {
    var element = containerRef.current;

    if (!element) {
      return function () {};
    }

    handleResizeCb();

    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResizeCb);
      return function () {
        window.removeEventListener('resize', handleResizeCb);
      };
    }

    var resizeObserver = new ResizeObserver(handleResizeCb);
    resizeObserver.observe(element);
    return function () {
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

  var isFetchingVariants = fetchVariantStatus === FetchStatus.FETCHING;
  var appliedDocument = (0, _typeUtil.exists)(stateSelectedVariant) ? stateSelectedVariant : document;
  var appliedVariants = appliedFetchVariants ? stateVariants : document.variants;
  var hasAppliedVariants = (0, _typeUtil.existsNonEmpty)(appliedVariants);
  var isDownloading = downloadStatus === FetchStatus.FETCHING;
  var isDownloadError = downloadStatus === FetchStatus.ERROR;

  var documentType = _DocumentService.default.resolveDocumentType(appliedDocument);

  var typeTitle = documentType.title,
      TypeIcon = documentType.Icon;
  var typeTitleString = typeTitle(appliedDocument.type);
  var primary = (0, _typeUtil.isStringNonEmpty)(appliedDocument.description) ? appliedDocument.description : /*#__PURE__*/_react.default.createElement("i", null, "No description");

  var spacer = /*#__PURE__*/_react.default.createElement("span", {
    className: classes.listItemSecondarySpacer
  }, "|");

  var renderTypes = function renderTypes() {
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

    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, appliedVariants.map(function (variant, index) {
      var variantTypeTitleString = _DocumentService.default.getDocumentTypeTitle(variant);

      var isSelected = appliedDocument.name === variant.name;
      var isLast = index === appliedVariants.length - 1;
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
        onClick: function onClick(event) {
          handleSelectedVariantChanged(variant);
        }
      });
    }));
  };

  var renderSecondaryItem = function renderSecondaryItem() {
    var sizeDisplay = /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement("i", null, "n/a"));

    if (appliedDocument.size) {
      sizeDisplay = /*#__PURE__*/_react.default.createElement("span", {
        title: "file size: ".concat(_DocumentService.default.formatBytes(appliedDocument.size))
      }, _DocumentService.default.formatBytes(appliedDocument.size));
    }

    var fileNumber = /*#__PURE__*/_react.default.createElement("span", {
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

  var renderAction = function renderAction() {
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
        onClick: function onClick() {
          handleDownloadStarted();

          _DocumentService.default.downloadDocument(appliedDocument, function (downloadDoc) {
            return handleDownloadIdle();
          }, function (downloadDoc) {
            return handleDownloadFailed();
          });
        }
      }, isDownloading ? /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
        size: 18
      }) : /*#__PURE__*/_react.default.createElement(_SaveAlt.default, {
        fontSize: "small"
      })))));
    }

    var button = !hasAppliedVariants ? /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "outlined",
      disabled: isDownloading || isDownloadError,
      startIcon: isDownloading ? /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
        size: 18
      }) : /*#__PURE__*/_react.default.createElement(_SaveAlt.default, {
        fontSize: "small"
      }),
      onClick: function onClick() {
        handleDownloadStarted();

        _DocumentService.default.downloadDocument(appliedDocument, function (downloadDoc) {
          return handleDownloadIdle();
        }, function (downloadDoc) {
          return handleDownloadFailed();
        });
      }
    }, "Download") : /*#__PURE__*/_react.default.createElement(_SplitButton.default, {
      name: "".concat(appliedDocument.name, "-document-list-item-download-split-button"),
      selectedOption: "".concat(typeTitleString),
      selectedOptionDisplayCallback: function selectedOptionDisplayCallback(selectedOption) {
        return "Download ".concat(selectedOption);
      },
      options: appliedVariants.map(function (variant) {
        return _DocumentService.default.getDocumentTypeTitle(variant);
      }),
      onClick: function onClick(option) {
        var nextSelectedVariant = _DocumentService.default.findFirstByDocumentTypeTitle(appliedVariants, option);

        if ((0, _typeUtil.exists)(nextSelectedVariant)) {
          var coercedDownloadVariant = nextSelectedVariant;
          handleDownloadStarted();

          _DocumentService.default.downloadDocument(coercedDownloadVariant, function (downloadDoc) {
            return handleDownloadIdle();
          }, function (downloadDoc) {
            return handleDownloadFailed();
          });
        }
      },
      onChange: function onChange(option) {
        var nextSelectedVariant = _DocumentService.default.findFirstByDocumentTypeTitle(appliedVariants, option);

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

  var renderDownloadError = function renderDownloadError() {
    if (!isDownloadError) return null;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.downloadErrorContainer
    }, /*#__PURE__*/_react.default.createElement(_WarningCard.default, {
      title: "Document download is currently unavailable for \"".concat(appliedDocument.name, ".\""),
      onActionClick: function onActionClick() {
        return handleDownloadIdle();
      }
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
    title: makeDownloadableLink ? "Click to download ".concat(document.name) : undefined // @ts-ignore
    ,
    button: makeDownloadableLink,
    onClick: !makeDownloadableLink ? undefined : function () {
      handleDownloadStarted();

      _DocumentService.default.downloadDocument(appliedDocument, function (downloadDoc) {
        return handleDownloadIdle();
      }, function (downloadDoc) {
        return handleDownloadFailed();
      });
    }
  }, /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, {
    className: classes.listItemIcon
  }, /*#__PURE__*/_react.default.createElement(TypeIcon, null)), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
    primary: primary,
    secondary: renderSecondaryItem()
  }), renderAction()), renderDownloadError());
};

var WrappedDocumentListItem = _Theme.default.getWrappedComponent(DocumentListItem);

var _default = WrappedDocumentListItem;
exports.default = _default;