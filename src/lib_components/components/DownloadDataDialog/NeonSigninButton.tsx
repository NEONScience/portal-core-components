import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import { getSignInButtonSubject } from './signInButtonState';

const useStyles = makeStyles((theme) => ({
  signInButton: {
    margin: theme.spacing(2),
  },
}));

const buttonSubject = getSignInButtonSubject();

const handleButtonClick = () => {
  // push to the subject to notify subscribers
  buttonSubject.next('clicked');
  document.location.href = NeonEnvironment.getFullAuthPath('login');
};

export default function NeonSignInButton() {
  const classes = useStyles();
  return (
    <Button variant="contained" className={classes.signInButton} color="primary" onClick={handleButtonClick}>
      Sign In
    </Button>
  );
}
