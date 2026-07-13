import React from 'react';
import Button from '@mui/material/Button';

import AuthService from '../NeonAuth/AuthService';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonSignInButtonState from './NeonSignInButtonState';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { resolveProps } from '../../util/defaultProps';

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

export interface NeonSignInButtonProps {
  disableMargin?: boolean;
}

const defaultProps = {
  disableMargin: undefined,
};

const NeonSignInButton = (inProps: NeonSignInButtonProps) => {
  const { disableMargin } = resolveProps(defaultProps, inProps) as NeonSignInButtonProps;
  const { classes } = useStyles();
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

export default NeonSignInButton;
