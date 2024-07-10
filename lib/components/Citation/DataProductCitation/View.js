"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _styles = require("@material-ui/core/styles");
var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _FormatQuote = _interopRequireDefault(require("@material-ui/icons/FormatQuote"));
var _BundleContentBuilder = _interopRequireDefault(require("../../Bundles/BundleContentBuilder"));
var _DataProductBundleCard = _interopRequireDefault(require("../../Bundles/DataProductBundleCard"));
var _ErrorCard = _interopRequireDefault(require("../../Card/ErrorCard"));
var _WarningCard = _interopRequireDefault(require("../../Card/WarningCard"));
var _Theme = _interopRequireDefault(require("../../Theme/Theme"));
var _RouteService = _interopRequireDefault(require("../../../service/RouteService"));
var _typeUtil = require("../../../util/typeUtil");
var _Context = _interopRequireDefault(require("./Context"));
var _ItemView = _interopRequireDefault(require("./ItemView"));
var _Service = _interopRequireDefault(require("./Service"));
var _State = require("./State");
var _ViewState = require("./ViewState");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const useStyles = (0, _styles.makeStyles)(theme => ({
  citationTextOnly: {
    color: theme.palette.grey[400]
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
  itemContainer: {
    marginBottom: theme.spacing(2)
  }
}));
const DataProductCitationView = props => {
  const {
    showQuoteIcon,
    disableSkeleton,
    showTextOnly,
    textOnlyProps,
    showManyParents
  } = props;
  const classes = useStyles(_Theme.default);
  const state = _Context.default.useDataProductCitationContextState();
  let appliedTextOnly = {
    variant: 'caption',
    cssClass: classes.citationTextOnly
  };
  if ((0, _typeUtil.exists)(textOnlyProps)) {
    appliedTextOnly = textOnlyProps;
  }
  const viewState = _Service.default.useViewState(state, props);
  const {
    status,
    displayType,
    citationItems
  } = viewState;
  const bundleParentCodes = {};
  const hasManyParents = citationItems.length > 1;
  citationItems.forEach(item => {
    var _item$releaseObject;
    if (!(0, _typeUtil.exists)(item) || !(0, _typeUtil.isStringNonEmpty)(item.bundleParentCode)) {
      return;
    }
    const key = "".concat(item.bundleParentCode, ":").concat((_item$releaseObject = item.releaseObject) === null || _item$releaseObject === void 0 ? void 0 : _item$releaseObject.release);
    if (!(0, _typeUtil.exists)(bundleParentCodes[key])) {
      var _item$releaseObject2;
      bundleParentCodes[key] = {
        productCode: item.bundleParentCode,
        release: ((_item$releaseObject2 = item.releaseObject) === null || _item$releaseObject2 === void 0 ? void 0 : _item$releaseObject2.release) || null
      };
    }
  });
  const renderSkeleton = () => {
    if (disableSkeleton) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
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
  const renderError = () => {
    const errorTitle = 'Data Product Citation Generation Error';
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
  const renderNotAvailable = () => {
    const errorTitle = 'Data Product Citation Not Available';
    const errorMessage = 'A citation is not available for the specified data product and release.';
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
  const renderCitationBlurb = () => {
    if (showTextOnly) {
      return null;
    }
    const showNonConditionalBlurb = [_ViewState.DisplayType.RELEASE, _ViewState.DisplayType.PROVISIONAL].includes(displayType);
    const quoteIcon = showQuoteIcon ? /*#__PURE__*/_react.default.createElement(_FormatQuote.default, {
      fontSize: "large",
      className: classes.calloutIcon
    }) : null;
    let blurb = 'Please use the appropriate citation(s) from below in your publications. ' + 'If using both provisional and release data please include both citations. ';
    if (showNonConditionalBlurb) {
      blurb = 'Please use this citation in your publications. ';
    }
    const dataPolicyLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
      href: _RouteService.default.getDataPoliciesCitationPath()
    }, "Data Policies & Citation Guidelines");
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.citationUseFlexContainer
    }, quoteIcon, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2",
      className: classes.citationUseText
    }, blurb, "See ", dataPolicyLink, " for more info."));
  };
  const renderBundleParentsCard = () => {
    const filteredCitationItems = citationItems.filter(item => (0, _typeUtil.exists)(item) && (0, _typeUtil.exists)(item.citableBaseProduct) && (0, _typeUtil.exists)(item.citableReleaseProduct) && (0, _typeUtil.isStringNonEmpty)(item.bundleParentCode) && (0, _typeUtil.exists)(item.releaseObject));
    if (!(0, _typeUtil.existsNonEmpty)(filteredCitationItems) || filteredCitationItems.length <= 1) {
      return null;
    }
    const isReleaseDisplay = displayType === _ViewState.DisplayType.RELEASE;
    const bundleNoteTerminalChar = !showManyParents ? '.' : ':';
    const titleContent = _BundleContentBuilder.default.buildDefaultSplitTitleContent(isReleaseDisplay, bundleNoteTerminalChar);
    const detailContent = !showManyParents ? undefined : /*#__PURE__*/_react.default.createElement("ul", {
      style: {
        margin: _Theme.default.spacing(1, 0)
      }
    }, filteredCitationItems.map(item => {
      const bundleParentName = isReleaseDisplay ? item.citableReleaseProduct.productName : item.citableBaseProduct.productName;
      let bundleParentHref = _RouteService.default.getProductDetailPath(item.bundleParentCode);
      if (isReleaseDisplay) {
        bundleParentHref = _RouteService.default.getProductDetailPath(item.bundleParentCode, item.releaseObject.release);
      }
      return /*#__PURE__*/_react.default.createElement("li", {
        key: bundleParentHref
      }, /*#__PURE__*/_react.default.createElement(_Link.default, {
        href: bundleParentHref,
        target: "_blank"
      }, "".concat(bundleParentName, " (").concat(item.bundleParentCode, ")")));
    }));
    let subTitleContent = !showManyParents ? undefined : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "Use either or both citations as appropriate.");
    if (showManyParents && filteredCitationItems.length > 2) {
      subTitleContent = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "Use citations as appropriate.");
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.itemContainer
    }, /*#__PURE__*/_react.default.createElement(_DataProductBundleCard.default, {
      isSplit: hasManyParents,
      titleContent: titleContent,
      detailContent: detailContent,
      subTitleContent: subTitleContent
    }));
  };
  const renderItems = () => citationItems.map((item, index) => /*#__PURE__*/_react.default.createElement("div", {
    className: classes.itemContainer
    // eslint-disable-next-line react/no-array-index-key
    ,
    key: "DataProductCitationItemKey-".concat(item.doiUrl || index)
  }, /*#__PURE__*/_react.default.createElement(_ItemView.default, _extends({}, props, {
    citationItem: item,
    viewState: viewState,
    hasManyParents: hasManyParents
  }))));
  const renderCitationDisplay = () => {
    switch (displayType) {
      case _ViewState.DisplayType.CONDITIONAL:
      case _ViewState.DisplayType.PROVISIONAL:
      case _ViewState.DisplayType.RELEASE:
        break;
      case _ViewState.DisplayType.NOT_AVAILABLE:
        return renderNotAvailable();
      default:
        // Invalid state, return error state.
        return renderError();
    }
    return /*#__PURE__*/_react.default.createElement("div", null, renderCitationBlurb(), renderBundleParentsCard(), renderItems());
  };
  switch (status) {
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
  textOnlyProps: undefined,
  showManyParents: true
};
var _default = exports.default = DataProductCitationView;