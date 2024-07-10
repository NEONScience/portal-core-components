"use strict";

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
var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));
var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Assignment = _interopRequireDefault(require("@material-ui/icons/Assignment"));
var _SaveAlt = _interopRequireDefault(require("@material-ui/icons/SaveAlt"));
var _BundleContentBuilder = _interopRequireDefault(require("../../Bundles/BundleContentBuilder"));
var _DataProductBundleCard = _interopRequireDefault(require("../../Bundles/DataProductBundleCard"));
var _ReleaseNoticeCard = _interopRequireDefault(require("../../Card/ReleaseNoticeCard"));
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable react/jsx-fragments */
const useStyles = (0, _styles.makeStyles)(theme => ({
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
  tombstoneBlurb: {
    fontSize: '0.8rem'
  },
  noticeCardDivider: {
    margin: theme.spacing(0, 0, 2, 0)
  }
}));
const DataProductCitationItemView = props => {
  const {
    showTextOnly,
    textOnlyProps,
    citationItem,
    viewState,
    hasManyParents
  } = props;
  const classes = useStyles(_Theme.default);
  const dispatch = _Context.default.useDataProductCitationContextDispatch();
  let appliedTextOnly = {
    variant: 'caption',
    cssClass: classes.citationTextOnly
  };
  if ((0, _typeUtil.exists)(textOnlyProps)) {
    appliedTextOnly = textOnlyProps;
  }
  const {
    displayType,
    isTombstoned,
    releases,
    citationDownloadsFetchStatus
  } = viewState;
  const {
    releaseObject,
    doiUrl,
    citableBaseProduct,
    citableReleaseProduct,
    bundleParentCode
  } = citationItem;
  const handleResetCitationDownloadsCb = (0, _react.useCallback)((provisionalCb, productCode) => {
    _Service.default.handleResetCitationDownloads(citationDownloadsFetchStatus, provisionalCb, productCode, dispatch);
  }, [dispatch, citationDownloadsFetchStatus]);
  const handleCitationDownloadCb = (0, _react.useCallback)(function (citationProduct, releaseCb, formatCb) {
    let provisionalCb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    const coercedTarget = _extends({}, citationProduct);
    const key = _Service.default.buildCitationDownloadKey(citationProduct, releaseCb, formatCb, provisionalCb);
    let fullDoi = _Service.default.getReleaseDoi(releases, releaseCb);
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
    _DataCiteService.default.downloadCitation(formatCb, _DataCiteService.CitationDownloadType.DATA_PRODUCT, coercedTarget, fullDoi, releaseCb, data => {
      if (dispatch) {
        dispatch(_Actions.default.fetchCitationDownloadSucceeded(key));
      }
    }, error => {
      if (dispatch) {
        dispatch(_Actions.default.fetchCitationDownloadFailed(key, 'Citation download failed'));
      }
    });
  }, [dispatch, releases, doiUrl, handleResetCitationDownloadsCb]);
  const renderTombstoneNotice = () => {
    if (!isTombstoned) {
      return null;
    }
    const citationRelease = releaseObject;
    let doiDisplay = ' ';
    if (citationRelease.productDoi.url) {
      const doiId = citationRelease.productDoi.url.split('/').slice(-2).join('/');
      doiDisplay = " (DOI:".concat(doiId, ") ");
    }
    let latestAvailableReleaseBlurb = null;
    if (citableBaseProduct !== null && citableBaseProduct !== void 0 && citableBaseProduct.releases && (citableBaseProduct === null || citableBaseProduct === void 0 ? void 0 : citableBaseProduct.releases.length) > 0) {
      const latestAvailableProductRelease = citableBaseProduct === null || citableBaseProduct === void 0 ? void 0 : citableBaseProduct.releases[0];
      if (latestAvailableProductRelease.release.localeCompare(citationRelease.release) !== 0) {
        const dataProductDetailLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
          href: _RouteService.default.getProductDetailPath(citableBaseProduct.productCode)
        }, "newer release");
        latestAvailableReleaseBlurb = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "has been replaced by a ", dataProductDetailLink, " and\xA0");
      }
    }
    const contactUsLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
      href: _RouteService.default.getContactUsPath()
    }, "Contact Us");
    const tombstoneNote = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("b", null, citationRelease.release), " of this data product", doiDisplay, " ", latestAvailableReleaseBlurb, "is no longer available for download. If this specific release is needed for research purposes, please fill out the ", contactUsLink, " form.");
    return /*#__PURE__*/_react.default.createElement(_ReleaseNoticeCard.default, {
      messageContent: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Divider.default, {
        className: classes.noticeCardDivider
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2",
        color: "textPrimary",
        className: classes.tombstoneBlurb
      }, tombstoneNote))
    });
  };
  const renderBundleParentLink = () => {
    if (!(0, _typeUtil.isStringNonEmpty)(bundleParentCode) || hasManyParents) {
      return null;
    }
    const isReleaseDisplay = displayType === _ViewState.DisplayType.RELEASE;
    const bundleParentName = isReleaseDisplay ? citableReleaseProduct.productName : citableBaseProduct.productName;
    let titleContent;
    const dataProductLike = {
      productCode: bundleParentCode,
      productName: bundleParentName
    };
    const appliedRelease = isReleaseDisplay ? releaseObject.release : undefined;
    if (isReleaseDisplay) {
      titleContent = _BundleContentBuilder.default.buildDefaultTitleContent(dataProductLike, appliedRelease);
    } else {
      titleContent = _BundleContentBuilder.default.buildDefaultTitleContent(dataProductLike);
    }
    const subTitleContent = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "The ", isReleaseDisplay ? 'citation below refers' : 'citations below refer', " to that data product as this data product is not directly citable.");
    return /*#__PURE__*/_react.default.createElement("div", {
      className: showTextOnly ? classes.bundleTextOnlySpacer : undefined
    }, /*#__PURE__*/_react.default.createElement(_DataProductBundleCard.default, {
      isSplit: hasManyParents,
      titleContent: titleContent,
      subTitleContent: subTitleContent
    }));
  };
  const renderCitationCard = function (release) {
    let conditional = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let provisional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    const citationProduct = provisional ? citableBaseProduct : citableReleaseProduct;
    let conditionalText = null;
    let citationClassName = classes.citationText;
    if (conditional) {
      const provReleaseText = provisional ? 'If Provisional data are used, include:' : 'If Released data are used, include:';
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
    let citationReleaseObject = null;
    if (!provisional) {
      citationReleaseObject = releaseObject;
    }
    const citationText = _CitationService.default.buildDataProductCitationText(citationProduct, citationReleaseObject);
    if (showTextOnly) {
      return /*#__PURE__*/_react.default.createElement("div", null, conditionalText, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: appliedTextOnly.variant,
        component: "h6",
        className: appliedTextOnly.cssClass
      }, citationText));
    }
    const isSectionDownloading = _Service.default.hasCitationDownloadStatus(citationDownloadsFetchStatus, provisional, citationProduct.productCode, _State.FetchStatus.FETCHING);
    let downloadStatus;
    if (_Service.default.hasCitationDownloadStatus(citationDownloadsFetchStatus, provisional, citationProduct.productCode, _State.FetchStatus.ERROR)) {
      downloadStatus = /*#__PURE__*/_react.default.createElement(_Alert.default, {
        severity: "error",
        onClose: () => handleResetCitationDownloadsCb(provisional, citationProduct.productCode)
      }, "Citation download encountered a problem");
    } else if (_Service.default.hasCitationDownloadStatus(citationDownloadsFetchStatus, provisional, citationProduct.productCode, _State.FetchStatus.SUCCESS)) {
      downloadStatus = /*#__PURE__*/_react.default.createElement(_Alert.default, {
        severity: "success",
        onClose: () => handleResetCitationDownloadsCb(provisional, citationProduct.productCode)
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
    }, "Copy"))), _DataCiteService.default.getDataProductFormats().map(format => {
      const key = _Service.default.buildCitationDownloadKey(citationProduct, release, format.shortName, provisional);
      const isDownloading = !(0, _typeUtil.exists)(citationDownloadsFetchStatus[key]) ? false : citationDownloadsFetchStatus[key].status === _State.FetchStatus.FETCHING;
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
        onClick: () => {
          handleCitationDownloadCb(citationProduct, release, format.shortName, provisional);
        }
      }, "Download (".concat(format.shortName, ")"))));
    })), downloadStatus);
  };
  let citationCard;
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
var _default = exports.default = DataProductCitationItemView;