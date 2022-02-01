"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _dateformat = _interopRequireDefault(require("dateformat"));

var _reactCopyToClipboard = require("react-copy-to-clipboard");

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Card = _interopRequireDefault(require("@material-ui/core/Card"));

var _CardActions = _interopRequireDefault(require("@material-ui/core/CardActions"));

var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Link = _interopRequireDefault(require("@material-ui/core/Link"));

var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));

var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Assignment = _interopRequireDefault(require("@material-ui/icons/Assignment"));

var _SaveAlt = _interopRequireDefault(require("@material-ui/icons/SaveAlt"));

var _FormatQuote = _interopRequireDefault(require("@material-ui/icons/FormatQuote"));

var _Context = _interopRequireDefault(require("./Context"));

var _ErrorCard = _interopRequireDefault(require("../../Card/ErrorCard"));

var _WarningCard = _interopRequireDefault(require("../../Card/WarningCard"));

var _Theme = _interopRequireDefault(require("../../Theme/Theme"));

var _State = require("./State");

var _BundleService = _interopRequireDefault(require("../../../service/BundleService"));

var _DataCiteService = _interopRequireWildcard(require("../../../service/DataCiteService"));

var _RouteService = _interopRequireDefault(require("../../../service/RouteService"));

var _typeUtil = require("../../../util/typeUtil");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable react/jsx-fragments */
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
      color: _Theme.default.palette.grey[400]
    },
    citationTextWithQualifier: {
      marginTop: theme.spacing(1.5),
      fontFamily: 'monospace'
    },
    calloutIcon: {
      color: theme.palette.grey[300],
      marginRight: theme.spacing(2)
    },
    citationUseFlexContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: theme.spacing(3)
    },
    citationUseText: {
      flexGrow: 1
    },
    bundleParentBlurbCard: {
      backgroundColor: _Theme.default.colors.GOLD[50],
      marginTop: theme.spacing(1)
    },
    bundleParentBlurbCardTextOnly: {
      backgroundColor: _Theme.default.colors.GOLD[50],
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2)
    },
    bundleParentBlurbCardContent: {
      padding: theme.spacing(2),
      paddingBottom: '20px !important'
    },
    bundleParentBlurb: {
      fontStyle: 'italic',
      fontSize: '0.8rem'
    }
  };
});

var DataProductCitationView = function DataProductCitationView(props) {
  var showQuoteIcon = props.showQuoteIcon,
      disableConditional = props.disableConditional,
      disableSkeleton = props.disableSkeleton,
      showTextOnly = props.showTextOnly,
      textOnlyProps = props.textOnlyProps;
  var classes = useStyles(_Theme.default);

  var state = _Context.default.useDataProductCitationContextState();

  var appliedTextOnly = {
    variant: 'caption',
    cssClass: classes.citationTextOnly
  };

  if ((0, _typeUtil.exists)(textOnlyProps)) {
    appliedTextOnly = textOnlyProps;
  }

  var currentReleaseTag = state.release,
      bundle = state.bundle,
      status = state.component.status,
      _state$data = state.data,
      baseProduct = _state$data.product,
      productReleases = _state$data.productReleases,
      bundleParents = _state$data.bundleParents,
      bundleParentReleases = _state$data.bundleParentReleases,
      releases = _state$data.releases,
      bundlesCtx = state.neonContextState.data.bundles;

  switch (status) {
    case _State.CONTEXT_STATUS.INITIALIZING:
    case _State.CONTEXT_STATUS.FETCHING:
    case _State.CONTEXT_STATUS.HAS_FETCHES_TO_TRIGGER:
      if (disableSkeleton) {
        return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
      }

      return /*#__PURE__*/_react.default.createElement(_Grid.default, {
        container: true,
        spacing: 2
      }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12
      }, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
        variant: "rect",
        width: "100%",
        height: 40
      })), !showTextOnly ? /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12
      }, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
        variant: "rect",
        width: "100%",
        height: 180
      })) : null);

    case _State.CONTEXT_STATUS.ERROR:
      return /*#__PURE__*/_react.default.createElement(_Grid.default, {
        container: true,
        spacing: 2
      }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12
      }, /*#__PURE__*/_react.default.createElement(_ErrorCard.default, {
        title: "Data Product Citation Generation Error"
      })));

    case _State.CONTEXT_STATUS.READY:
    default:
      break;
  }

  var latestRelease = releases && releases.length ? releases.find(function (r) {
    return r.showCitation;
  }) : null;
  var hasBundleCode = bundle.parentCodes.length > 0 && (0, _typeUtil.isStringNonEmpty)(bundle.doiProductCode);
  var bundleParentCode = hasBundleCode ? bundle.doiProductCode : null;
  var citableBaseProduct = hasBundleCode ? bundleParents[bundleParentCode] || baseProduct : baseProduct;
  /**
   * Determines if the latest release has a bundle defined for this product
   * @returns True if the latest release has a bundle defined for this product
   */

  var hasLatestBundleRelease = function hasLatestBundleRelease() {
    if (!bundleParentReleases || !bundleParentCode) {
      return false;
    }

    var latestReleaseTag = (latestRelease || {}).release;

    if (!latestReleaseTag) {
      return false;
    }

    return _BundleService.default.isProductInBundle(bundlesCtx, latestReleaseTag, baseProduct.productCode);
  };

  var citableReleaseProduct = null;
  var citationReleaseTag = currentReleaseTag || (latestRelease || {}).release || null;

  if (citationReleaseTag) {
    // If we're referencing latest release and provisional, and there isn't a bundle
    // defined for the latest release, use base product for release citation
    if (!currentReleaseTag && !hasLatestBundleRelease()) {
      citableReleaseProduct = baseProduct;
    } else {
      // When a bundled product code is available for the given release,
      // get the product for the parent code and release.
      // Otherwise, the citable product is the current product for the specified
      // release when available.
      citableReleaseProduct = bundleParentCode ? (bundleParentReleases[bundleParentCode] || {})[citationReleaseTag] || null : productReleases[citationReleaseTag] || null;
    }
  }

  var bundleParentLink = null;

  if (bundleParentCode) {
    var bundleParentName = currentReleaseTag && citableReleaseProduct ? citableReleaseProduct.productName : citableBaseProduct.productName;

    var bundleParentHref = _RouteService.default.getProductDetailPath(bundleParentCode);

    if (currentReleaseTag) {
      bundleParentHref = _RouteService.default.getProductDetailPath(bundleParentCode, currentReleaseTag);
    }

    bundleParentLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
      href: bundleParentHref
    }, "".concat(bundleParentName, " (").concat(bundleParentCode, ")"));
  }

  var dataPolicyLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
    href: _RouteService.default.getDataPoliciesCitationPath()
  }, "Data Policies & Citation Guidelines");

  var getReleaseObject = function getReleaseObject(release) {
    return !release || release === 'provisional' ? null : releases.find(function (r) {
      return r.release === release;
    });
  };

  var currentReleaseObject = getReleaseObject(currentReleaseTag);
  var hideCitation = currentReleaseObject && !currentReleaseObject.showCitation;

  var getReleaseDoi = function getReleaseDoi(release) {
    var releaseObject = getReleaseObject(release);
    return releaseObject && releaseObject.productDoi && releaseObject.productDoi.url ? releaseObject.productDoi.url : null;
  };

  var getCitationText = function getCitationText(product, release) {
    if (!product) {
      return null;
    }

    var releaseObject = getReleaseObject(release);
    var citationDoi = releaseObject && releaseObject.productDoi && releaseObject.productDoi.url ? releaseObject.productDoi.url : null;
    var now = new Date();
    var today = (0, _dateformat.default)(now, 'mmmm d, yyyy');
    var neon = 'NEON (National Ecological Observatory Network)';
    var productName = releaseObject === null ? "".concat(product.productName, " (").concat(product.productCode, ")") : "".concat(product.productName, ", ").concat(release, " (").concat(product.productCode, ")");
    var doiText = citationDoi ? ". ".concat(citationDoi) : '';

    var url = _RouteService.default.getDataProductCitationDownloadUrl();

    var accessed = releaseObject === null ? "".concat(url, " (accessed ").concat(today, ")") : "Dataset accessed from ".concat(url, " on ").concat(today);
    return "".concat(neon, ". ").concat(productName).concat(doiText, ". ").concat(accessed);
  }; // Click handler for initiating a citation download


  var handleDownloadCitation = function handleDownloadCitation(release, format) {
    var provisional = release === 'provisional';
    var citationProduct = provisional ? citableBaseProduct : citableReleaseProduct; // Release: fetch content from DataCite API to pipe into download

    var fullDoi = getReleaseDoi(release);

    _DataCiteService.default.downloadCitation(format, _DataCiteService.CitationDownloadType.DATA_PRODUCT, citationProduct, fullDoi, release);
  };

  var renderCitationBlurb = function renderCitationBlurb() {
    if (showTextOnly) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
    }

    var showCitationBlurb = true;

    if ((0, _typeUtil.isStringNonEmpty)(currentReleaseTag)) {
      showCitationBlurb = getReleaseDoi(currentReleaseTag) !== null;
    }

    if (!showCitationBlurb) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
    }

    var quoteIcon = showQuoteIcon ? /*#__PURE__*/_react.default.createElement(_FormatQuote.default, {
      fontSize: "large",
      className: classes.calloutIcon
    }) : null;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.citationUseFlexContainer
    }, quoteIcon, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2",
      className: classes.citationUseText
    }, currentReleaseTag || latestRelease === null ? 'Please use this citation in your publications. ' : 'Please use the appropriate citation(s) from below in your publications. If using both provisional and release data please include both citations. ', "See ", dataPolicyLink, " for more info."));
  };

  var renderBundleParentLink = function renderBundleParentLink() {
    return !bundleParentLink ? null : /*#__PURE__*/_react.default.createElement(_Card.default, {
      className: showTextOnly ? classes.bundleParentBlurbCardTextOnly : classes.bundleParentBlurbCard
    }, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
      className: classes.bundleParentBlurbCardContent
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      color: "textSecondary",
      className: classes.bundleParentBlurb
    }, /*#__PURE__*/_react.default.createElement("b", null, "Note:"), " This product is bundled into ", bundleParentLink, ". The ", currentReleaseTag || !latestRelease ? 'citation below refers' : 'citations below refer', " to that product as this sub-product is not directly citable.")));
  };

  var renderCitationCard = function renderCitationCard(release) {
    var conditional = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var provisional = release === 'provisional' || hideCitation;
    var citationProduct = provisional ? citableBaseProduct : citableReleaseProduct;

    if (!citationProduct) {
      return null;
    }

    var downloadEnabled = provisional || getReleaseDoi(release) !== null;

    if (!downloadEnabled) {
      return /*#__PURE__*/_react.default.createElement(_WarningCard.default, {
        title: "Data Product Citation Not Available",
        message: "A citation is not available for the specified data product and release."
      });
    }

    var conditionalText = null;
    var citationClassName = classes.citationText;

    if (conditional && !disableConditional) {
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

    var citationText = getCitationText(citationProduct, release);

    if (showTextOnly) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", null, conditionalText, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: appliedTextOnly.variant,
        component: "h6",
        className: appliedTextOnly.cssClass
      }, citationText)));
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
      text: citationText || ''
    }, /*#__PURE__*/_react.default.createElement(_Button.default, {
      size: "small",
      color: "primary",
      variant: "outlined",
      className: classes.cardButton
    }, /*#__PURE__*/_react.default.createElement(_Assignment.default, {
      fontSize: "small",
      className: classes.cardButtonIcon
    }), "Copy"))), _DataCiteService.default.getDataProductFormats().map(function (format) {
      return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        key: format.shortName,
        placement: "bottom-start",
        title: downloadEnabled ? "Click to download the ".concat(citationProduct.productCode, "/").concat(release, " citation as a file in ").concat(format.longName, " format") : 'Citation format downloads are not available because this product release has no DOI'
      }, /*#__PURE__*/_react.default.createElement("span", {
        style: downloadEnabled ? {} : {
          cursor: 'no-drop'
        }
      }, /*#__PURE__*/_react.default.createElement(_Button.default, {
        size: "small",
        color: "primary",
        variant: "outlined",
        className: classes.cardButton,
        onClick: function onClick() {
          handleDownloadCitation(release, format.shortName);
        },
        disabled: !downloadEnabled
      }, /*#__PURE__*/_react.default.createElement(_SaveAlt.default, {
        fontSize: "small",
        className: classes.cardButtonIcon
      }), "Download (".concat(format.shortName, ")"))));
    })));
  };

  return /*#__PURE__*/_react.default.createElement("div", null, renderCitationBlurb(), renderBundleParentLink(), currentReleaseTag ? renderCitationCard(currentReleaseTag) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderCitationCard('provisional', latestRelease !== null), latestRelease && !disableConditional ? renderCitationCard(latestRelease.release, true) : null));
};

DataProductCitationView.defaultProps = {
  showQuoteIcon: false,
  disableConditional: false,
  disableSkeleton: false,
  showTextOnly: false,
  textOnlyProps: undefined
};
var _default = DataProductCitationView;
exports.default = _default;