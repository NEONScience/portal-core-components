import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import LoginRequiredCard from '../Card/LoginRequiredCard';
import NeonContext from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonSignInButton from '../NeonSignInButton/NeonSignInButton';
import RouteService from '../../service/RouteService';
import { makeStyles } from '../Theme/makeStyles';
import SaeDataViewerContext from './SaeDataViewerContext';
const useStyles = makeStyles()((theme)=>({
        messageContent: {
            margin: theme.spacing(0, 0, 2, 0)
        }
    }));
const SaeDataViewerLimitedCard = ()=>{
    const state = SaeDataViewerContext.useSaeDataViewerContextState();
    const neonContextSessionState = NeonContext.useNeonContextSessionState();
    const { classes } = useStyles();
    if (!state.isViewerLimitedMode || !neonContextSessionState.ready) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return /*#__PURE__*/ _jsx(_Fragment, {});
    }
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
    const renderTitle = ()=>'Viewing Limited SAE Viewer Data - Login Required';
    const renderContents = ()=>{
        const details = `The SAE viewer is displaying a limited dataset that does not
      reflect the actual data availability for SAE data products. You must sign in or create
      and validate an account before viewing the full set of SAE data available.
      `;
        return /*#__PURE__*/ _jsxs(Typography, {
            variant: "body2",
            className: classes.messageContent,
            children: [
                details,
                ' ',
                " Navigate to ",
                myAccountLink,
                " to sign in or create an account.",
                ' ',
                " ",
                accountInfoLink,
                " about the benefits of having an account."
            ]
        });
    };
    const renderSignInButton = ()=>{
        if (neonContextSessionState.authenticated === true) {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return /*#__PURE__*/ _jsx(_Fragment, {});
        }
        return /*#__PURE__*/ _jsx(NeonSignInButton, {
            disableMargin: true
        });
    };
    return /*#__PURE__*/ _jsx(LoginRequiredCard, {
        showValidation: true,
        customTitle: renderTitle(),
        customContent: /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                renderContents(),
                renderSignInButton()
            ]
        }),
        isAuthenticated: neonContextSessionState.authenticated,
        accountValidated: neonContextSessionState.accountValidated,
        accountValidationSteps: neonContextSessionState.accountValidationSteps
    });
};
export default SaeDataViewerLimitedCard;
