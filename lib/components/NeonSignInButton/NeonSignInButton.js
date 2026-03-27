import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import AuthService from '../NeonAuth/AuthService';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonSignInButtonState from './NeonSignInButtonState';
const useStyles = makeStyles((theme)=>({
        signInButton: {
            margin: theme.spacing(2)
        }
    }));
const handleButtonClick = ()=>{
    // Notify observers the sign in button has been clicked.
    NeonSignInButtonState.sendNotification();
    AuthService.login(NeonEnvironment.getFullAuthPath('login'), AuthService.getLoginRedirectUri());
};
export default function NeonSignInButton() {
    const classes = useStyles();
    return /*#__PURE__*/ _jsx(Button, {
        variant: "contained",
        className: classes.signInButton,
        color: "primary",
        onClick: handleButtonClick,
        children: "Sign In"
    });
}
