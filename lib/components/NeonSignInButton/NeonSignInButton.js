import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import Button from '@mui/material/Button';
import AuthService from '../NeonAuth/AuthService';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonSignInButtonState from './NeonSignInButtonState';
import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';
const useStyles = makeStyles()((theme)=>({
        signInButton: {
            margin: theme.spacing(2)
        }
    }));
const handleButtonClick = ()=>{
    // Notify observers the sign in button has been clicked.
    NeonSignInButtonState.sendNotification();
    AuthService.login(NeonEnvironment.getFullAuthPath('login'), AuthService.getLoginRedirectUri());
};
const defaultProps = {
    disableMargin: undefined
};
const NeonSignInButton = (inProps)=>{
    const { disableMargin } = resolveProps(defaultProps, inProps);
    const { classes } = useStyles();
    let appliedClass = classes.signInButton;
    if (disableMargin === true) {
        appliedClass = undefined;
    }
    return /*#__PURE__*/ _jsx(Button, {
        variant: "contained",
        className: appliedClass,
        color: "primary",
        onClick: handleButtonClick,
        children: "Sign In"
    });
};
export default NeonSignInButton;
