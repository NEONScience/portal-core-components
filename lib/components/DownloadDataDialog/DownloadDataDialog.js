"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DownloadDataDialog;
var _react = _interopRequireWildcard(require("react"));
var _nodeLzw = _interopRequireDefault(require("node-lzw"));
var _styles = require("@material-ui/core/styles");
var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _Card = _interopRequireDefault(require("@material-ui/core/Card"));
var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));
var _Chip = _interopRequireDefault(require("@material-ui/core/Chip"));
var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));
var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));
var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));
var _Hidden = _interopRequireDefault(require("@material-ui/core/Hidden"));
var _LinearProgress = _interopRequireDefault(require("@material-ui/core/LinearProgress"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _MobileStepper = _interopRequireDefault(require("@material-ui/core/MobileStepper"));
var _Stepper = _interopRequireDefault(require("@material-ui/core/Stepper"));
var _Step = _interopRequireDefault(require("@material-ui/core/Step"));
var _StepButton = _interopRequireDefault(require("@material-ui/core/StepButton"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Stars = _interopRequireDefault(require("@material-ui/icons/Stars"));
var _SaveAlt = _interopRequireDefault(require("@material-ui/icons/SaveAlt"));
var _ErrorOutline = _interopRequireDefault(require("@material-ui/icons/ErrorOutline"));
var _ChevronLeft = _interopRequireDefault(require("@material-ui/icons/ChevronLeft"));
var _ChevronRight = _interopRequireDefault(require("@material-ui/icons/ChevronRight"));
var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));
var _DialogBase = _interopRequireDefault(require("../DialogBase/DialogBase"));
var _DownloadStepForm = _interopRequireDefault(require("../DownloadStepForm/DownloadStepForm"));
var _DownloadDataContext = _interopRequireDefault(require("../DownloadDataContext/DownloadDataContext"));
var _DataThemeIcon = _interopRequireDefault(require("../DataThemeIcon/DataThemeIcon"));
var _ExternalHost = _interopRequireDefault(require("../ExternalHost/ExternalHost"));
var _ExternalHostInfo = _interopRequireDefault(require("../ExternalHostInfo/ExternalHostInfo"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _ReleaseChip = _interopRequireDefault(require("../Chip/ReleaseChip"));
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
var _NeonSignInButton = _interopRequireDefault(require("../NeonSignInButton/NeonSignInButton"));
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _manifestUtil = require("../../util/manifestUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const useStyles = (belowSm, belowSmMd) => (0, _styles.makeStyles)(theme => ({
  stepChip: {
    marginRight: theme.spacing(1),
    fontSize: '1rem',
    fontWeight: 600
  },
  productCodeChip: {
    color: theme.palette.grey[400],
    border: "1px solid ".concat(theme.palette.grey[400]),
    backgroundColor: theme.palette.grey[100],
    fontWeight: 600,
    cursor: 'help',
    height: '26px',
    margin: theme.spacing(-0.5, 1.5, 0, 0)
  },
  releaseChip: {
    color: _Theme.default.colors.LIGHT_BLUE[600],
    border: "1px solid ".concat(_Theme.default.colors.LIGHT_BLUE[600]),
    backgroundColor: _Theme.default.colors.LIGHT_BLUE[50],
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'help',
    height: belowSmMd && !belowSm ? 'auto' : undefined,
    padding: theme.spacing(2, 1, 2, 1)
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  endFlex: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  completedInactive: {
    '& svg': {
      opacity: 0.5
    }
  },
  summaryIcon: {
    fontSize: '30px',
    color: theme.palette.primary.main
  },
  summaryIconTitleMarker: {
    fontSize: '38px',
    color: theme.palette.primary.main,
    margin: '-2px 6px -2px -4px'
  },
  callout: {
    backgroundColor: _Theme.COLORS.GOLD[300],
    margin: _Theme.default.spacing(0.5, 0, 2, 0)
  },
  calloutIcon: {
    color: _Theme.COLORS.GOLD[800],
    marginRight: theme.spacing(2)
  },
  gtmCaptureButton: {
    '& span': {
      pointerEvents: 'none'
    }
  }
}));
const useDialogBaseStyles = belowSm => (0, _styles.makeStyles)(theme => ({
  contentPaper: {
    margin: theme.spacing(10, 2, belowSm ? 9 : 2, 2),
    padding: theme.spacing(3),
    minWidth: '340px'
  }
}));
function DownloadDataDialog() {
  const belowSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('xs'));
  const belowSmMd = (0, _useMediaQuery.default)('(max-width: 750px)');
  const belowSmMdStepper = (0, _useMediaQuery.default)('(max-width: 700px)');
  const belowMdStepper = (0, _useMediaQuery.default)('(max-width: 800px)');
  const classes = useStyles(belowSm, belowSmMd)(_Theme.default);
  const dialogBaseClasses = useDialogBaseStyles(belowSm)(_Theme.default);

  /**
     State (from DownloadDataContext)
  */
  const [{
    dialogOpen,
    productData,
    manifest,
    requiredSteps,
    allStepsComplete,
    fromManifest,
    fromAOPManifest,
    documentation,
    s3Files,
    release,
    latestRelease,
    sites,
    dateRange,
    packageType,
    provisionalData
  }, dispatch] = _DownloadDataContext.default.useDownloadDataState();

  /**
     State (from NeonContext)
  */
  const [{
    auth: {
      isAuthenticated
    }
  }] = _NeonContext.default.useNeonContextState();

  /**
     State (local)
  */
  const [activeStepIndex, setActiveStepIndex] = (0, _react.useState)(0);
  const [downloadExecuted, setDownloadExecuted] = (0, _react.useState)(false);

  /**
     Size estimate getter (in bytes)
  */
  const getSizeEstimateBytes = () => (fromAOPManifest ? s3Files.totalSize : manifest.sizeEstimate) || 0;

  /**
     External Host
  */
  const externalHost = _ExternalHost.default.getByProductCode(productData.productCode);
  const renderExternalHostInfo = () => {
    if (!externalHost || externalHost.hostType === _ExternalHost.default.HOST_TYPES.EXCLUSIVE_DATA) {
      return null;
    }
    const availableSiteCodes = (productData.siteCodes || []).map(site => site.siteCode);
    return /*#__PURE__*/_react.default.createElement(_ExternalHostInfo.default, {
      "data-selenium": "download-data-dialog.external-host-info",
      productCode: productData.productCode,
      siteCodes: availableSiteCodes,
      expandable: true
    });
  };

  /**
     Step content
  */
  const {
    ALL_STEPS
  } = _DownloadDataContext.default;
  const getStep = function () {
    let idx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    if (!requiredSteps[idx]) {
      return {};
    }
    return ALL_STEPS[requiredSteps[idx].key];
  };

  /**
     Handlers
  */
  const changeToStep = stepIdx => {
    setActiveStepIndex(stepIdx);
  };
  const changeToNextUncompletedStep = () => {
    const lastStepIndex = requiredSteps.length - 1;
    const summaryIndex = requiredSteps[lastStepIndex].key === 'summary' ? lastStepIndex : null;
    const allIncompleteSteps = Object.keys(requiredSteps).map(idx => parseInt(idx, 10)).filter(idx => idx !== activeStepIndex && idx !== summaryIndex && !requiredSteps[idx].isComplete);
    if (activeStepIndex === lastStepIndex) {
      return null;
    }
    if (!allIncompleteSteps.length) {
      return summaryIndex ? changeToStep(summaryIndex) : null;
    }
    // There is at least one incomplete step.
    // If any steps are after the current active step (OTHER than summary), go there first.
    // If not then take the first incomplete step in the list.
    const laterIncompleteSteps = allIncompleteSteps.filter(idx => idx !== summaryIndex && idx > activeStepIndex);
    return changeToStep(laterIncompleteSteps.length ? laterIncompleteSteps[0] : allIncompleteSteps[0]);
  };
  const handleCancel = () => {
    dispatch({
      type: 'setDialogOpen',
      open: false
    });
  };
  const handleDownload = () => {
    setDownloadExecuted(true);
    const manifestSelection = {
      productData,
      release,
      sites,
      dateRange,
      documentation,
      packageType,
      provisionalData
    };
    if (fromAOPManifest) {
      const config = (0, _manifestUtil.buildManifestConfig)(manifestSelection, null, true);
      return (0, _manifestUtil.downloadAopManifest)(config, s3Files, documentation.value);
    }
    if (manifest.status !== 'fetched' || !manifest.body || !manifest.body.data) {
      return null;
    }
    const config = (0, _manifestUtil.buildManifestConfig)(manifestSelection);
    const manifestBody = (0, _manifestUtil.buildManifestRequestBody)(config);
    return (0, _manifestUtil.downloadManifest)(manifestBody);
  };

  /**
     Render functions
  */
  const renderSizeEstimate = () => {
    const alignRight = {
      style: {
        textAlign: 'right'
      }
    };
    const subtitleStyle = {
      style: {
        lineHeight: '1rem',
        fontSize: '0.9rem',
        marginBottom: '4px'
      }
    };
    if (fromManifest && manifest.status === 'awaitingFetchCall' || fromAOPManifest && !s3Files.isValid) {
      return '';
    }
    if (fromManifest && manifest.status === 'fetching') {
      return belowSm ? /*#__PURE__*/_react.default.createElement("div", {
        className: classes.startFlex
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2"
      }, "Estimating size..."), /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
        size: 16,
        style: {
          marginLeft: _Theme.default.spacing(1)
        }
      })) : /*#__PURE__*/_react.default.createElement("div", alignRight, /*#__PURE__*/_react.default.createElement(_Typography.default, _extends({
        variant: "subtitle1"
      }, subtitleStyle), "Estimating size..."), /*#__PURE__*/_react.default.createElement(_LinearProgress.default, {
        style: {
          marginTop: _Theme.default.spacing(1.5)
        }
      }));
    }
    if (fromManifest && manifest.status === 'fetched' && manifest.sizeEstimate > 0 || fromAOPManifest && s3Files.isValid) {
      const bytes = getSizeEstimateBytes();
      const uncompressed = fromAOPManifest ? ' (uncompressed)' : '';
      let estimateColor = bytes > _manifestUtil.DOWNLOAD_SIZE_WARN ? _Theme.COLORS.GOLD[300] : 'inherit';
      const estimateIcon = bytes > _manifestUtil.DOWNLOAD_SIZE_WARN ? /*#__PURE__*/_react.default.createElement(_Warning.default, {
        style: {
          marginRight: '8px',
          marginBottom: '-5px'
        }
      }) : null;
      /* eslint-disable react/jsx-one-expression-per-line */
      if (belowSm) {
        estimateColor = bytes > _manifestUtil.DOWNLOAD_SIZE_WARN ? _Theme.COLORS.GOLD[500] : 'inherit';
        return /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "body2"
        }, "Estimated size", uncompressed, ":\xA0", /*#__PURE__*/_react.default.createElement("span", {
          style: {
            fontWeight: 700,
            color: estimateColor
          }
        }, estimateIcon, (0, _manifestUtil.formatBytes)(bytes)));
      }
      return /*#__PURE__*/_react.default.createElement("div", alignRight, /*#__PURE__*/_react.default.createElement(_Typography.default, _extends({
        variant: "subtitle1"
      }, subtitleStyle), "Estimated size", uncompressed), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "h5",
        style: {
          color: estimateColor
        }
      }, estimateIcon, (0, _manifestUtil.formatBytes)(bytes)));
      /* eslint-enable react/jsx-one-expression-per-line */
    }
    if (fromManifest && (manifest.status === 'fetched' || manifest.status === 'no-data') && !(manifest.sizeEstimate > 0) || fromAOPManifest && !(s3Files.totalSize > 0)) {
      const hasProvisionalDataStep = requiredSteps.some(step => step.key === 'provisionalData');
      const excludeProvisionalData = hasProvisionalDataStep && provisionalData.value === 'exclude';
      const showNoReleaseData = hasProvisionalDataStep && excludeProvisionalData;
      return /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2",
        color: "error"
      }, showNoReleaseData ? 'No release data selected' : 'No data selected');
    }
    if (fromManifest && manifest.status === 'error' || fromAOPManifest && !s3Files.isValid) {
      return /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2",
        color: "error"
      }, "Unable to estimate size");
    }
    return null;
  };
  const renderDownloadSizeWarning = () => {
    const bytes = getSizeEstimateBytes();
    if (bytes < _manifestUtil.DOWNLOAD_SIZE_WARN) {
      return null;
    }
    const formattedBytes = (0, _manifestUtil.formatBytes)(bytes);
    return /*#__PURE__*/_react.default.createElement(_Card.default, {
      className: classes.callout
    }, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
      className: classes.startFlex
    }, /*#__PURE__*/_react.default.createElement(_Warning.default, {
      fontSize: "large",
      className: classes.calloutIcon
    }), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle1",
      style: {
        fontWeight: 600
      }
    }, "Be sure you have at least ", formattedBytes, " of free disk space for this download!"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body1"
    }, "If needed, you can reduce the download size by selecting fewer sites or a more restrictive date range."))));
  };
  const renderFileType = () => {
    if (!fromManifest) {
      return null;
    }
    if (manifest.status !== 'fetched' || manifest.status === 'fetched' && !(manifest.sizeEstimate > 0)) {
      return /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2",
        "data-selenium": "download-data-dialog.file-type"
      }, "File Type:\xA0", /*#__PURE__*/_react.default.createElement("b", null, "Not available"));
    }
    // TODO: Do other file types ever come back in the manifest response?
    const fileTypes = {
      'application/zip': 'ZIP (Compressed Text)'
    };
    const mimeType = manifest.body && manifest.body.data && manifest.body.data.mimeType ? manifest.body.data.mimeType : null;
    const fileTypeText = Object.keys(fileTypes).includes(mimeType) ? fileTypes[mimeType] : 'Unknown';
    return /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      "data-selenium": "download-data-dialog.file-type"
    }, "File Type:\xA0", /*#__PURE__*/_react.default.createElement("b", null, fileTypeText));
  };

  // Not the same as the Download Data Button component!
  // This entire dialog component is launched by the Download Data Button component.
  // The button rendered here looks the same but only appears inside the dialog,
  // and actually executes the download (provided the context is in a complete state).
  const renderDownloadButton = () => {
    let disabled = true;
    let buttonText = 'Download Data';
    const iconProps = {
      style: {
        marginLeft: _Theme.default.spacing(1)
      }
    };
    let icon = /*#__PURE__*/_react.default.createElement(_SaveAlt.default, iconProps);
    if (allStepsComplete) {
      if (fromAOPManifest) {
        disabled = false;
      }
      if (fromManifest) {
        switch (manifest.status) {
          case 'fetched':
            disabled = !(manifest.sizeEstimate > 0);
            break;
          case 'fetching':
            buttonText = 'Fetching File List...';
            icon = /*#__PURE__*/_react.default.createElement(_CircularProgress.default, _extends({
              size: 16,
              color: "inherit"
            }, iconProps));
            break;
          case 'error':
            buttonText = 'Download Unavailable';
            icon = /*#__PURE__*/_react.default.createElement(_ErrorOutline.default, iconProps);
            break;
          case 'awaitingFetchCall':
            break;
          case 'no-data':
          case 'invalid-config':
          default:
            buttonText = 'Download Unavailable';
            break;
        }
      }
    }
    let appliedDownloadButtonStyle = {
      whiteSpace: 'nowrap'
    };
    if (belowSmMd) {
      appliedDownloadButtonStyle = _extends({}, appliedDownloadButtonStyle, {
        width: '100%'
      });
    }
    return /*#__PURE__*/_react.default.createElement(_Button.default, {
      fullWidth: belowSm,
      "data-selenium": "download-data-dialog.download-button",
      "data-gtm": "download-data-dialog.download-button",
      size: "large",
      color: "primary",
      variant: "contained",
      onClick: handleDownload,
      style: appliedDownloadButtonStyle,
      disabled: disabled,
      className: classes.gtmCaptureButton
    }, buttonText, icon);
  };
  const renderAuthSuggestion = () => {
    if (isAuthenticated) {
      return null;
    }
    /* eslint-disable react/jsx-one-expression-per-line */
    const authStyles = {
      color: _Theme.COLORS.GOLD[800],
      textAlign: 'right'
    };
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      style: _extends({}, authStyles, {
        marginTop: _Theme.default.spacing(1),
        fontWeight: 600
      })
    }, "Consider signing in or creating an account before proceeding."), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      style: _extends({}, authStyles, {
        fontStyle: 'italic',
        fontSize: '0.8rem'
      })
    }, /*#__PURE__*/_react.default.createElement(_Link.default, {
      target: "_new",
      href: _RouteService.default.getUserAccountsPath()
    }, "Learn"), " the benefits of having an account."), /*#__PURE__*/_react.default.createElement(_NeonSignInButton.default, null));
    /* eslint-enable react/jsx-one-expression-per-line */
  };
  const renderDownloadButtonStepNote = () => {
    const showDownloadButton = fromManifest || fromAOPManifest;
    if (!showDownloadButton) {
      return null;
    }
    const completableSteps = requiredSteps.filter(step => step.key !== 'summary');
    const completedSteps = requiredSteps.filter(step => step.key !== 'summary' && step.isComplete);
    const noDataAvailable = fromManifest && (manifest.status === 'fetched' || manifest.status === 'no-data') && !(manifest.sizeEstimate > 0) || fromAOPManifest && !(s3Files.totalSize > 0);
    if (!allStepsComplete) {
      return /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2",
        style: {
          marginTop: _Theme.default.spacing(2),
          textAlign: 'right'
        }
      }, "Complete all steps to enable download. ".concat(completedSteps.length, " of ").concat(completableSteps.length, " completed."));
    }
    return /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      style: {
        marginTop: _Theme.default.spacing(2),
        textAlign: 'right'
      }
    }, noDataAvailable ? 'No data selected.' : 'All steps completed.');
  };
  const renderActions = () => {
    const divClass = belowSm ? classes.startFlex : classes.endFlex;
    const showDownloadButton = fromManifest || fromAOPManifest;
    if (belowSm) {
      return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Grid.default, {
        container: true,
        spacing: 2
      }, showDownloadButton ? /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12,
        sm: 12,
        md: 8
      }, renderDownloadButton()) : null, /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12,
        sm: 12,
        md: showDownloadButton ? 4 : 12
      }, /*#__PURE__*/_react.default.createElement(_Button.default, {
        fullWidth: true,
        "data-selenium": "download-data-dialog.cancel-button",
        "data-gtm": "download-data-dialog.cancel-button",
        size: "large",
        color: "primary",
        variant: "outlined",
        onClick: handleCancel,
        style: {
          marginRight: _Theme.default.spacing(showDownloadButton ? 1 : 0)
        },
        className: classes.gtmCaptureButton
      }, showDownloadButton ? 'Cancel' : 'Done'))), /*#__PURE__*/_react.default.createElement("div", {
        className: divClass,
        style: {
          flexDirection: 'column',
          alignItems: 'flex-end'
        }
      }, renderDownloadButtonStepNote(), renderAuthSuggestion()));
    }
    let appliedActionsContainerStyles = {};
    let appliedDismissActionStyle = {
      marginRight: _Theme.default.spacing(showDownloadButton ? 1 : 0)
    };
    if (showDownloadButton && belowSmMd) {
      appliedActionsContainerStyles = {
        flexDirection: 'column-reverse',
        width: '100%'
      };
      appliedDismissActionStyle = {
        marginRight: '0px',
        marginTop: '10px',
        width: '100%'
      };
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: divClass,
      style: {
        flexDirection: 'column',
        alignItems: 'flex-end'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: divClass,
      style: appliedActionsContainerStyles
    }, /*#__PURE__*/_react.default.createElement(_Button.default, {
      "data-selenium": "download-data-dialog.cancel-button",
      "data-gtm": "download-data-dialog.cancel-button",
      size: "large",
      color: "primary",
      variant: "outlined",
      onClick: handleCancel,
      style: appliedDismissActionStyle,
      className: classes.gtmCaptureButton
    }, showDownloadButton ? 'Cancel' : 'Done'), showDownloadButton ? renderDownloadButton() : null), renderDownloadButtonStepNote(), renderAuthSuggestion());
  };
  const renderStepNavButtons = () => /*#__PURE__*/_react.default.createElement("div", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/_react.default.createElement(_Button.default, {
    "data-selenium": "download-data-dialog.step-nav-button.previous",
    variant: "outlined",
    "aria-label": "Previous",
    disabled: activeStepIndex === 0,
    onClick: () => changeToStep(activeStepIndex - 1),
    startIcon: /*#__PURE__*/_react.default.createElement(_ChevronLeft.default, null)
  }, belowSm ? null : 'Back'), /*#__PURE__*/_react.default.createElement(_Button.default, {
    "data-selenium": "download-data-dialog.step-nav-button.next",
    variant: "outlined",
    "aria-label": "Next",
    disabled: activeStepIndex === requiredSteps.length - 1,
    style: {
      marginLeft: _Theme.default.spacing(1)
    },
    onClick: () => changeToStep(activeStepIndex + 1),
    endIcon: /*#__PURE__*/_react.default.createElement(_ChevronRight.default, null)
  }, belowSm ? null : 'Next'));
  const renderStepper = () => {
    if (requiredSteps.length < 2) {
      return null;
    }
    const hideLabel = requiredSteps.length > 5 && belowMdStepper || requiredSteps.length <= 5 && belowSmMdStepper;
    if (belowSm) {
      const maxSteps = requiredSteps.length;
      const buttonProps = {
        size: 'small',
        color: 'primary',
        variant: 'contained'
      };
      const handleBack = () => changeToStep(activeStepIndex - 1);
      const handleNext = () => changeToStep(activeStepIndex + 1);
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_MobileStepper.default, {
        steps: maxSteps,
        variant: "dots",
        activeStep: activeStepIndex,
        backButton: /*#__PURE__*/_react.default.createElement(_Button.default, _extends({}, buttonProps, {
          onClick: handleBack,
          disabled: activeStepIndex === 0
        }), _Theme.default.direction === 'rtl' ? /*#__PURE__*/_react.default.createElement(_ChevronRight.default, null) : /*#__PURE__*/_react.default.createElement(_ChevronLeft.default, null), "Back"),
        nextButton: /*#__PURE__*/_react.default.createElement(_Button.default, _extends({}, buttonProps, {
          onClick: handleNext,
          disabled: activeStepIndex === maxSteps - 1
        }), "Next", _Theme.default.direction === 'rtl' ? /*#__PURE__*/_react.default.createElement(_ChevronLeft.default, null) : /*#__PURE__*/_react.default.createElement(_ChevronRight.default, null))
      }), /*#__PURE__*/_react.default.createElement(_Divider.default, null));
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Stepper.default, {
      nonLinear: true,
      "data-selenium": "download-data-dialog.stepper"
    }, requiredSteps.map((step, index) => {
      const {
        label
      } = getStep(index);
      const buttonProps = {
        onClick: () => changeToStep(index)
      };
      if (step.isComplete === true && activeStepIndex !== index) {
        buttonProps.className = classes.completedInactive;
      }
      if (step.key === 'summary') {
        buttonProps.icon = /*#__PURE__*/_react.default.createElement(_Stars.default, {
          className: classes.summaryIcon,
          style: {
            opacity: activeStepIndex === index ? 1 : 0.5
          }
        });
      }
      return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        key: label,
        placement: "top",
        title: label
      }, /*#__PURE__*/_react.default.createElement(_Step.default, {
        key: label,
        active: activeStepIndex === index,
        completed: step.isComplete === true
      }, /*#__PURE__*/_react.default.createElement(_StepButton.default, buttonProps, hideLabel ? null : label)));
    })), /*#__PURE__*/_react.default.createElement(_Divider.default, null));
  };
  const renderActiveStep = () => {
    if (!requiredSteps.length) {
      return null;
    }
    if (requiredSteps.length < 2) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, getStep(activeStepIndex).title ? /*#__PURE__*/_react.default.createElement("div", {
        style: {
          marginTop: _Theme.default.spacing(3)
        }
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "h5",
        style: {
          flexGrow: 1
        }
      }, getStep(activeStepIndex).title)) : null, /*#__PURE__*/_react.default.createElement("div", {
        style: {
          margin: _Theme.default.spacing(3, belowSm ? 0 : 5)
        }
      }, /*#__PURE__*/_react.default.createElement(_DownloadStepForm.default, {
        stepKey: requiredSteps[activeStepIndex].key
      })));
    }
    const titleMarker = requiredSteps[activeStepIndex].key === 'summary' ? /*#__PURE__*/_react.default.createElement(_Stars.default, {
      className: classes.summaryIconTitleMarker
    }) : /*#__PURE__*/_react.default.createElement(_Chip.default, {
      color: "primary",
      label: activeStepIndex + 1,
      className: classes.stepChip
    });
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlex,
      style: {
        marginTop: _Theme.default.spacing(3)
      }
    }, titleMarker, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h5",
      style: {
        flexGrow: 1
      }
    }, getStep(activeStepIndex).title), belowSm ? null : renderStepNavButtons()), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        margin: _Theme.default.spacing(2, belowSm ? 0 : 5)
      }
    }, /*#__PURE__*/_react.default.createElement(_DownloadStepForm.default, {
      stepKey: requiredSteps[activeStepIndex].key,
      changeToStep: changeToStep,
      changeToNextUncompletedStep: changeToNextUncompletedStep,
      renderDownloadButton: renderDownloadButton
    })));
  };

  // Google Tag Manager variables
  const getStepsCompleted = () => requiredSteps.filter(step => step.isComplete === true).map(step => step.key);
  const getStepsNotCompleted = () => requiredSteps.filter(step => step.isComplete === false).map(step => step.key);
  const getStepCompletionPercentage = () => {
    const completed = getStepsCompleted();
    const notCompleted = getStepsNotCompleted();
    const total = completed.length + notCompleted.length;
    return total ? completed.length / total * 100 : 0;
  };
  const getLZWCompressedConfig = () => {
    if (!allStepsComplete) {
      return '';
    }
    // The subset of possible steps we actually want to persist in the GA event
    const eventSteps = ['sites', 'dateRange'];
    if (requiredSteps.some(step => step.key === 'documentation')) {
      eventSteps.push('documentation');
    }
    if (requiredSteps.some(step => step.key === 'packageType')) {
      eventSteps.push('packageType');
    }
    if (requiredSteps.some(step => step.key === 'provisionalData')) {
      eventSteps.push('provisionalData');
    }
    // Build the config for reporting
    const eventValues = {
      sites,
      dateRange,
      documentation,
      packageType,
      provisionalData
    };
    const eventConfig = {
      productCode: productData.productCode
    };
    eventSteps.forEach(step => {
      eventConfig[step] = eventValues[step].value;
    });
    // Stringify, compress, and return
    return _nodeLzw.default.encode(JSON.stringify(eventConfig));
  };
  const renderGtmTags = () => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("input", {
    type: "hidden",
    "data-gtm": "download-data-dialog.product-code",
    value: productData.productCode
  }), /*#__PURE__*/_react.default.createElement("input", {
    type: "hidden",
    "data-gtm": "download-data-dialog.size-estimate-bytes",
    value: getSizeEstimateBytes()
  }), /*#__PURE__*/_react.default.createElement("input", {
    type: "hidden",
    "data-gtm": "download-data-dialog.steps-completed",
    value: getStepsCompleted().join(', ')
  }), /*#__PURE__*/_react.default.createElement("input", {
    type: "hidden",
    "data-gtm": "download-data-dialog.steps-not-completed",
    value: getStepsNotCompleted().join(', ')
  }), /*#__PURE__*/_react.default.createElement("input", {
    type: "hidden",
    "data-gtm": "download-data-dialog.step-completion-percentage",
    value: getStepCompletionPercentage()
  }), /*#__PURE__*/_react.default.createElement("input", {
    type: "hidden",
    "data-gtm": "download-data-dialog.download-executed",
    value: downloadExecuted ? 1 : 0
  }), /*#__PURE__*/_react.default.createElement("input", {
    type: "hidden",
    "data-gtm": "download-data-dialog.lzw-compressed-config",
    value: getLZWCompressedConfig()
  }));
  const releaseTooltip = release.value === null ? "You are downloading only the latest released and provisional data (release: ".concat(latestRelease || 'unknown', ").") : "You are downloading product data only from the ".concat(release.value, " release (no provisional data will be included).");
  const releaseChipLabel = release.value === null ? 'Latest released and provisional data' : "Release: ".concat(release.value);
  const releaseChipLabelStyle = belowSmMd && !belowSm ? {
    whiteSpace: 'break-spaces'
  } : {};
  return /*#__PURE__*/_react.default.createElement(_DialogBase.default, {
    "data-selenium": "download-data-dialog",
    open: dialogOpen,
    onClose: handleCancel,
    customClasses: dialogBaseClasses,
    title: fromManifest || fromAOPManifest ? 'Configure Data for Download' : 'Download Data from External Host',
    closeButtonProps: {
      'data-gtm': 'download-data-dialog.cancel-button',
      className: classes.gtmCaptureButton
    },
    toolbarChildren: fromManifest || fromAOPManifest ? /*#__PURE__*/_react.default.createElement(_Hidden.default, {
      xsDown: true
    }, /*#__PURE__*/_react.default.createElement("div", {
      "data-selenium": "download-data-dialog.size-estimate"
    }, renderSizeEstimate())) : null
  }, renderGtmTags(), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    container: true,
    spacing: 2,
    alignItems: "flex-start",
    style: {
      marginBottom: _Theme.default.spacing(2)
    }
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6,
    md: 6,
    lg: 8,
    "data-selenium": "download-data-dialog.product-info"
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5",
    style: {
      marginBottom: _Theme.default.spacing(1.5)
    }
  }, productData.productName), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.startFlex,
    style: {
      marginBottom: _Theme.default.spacing(1.5)
    }
  }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    placement: "right",
    title: "The unique identifier for this data product independent of release"
  }, /*#__PURE__*/_react.default.createElement(_Chip.default, {
    label: productData.productCode,
    className: classes.productCodeChip
  })), (productData.themes || []).map(dataTheme => /*#__PURE__*/_react.default.createElement("div", {
    key: dataTheme,
    style: {
      marginLeft: _Theme.default.spacing(1.5)
    }
  }, /*#__PURE__*/_react.default.createElement(_DataThemeIcon.default, {
    size: 3,
    theme: dataTheme
  })))), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_ReleaseChip.default, {
    chipLabel: /*#__PURE__*/_react.default.createElement("span", {
      style: releaseChipLabelStyle
    }, releaseChipLabel),
    classes: {
      chip: classes.releaseChip
    },
    tooltipTitle: releaseTooltip,
    tooltipProps: {
      placement: 'bottom-start'
    }
  }))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6,
    md: 6,
    lg: 4
  }, fromManifest || fromAOPManifest ? /*#__PURE__*/_react.default.createElement(_Hidden.default, {
    smUp: true
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginBottom: _Theme.default.spacing(2)
    }
  }, renderFileType(), /*#__PURE__*/_react.default.createElement("div", {
    "data-selenium": "download-data-dialog.size-estimate"
  }, renderSizeEstimate()))) : null, renderActions(), fromManifest || fromAOPManifest ? /*#__PURE__*/_react.default.createElement(_Hidden.default, {
    xsDown: true
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginTop: _Theme.default.spacing(1),
      textAlign: 'right'
    }
  }, renderFileType())) : null)), renderExternalHostInfo(), renderDownloadSizeWarning(), getSizeEstimateBytes() < _manifestUtil.DOWNLOAD_SIZE_WARN ? /*#__PURE__*/_react.default.createElement(_Divider.default, null) : null, renderStepper(), renderActiveStep());
}