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

export interface NeonSignInButtonProps {
  disableMargin?: boolean;
}

const NeonSignInButton = (props: NeonSignInButtonProps) => {
  const { disableMargin }: NeonSignInButtonProps = props;
  const classes = useStyles();
  let appliedClass: string|undefined = classes.signInButton;
  if (disableMargin === true) {
    appliedClass = undefined;
  }
  return (
    <Button
      variant="contained"
      className={appliedClass}
      color="primary"
      onClick={handleButtonClick}
    >
      Sign In
    </Button>
  );
};

NeonSignInButton.defaultProps = {
  disableMargin: undefined,
};

export default NeonSignInButton;
