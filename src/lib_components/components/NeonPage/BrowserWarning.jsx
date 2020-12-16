import React, { useState } from 'react';

import Cookies from 'universal-cookie';

import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Theme from '../Theme/Theme';

/*
  Browser duck typing and warning
  We know detecting browser on user agent strings for feature gating is bad practice.
  Here, though, we just want a generic wanring if we know the browser is IE.
  Nothing else is or should be predicated on the value detected here.
  Don't make this any more complicated!
*/
const browserIsIE = navigator.userAgent.indexOf('MSIE') !== -1
  || navigator.appVersion.indexOf('Trident/') > -1;

const useStyles = makeStyles((theme) => ({
  browserWarning: {
    backgroundColor: theme.palette.error.main,
  },
  browserWarningMessage: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonRow: {
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-around',
  },
}));

const cookies = new Cookies();

const BrowserWarning = () => {
  const classes = useStyles(Theme);
  const [browserWarningOpen, setBrowserWarningOpen] = useState(browserIsIE);

  if (!browserIsIE) {
    return null;
  }

  if (cookies.get('ignoreIE11Warning')) {
    return null;
  }

  const handleBrowserWarningClose = () => {
    cookies.set('ignoreIE11Warning', true, { path: '/', maxAge: 86400 });
    setBrowserWarningOpen(false);
  };

  const buttonProps = {
    color: 'inherit',
    target: '_blank',
  };
  const message = (
    <span
      id="browser-warning"
      className={classes.browserWarningMessage}
      data-selenium="neon-page.browser-warning"
    >
      <div>
        <b>Your browser has limited support on the NEON Data Portal.</b>
        <br />
        Some parts of the portal will not work for you.
        <br />
        Please use a modern browser for full support.
        <br />
        <div className={classes.buttonRow}>
          <Button {...buttonProps} href="https://www.mozilla.org/en-US/firefox/new/">
            Firefox
          </Button>
          <Button {...buttonProps} href="https://www.google.com/chrome/">
            Chrome
          </Button>
          <Button {...buttonProps} href="https://www.apple.com/safari/">
            Safari
          </Button>
          <Button {...buttonProps} href="https://www.microsoft.com/en-us/windows/microsoft-edge">
            Edge
          </Button>
        </div>
      </div>
    </span>
  );

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      ContentProps={{ 'aria-describedby': 'browser-warning' }}
      open={browserWarningOpen}
    >
      <SnackbarContent
        className={classes.browserWarning}
        message={message}
        action={(
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={handleBrowserWarningClose}
          >
            <CloseIcon />
          </IconButton>
        )}
      />
    </Snackbar>
  );
};

export default BrowserWarning;
