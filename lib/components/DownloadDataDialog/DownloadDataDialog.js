'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = DownloadDataDialog;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styles = require('@material-ui/core/styles');

var _useMediaQuery = require('@material-ui/core/useMediaQuery');

var _useMediaQuery2 = _interopRequireDefault(_useMediaQuery);

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Chip = require('@material-ui/core/Chip');

var _Chip2 = _interopRequireDefault(_Chip);

var _CircularProgress = require('@material-ui/core/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _Divider = require('@material-ui/core/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _Grid = require('@material-ui/core/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Hidden = require('@material-ui/core/Hidden');

var _Hidden2 = _interopRequireDefault(_Hidden);

var _LinearProgress = require('@material-ui/core/LinearProgress');

var _LinearProgress2 = _interopRequireDefault(_LinearProgress);

var _Link = require('@material-ui/core/Link');

var _Link2 = _interopRequireDefault(_Link);

var _MobileStepper = require('@material-ui/core/MobileStepper');

var _MobileStepper2 = _interopRequireDefault(_MobileStepper);

var _SnackbarContent = require('@material-ui/core/SnackbarContent');

var _SnackbarContent2 = _interopRequireDefault(_SnackbarContent);

var _Stepper = require('@material-ui/core/Stepper');

var _Stepper2 = _interopRequireDefault(_Stepper);

var _Step = require('@material-ui/core/Step');

var _Step2 = _interopRequireDefault(_Step);

var _StepButton = require('@material-ui/core/StepButton');

var _StepButton2 = _interopRequireDefault(_StepButton);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _Stars = require('@material-ui/icons/Stars');

var _Stars2 = _interopRequireDefault(_Stars);

var _CloudDownload = require('@material-ui/icons/CloudDownload');

var _CloudDownload2 = _interopRequireDefault(_CloudDownload);

var _ErrorOutline = require('@material-ui/icons/ErrorOutline');

var _ErrorOutline2 = _interopRequireDefault(_ErrorOutline);

var _ChevronLeft = require('@material-ui/icons/ChevronLeft');

var _ChevronLeft2 = _interopRequireDefault(_ChevronLeft);

var _ChevronRight = require('@material-ui/icons/ChevronRight');

var _ChevronRight2 = _interopRequireDefault(_ChevronRight);

var _Warning = require('@material-ui/icons/Warning');

var _Warning2 = _interopRequireDefault(_Warning);

var _DialogBase = require('../DialogBase/DialogBase');

var _DialogBase2 = _interopRequireDefault(_DialogBase);

var _DownloadStepForm = require('../DownloadStepForm/DownloadStepForm');

var _DownloadStepForm2 = _interopRequireDefault(_DownloadStepForm);

var _DownloadDataContext = require('../DownloadDataContext/DownloadDataContext');

var _DownloadDataContext2 = _interopRequireDefault(_DownloadDataContext);

var _DataThemeIcon = require('../DataThemeIcon/DataThemeIcon');

var _DataThemeIcon2 = _interopRequireDefault(_DataThemeIcon);

var _ExternalHost = require('../ExternalHost/ExternalHost');

var _ExternalHost2 = _interopRequireDefault(_ExternalHost);

var _ExternalHostInfo = require('../ExternalHostInfo/ExternalHostInfo');

var _ExternalHostInfo2 = _interopRequireDefault(_ExternalHostInfo);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

var _manifestUtil = require('../../util/manifestUtil');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      border: '1px solid ' + theme.palette.primary.main + '80',
      margin: _Theme2.default.spacing(0.5, 0, 2, 0),
      padding: _Theme2.default.spacing(0, 2),
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
  var classes = useStyles(_Theme2.default);
  var belowSm = (0, _useMediaQuery2.default)(_Theme2.default.breakpoints.only('xs'));

  /**
     State (from Context)
  */

  var _DownloadDataContext$ = _DownloadDataContext2.default.useDownloadDataState(),
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
  var externalHost = _ExternalHost2.default.getByProductCode(productData.productCode);
  var renderExternalHostInfo = function renderExternalHostInfo() {
    if (!externalHost || externalHost.hostType === _ExternalHost2.default.HOST_TYPES.EXCLUSIVE_DATA) {
      return null;
    }
    return _react2.default.createElement(_ExternalHostInfo2.default, {
      'data-selenium': 'download-data-dialog.external-host-info',
      productCode: productData.productCode,
      expandable: true
    });
  };

  /**
     Step content
  */
  var ALL_STEPS = _DownloadDataContext2.default.ALL_STEPS;

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
    }
    // There is at least one incomplete step.
    // If any steps are after the current active step (OTHER than summary), go there first.
    // If not then take the first incomplete step in the list.
    var laterIncompleteSteps = allIncompleteSteps.filter(function (idx) {
      return idx !== summaryIndex && idx > activeStepIndex;
    });
    return changeToStep(laterIncompleteSteps.length ? laterIncompleteSteps[0] : allIncompleteSteps[0]);
  };

  var handleCancel = function handleCancel() {
    dispatch({ type: 'setDialogOpen', open: false });
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
    var alignRight = { style: { textAlign: 'right' } };
    var subtitleStyle = { style: { lineHeight: '1rem' } };
    if (fromManifest && manifest.status === 'awaitingFetchCall' || fromAOPManifest && !s3Files.isValid) {
      return '';
    }
    if (fromManifest && manifest.status === 'fetching') {
      return belowSm ? _react2.default.createElement(
        'div',
        { className: classes.startFlex },
        _react2.default.createElement(
          _Typography2.default,
          { variant: 'body2' },
          'Estimating size...'
        ),
        _react2.default.createElement(_CircularProgress2.default, { size: 16, style: { marginLeft: _Theme2.default.spacing(1) } })
      ) : _react2.default.createElement(
        'div',
        alignRight,
        _react2.default.createElement(
          _Typography2.default,
          _extends({ variant: 'subtitle1' }, subtitleStyle),
          'Estimating size...'
        ),
        _react2.default.createElement(_LinearProgress2.default, { style: { marginTop: _Theme2.default.spacing(1.5) } })
      );
    }
    if (fromManifest && manifest.status === 'fetched' && manifest.sizeEstimate > 0 || fromAOPManifest && s3Files.isValid) {
      var bytes = getSizeEstimateBytes();
      var uncompressed = fromAOPManifest ? ' (uncompressed)' : '';
      var estimateColor = bytes > _manifestUtil.DOWNLOAD_SIZE_WARN ? _Theme.COLORS.ORANGE[300] : 'inherit';
      /* eslint-disable react/jsx-one-expression-per-line */
      if (belowSm) {
        estimateColor = bytes > _manifestUtil.DOWNLOAD_SIZE_WARN ? _Theme.COLORS.ORANGE[500] : 'inherit';
        return _react2.default.createElement(
          _Typography2.default,
          { variant: 'body2' },
          'Estimated size',
          uncompressed,
          ':\xA0',
          _react2.default.createElement(
            'span',
            { style: { fontWeight: 700, color: estimateColor } },
            (0, _manifestUtil.formatBytes)(bytes)
          )
        );
      }
      return _react2.default.createElement(
        'div',
        alignRight,
        _react2.default.createElement(
          _Typography2.default,
          _extends({ variant: 'subtitle1' }, subtitleStyle),
          'Estimated size',
          uncompressed
        ),
        _react2.default.createElement(
          _Typography2.default,
          { variant: 'h5', style: { color: estimateColor } },
          (0, _manifestUtil.formatBytes)(bytes)
        )
      );
      /* eslint-enable react/jsx-one-expression-per-line */
    }
    return _react2.default.createElement(
      _Typography2.default,
      { variant: 'body2', color: 'error' },
      'Unable to estimate size'
    );
  };

  var renderDownloadSizeWarning = function renderDownloadSizeWarning() {
    var bytes = getSizeEstimateBytes();
    if (bytes < _manifestUtil.DOWNLOAD_SIZE_WARN) {
      return null;
    }
    var formattedBytes = (0, _manifestUtil.formatBytes)(bytes);
    var aopHardDriveLink = _react2.default.createElement(
      _Link2.default,
      {
        target: '_blank',
        href: 'https://www.neonscience.org/data-collection/airborne-remote-sensing/aop-data-hard-drive-request'
      },
      'AOP Data to Hard Drive Request'
    );
    var aopBlurb = _react2.default.createElement(
      _react2.default.Fragment,
      null,
      'An alternate way to obtain lots of AOP data is to submit an ',
      aopHardDriveLink,
      '.'
    );
    return _react2.default.createElement(_SnackbarContent2.default, {
      className: classes.warningSnackbar,
      message: _react2.default.createElement(
        'div',
        { className: classes.startFlex },
        _react2.default.createElement(_Warning2.default, { fontSize: 'large', className: classes.warningSnackbarIcon }),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            _Typography2.default,
            { variant: 'subtitle1' },
            _react2.default.createElement(
              'b',
              null,
              'Be sure you have at least ',
              formattedBytes,
              ' of free disk space for this download!'
            ),
            _react2.default.createElement('br', null),
            'If needed, you can reduce the download size by selecting fewer sites or a more restrictive date range. ',
            fromAOPManifest ? aopBlurb : null
          )
        )
      )
    });
  };

  var renderFileType = function renderFileType() {
    if (manifest.status !== 'fetched') {
      return null;
    }
    // TODO: Do other file types ever come back in the manifest response?
    var fileTypes = {
      'application/zip': 'ZIP (Compressed Text)'
    };
    var mimeType = manifest.body && manifest.body.mimeType ? manifest.body.mimeType : null;
    var fileTypeText = Object.keys(fileTypes).includes(mimeType) ? fileTypes[manifest.body.mimeType] : 'Unknown';
    return _react2.default.createElement(
      _Typography2.default,
      { variant: 'body2', 'data-selenium': 'download-data-dialog.file-type' },
      'File Type:\xA0',
      _react2.default.createElement(
        'b',
        null,
        fileTypeText
      )
    );
  };

  // Not the same as the Download Data Button component!
  // This entire dialog component is launched by the Download Data Button component.
  // The button rendered here looks the same but only appears inside the dialog,
  // and actually executes the download (provided the context is in a complete state).
  var renderDownloadButton = function renderDownloadButton() {
    var disabled = true;
    var buttonText = 'Download Data';
    var iconProps = {
      style: { marginLeft: _Theme2.default.spacing(1) }
    };
    var icon = _react2.default.createElement(_CloudDownload2.default, iconProps);
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
            icon = _react2.default.createElement(_CircularProgress2.default, _extends({ size: 16, color: 'inherit' }, iconProps));
            break;
          default:
            buttonText = 'Download Unavailable';
            icon = _react2.default.createElement(_ErrorOutline2.default, iconProps);
            break;
        }
      }
    }
    return _react2.default.createElement(
      _Button2.default,
      {
        'data-selenium': 'download-data-dialog.download-button',
        'data-gtm': 'download-data-dialog.download-button',
        size: 'large',
        color: 'primary',
        variant: 'contained',
        onClick: handleDownload,
        style: { whiteSpace: 'nowrap' },
        disabled: disabled,
        className: classes.gtmCaptureButton
      },
      buttonText,
      icon
    );
  };

  var renderActions = function renderActions() {
    var divClass = belowSm ? classes.startFlex : classes.endFlex;
    var showDownloadButton = fromManifest || fromAOPManifest;
    return _react2.default.createElement(
      'div',
      { className: divClass, style: { flexDirection: 'column', alignItems: 'flex-end' } },
      _react2.default.createElement(
        'div',
        { className: divClass },
        _react2.default.createElement(
          _Button2.default,
          {
            'data-selenium': 'download-data-dialog.cancel-button',
            'data-gtm': 'download-data-dialog.cancel-button',
            size: 'large',
            color: 'primary',
            variant: 'outlined',
            onClick: handleCancel,
            style: { marginRight: _Theme2.default.spacing(showDownloadButton ? 1 : 0) },
            className: classes.gtmCaptureButton
          },
          showDownloadButton ? 'Cancel' : 'Done'
        ),
        showDownloadButton ? renderDownloadButton() : null
      ),
      showDownloadButton && !allStepsComplete ? _react2.default.createElement(
        _Typography2.default,
        { variant: 'body2', style: { marginTop: _Theme2.default.spacing(1) } },
        'Complete all steps to enable download'
      ) : null
    );
  };

  var renderStepNavButtons = function renderStepNavButtons() {
    return _react2.default.createElement(
      'div',
      { style: { whiteSpace: 'nowrap' } },
      _react2.default.createElement(
        _Button2.default,
        {
          'data-selenium': 'download-data-dialog.step-nav-button.previous',
          size: 'small',
          color: 'primary',
          variant: 'outlined',
          'aria-label': 'Previous',
          disabled: activeStepIndex === 0,
          onClick: function onClick() {
            return changeToStep(activeStepIndex - 1);
          }
        },
        _react2.default.createElement(_ChevronLeft2.default, { style: { marginLeft: belowSm ? 0 : _Theme2.default.spacing(-1) } }),
        belowSm ? null : 'Back'
      ),
      _react2.default.createElement(
        _Button2.default,
        {
          'data-selenium': 'download-data-dialog.step-nav-button.next',
          size: 'small',
          color: 'primary',
          variant: 'outlined',
          'aria-label': 'Next',
          disabled: activeStepIndex === requiredSteps.length - 1,
          style: { marginLeft: _Theme2.default.spacing(1) },
          onClick: function onClick() {
            return changeToStep(activeStepIndex + 1);
          }
        },
        belowSm ? null : 'Next',
        _react2.default.createElement(_ChevronRight2.default, { style: { marginRight: belowSm ? 0 : _Theme2.default.spacing(-1) } })
      )
    );
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
      return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(_MobileStepper2.default, {
          steps: maxSteps,
          variant: 'dots',
          activeStep: activeStepIndex,
          backButton: _react2.default.createElement(
            _Button2.default,
            _extends({}, buttonProps, {
              onClick: handleBack,
              disabled: activeStepIndex === 0
            }),
            _Theme2.default.direction === 'rtl' ? _react2.default.createElement(_ChevronRight2.default, null) : _react2.default.createElement(_ChevronLeft2.default, null),
            'Back'
          ),
          nextButton: _react2.default.createElement(
            _Button2.default,
            _extends({}, buttonProps, {
              onClick: handleNext,
              disabled: activeStepIndex === maxSteps - 1
            }),
            'Next',
            _Theme2.default.direction === 'rtl' ? _react2.default.createElement(_ChevronLeft2.default, null) : _react2.default.createElement(_ChevronRight2.default, null)
          )
        }),
        _react2.default.createElement(_Divider2.default, null)
      );
    }
    return _react2.default.createElement(
      _react2.default.Fragment,
      null,
      _react2.default.createElement(
        _Stepper2.default,
        { nonLinear: true, 'data-selenium': 'download-data-dialog.stepper' },
        requiredSteps.map(function (step, index) {
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
            buttonProps.icon = _react2.default.createElement(_Stars2.default, {
              className: classes.summaryIcon,
              style: { opacity: activeStepIndex === index ? 1 : 0.5 }
            });
          }
          return _react2.default.createElement(
            _Step2.default,
            {
              key: label,
              active: activeStepIndex === index,
              completed: step.isComplete === true
            },
            _react2.default.createElement(
              _StepButton2.default,
              buttonProps,
              label
            )
          );
        })
      ),
      _react2.default.createElement(_Divider2.default, null)
    );
  };

  var renderActiveStep = function renderActiveStep() {
    if (!requiredSteps.length) {
      return null;
    }
    if (requiredSteps.length < 2) {
      return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        getStep(activeStepIndex).title ? _react2.default.createElement(
          'div',
          { style: { marginTop: _Theme2.default.spacing(3) } },
          _react2.default.createElement(
            _Typography2.default,
            { variant: 'h5', style: { flexGrow: 1 } },
            getStep(activeStepIndex).title
          )
        ) : null,
        _react2.default.createElement(
          'div',
          { style: { margin: _Theme2.default.spacing(3, belowSm ? 0 : 5) } },
          _react2.default.createElement(_DownloadStepForm2.default, { stepKey: requiredSteps[activeStepIndex].key })
        )
      );
    }
    var titleMarker = requiredSteps[activeStepIndex].key === 'summary' ? _react2.default.createElement(_Stars2.default, { className: classes.summaryIconTitleMarker }) : _react2.default.createElement(_Chip2.default, { color: 'primary', label: activeStepIndex + 1, className: classes.stepChip });
    return _react2.default.createElement(
      _react2.default.Fragment,
      null,
      _react2.default.createElement(
        'div',
        { className: classes.startFlex, style: { marginTop: _Theme2.default.spacing(3) } },
        titleMarker,
        _react2.default.createElement(
          _Typography2.default,
          { variant: 'h5', style: { flexGrow: 1 } },
          getStep(activeStepIndex).title
        ),
        belowSm ? null : renderStepNavButtons()
      ),
      _react2.default.createElement(
        'div',
        { style: { margin: _Theme2.default.spacing(2, belowSm ? 0 : 5) } },
        _react2.default.createElement(_DownloadStepForm2.default, {
          stepKey: requiredSteps[activeStepIndex].key,
          changeToStep: changeToStep,
          changeToNextUncompletedStep: changeToNextUncompletedStep,
          renderDownloadButton: renderDownloadButton
        })
      )
    );
  };

  // Google Tag Manager variables
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
  var renderGtmTags = function renderGtmTags() {
    return _react2.default.createElement(
      _react2.default.Fragment,
      null,
      _react2.default.createElement('input', { type: 'hidden', 'data-gtm': 'download-data-dialog.product-code', value: productData.productCode }),
      _react2.default.createElement('input', { type: 'hidden', 'data-gtm': 'download-data-dialog.size-estimate-bytes', value: getSizeEstimateBytes() }),
      _react2.default.createElement('input', { type: 'hidden', 'data-gtm': 'download-data-dialog.steps-completed', value: getStepsCompleted().join(', ') }),
      _react2.default.createElement('input', { type: 'hidden', 'data-gtm': 'download-data-dialog.steps-not-completed', value: getStepsNotCompleted().join(', ') }),
      _react2.default.createElement('input', { type: 'hidden', 'data-gtm': 'download-data-dialog.step-completion-percentage', value: getStepCompletionPercentage() }),
      _react2.default.createElement('input', { type: 'hidden', 'data-gtm': 'download-data-dialog.download-executed', value: downloadExecuted ? 1 : 0 })
    );
  };

  return _react2.default.createElement(
    _DialogBase2.default,
    {
      'data-selenium': 'download-data-dialog',
      open: dialogOpen,
      onClose: handleCancel,
      title: fromManifest || fromAOPManifest ? 'Configure Data for Download' : 'Download Data from External Host',
      closeButtonProps: {
        'data-gtm': 'download-data-dialog.cancel-button',
        className: classes.gtmCaptureButton
      },
      toolbarChildren: fromManifest || fromAOPManifest ? _react2.default.createElement(
        _Hidden2.default,
        { xsDown: true },
        _react2.default.createElement(
          'div',
          { 'data-selenium': 'download-data-dialog.size-estimate' },
          renderSizeEstimate()
        )
      ) : null
    },
    renderGtmTags(),
    _react2.default.createElement(
      _Grid2.default,
      { container: true, spacing: 2, alignItems: 'center', style: { marginBottom: _Theme2.default.spacing(2) } },
      _react2.default.createElement(
        _Grid2.default,
        { item: true, xs: 12, sm: 6, md: 8, 'data-selenium': 'download-data-dialog.product-info' },
        _react2.default.createElement(
          _Typography2.default,
          { variant: 'h5', style: { marginBottom: _Theme2.default.spacing(1) } },
          productData.productName
        ),
        _react2.default.createElement(
          'div',
          { className: classes.startFlex },
          (productData.themes || []).map(function (dataTheme) {
            return _react2.default.createElement(
              'div',
              { key: dataTheme, style: { marginRight: _Theme2.default.spacing(1) } },
              _react2.default.createElement(_DataThemeIcon2.default, { size: 3, theme: dataTheme })
            );
          }),
          _react2.default.createElement(
            _Typography2.default,
            { variant: 'subtitle2' },
            productData.productCode
          )
        )
      ),
      _react2.default.createElement(
        _Grid2.default,
        { item: true, xs: 12, sm: 6, md: 4 },
        fromManifest || fromAOPManifest ? _react2.default.createElement(
          _Hidden2.default,
          { smUp: true },
          _react2.default.createElement(
            'div',
            { style: { marginBottom: _Theme2.default.spacing(2) } },
            renderFileType(),
            _react2.default.createElement(
              'div',
              { 'data-selenium': 'download-data-dialog.size-estimate' },
              renderSizeEstimate()
            )
          )
        ) : null,
        renderActions(),
        fromManifest || fromAOPManifest ? _react2.default.createElement(
          _Hidden2.default,
          { xsDown: true },
          _react2.default.createElement(
            'div',
            { style: { marginTop: _Theme2.default.spacing(1), textAlign: 'right' } },
            renderFileType()
          )
        ) : null
      )
    ),
    renderExternalHostInfo(),
    renderDownloadSizeWarning(),
    getSizeEstimateBytes() < _manifestUtil.DOWNLOAD_SIZE_WARN ? _react2.default.createElement(_Divider2.default, null) : null,
    renderStepper(),
    renderActiveStep()
  );
}