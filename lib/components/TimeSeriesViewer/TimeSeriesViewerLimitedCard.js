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
import { isStringNonEmpty } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';
import TimeSeriesViewerContext from './TimeSeriesViewerContext';
const useStyles = makeStyles()((theme)=>({
        messageContent: {
            margin: theme.spacing(0, 0, 2, 0)
        },
        messageContentNoMargin: {
            margin: theme.spacing(0, 0, 0, 0)
        }
    }));
const defaultProps = {
    showInfoOnly: undefined
};
const TimeSeriesViewerLimitedCard = (inProps)=>{
    const { showInfoOnly } = resolveProps(defaultProps, inProps);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
    const neonContextSessionState = NeonContext.useNeonContextSessionState();
    const { classes } = useStyles();
    if (!state.isViewerLimitedMode) {
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
    const renderTitle = ()=>{
        if (isStringNonEmpty(state.release)) {
            return 'Login Required';
        }
        return 'Viewing Limited Time Series Data - Login Required';
    };
    const renderContents = ()=>{
        let details = `The time series viewer is displaying a limited dataset that does not
      reflect the actual data availability for this data product. You must sign in or create
      and validate an account before viewing the full dataset for this data product.
      `;
        if (isStringNonEmpty(state.release)) {
            details = 'You must sign in or create and validate an account before viewing release data.';
        }
        const appliedMessageContentClass = showInfoOnly === true ? classes.messageContentNoMargin : classes.messageContent;
        return /*#__PURE__*/ _jsxs(Typography, {
            variant: "body2",
            className: appliedMessageContentClass,
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
        if (showInfoOnly === true) {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return /*#__PURE__*/ _jsx(_Fragment, {});
        }
        if (neonContextSessionState.authenticated === true) {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return /*#__PURE__*/ _jsx(_Fragment, {});
        }
        return /*#__PURE__*/ _jsx(NeonSignInButton, {
            disableMargin: true
        });
    };
    return /*#__PURE__*/ _jsx(LoginRequiredCard, {
        showValidation: showInfoOnly !== true,
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
export default TimeSeriesViewerLimitedCard;
