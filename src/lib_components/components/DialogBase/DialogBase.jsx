import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';

import Theme from '../Theme/Theme';

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const useStyles = (belowSm) => makeStyles((theme) => ({
  dialogTitle: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogPaper: {
    backgroundColor: theme.palette.grey[200],
    position: 'relative',
  },
  noPaper: {
    margin: theme.spacing(10, 2, belowSm ? 9 : 2, 2),
  },
  contentPaper: {
    margin: theme.spacing(10, 2, belowSm ? 9 : 2, 2),
    padding: theme.spacing(3),
  },
}));

const DialogBase = (props) => {
  const belowSm = useMediaQuery(Theme.breakpoints.only('xs'));
  const classes = useStyles(belowSm)(Theme);

  const {
    open,
    onClose,
    title,
    toolbarChildren,
    children,
    closeButtonProps,
    customClasses,
    nopaper,
    style,
    ...other
  } = props;

  const appliedPaperClass = (customClasses && customClasses.contentPaper)
    ? customClasses.contentPaper
    : classes.contentPaper;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      fullScreen
      PaperProps={{
        className: classes.dialogPaper,
      }}
      style={{ ...style, zIndex: Theme.zIndex.fullScreenBackdrop }}
      {...other}
    >
      <AppBar color="secondary">
        <Toolbar>
          <IconButton
            data-selenium="dialog-close-button"
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="cancel"
            {...closeButtonProps}
            size="large"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" className={classes.dialogTitle} noWrap>
            {title}
          </Typography>
          {toolbarChildren}
        </Toolbar>
      </AppBar>
      {nopaper ? (
        <div className={classes.noPaper}>
          {children}
        </div>
      ) : (
        <Paper className={appliedPaperClass}>
          {children}
        </Paper>
      )}
    </Dialog>
  );
};

DialogBase.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  toolbarChildren: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ])),
    PropTypes.node,
    PropTypes.string,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ])),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  closeButtonProps: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  ),
  customClasses: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
    ]),
  ),
  nopaper: PropTypes.bool,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

DialogBase.defaultProps = {
  open: true,
  toolbarChildren: null,
  closeButtonProps: {},
  customClasses: {},
  nopaper: false,
  style: {},
};

export default DialogBase;
