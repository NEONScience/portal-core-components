import React from 'react';
import Button from '@mui/material/Button';

import AuthService from '../NeonAuth/AuthService';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonSignInButtonState from './NeonSignInButtonState';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  signInButton: {
    margin: theme.spacing(2),
  },
}));

const handleButtonClick = () => {
  // Notify observers the sign in button has been clicked.
  NeonSignInButtonState.sendNotification();
  AuthService.login(
    NeonEnvironment.getFullAuthPath('login'),
    AuthService.getLoginRedirectUri(),
  );
};

export default function NeonSignInButton() {
  const { classes } = useStyles();
  return (
    <Button
      variant="contained"
      className={classes.signInButton}
      color="primary"
      onClick={handleButtonClick}
    >
      Sign In
    </Button>
  );
}
