import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';

import Theme from '../Theme/Theme';

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const useStyles = makeStyles(theme => ({
  dialogTitle: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogPaper: {
    backgroundColor: theme.palette.grey[200],
    position: 'relative',
  },
  noPaper: {
    margin: theme.spacing(2),
  },
  contentPaper: {
    margin: theme.spacing(2),
    padding: theme.spacing(3),
  },
}));

const DialogBase = (props) => {
  const classes = useStyles(Theme);
  const belowSm = useMediaQuery(Theme.breakpoints.only('xs'));

  const {
    open,
    onClose,
    title,
    toolbarChildren,
    children,
    closeButtonProps,
    nopaper,
    ...other
  } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      fullScreen
      PaperProps={{
        className: classes.dialogPaper,
        style: {
          top: Theme.spacing(belowSm ? 0.5 : 4),
          height: `calc(100% - ${Theme.spacing(belowSm ? 13 : 8)}px)`,
        },
      }}
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
        <Paper className={classes.contentPaper}>
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
  nopaper: PropTypes.bool,
};

DialogBase.defaultProps = {
  open: true,
  toolbarChildren: null,
  closeButtonProps: {},
  nopaper: false,
};

export default DialogBase;
