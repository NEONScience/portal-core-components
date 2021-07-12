import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import NeonEnvironment from '../NeonEnvironment';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    // backgroundColor: theme.palette.background.paper,
    backgroundColor: '#1b67b3',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
  },
  signInButton: {
    margin: theme.spacing(2),
  },
  signInBox: {
    maxWidth: 400,
    minHeight: 600,
    margin: 0,
    padding: 0,
    border: 'none',
    scrolling: 'yes',
  },
}));

export default function SigninModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, call only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="button" variant="contained" onClick={handleOpen} className={classes.signInButton}>
        Sign In
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-label="Neon Sign In"
      >
        <div style={modalStyle} className={classes.paper}>
          <iframe
            id="signInBox"
            className={classes.signInBox}
            title="Neon Sign In"
            src={NeonEnvironment.getFullAuthPath('login')}
          />
        </div>
      </Modal>
    </>
  );
}
