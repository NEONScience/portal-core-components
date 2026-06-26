"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _Stepper = _interopRequireDefault(require("@material-ui/core/Stepper"));
var _Step = _interopRequireDefault(require("@material-ui/core/Step/Step"));
var _StepContent = _interopRequireDefault(require("@material-ui/core/StepContent"));
var _StepButton = _interopRequireDefault(require("@material-ui/core/StepButton"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));
var _styles = require("@material-ui/core/styles");
var _CheckCircle = _interopRequireDefault(require("@material-ui/icons/CheckCircle"));
var _VerifiedUser = _interopRequireDefault(require("@material-ui/icons/VerifiedUser"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _NeonSignInButton = _interopRequireDefault(require("../NeonSignInButton/NeonSignInButton"));
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const myAccountLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
  target: "_blank",
  href: _NeonEnvironment.default.route.buildAccountRoute()
}, "My Account");
const accountInfoLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
  target: "_blank",
  href: _RouteService.default.getUserAccountsPath()
}, "Learn");
const VALIDATION_STEPS = {
  login: {
    displayLabel: 'Sign In',
    getContents: completed => {
      if (!completed) {
        return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "body2",
          style: {
            marginBottom: _Theme.default.spacing(2)
          }
        }, "Sign in or create an account before proceeding"), /*#__PURE__*/_react.default.createElement(_NeonSignInButton.default, {
          disableMargin: true
        }));
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      }, /*#__PURE__*/_react.default.createElement(_CheckCircle.default, {
        color: "primary",
        style: {
          marginRight: _Theme.default.spacing(1.5)
        }
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2",
        style: {
          height: '24px',
          paddingTop: '3px'
        }
      }, "Sign In Completed"));
    }
  },
  'verify-email': {
    displayLabel: 'Verify Email',
    getContents: completed => {
      if (!completed) {
        return /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "body2"
        }, "Navigate to ", myAccountLink, " to verify email");
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      }, /*#__PURE__*/_react.default.createElement(_VerifiedUser.default, {
        color: "primary",
        style: {
          marginRight: _Theme.default.spacing(1.5)
        }
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2",
        style: {
          height: '24px',
          paddingTop: '3px'
        }
      }, "Email Verified"));
    }
  },
  'validate-account': {
    displayLabel: 'Validate Account',
    getContents: completed => {
      if (!completed) {
        return /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "body2"
        }, "Validate your account by navigating to ", myAccountLink, " and updating your account information with all required fields.");
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      }, /*#__PURE__*/_react.default.createElement(_CheckCircle.default, {
        color: "primary",
        style: {
          marginRight: _Theme.default.spacing(1.5)
        }
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2",
        style: {
          height: '24px',
          paddingTop: '3px'
        }
      }, "Account Validated"));
    }
  }
};
const getAppliedSteps = (isAuthenticated, accountValidationSteps) => {
  if (!(0, _typeUtil.existsNonEmpty)(accountValidationSteps)) {
    return [];
  }
  const loginStep = {
    step: 'login',
    completed: isAuthenticated
  };
  return [loginStep, ...accountValidationSteps];
};
const getInitialActiveStep = accountValidationSteps => {
  const initialStep = accountValidationSteps.find(value => !value.completed);
  if (!(0, _typeUtil.exists)(initialStep)) {
    return accountValidationSteps[0].step;
  }
  return initialStep.step;
};
const getActiveStep = (activeStep, accountValidationSteps) => accountValidationSteps.find(value => value.step === activeStep);
const getActiveStepIndex = (activeStep, accountValidationSteps) => {
  const idx = accountValidationSteps.findIndex(value => value.step === activeStep);
  if (idx < 0) {
    return 0;
  }
  return idx;
};
const hasStep = (activeStep, customSteps) => (0, _typeUtil.exists)(VALIDATION_STEPS[activeStep]) || (0, _typeUtil.exists)(customSteps) && (0, _typeUtil.exists)(customSteps[activeStep]);
const getStepDisplayLabel = (activeStep, customSteps) => {
  const hasCustomStep = (0, _typeUtil.exists)(customSteps) && (0, _typeUtil.exists)(customSteps[activeStep]);
  if (hasCustomStep) {
    const coercedStep = customSteps[activeStep];
    return coercedStep.displayLabel;
  }
  if ((0, _typeUtil.exists)(VALIDATION_STEPS[activeStep])) {
    return VALIDATION_STEPS[activeStep].displayLabel;
  }
  return activeStep;
};
const getStepContents = (activeStep, stepCompleted, customSteps) => {
  const hasCustomStep = (0, _typeUtil.exists)(customSteps) && (0, _typeUtil.exists)(customSteps[activeStep]);
  if (hasCustomStep) {
    const coercedStep = customSteps[activeStep];
    return coercedStep.getContents(stepCompleted);
  }
  if ((0, _typeUtil.exists)(VALIDATION_STEPS[activeStep])) {
    return VALIDATION_STEPS[activeStep].getContents(stepCompleted);
  }
  return /*#__PURE__*/_react.default.createElement("div", null, activeStep);
};
const useStyles = (0, _styles.makeStyles)(theme => (0, _styles.createStyles)({
  accountValidationNotesContainer: {
    margin: theme.spacing(1, 0, 0, 0)
  },
  stepperTopDivider: {
    margin: theme.spacing(2, 0, 0, 0)
  },
  stepperBottomDivider: {
    margin: theme.spacing(1, 0, 2, 0)
  },
  validationStepsRoot: {
    width: '100%',
    margin: theme.spacing(2, 0, 0, 0)
  },
  validationStepperRoot: {
    margin: theme.spacing(1, 0, 0, 0),
    backgroundColor: 'transparent'
  },
  horizontalContentsContainer: {
    margin: theme.spacing(0, 0, 0, 4)
  }
}));
const AccountValidationStepper = props => {
  const {
    isAuthenticated,
    accountValidated,
    accountValidationSteps,
    accountValidationStepDisplay
  } = props;
  const appliedSteps = getAppliedSteps(isAuthenticated, accountValidationSteps);
  const classes = useStyles(_Theme.default);
  const belowMd = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('md'));
  const [activeStep, setActiveStep] = (0, _react.useState)(getInitialActiveStep(appliedSteps));
  const renderStepsCompleted = () => {
    if (appliedSteps.length <= 0) {
      return 'Complete all validation steps';
    }
    const numCompleted = appliedSteps.reduce((acc, item) => acc + (item.completed === true ? 1 : 0), 0);
    if (numCompleted === appliedSteps.length) {
      return 'All steps completed';
    }
    return "".concat(numCompleted, " of ").concat(appliedSteps.length, " completed");
  };
  const renderVerticalStepContents = () => {
    var _getActiveStep;
    if (!belowMd) {
      return null;
    }
    const stepCompleted = ((_getActiveStep = getActiveStep(activeStep, appliedSteps)) === null || _getActiveStep === void 0 ? void 0 : _getActiveStep.completed) || false;
    const stepContents = hasStep(activeStep, accountValidationStepDisplay) ? getStepContents(activeStep, stepCompleted, accountValidationStepDisplay) : activeStep;
    return /*#__PURE__*/_react.default.createElement(_StepContent.default, null, stepContents);
  };
  const renderHorizontalStepContents = () => {
    var _getActiveStep2;
    if (belowMd) {
      return null;
    }
    const stepCompleted = ((_getActiveStep2 = getActiveStep(activeStep, appliedSteps)) === null || _getActiveStep2 === void 0 ? void 0 : _getActiveStep2.completed) || false;
    const stepContents = hasStep(activeStep, accountValidationStepDisplay) ? getStepContents(activeStep, stepCompleted, accountValidationStepDisplay) : activeStep;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.horizontalContentsContainer
    }, stepContents);
  };
  const renderValidationSteps = steps => steps.map(step => {
    const stepDisplayLabel = hasStep(step.step, accountValidationStepDisplay) ? getStepDisplayLabel(step.step, accountValidationStepDisplay) : step.step;
    return /*#__PURE__*/_react.default.createElement(_Step.default, {
      key: step.step,
      completed: step.completed
    }, /*#__PURE__*/_react.default.createElement(_StepButton.default, {
      onClick: () => setActiveStep(step.step),
      completed: step.completed
    }, stepDisplayLabel), renderVerticalStepContents());
  });
  const renderValidation = () => {
    if ((0, _typeUtil.exists)(accountValidated) && accountValidated === true) {
      return null;
    }
    if (!(0, _typeUtil.existsNonEmpty)(appliedSteps)) {
      return null;
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.validationStepsRoot
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Account Validation Steps"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, renderStepsCompleted()), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      className: classes.accountValidationNotesContainer
    }, accountInfoLink, " about account validation."), /*#__PURE__*/_react.default.createElement(_Divider.default, {
      className: classes.stepperTopDivider
    }), /*#__PURE__*/_react.default.createElement(_Stepper.default, {
      nonLinear: true,
      orientation: belowMd ? 'vertical' : 'horizontal',
      activeStep: getActiveStepIndex(activeStep, appliedSteps),
      className: classes.validationStepperRoot
    }, renderValidationSteps(appliedSteps)), belowMd ? null : /*#__PURE__*/_react.default.createElement(_Divider.default, {
      className: classes.stepperBottomDivider
    }), renderHorizontalStepContents());
  };
  return /*#__PURE__*/_react.default.createElement("div", null, renderValidation());
};
AccountValidationStepper.defaultProps = {
  accountValidationStepDisplay: undefined
};
var _default = exports.default = AccountValidationStepper;