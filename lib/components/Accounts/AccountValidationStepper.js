import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import CompletedIcon from '@mui/icons-material/CheckCircle';
import VerifiedEmailIcon from '@mui/icons-material/VerifiedUser';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import Theme from '../Theme/Theme';
import NeonSignInButton from '../NeonSignInButton/NeonSignInButton';
import RouteService from '../../service/RouteService';
import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';
import { exists, existsNonEmpty } from '../../util/typeUtil';
const myAccountLink = /*#__PURE__*/ _jsx(Link, {
    target: "_blank",
    href: NeonEnvironment.route.buildAccountRoute(),
    children: "My Account"
});
const accountInfoLink = /*#__PURE__*/ _jsx(Link, {
    target: "_blank",
    href: RouteService.getUserAccountsPath(),
    children: "Learn"
});
const VALIDATION_STEPS = {
    login: {
        displayLabel: 'Sign In',
        getContents: (completed)=>{
            if (!completed) {
                return /*#__PURE__*/ _jsxs("div", {
                    children: [
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "body2",
                            style: {
                                marginBottom: Theme.spacing(2)
                            },
                            children: "Sign in or create an account before proceeding"
                        }),
                        /*#__PURE__*/ _jsx(NeonSignInButton, {
                            disableMargin: true
                        })
                    ]
                });
            }
            return /*#__PURE__*/ _jsxs("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ _jsx(CompletedIcon, {
                        color: "primary",
                        style: {
                            marginRight: Theme.spacing(1.5)
                        }
                    }),
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "body2",
                        style: {
                            height: '24px',
                            paddingTop: '3px'
                        },
                        children: "Sign In Completed"
                    })
                ]
            });
        }
    },
    'verify-email': {
        displayLabel: 'Verify Email',
        getContents: (completed)=>{
            if (!completed) {
                return /*#__PURE__*/ _jsxs(Typography, {
                    variant: "body2",
                    children: [
                        "Navigate to ",
                        myAccountLink,
                        " to verify email"
                    ]
                });
            }
            return /*#__PURE__*/ _jsxs("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ _jsx(VerifiedEmailIcon, {
                        color: "primary",
                        style: {
                            marginRight: Theme.spacing(1.5)
                        }
                    }),
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "body2",
                        style: {
                            height: '24px',
                            paddingTop: '3px'
                        },
                        children: "Email Verified"
                    })
                ]
            });
        }
    },
    'validate-account': {
        displayLabel: 'Validate Account',
        getContents: (completed)=>{
            if (!completed) {
                return /*#__PURE__*/ _jsxs(Typography, {
                    variant: "body2",
                    children: [
                        "Validate your account by navigating to ",
                        myAccountLink,
                        " and updating your account information with all required fields."
                    ]
                });
            }
            return /*#__PURE__*/ _jsxs("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ _jsx(CompletedIcon, {
                        color: "primary",
                        style: {
                            marginRight: Theme.spacing(1.5)
                        }
                    }),
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "body2",
                        style: {
                            height: '24px',
                            paddingTop: '3px'
                        },
                        children: "Account Validated"
                    })
                ]
            });
        }
    }
};
const getAppliedSteps = (isAuthenticated, accountValidationSteps)=>{
    if (!existsNonEmpty(accountValidationSteps)) {
        return [];
    }
    const loginStep = {
        step: 'login',
        completed: isAuthenticated
    };
    return [
        loginStep,
        ...accountValidationSteps
    ];
};
const getInitialActiveStep = (accountValidationSteps)=>{
    const initialStep = accountValidationSteps.find((value)=>!value.completed);
    if (!exists(initialStep)) {
        return accountValidationSteps[0].step;
    }
    return initialStep.step;
};
const getActiveStep = (activeStep, accountValidationSteps)=>accountValidationSteps.find((value)=>value.step === activeStep);
const getActiveStepIndex = (activeStep, accountValidationSteps)=>{
    const idx = accountValidationSteps.findIndex((value)=>value.step === activeStep);
    if (idx < 0) {
        return 0;
    }
    return idx;
};
const hasStep = (activeStep, customSteps)=>exists(VALIDATION_STEPS[activeStep]) || exists(customSteps) && exists(customSteps[activeStep]);
const getStepDisplayLabel = (activeStep, customSteps)=>{
    const hasCustomStep = exists(customSteps) && exists(customSteps[activeStep]);
    if (hasCustomStep) {
        const coercedStep = customSteps[activeStep];
        return coercedStep.displayLabel;
    }
    if (exists(VALIDATION_STEPS[activeStep])) {
        return VALIDATION_STEPS[activeStep].displayLabel;
    }
    return activeStep;
};
const getStepContents = (activeStep, stepCompleted, customSteps)=>{
    const hasCustomStep = exists(customSteps) && exists(customSteps[activeStep]);
    if (hasCustomStep) {
        const coercedStep = customSteps[activeStep];
        return coercedStep.getContents(stepCompleted);
    }
    if (exists(VALIDATION_STEPS[activeStep])) {
        return VALIDATION_STEPS[activeStep].getContents(stepCompleted);
    }
    return /*#__PURE__*/ _jsx("div", {
        children: activeStep
    });
};
const useStyles = makeStyles()((theme)=>({
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
const defaultProps = {
    accountValidationStepDisplay: undefined
};
const AccountValidationStepper = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const { isAuthenticated, accountValidated, accountValidationSteps, accountValidationStepDisplay } = props;
    const appliedSteps = getAppliedSteps(isAuthenticated, accountValidationSteps);
    const { classes, theme } = useStyles();
    const belowMd = useMediaQuery(theme.breakpoints.down('md'));
    const [activeStep, setActiveStep] = useState(getInitialActiveStep(appliedSteps));
    const renderStepsCompleted = ()=>{
        if (appliedSteps.length <= 0) {
            return 'Complete all validation steps';
        }
        const numCompleted = appliedSteps.reduce((acc, item)=>acc + (item.completed === true ? 1 : 0), 0);
        if (numCompleted === appliedSteps.length) {
            return 'All steps completed';
        }
        return `${numCompleted} of ${appliedSteps.length} completed`;
    };
    const renderVerticalStepContents = ()=>{
        if (!belowMd) {
            return null;
        }
        const stepCompleted = getActiveStep(activeStep, appliedSteps)?.completed || false;
        const stepContents = hasStep(activeStep, accountValidationStepDisplay) ? getStepContents(activeStep, stepCompleted, accountValidationStepDisplay) : activeStep;
        return /*#__PURE__*/ _jsx(StepContent, {
            children: stepContents
        });
    };
    const renderHorizontalStepContents = ()=>{
        if (belowMd) {
            return null;
        }
        const stepCompleted = getActiveStep(activeStep, appliedSteps)?.completed || false;
        const stepContents = hasStep(activeStep, accountValidationStepDisplay) ? getStepContents(activeStep, stepCompleted, accountValidationStepDisplay) : activeStep;
        return /*#__PURE__*/ _jsx("div", {
            className: classes.horizontalContentsContainer,
            children: stepContents
        });
    };
    const renderValidationSteps = (steps)=>steps.map((step)=>{
            const stepDisplayLabel = hasStep(step.step, accountValidationStepDisplay) ? getStepDisplayLabel(step.step, accountValidationStepDisplay) : step.step;
            return /*#__PURE__*/ _jsxs(Step, {
                completed: step.completed,
                children: [
                    /*#__PURE__*/ _jsx(StepButton, {
                        onClick: ()=>setActiveStep(step.step),
                        children: stepDisplayLabel
                    }),
                    renderVerticalStepContents()
                ]
            }, step.step);
        });
    const renderValidation = ()=>{
        if (exists(accountValidated) && accountValidated === true) {
            return null;
        }
        if (!existsNonEmpty(appliedSteps)) {
            return null;
        }
        return /*#__PURE__*/ _jsxs("div", {
            className: classes.validationStepsRoot,
            children: [
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "subtitle2",
                    children: "Account Validation Steps"
                }),
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "caption",
                    children: renderStepsCompleted()
                }),
                /*#__PURE__*/ _jsxs(Typography, {
                    variant: "body2",
                    className: classes.accountValidationNotesContainer,
                    children: [
                        accountInfoLink,
                        " about account validation."
                    ]
                }),
                /*#__PURE__*/ _jsx(Divider, {
                    className: classes.stepperTopDivider
                }),
                /*#__PURE__*/ _jsx(Stepper, {
                    nonLinear: true,
                    orientation: belowMd ? 'vertical' : 'horizontal',
                    activeStep: getActiveStepIndex(activeStep, appliedSteps),
                    className: classes.validationStepperRoot,
                    children: renderValidationSteps(appliedSteps)
                }),
                belowMd ? null : /*#__PURE__*/ _jsx(Divider, {
                    className: classes.stepperBottomDivider
                }),
                renderHorizontalStepContents()
            ]
        });
    };
    return /*#__PURE__*/ _jsx("div", {
        children: renderValidation()
    });
};
export default AccountValidationStepper;
