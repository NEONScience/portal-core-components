"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DownloadDataDialog;

var _react = _interopRequireWildcard(require("react"));

var _nodeLzw = _interopRequireDefault(require("node-lzw"));

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Chip = _interopRequireDefault(require("@material-ui/core/Chip"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Hidden = _interopRequireDefault(require("@material-ui/core/Hidden"));

var _LinearProgress = _interopRequireDefault(require("@material-ui/core/LinearProgress"));

var _Link = _interopRequireDefault(require("@material-ui/core/Link"));

var _MobileStepper = _interopRequireDefault(require("@material-ui/core/MobileStepper"));

var _SnackbarContent = _interopRequireDefault(require("@material-ui/core/SnackbarContent"));

var _Stepper = _interopRequireDefault(require("@material-ui/core/Stepper"));

var _Step = _interopRequireDefault(require("@material-ui/core/Step"));

var _StepButton = _interopRequireDefault(require("@material-ui/core/StepButton"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Stars = _interopRequireDefault(require("@material-ui/icons/Stars"));

var _CloudDownload = _interopRequireDefault(require("@material-ui/icons/CloudDownload"));

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

var _Theme = _interopRequireWildcard(require("../Theme/Theme"));

var _manifestUtil = require("../../util/manifestUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    stepChip: {
      marginRight: theme.spacing(1),
      fontSize: '1rem',
      fontWeight: 600
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
    warningSnackbar: {
      backgroundColor: _Theme.COLORS.ORANGE[100],
      color: '#000',
      border: "1px solid ".concat(theme.palette.primary.main, "80"),
      margin: _Theme.default.spacing(0.5, 0, 2, 0),
      padding: _Theme.default.spacing(0, 2),
      '& div': {
        width: '100%'
      }
    },
    warningSnackbarIcon: {
      color: _Theme.COLORS.ORANGE[800],
      marginRight: theme.spacing(2)
    },
    gtmCaptureButton: {
      '& span': {
        pointerEvents: 'none'
      }
    }
  };
});

function DownloadDataDialog() {
  var classes = useStyles(_Theme.default);
  var belowSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('xs'));
  /**
     State (from Context)
  */

  var _DownloadDataContext$ = _DownloadDataContext.default.useDownloadDataState(),
      _DownloadDataContext$2 = _slicedToArray(_DownloadDataContext$, 2),
      _DownloadDataContext$3 = _DownloadDataContext$2[0],
      dialogOpen = _DownloadDataContext$3.dialogOpen,
      productData = _DownloadDataContext$3.productData,
      manifest = _DownloadDataContext$3.manifest,
      requiredSteps = _DownloadDataContext$3.requiredSteps,
      allStepsComplete = _DownloadDataContext$3.allStepsComplete,
      fromManifest = _DownloadDataContext$3.fromManifest,
      fromAOPManifest = _DownloadDataContext$3.fromAOPManifest,
      documentation = _DownloadDataContext$3.documentation,
      s3Files = _DownloadDataContext$3.s3Files,
      sites = _DownloadDataContext$3.sites,
      dateRange = _DownloadDataContext$3.dateRange,
      packageType = _DownloadDataContext$3.packageType,
      dispatch = _DownloadDataContext$2[1];
  /**
     State (local)
  */


  var _useState = (0, _react.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      activeStepIndex = _useState2[0],
      setActiveStepIndex = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      downloadExecuted = _useState4[0],
      setDownloadExecuted = _useState4[1];
  /**
     Size estimate getter (in bytes)
  */


  var getSizeEstimateBytes = function getSizeEstimateBytes() {
    return (fromAOPManifest ? s3Files.totalSize : manifest.sizeEstimate) || 0;
  };
  /**
     External Host
  */


  var externalHost = _ExternalHost.default.getByProductCode(productData.productCode);

  var renderExternalHostInfo = function renderExternalHostInfo() {
    if (!externalHost || externalHost.hostType === _ExternalHost.default.HOST_TYPES.EXCLUSIVE_DATA) {
      return null;
    }

    return _react.default.createElement(_ExternalHostInfo.default, {
      "data-selenium": "download-data-dialog.external-host-info",
      productCode: productData.productCode,
      expandable: true
    });
  };
  /**
     Step content
  */


  var ALL_STEPS = _DownloadDataContext.default.ALL_STEPS;

  var getStep = function getStep() {
    var idx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (!requiredSteps[idx]) {
      return {};
    }

    return ALL_STEPS[requiredSteps[idx].key];
  };
  /**
     Handlers
  */


  var changeToStep = function changeToStep(stepIdx) {
    setActiveStepIndex(stepIdx);
  };

  var changeToNextUncompletedStep = function changeToNextUncompletedStep() {
    var lastStepIndex = requiredSteps.length - 1;
    var summaryIndex = requiredSteps[lastStepIndex].key === 'summary' ? lastStepIndex : null;
    var allIncompleteSteps = Object.keys(requiredSteps).map(function (idx) {
      return parseInt(idx, 10);
    }).filter(function (idx) {
      return idx !== activeStepIndex && idx !== summaryIndex && !requiredSteps[idx].isComplete;
    });

    if (activeStepIndex === lastStepIndex) {
      return null;
    }

    if (!allIncompleteSteps.length) {
      return summaryIndex ? changeToStep(summaryIndex) : null;
    } // There is at least one incomplete step.
    // If any steps are after the current active step (OTHER than summary), go there first.
    // If not then take the first incomplete step in the list.


    var laterIncompleteSteps = allIncompleteSteps.filter(function (idx) {
      return idx !== summaryIndex && idx > activeStepIndex;
    });
    return changeToStep(laterIncompleteSteps.length ? laterIncompleteSteps[0] : allIncompleteSteps[0]);
  };

  var handleCancel = function handleCancel() {
    dispatch({
      type: 'setDialogOpen',
      open: false
    });
  };

  var handleDownload = function handleDownload() {
    setDownloadExecuted(true);

    if (fromAOPManifest) {
      return (0, _manifestUtil.downloadAopManifest)(productData, s3Files, documentation.value);
    }

    if (manifest.status !== 'fetched' || !manifest.body) {
      return null;
    }

    return (0, _manifestUtil.downloadManifest)(manifest.body);
  };
  /**
     Render functions
  */


  var renderSizeEstimate = function renderSizeEstimate() {
    var alignRight = {
      style: {
        textAlign: 'right'
      }
    };
    var subtitleStyle = {
      style: {
        lineHeight: '1rem'
      }
    };

    if (fromManifest && manifest.status === 'awaitingFetchCall' || fromAOPManifest && !s3Files.isValid) {
      return '';
    }

    if (fromManifest && manifest.status === 'fetching') {
      return belowSm ? _react.default.createElement("div", {
        className: classes.startFlex
      }, _react.default.createElement(_Typography.default, {
        variant: "body2"
      }, "Estimating size..."), _react.default.createElement(_CircularProgress.default, {
        size: 16,
        style: {
          marginLeft: _Theme.default.spacing(1)
        }
      })) : _react.default.createElement("div", alignRight, _react.default.createElement(_Typography.default, _extends({
        variant: "subtitle1"
      }, subtitleStyle), "Estimating size..."), _react.default.createElement(_LinearProgress.default, {
        style: {
          marginTop: _Theme.default.spacing(1.5)
        }
      }));
    }

    if (fromManifest && manifest.status === 'fetched' && manifest.sizeEstimate > 0 || fromAOPManifest && s3Files.isValid) {
      var bytes = getSizeEstimateBytes();
      var uncompressed = fromAOPManifest ? ' (uncompressed)' : '';
      var estimateColor = bytes > _manifestUtil.DOWNLOAD_SIZE_WARN ? _Theme.COLORS.ORANGE[300] : 'inherit';
      /* eslint-disable react/jsx-one-expression-per-line */

      if (belowSm) {
        estimateColor = bytes > _manifestUtil.DOWNLOAD_SIZE_WARN ? _Theme.COLORS.ORANGE[500] : 'inherit';
        return _react.default.createElement(_Typography.default, {
          variant: "body2"
        }, "Estimated size", uncompressed, ":\xA0", _react.default.createElement("span", {
          style: {
            fontWeight: 700,
            color: estimateColor
          }
        }, (0, _manifestUtil.formatBytes)(bytes)));
      }

      return _react.default.createElement("div", alignRight, _react.default.createElement(_Typography.default, _extends({
        variant: "subtitle1"
      }, subtitleStyle), "Estimated size", uncompressed), _react.default.createElement(_Typography.default, {
        variant: "h5",
        style: {
          color: estimateColor
        }
      }, (0, _manifestUtil.formatBytes)(bytes)));
      /* eslint-enable react/jsx-one-expression-per-line */
    }

    return _react.default.createElement(_Typography.default, {
      variant: "body2",
      color: "error"
    }, "Unable to estimate size");
  };

  var renderDownloadSizeWarning = function renderDownloadSizeWarning() {
    var bytes = getSizeEstimateBytes();

    if (bytes < _manifestUtil.DOWNLOAD_SIZE_WARN) {
      return null;
    }

    var formattedBytes = (0, _manifestUtil.formatBytes)(bytes);

    var aopHardDriveLink = _react.default.createElement(_Link.default, {
      target: "_blank",
      href: "https://www.neonscience.org/data-collection/airborne-remote-sensing/aop-data-hard-drive-request"
    }, "AOP Data to Hard Drive Request");

    var aopBlurb = _react.default.createElement(_react.default.Fragment, null, "An alternate way to obtain lots of AOP data is to submit an ", aopHardDriveLink, ".");

    return _react.default.createElement(_SnackbarContent.default, {
      className: classes.warningSnackbar,
      message: _react.default.createElement("div", {
        className: classes.startFlex
      }, _react.default.createElement(_Warning.default, {
        fontSize: "large",
        className: classes.warningSnackbarIcon
      }), _react.default.createElement("div", null, _react.default.createElement(_Typography.default, {
        variant: "subtitle1"
      }, _react.default.createElement("b", null, "Be sure you have at least ", formattedBytes, " of free disk space for this download!"), _react.default.createElement("br", null), "If needed, you can reduce the download size by selecting fewer sites or a more restrictive date range. ", fromAOPManifest ? aopBlurb : null)))
    });
  };

  var renderFileType = function renderFileType() {
    if (manifest.status !== 'fetched') {
      return null;
    } // TODO: Do other file types ever come back in the manifest response?


    var fileTypes = {
      'application/zip': 'ZIP (Compressed Text)'
    };
    var mimeType = manifest.body && manifest.body.mimeType ? manifest.body.mimeType : null;
    var fileTypeText = Object.keys(fileTypes).includes(mimeType) ? fileTypes[manifest.body.mimeType] : 'Unknown';
    return _react.default.createElement(_Typography.default, {
      variant: "body2",
      "data-selenium": "download-data-dialog.file-type"
    }, "File Type:\xA0", _react.default.createElement("b", null, fileTypeText));
  }; // Not the same as the Download Data Button component!
  // This entire dialog component is launched by the Download Data Button component.
  // The button rendered here looks the same but only appears inside the dialog,
  // and actually executes the download (provided the context is in a complete state).


  var renderDownloadButton = function renderDownloadButton() {
    var disabled = true;
    var buttonText = 'Download Data';
    var iconProps = {
      style: {
        marginLeft: _Theme.default.spacing(1)
      }
    };

    var icon = _react.default.createElement(_CloudDownload.default, iconProps);

    if (allStepsComplete) {
      if (fromAOPManifest) {
        disabled = false;
      }

      if (fromManifest) {
        switch (manifest.status) {
          case 'fetched':
            disabled = false;
            break;

          case 'fetching':
            buttonText = 'Fetching File List...';
            icon = _react.default.createElement(_CircularProgress.default, _extends({
              size: 16,
              color: "inherit"
            }, iconProps));
            break;

          default:
            buttonText = 'Download Unavailable';
            icon = _react.default.createElement(_ErrorOutline.default, iconProps);
            break;
        }
      }
    }

    return _react.default.createElement(_Button.default, {
      "data-selenium": "download-data-dialog.download-button",
      "data-gtm": "download-data-dialog.download-button",
      size: "large",
      color: "primary",
      variant: "contained",
      onClick: handleDownload,
      style: {
        whiteSpace: 'nowrap'
      },
      disabled: disabled,
      className: classes.gtmCaptureButton
    }, buttonText, icon);
  };

  var renderActions = function renderActions() {
    var divClass = belowSm ? classes.startFlex : classes.endFlex;
    var showDownloadButton = fromManifest || fromAOPManifest;
    return _react.default.createElement("div", {
      className: divClass,
      style: {
        flexDirection: 'column',
        alignItems: 'flex-end'
      }
    }, _react.default.createElement("div", {
      className: divClass
    }, _react.default.createElement(_Button.default, {
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
    }, showDownloadButton ? 'Cancel' : 'Done'), showDownloadButton ? renderDownloadButton() : null), showDownloadButton && !allStepsComplete ? _react.default.createElement(_Typography.default, {
      variant: "body2",
      style: {
        marginTop: _Theme.default.spacing(1)
      }
    }, "Complete all steps to enable download") : null);
  };

  var renderStepNavButtons = function renderStepNavButtons() {
    return _react.default.createElement("div", {
      style: {
        whiteSpace: 'nowrap'
      }
    }, _react.default.createElement(_Button.default, {
      "data-selenium": "download-data-dialog.step-nav-button.previous",
      size: "small",
      color: "primary",
      variant: "outlined",
      "aria-label": "Previous",
      disabled: activeStepIndex === 0,
      onClick: function onClick() {
        return changeToStep(activeStepIndex - 1);
      }
    }, _react.default.createElement(_ChevronLeft.default, {
      style: {
        marginLeft: belowSm ? 0 : _Theme.default.spacing(-1)
      }
    }), belowSm ? null : 'Back'), _react.default.createElement(_Button.default, {
      "data-selenium": "download-data-dialog.step-nav-button.next",
      size: "small",
      color: "primary",
      variant: "outlined",
      "aria-label": "Next",
      disabled: activeStepIndex === requiredSteps.length - 1,
      style: {
        marginLeft: _Theme.default.spacing(1)
      },
      onClick: function onClick() {
        return changeToStep(activeStepIndex + 1);
      }
    }, belowSm ? null : 'Next', _react.default.createElement(_ChevronRight.default, {
      style: {
        marginRight: belowSm ? 0 : _Theme.default.spacing(-1)
      }
    })));
  };

  var renderStepper = function renderStepper() {
    if (requiredSteps.length < 2) {
      return null;
    }

    if (belowSm) {
      var maxSteps = requiredSteps.length;
      var buttonProps = {
        size: 'small',
        color: 'primary',
        variant: 'contained'
      };

      var handleBack = function handleBack() {
        return changeToStep(activeStepIndex - 1);
      };

      var handleNext = function handleNext() {
        return changeToStep(activeStepIndex + 1);
      };

      return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_MobileStepper.default, {
        steps: maxSteps,
        variant: "dots",
        activeStep: activeStepIndex,
        backButton: _react.default.createElement(_Button.default, _extends({}, buttonProps, {
          onClick: handleBack,
          disabled: activeStepIndex === 0
        }), _Theme.default.direction === 'rtl' ? _react.default.createElement(_ChevronRight.default, null) : _react.default.createElement(_ChevronLeft.default, null), "Back"),
        nextButton: _react.default.createElement(_Button.default, _extends({}, buttonProps, {
          onClick: handleNext,
          disabled: activeStepIndex === maxSteps - 1
        }), "Next", _Theme.default.direction === 'rtl' ? _react.default.createElement(_ChevronLeft.default, null) : _react.default.createElement(_ChevronRight.default, null))
      }), _react.default.createElement(_Divider.default, null));
    }

    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_Stepper.default, {
      nonLinear: true,
      "data-selenium": "download-data-dialog.stepper"
    }, requiredSteps.map(function (step, index) {
      var _getStep = getStep(index),
          label = _getStep.label;

      var buttonProps = {
        onClick: function onClick() {
          return changeToStep(index);
        }
      };

      if (step.isComplete === true && activeStepIndex !== index) {
        buttonProps.className = classes.completedInactive;
      }

      if (step.key === 'summary') {
        buttonProps.icon = _react.default.createElement(_Stars.default, {
          className: classes.summaryIcon,
          style: {
            opacity: activeStepIndex === index ? 1 : 0.5
          }
        });
      }

      return _react.default.createElement(_Step.default, {
        key: label,
        active: activeStepIndex === index,
        completed: step.isComplete === true
      }, _react.default.createElement(_StepButton.default, buttonProps, label));
    })), _react.default.createElement(_Divider.default, null));
  };

  var renderActiveStep = function renderActiveStep() {
    if (!requiredSteps.length) {
      return null;
    }

    if (requiredSteps.length < 2) {
      return _react.default.createElement(_react.default.Fragment, null, getStep(activeStepIndex).title ? _react.default.createElement("div", {
        style: {
          marginTop: _Theme.default.spacing(3)
        }
      }, _react.default.createElement(_Typography.default, {
        variant: "h5",
        style: {
          flexGrow: 1
        }
      }, getStep(activeStepIndex).title)) : null, _react.default.createElement("div", {
        style: {
          margin: _Theme.default.spacing(3, belowSm ? 0 : 5)
        }
      }, _react.default.createElement(_DownloadStepForm.default, {
        stepKey: requiredSteps[activeStepIndex].key
      })));
    }

    var titleMarker = requiredSteps[activeStepIndex].key === 'summary' ? _react.default.createElement(_Stars.default, {
      className: classes.summaryIconTitleMarker
    }) : _react.default.createElement(_Chip.default, {
      color: "primary",
      label: activeStepIndex + 1,
      className: classes.stepChip
    });
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
      className: classes.startFlex,
      style: {
        marginTop: _Theme.default.spacing(3)
      }
    }, titleMarker, _react.default.createElement(_Typography.default, {
      variant: "h5",
      style: {
        flexGrow: 1
      }
    }, getStep(activeStepIndex).title), belowSm ? null : renderStepNavButtons()), _react.default.createElement("div", {
      style: {
        margin: _Theme.default.spacing(2, belowSm ? 0 : 5)
      }
    }, _react.default.createElement(_DownloadStepForm.default, {
      stepKey: requiredSteps[activeStepIndex].key,
      changeToStep: changeToStep,
      changeToNextUncompletedStep: changeToNextUncompletedStep,
      renderDownloadButton: renderDownloadButton
    })));
  }; // Google Tag Manager variables


  var getStepsCompleted = function getStepsCompleted() {
    return requiredSteps.filter(function (step) {
      return step.isComplete === true;
    }).map(function (step) {
      return step.key;
    });
  };

  var getStepsNotCompleted = function getStepsNotCompleted() {
    return requiredSteps.filter(function (step) {
      return step.isComplete === false;
    }).map(function (step) {
      return step.key;
    });
  };

  var getStepCompletionPercentage = function getStepCompletionPercentage() {
    var completed = getStepsCompleted();
    var notCompleted = getStepsNotCompleted();
    var total = completed.length + notCompleted.length;
    return total ? completed.length / total * 100 : 0;
  };

  var getLZWCompressedConfig = function getLZWCompressedConfig() {
    if (!allStepsComplete) {
      return '';
    } // The subset of possible steps we actually want to persist in the GA event


    var eventSteps = ['sites', 'dateRange'];

    if (requiredSteps.some(function (step) {
      return step.key === 'documentation';
    })) {
      eventSteps.push('documentation');
    }

    if (requiredSteps.some(function (step) {
      return step.key === 'packageType';
    })) {
      eventSteps.push('packageType');
    } // Build the config for reporting


    var eventValues = {
      sites: sites,
      dateRange: dateRange,
      documentation: documentation,
      packageType: packageType
    };
    var eventConfig = {
      productCode: productData.productCode
    };
    eventSteps.forEach(function (step) {
      eventConfig[step] = eventValues[step].value;
    }); // Stringify, compress, and return

    return _nodeLzw.default.encode(JSON.stringify(eventConfig));
  };

  var renderGtmTags = function renderGtmTags() {
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("input", {
      type: "hidden",
      "data-gtm": "download-data-dialog.product-code",
      value: productData.productCode
    }), _react.default.createElement("input", {
      type: "hidden",
      "data-gtm": "download-data-dialog.size-estimate-bytes",
      value: getSizeEstimateBytes()
    }), _react.default.createElement("input", {
      type: "hidden",
      "data-gtm": "download-data-dialog.steps-completed",
      value: getStepsCompleted().join(', ')
    }), _react.default.createElement("input", {
      type: "hidden",
      "data-gtm": "download-data-dialog.steps-not-completed",
      value: getStepsNotCompleted().join(', ')
    }), _react.default.createElement("input", {
      type: "hidden",
      "data-gtm": "download-data-dialog.step-completion-percentage",
      value: getStepCompletionPercentage()
    }), _react.default.createElement("input", {
      type: "hidden",
      "data-gtm": "download-data-dialog.download-executed",
      value: downloadExecuted ? 1 : 0
    }), _react.default.createElement("input", {
      type: "hidden",
      "data-gtm": "download-data-dialog.lzw-compressed-config",
      value: getLZWCompressedConfig()
    }));
  };

  return _react.default.createElement(_DialogBase.default, {
    "data-selenium": "download-data-dialog",
    open: dialogOpen,
    onClose: handleCancel,
    title: fromManifest || fromAOPManifest ? 'Configure Data for Download' : 'Download Data from External Host',
    closeButtonProps: {
      'data-gtm': 'download-data-dialog.cancel-button',
      className: classes.gtmCaptureButton
    },
    toolbarChildren: fromManifest || fromAOPManifest ? _react.default.createElement(_Hidden.default, {
      xsDown: true
    }, _react.default.createElement("div", {
      "data-selenium": "download-data-dialog.size-estimate"
    }, renderSizeEstimate())) : null
  }, renderGtmTags(), _react.default.createElement(_Grid.default, {
    container: true,
    spacing: 2,
    alignItems: "center",
    style: {
      marginBottom: _Theme.default.spacing(2)
    }
  }, _react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6,
    md: 8,
    "data-selenium": "download-data-dialog.product-info"
  }, _react.default.createElement(_Typography.default, {
    variant: "h5",
    style: {
      marginBottom: _Theme.default.spacing(1)
    }
  }, productData.productName), _react.default.createElement("div", {
    className: classes.startFlex
  }, (productData.themes || []).map(function (dataTheme) {
    return _react.default.createElement("div", {
      key: dataTheme,
      style: {
        marginRight: _Theme.default.spacing(1)
      }
    }, _react.default.createElement(_DataThemeIcon.default, {
      size: 3,
      theme: dataTheme
    }));
  }), _react.default.createElement(_Typography.default, {
    variant: "subtitle2"
  }, productData.productCode))), _react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6,
    md: 4
  }, fromManifest || fromAOPManifest ? _react.default.createElement(_Hidden.default, {
    smUp: true
  }, _react.default.createElement("div", {
    style: {
      marginBottom: _Theme.default.spacing(2)
    }
  }, renderFileType(), _react.default.createElement("div", {
    "data-selenium": "download-data-dialog.size-estimate"
  }, renderSizeEstimate()))) : null, renderActions(), fromManifest || fromAOPManifest ? _react.default.createElement(_Hidden.default, {
    xsDown: true
  }, _react.default.createElement("div", {
    style: {
      marginTop: _Theme.default.spacing(1),
      textAlign: 'right'
    }
  }, renderFileType())) : null)), renderExternalHostInfo(), renderDownloadSizeWarning(), getSizeEstimateBytes() < _manifestUtil.DOWNLOAD_SIZE_WARN ? _react.default.createElement(_Divider.default, null) : null, renderStepper(), renderActiveStep());
}