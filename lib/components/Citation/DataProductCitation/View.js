"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

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

var _Service = _interopRequireDefault(require("./Service"));

var _ErrorCard = _interopRequireDefault(require("../../Card/ErrorCard"));

var _WarningCard = _interopRequireDefault(require("../../Card/WarningCard"));

var _Theme = _interopRequireDefault(require("../../Theme/Theme"));

var _CitationService = _interopRequireDefault(require("../../../service/CitationService"));

var _DataCiteService = _interopRequireWildcard(require("../../../service/DataCiteService"));

var _RouteService = _interopRequireDefault(require("../../../service/RouteService"));

var _typeUtil = require("../../../util/typeUtil");

var _State = require("./State");

var _ViewState = require("./ViewState");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

  var viewState = _Service.default.useViewState(state, props); // Click handler for initiating a citation download


  var handleDownloadCitation = function handleDownloadCitation(release, format) {
    var provisional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var citationProduct = provisional ? viewState.citableBaseProduct : viewState.citableReleaseProduct;

    if (!(0, _typeUtil.exists)(citationProduct)) {
      return;
    }

    var coercedTarget = _extends({}, citationProduct); // Release: fetch content from DataCite API to pipe into download


    var fullDoi = _Service.default.getReleaseDoi(viewState.releases, release);

    _DataCiteService.default.downloadCitation(format, _DataCiteService.CitationDownloadType.DATA_PRODUCT, coercedTarget, fullDoi, release);
  };

  var renderSkeleton = function renderSkeleton() {
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
  };

  var renderError = function renderError() {
    var errorTitle = 'Data Product Citation Generation Error';

    if (showTextOnly) {
      return /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: appliedTextOnly.variant,
        component: "h6",
        className: appliedTextOnly.cssClass
      }, errorTitle);
    }

    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true,
      spacing: 2
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12
    }, /*#__PURE__*/_react.default.createElement(_ErrorCard.default, {
      title: errorTitle
    })));
  };

  var renderNotAvailable = function renderNotAvailable() {
    var errorTitle = 'Data Product Citation Not Available';
    var errorMessage = 'A citation is not available for the specified data product and release.';

    if (showTextOnly) {
      return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: appliedTextOnly.variant,
        component: "h6",
        className: appliedTextOnly.cssClass
      }, "".concat(errorTitle, ": ").concat(errorMessage)));
    }

    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true,
      spacing: 2
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12
    }, /*#__PURE__*/_react.default.createElement(_WarningCard.default, {
      title: errorTitle,
      message: errorMessage
    })));
  };

  var renderCitationBlurb = function renderCitationBlurb() {
    if (showTextOnly) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
    }

    var showNonConditionalBlurb = [_ViewState.DisplayType.RELEASE, _ViewState.DisplayType.PROVISIONAL].includes(viewState.displayType);
    var quoteIcon = showQuoteIcon ? /*#__PURE__*/_react.default.createElement(_FormatQuote.default, {
      fontSize: "large",
      className: classes.calloutIcon
    }) : null;
    var blurb = 'Please use the appropriate citation(s) from below in your publications. ' + 'If using both provisional and release data please include both citations. ';

    if (showNonConditionalBlurb) {
      blurb = 'Please use this citation in your publications. ';
    }

    var dataPolicyLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
      href: _RouteService.default.getDataPoliciesCitationPath()
    }, "Data Policies & Citation Guidelines");

    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.citationUseFlexContainer
    }, quoteIcon, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2",
      className: classes.citationUseText
    }, blurb, "See ", dataPolicyLink, " for more info."));
  };

  var renderBundleParentLink = function renderBundleParentLink() {
    if (!(0, _typeUtil.isStringNonEmpty)(viewState.bundleParentCode)) {
      return null;
    }

    var isReleaseDisplay = viewState.displayType === _ViewState.DisplayType.RELEASE;
    var bundleParentName = isReleaseDisplay ? viewState.citableReleaseProduct.productName : viewState.citableBaseProduct.productName;

    var bundleParentHref = _RouteService.default.getProductDetailPath(viewState.bundleParentCode);

    if (isReleaseDisplay) {
      bundleParentHref = _RouteService.default.getProductDetailPath(viewState.bundleParentCode, viewState.releaseObject.release);
    }

    var bundleParentLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
      href: bundleParentHref
    }, "".concat(bundleParentName, " (").concat(viewState.bundleParentCode, ")"));

    return /*#__PURE__*/_react.default.createElement(_Card.default, {
      className: showTextOnly ? classes.bundleParentBlurbCardTextOnly : classes.bundleParentBlurbCard
    }, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
      className: classes.bundleParentBlurbCardContent
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      color: "textSecondary",
      className: classes.bundleParentBlurb
    }, /*#__PURE__*/_react.default.createElement("b", null, "Note:"), " This product is bundled into ", bundleParentLink, ". The ", isReleaseDisplay ? 'citation below refers' : 'citations below refer', " to that product as this sub-product is not directly citable.")));
  };

  var renderCitationCard = function renderCitationCard(release) {
    var conditional = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var provisional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var citationProduct = provisional ? viewState.citableBaseProduct : viewState.citableReleaseProduct;
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
      citationReleaseObject = viewState.releaseObject;
    }

    var citationText = _CitationService.default.buildDataProductCitationText(citationProduct, citationReleaseObject);

    if (showTextOnly) {
      return /*#__PURE__*/_react.default.createElement("div", null, conditionalText, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: appliedTextOnly.variant,
        component: "h6",
        className: appliedTextOnly.cssClass
      }, citationText));
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
      className: classes.cardButton
    }, /*#__PURE__*/_react.default.createElement(_Assignment.default, {
      fontSize: "small",
      className: classes.cardButtonIcon
    }), "Copy"))), _DataCiteService.default.getDataProductFormats().map(function (format) {
      return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        key: format.shortName,
        placement: "bottom-start",
        title: "Click to download the ".concat(citationProduct.productCode, "/").concat(release, " citation as a '") + "'file in ".concat(format.longName, " format")
      }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_Button.default, {
        size: "small",
        color: "primary",
        variant: "outlined",
        className: classes.cardButton,
        onClick: function onClick() {
          handleDownloadCitation(release, format.shortName, provisional);
        }
      }, /*#__PURE__*/_react.default.createElement(_SaveAlt.default, {
        fontSize: "small",
        className: classes.cardButtonIcon
      }), "Download (".concat(format.shortName, ")"))));
    })));
  };

  var renderCitationDisplay = function renderCitationDisplay() {
    var citationCard = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);

    switch (viewState.displayType) {
      case _ViewState.DisplayType.CONDITIONAL:
        citationCard = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderCitationCard(_State.PROVISIONAL_RELEASE, true, true), renderCitationCard(viewState.releaseObject.release, true, false));
        break;

      case _ViewState.DisplayType.PROVISIONAL:
        citationCard = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderCitationCard(_State.PROVISIONAL_RELEASE, false, true));
        break;

      case _ViewState.DisplayType.RELEASE:
        citationCard = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderCitationCard(viewState.releaseObject.release, false, false));
        break;

      case _ViewState.DisplayType.NOT_AVAILABLE:
        return renderNotAvailable();

      default:
        // Invalid state, return error state.
        return renderError();
    }

    return /*#__PURE__*/_react.default.createElement("div", null, renderCitationBlurb(), renderBundleParentLink(), citationCard);
  };

  switch (viewState.status) {
    case _State.ContextStatus.INITIALIZING:
    case _State.ContextStatus.FETCHING:
    case _State.ContextStatus.HAS_FETCHES_TO_TRIGGER:
      return renderSkeleton();

    case _State.ContextStatus.ERROR:
      return renderError();

    case _State.ContextStatus.READY:
    default:
      break;
  }

  return renderCitationDisplay();
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