import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import AuthService from '../NeonAuth/AuthService';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonSignInButtonState from './NeonSignInButtonState';

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();
  return (
    <Button variant="contained" className={classes.signInButton} color="primary" onClick={handleButtonClick}>
      Sign In
    </Button>
  );
}
