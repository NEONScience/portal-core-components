import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import NeonEnvironment from '../NeonEnvironment';

const useStyles = makeStyles((theme) => ({
  signInButton: {
    margin: theme.spacing(2),
  },
}));

const handleButtonClick = () => {
  document.location.href = NeonEnvironment.getFullAuthPath('login');
};

export default function SigninModal() {
  const classes = useStyles();
  return (
    <>
      <Button variant="contained" className={classes.signInButton} color="primary" onClick={handleButtonClick}>
        Sign In
      </Button>
    </>
  );
}
