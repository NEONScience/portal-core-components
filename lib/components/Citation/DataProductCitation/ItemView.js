"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactCopyToClipboard = require("react-copy-to-clipboard");
var _styles = require("@material-ui/core/styles");
var _Alert = _interopRequireDefault(require("@material-ui/lab/Alert"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _Card = _interopRequireDefault(require("@material-ui/core/Card"));
var _CardActions = _interopRequireDefault(require("@material-ui/core/CardActions"));
var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));
var _CardHeader = _interopRequireDefault(require("@material-ui/core/CardHeader"));
var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Assignment = _interopRequireDefault(require("@material-ui/icons/Assignment"));
var _SaveAlt = _interopRequireDefault(require("@material-ui/icons/SaveAlt"));
var _BundleContentBuilder = _interopRequireDefault(require("../../Bundles/BundleContentBuilder"));
var _DataProductBundleCard = _interopRequireDefault(require("../../Bundles/DataProductBundleCard"));
var _CitationService = _interopRequireDefault(require("../../../service/CitationService"));
var _DataCiteService = _interopRequireWildcard(require("../../../service/DataCiteService"));
var _RouteService = _interopRequireDefault(require("../../../service/RouteService"));
var _Theme = _interopRequireDefault(require("../../Theme/Theme"));
var _ReleaseService = require("../../../service/ReleaseService");
var _typeUtil = require("../../../util/typeUtil");
var _Actions = _interopRequireDefault(require("./Actions"));
var _Context = _interopRequireDefault(require("./Context"));
var _Service = _interopRequireDefault(require("./Service"));
var _State = require("./State");
var _ViewState = require("./ViewState");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    cardActions: {
      flexWrap: 'wrap',
      marginTop: theme.spacing(-1),
      '&> *': {
        marginLeft: '0px !important',
        marginTop: theme.spacing(1)
      },
      '&> :not(:last-child)': {
        marginRight: theme.spacing(1)
      }
    },
    cardButton: {
      padding: '5px 10px',
      backgroundColor: '#fff',
      whiteSpace: 'nowrap'
    },
    cardButtonIcon: {
      marginRight: theme.spacing(1)
    },
    citationCard: {
      marginTop: theme.spacing(2)
    },
    citationText: {
      fontFamily: 'monospace'
    },
    citationTextOnly: {
      color: theme.palette.grey[400]
    },
    citationTextWithQualifier: {
      marginTop: theme.spacing(1.5),
      fontFamily: 'monospace'
    },
    bundleTextOnlySpacer: {
      marginBottom: theme.spacing(2)
    },
    tombstoneBlurbCard: {
      backgroundColor: _Theme.default.colors.BROWN[50],
      borderColor: _Theme.default.colors.BROWN[300],
      marginTop: theme.spacing(1)
    },
    tombstoneBlurbCardTextOnly: {
      backgroundColor: _Theme.default.colors.BROWN[50],
      borderColor: _Theme.default.colors.BROWN[300],
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2)
    },
    tombstoneBlurbCardHeader: {
      padding: theme.spacing(2),
      paddingBottom: 0
    },
    tombstoneBlurbCardContent: {
      padding: theme.spacing(2),
      paddingTop: theme.spacing(1),
      paddingBottom: '20px !important'
    },
    tombstoneBlurb: {
      fontSize: '0.8rem'
    }
  };
});
var DataProductCitationItemView = function DataProductCitationItemView(props) {
  var showTextOnly = props.showTextOnly,
    textOnlyProps = props.textOnlyProps,
    citationItem = props.citationItem,
    viewState = props.viewState,
    hasManyParents = props.hasManyParents;
  var classes = useStyles(_Theme.default);
  var dispatch = _Context.default.useDataProductCitationContextDispatch();
  var appliedTextOnly = {
    variant: 'caption',
    cssClass: classes.citationTextOnly
  };
  if ((0, _typeUtil.exists)(textOnlyProps)) {
    appliedTextOnly = textOnlyProps;
  }
  var displayType = viewState.displayType,
    isTombstoned = viewState.isTombstoned,
    releases = viewState.releases,
    citationDownloadsFetchStatus = viewState.citationDownloadsFetchStatus;
  var releaseObject = citationItem.releaseObject,
    doiUrl = citationItem.doiUrl,
    citableBaseProduct = citationItem.citableBaseProduct,
    citableReleaseProduct = citationItem.citableReleaseProduct,
    bundleParentCode = citationItem.bundleParentCode;
  var handleResetCitationDownloadsCb = (0, _react.useCallback)(function (provisionalCb, productCode) {
    _Service.default.handleResetCitationDownloads(citationDownloadsFetchStatus, provisionalCb, productCode, dispatch);
  }, [dispatch, citationDownloadsFetchStatus]);
  var handleCitationDownloadCb = (0, _react.useCallback)(function (citationProduct, releaseCb, formatCb) {
    var provisionalCb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var coercedTarget = _extends({}, citationProduct);
    var key = _Service.default.buildCitationDownloadKey(citationProduct, releaseCb, formatCb, provisionalCb);
    var fullDoi = _Service.default.getReleaseDoi(releases, releaseCb);
    if ((0, _typeUtil.isStringNonEmpty)(fullDoi) && (0, _typeUtil.isStringNonEmpty)(doiUrl) && fullDoi !== doiUrl) {
      // In the case of multiple citations for a single product, we want to resolve
      // to the specified DOI URL for this citation, but adhere to pulling
      // from the set of releases in all other cases and to confirm a valid
      // release is present.
      fullDoi = doiUrl;
    }
    handleResetCitationDownloadsCb(provisionalCb, citationProduct.productCode);
    if (dispatch) {
      dispatch(_Actions.default.fetchCitationDownloadStarted(key));
    }
    _DataCiteService.default.downloadCitation(formatCb, _DataCiteService.CitationDownloadType.DATA_PRODUCT, coercedTarget, fullDoi, releaseCb, function (data) {
      if (dispatch) {
        dispatch(_Actions.default.fetchCitationDownloadSucceeded(key));
      }
    }, function (error) {
      if (dispatch) {
        dispatch(_Actions.default.fetchCitationDownloadFailed(key, 'Citation download failed'));
      }
    });
  }, [dispatch, releases, doiUrl, handleResetCitationDownloadsCb]);
  var renderTombstoneNotice = function renderTombstoneNotice() {
    if (!isTombstoned) {
      return null;
    }
    var citationRelease = releaseObject;
    var doiDisplay = ' ';
    if (citationRelease.productDoi.url) {
      var doiId = citationRelease.productDoi.url.split('/').slice(-2).join('/');
      doiDisplay = " (DOI:".concat(doiId, ") ");
    }
    var latestAvailableReleaseBlurb = null;
    if (citableBaseProduct !== null && citableBaseProduct !== void 0 && citableBaseProduct.releases && (citableBaseProduct === null || citableBaseProduct === void 0 ? void 0 : citableBaseProduct.releases.length) > 0) {
      var latestAvailableProductRelease = citableBaseProduct === null || citableBaseProduct === void 0 ? void 0 : citableBaseProduct.releases[0];
      if (latestAvailableProductRelease.release.localeCompare(citationRelease.release) !== 0) {
        var dataProductDetailLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
          href: _RouteService.default.getProductDetailPath(citableBaseProduct.productCode)
        }, "newer release");
        latestAvailableReleaseBlurb = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "has been replaced by a ", dataProductDetailLink, " and\xA0");
      }
    }
    var contactUsLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
      href: _RouteService.default.getContactUsPath()
    }, "Contact Us");
    var tombstoneNote = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, citationRelease.release, " of this data product", doiDisplay, " ", latestAvailableReleaseBlurb, "is no longer available for download. If this specific release is needed for research purposes, please fill out the ", contactUsLink, " form.");
    return /*#__PURE__*/_react.default.createElement(_Card.default, {
      className: showTextOnly ? classes.tombstoneBlurbCardTextOnly : classes.tombstoneBlurbCard
    }, /*#__PURE__*/_react.default.createElement(_CardHeader.default, {
      className: classes.tombstoneBlurbCardHeader,
      title: /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "h6",
        component: "h6"
      }, "Release Notice")
    }), /*#__PURE__*/_react.default.createElement(_CardContent.default, {
      className: classes.tombstoneBlurbCardContent
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      color: "textSecondary",
      className: classes.tombstoneBlurb
    }, tombstoneNote)));
  };
  var renderBundleParentLink = function renderBundleParentLink() {
    if (!(0, _typeUtil.isStringNonEmpty)(bundleParentCode) || hasManyParents) {
      return null;
    }
    var isReleaseDisplay = displayType === _ViewState.DisplayType.RELEASE;
    var bundleParentName = isReleaseDisplay ? citableReleaseProduct.productName : citableBaseProduct.productName;
    var titleContent;
    var dataProductLike = {
      productCode: bundleParentCode,
      productName: bundleParentName
    };
    var appliedRelease = isReleaseDisplay ? releaseObject.release : undefined;
    if (isReleaseDisplay) {
      titleContent = _BundleContentBuilder.default.buildDefaultTitleContent(dataProductLike, appliedRelease);
    } else {
      titleContent = _BundleContentBuilder.default.buildDefaultTitleContent(dataProductLike);
    }
    var subTitleContent = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "The ", isReleaseDisplay ? 'citation below refers' : 'citations below refer', " to that data product as this sub-product is not directly citable.");
    return /*#__PURE__*/_react.default.createElement("div", {
      className: showTextOnly ? classes.bundleTextOnlySpacer : undefined
    }, /*#__PURE__*/_react.default.createElement(_DataProductBundleCard.default, {
      showIcon: !hasManyParents,
      isSplit: hasManyParents,
      titleContent: titleContent,
      subTitleContent: subTitleContent
    }));
  };
  var renderCitationCard = function renderCitationCard(release) {
    var conditional = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var provisional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var citationProduct = provisional ? citableBaseProduct : citableReleaseProduct;
    var conditionalText = null;
    var citationClassName = classes.citationText;
    if (conditional) {
      var provReleaseText = provisional ? 'If Provisional data are used, include:' : 'If Released data are used, include:';
      if (showTextOnly) {
        conditionalText = /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: appliedTextOnly.variant,
          component: "h6",
          className: appliedTextOnly.cssClass
        }, provReleaseText);
      } else {
        conditionalText = /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "body1",
          component: "h6"
        }, provReleaseText);
      }
      citationClassName = classes.citationTextWithQualifier;
    }
    var citationReleaseObject = null;
    if (!provisional) {
      citationReleaseObject = releaseObject;
    }
    var citationText = _CitationService.default.buildDataProductCitationText(citationProduct, citationReleaseObject);
    if (showTextOnly) {
      return /*#__PURE__*/_react.default.createElement("div", null, conditionalText, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: appliedTextOnly.variant,
        component: "h6",
        className: appliedTextOnly.cssClass
      }, citationText));
    }
    var isSectionDownloading = _Service.default.hasCitationDownloadStatus(citationDownloadsFetchStatus, provisional, citationProduct.productCode, _State.FetchStatus.FETCHING);
    var downloadStatus;
    if (_Service.default.hasCitationDownloadStatus(citationDownloadsFetchStatus, provisional, citationProduct.productCode, _State.FetchStatus.ERROR)) {
      downloadStatus = /*#__PURE__*/_react.default.createElement(_Alert.default, {
        severity: "error",
        onClose: function onClose() {
          return handleResetCitationDownloadsCb(provisional, citationProduct.productCode);
        }
      }, "Citation download encountered a problem");
    } else if (_Service.default.hasCitationDownloadStatus(citationDownloadsFetchStatus, provisional, citationProduct.productCode, _State.FetchStatus.SUCCESS)) {
      downloadStatus = /*#__PURE__*/_react.default.createElement(_Alert.default, {
        severity: "success",
        onClose: function onClose() {
          return handleResetCitationDownloadsCb(provisional, citationProduct.productCode);
        }
      }, "Citation downloaded");
    }
    return /*#__PURE__*/_react.default.createElement(_Card.default, {
      className: classes.citationCard
    }, /*#__PURE__*/_react.default.createElement(_CardContent.default, null, conditionalText, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body1",
      className: citationClassName
    }, citationText)), /*#__PURE__*/_react.default.createElement(_CardActions.default, {
      className: classes.cardActions
    }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      placement: "bottom-start",
      title: "Click to copy the above plain text citation to the clipboard"
    }, /*#__PURE__*/_react.default.createElement(_reactCopyToClipboard.CopyToClipboard, {
      text: citationText
    }, /*#__PURE__*/_react.default.createElement(_Button.default, {
      size: "small",
      color: "primary",
      variant: "outlined",
      startIcon: /*#__PURE__*/_react.default.createElement(_Assignment.default, {
        fontSize: "small",
        className: classes.cardButtonIcon
      }),
      className: classes.cardButton
    }, "Copy"))), _DataCiteService.default.getDataProductFormats().map(function (format) {
      var key = _Service.default.buildCitationDownloadKey(citationProduct, release, format.shortName, provisional);
      var isDownloading = !(0, _typeUtil.exists)(citationDownloadsFetchStatus[key]) ? false : citationDownloadsFetchStatus[key].status === _State.FetchStatus.FETCHING;
      return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        key: format.shortName,
        placement: "bottom-start",
        title: "Click to download the ".concat(citationProduct.productCode, "/").concat(release, " citation as a ") + "file in ".concat(format.longName, " format")
      }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_Button.default, {
        size: "small",
        color: "primary",
        variant: "outlined",
        className: classes.cardButton,
        disabled: isDownloading || isSectionDownloading,
        startIcon: isDownloading ? /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
          size: 18,
          className: classes.cardButtonIcon
        }) : /*#__PURE__*/_react.default.createElement(_SaveAlt.default, {
          fontSize: "small",
          className: classes.cardButtonIcon
        }),
        onClick: function onClick() {
          handleCitationDownloadCb(citationProduct, release, format.shortName, provisional);
        }
      }, "Download (".concat(format.shortName, ")"))));
    })), downloadStatus);
  };
  var citationCard;
  switch (displayType) {
    case _ViewState.DisplayType.CONDITIONAL:
      citationCard = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderCitationCard(_ReleaseService.PROVISIONAL_RELEASE, true, true), renderCitationCard(releaseObject.release, true, false));
      break;
    case _ViewState.DisplayType.PROVISIONAL:
      citationCard = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderCitationCard(_ReleaseService.PROVISIONAL_RELEASE, false, true));
      break;
    case _ViewState.DisplayType.RELEASE:
      citationCard = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderCitationCard(releaseObject.release, false, false));
      break;
    case _ViewState.DisplayType.NOT_AVAILABLE:
    default:
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderTombstoneNotice(), renderBundleParentLink(), citationCard);
};
DataProductCitationItemView.defaultProps = {
  showQuoteIcon: false,
  disableConditional: false,
  disableSkeleton: false,
  showTextOnly: false,
  textOnlyProps: undefined
};
var _default = DataProductCitationItemView;
exports.default = _default;