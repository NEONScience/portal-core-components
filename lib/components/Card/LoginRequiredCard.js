import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import AccountValidationStepper from '../Accounts/AccountValidationStepper';
import InfoMessageCard from './InfoMessageCard';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonSignInButton from '../NeonSignInButton/NeonSignInButton';
import RouteService from '../../service/RouteService';
import { makeStyles } from '../Theme/makeStyles';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';
const useStyles = makeStyles()((theme)=>({
        loginContentsDivider: {
            margin: theme.spacing(0, 0, 2, 0)
        },
        messageContent: {
            margin: theme.spacing(0, 0, 2, 0)
        },
        card: {
            margin: theme.spacing(0.5, 0, 3, 0),
            backgroundColor: theme.colors.GOLD[50],
            borderColor: theme.colors.GOLD[300]
        },
        cardSecondaryIcon: {
            color: theme.colors.GOLD[300],
            marginLeft: theme.spacing(2)
        }
    }));
const defaultProps = {
    customTitle: undefined,
    customContent: undefined,
    isAuthenticated: false,
    showValidation: true,
    accountValidated: undefined,
    accountValidationSteps: undefined,
    accountValidationStepDisplay: undefined
};
const LoginRequiredCard = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const { customTitle, customContent, isAuthenticated, showValidation, accountValidated, accountValidationSteps, accountValidationStepDisplay } = props;
    const { classes } = useStyles();
    const hasValidationSteps = existsNonEmpty(accountValidationSteps);
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
    const renderValidation = ()=>{
        if (showValidation !== true) {
            return null;
        }
        if (exists(accountValidated) && accountValidated === true) {
            return null;
        }
        if (!hasValidationSteps) {
            return null;
        }
        return /*#__PURE__*/ _jsx(AccountValidationStepper, {
            isAuthenticated: isAuthenticated,
            accountValidated: accountValidated,
            accountValidationSteps: accountValidationSteps,
            accountValidationStepDisplay: accountValidationStepDisplay
        });
    };
    const renderContents = ()=>{
        let message;
        if (exists(customContent)) {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            message = /*#__PURE__*/ _jsx(_Fragment, {
                children: customContent
            });
        } else {
            message = /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsxs(Typography, {
                        variant: "body2",
                        className: classes.messageContent,
                        children: [
                            "You must sign in or create and validate an account before proceeding.",
                            ' ',
                            " Navigate to ",
                            myAccountLink,
                            " to sign in or create an account.",
                            ' ',
                            " ",
                            accountInfoLink,
                            " about the benefits of having an account."
                        ]
                    }),
                    !hasValidationSteps ? /*#__PURE__*/ _jsx(NeonSignInButton, {
                        disableMargin: true
                    }) : null
                ]
            });
        }
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx(Divider, {
                    className: classes.loginContentsDivider
                }),
                /*#__PURE__*/ _jsxs("div", {
                    children: [
                        message,
                        renderValidation()
                    ]
                })
            ]
        });
    };
    return /*#__PURE__*/ _jsx(InfoMessageCard, {
        ...props,
        title: isStringNonEmpty(customTitle) ? customTitle : 'Login Required',
        classes: {
            card: classes.card,
            secondaryIcon: classes.cardSecondaryIcon
        },
        messageContent: renderContents()
    });
};
export default LoginRequiredCard;
