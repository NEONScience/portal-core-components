"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _styles = require("@mui/styles");
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _Link = _interopRequireDefault(require("@mui/material/Link"));
var _Skeleton = _interopRequireDefault(require("@mui/material/Skeleton"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _FormatQuote = _interopRequireDefault(require("@mui/icons-material/FormatQuote"));
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
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
    if (!(0, _typeUtil.exists)(item) || !(0, _typeUtil.isStringNonEmpty)(item.bundleParentCode)) {
      return;
    }
    const key = `${item.bundleParentCode}:${item.releaseObject?.release}`;
    if (!(0, _typeUtil.exists)(bundleParentCodes[key])) {
      bundleParentCodes[key] = {
        productCode: item.bundleParentCode,
        release: item.releaseObject?.release || null
      };
    }
  });
  const renderSkeleton = () => {
    if (disableSkeleton) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {});
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
      container: true,
      spacing: 2,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
          variant: "rectangular",
          width: "100%",
          height: 40
        })
      }), !showTextOnly ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
          variant: "rectangular",
          width: "100%",
          height: 180
        })
      }) : null]
    });
  };
  const renderError = () => {
    const errorTitle = 'Data Product Citation Generation Error';
    if (showTextOnly) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: appliedTextOnly.variant,
        component: "h6",
        className: appliedTextOnly.cssClass,
        children: errorTitle
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      container: true,
      spacing: 2,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ErrorCard.default, {
          title: errorTitle
        })
      })
    });
  };
  const renderNotAvailable = () => {
    const errorTitle = 'Data Product Citation Not Available';
    const errorMessage = 'A citation is not available for the specified data product and release.';
    if (showTextOnly) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: appliedTextOnly.variant,
          component: "h6",
          className: appliedTextOnly.cssClass,
          children: `${errorTitle}: ${errorMessage}`
        })
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      container: true,
      spacing: 2,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_WarningCard.default, {
          title: errorTitle,
          message: errorMessage
        })
      })
    });
  };
  const renderCitationBlurb = () => {
    if (showTextOnly) {
      return null;
    }
    const showNonConditionalBlurb = [_ViewState.DisplayType.RELEASE, _ViewState.DisplayType.PROVISIONAL].includes(displayType);
    const quoteIcon = showQuoteIcon ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormatQuote.default, {
      fontSize: "large",
      className: classes.calloutIcon
    }) : null;
    let blurb = 'Please use the appropriate citation(s) from below in your publications. ' + 'If using both provisional and release data please include both citations. ';
    if (showNonConditionalBlurb) {
      blurb = 'Please use this citation in your publications. ';
    }
    const dataPolicyLink = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
      href: _RouteService.default.getDataPoliciesCitationPath(),
      children: "Data Policies & Citation Guidelines"
    });
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.citationUseFlexContainer,
      children: [quoteIcon, /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
        variant: "subtitle2",
        className: classes.citationUseText,
        children: [blurb, "See ", dataPolicyLink, " for more info."]
      })]
    });
  };
  const renderBundleParentsCard = () => {
    const filteredCitationItems = citationItems.filter(item => (0, _typeUtil.exists)(item) && (0, _typeUtil.exists)(item.citableBaseProduct) && (0, _typeUtil.exists)(item.citableReleaseProduct) && (0, _typeUtil.isStringNonEmpty)(item.bundleParentCode) && (0, _typeUtil.exists)(item.releaseObject));
    if (!(0, _typeUtil.existsNonEmpty)(filteredCitationItems) || filteredCitationItems.length <= 1) {
      return null;
    }
    const isReleaseDisplay = displayType === _ViewState.DisplayType.RELEASE;
    const bundleNoteTerminalChar = !showManyParents ? '.' : ':';
    const titleContent = _BundleContentBuilder.default.buildDefaultSplitTitleContent(isReleaseDisplay, bundleNoteTerminalChar);
    const detailContent = !showManyParents ? undefined : /*#__PURE__*/(0, _jsxRuntime.jsx)("ul", {
      style: {
        margin: _Theme.default.spacing(1, 0)
      },
      children: filteredCitationItems.map(item => {
        const bundleParentName = isReleaseDisplay ? item.citableReleaseProduct.productName : item.citableBaseProduct.productName;
        let bundleParentHref = _RouteService.default.getProductDetailPath(item.bundleParentCode);
        if (isReleaseDisplay) {
          bundleParentHref = _RouteService.default.getProductDetailPath(item.bundleParentCode, item.releaseObject.release);
        }
        return /*#__PURE__*/(0, _jsxRuntime.jsx)("li", {
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
            href: bundleParentHref,
            target: "_blank",
            children: `${bundleParentName} (${item.bundleParentCode})`
          })
        }, bundleParentHref);
      })
    });
    let subTitleContent = !showManyParents ? undefined : /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
      children: "Use either or both citations as appropriate."
    });
    if (showManyParents && filteredCitationItems.length > 2) {
      subTitleContent = /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
        children: "Use citations as appropriate."
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.itemContainer,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_DataProductBundleCard.default, {
        isSplit: hasManyParents,
        titleContent: titleContent,
        detailContent: detailContent,
        subTitleContent: subTitleContent
      })
    });
  };
  const renderItems = () => citationItems.map((item, index) => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: classes.itemContainer
    // eslint-disable-next-line react/no-array-index-key
    ,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ItemView.default, {
      ...props,
      citationItem: item,
      viewState: viewState,
      hasManyParents: hasManyParents
    })
  }, `DataProductCitationItemKey-${item.doiUrl || index}`));
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
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [renderCitationBlurb(), renderBundleParentsCard(), renderItems()]
    });
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