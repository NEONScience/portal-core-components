import React from 'react';
import PropTypes from 'prop-types';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Warning';
import HomeIcon from '@mui/icons-material/Home';
import ResetIcon from '@mui/icons-material/Autorenew';

import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';

import NeonLogo from '../../images/NSF-NEON-logo.png';

const useStyles = makeStyles()((theme, { sidebarWidth }) => ({
  outerPageContainer: {
    display: 'flex',
    position: 'relative',
    minHeight: theme.spacing(30),
    borderTop: '2px solid transparent',
    paddingLeft: '0px',
    paddingRight: '0px',
    [theme.breakpoints.down('md')]: {
      paddingBottom: theme.spacing(2.5),
      flexDirection: 'column',
    },
  },
  pageContent: {
    display: 'block',
    verticalAlign: 'top',
    position: 'relative',
    padding: theme.spacing(4, 8, 12, 8),
    width: `calc(100% - ${sidebarWidth}px)`,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      display: 'block',
      padding: theme.spacing(3, 5, 8, 5),
    },
    // These override links created with a naked <a> tag, as opposed to a <Link>
    // component, to appear the same as the <Link> component. This is especially
    // useful for rendered markdown where injecting Mui Links isn't possible.
    '& a:not([class]), a[class=""]': {
      color: COLORS.LIGHT_BLUE[500],
      textDecoration: 'none',
    },
    '& a:hover:not([class]), a:hover[class=""]': {
      textDecoration: 'underline',
    },
  },
  pageTitle: {
    margin: theme.spacing(3, 0, 4, 0),
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(3, 0, 4, 0),
    },
  },
  errorPageTitleIcon: {
    marginRight: theme.spacing(1.5),
    color: theme.palette.error.dark,
    fontSize: '2.3rem',
    marginBottom: '-3px',
  },
  errorPageCaption: {
    display: 'block',
    fontSize: '1rem',
    fontFamily: 'monospace, monospace',
    marginBottom: theme.spacing(4),
  },
  errorPageLogo: {
    height: '6em',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
}));

/**
  NEON Error Page
  Shown as the fallback for a general error boundary around all NEON page instances
 */
const NeonErrorPage = (props) => {
  const {
    error: { message, stack },
    resetErrorBoundary,
  } = props;
  const { classes, theme } = useStyles({ sidebarWidth: 0 });
  // eslint-disable-next-line no-console
  console.error(stack);
  return (
    <Container className={classes.outerPageContainer}>
      <div className={classes.pageContent} data-selenium="neon-page.content">
        <img
          title="NEON Data Portal"
          alt="NEON Data Portal"
          className={classes.errorPageLogo}
          src={NeonLogo.src}
        />
        <Typography variant="h3" component="h1" className={classes.pageTitle}>
          <ErrorIcon className={classes.errorPageTitleIcon} />
          Something broke.
        </Typography>
        <div>
          <Typography variant="caption" className={classes.errorPageCaption}>
            {message}
          </Typography>
        </div>
        <div style={{ display: 'flex' }}>
          <Button startIcon={<ResetIcon />} variant="outlined" onClick={resetErrorBoundary}>
            Reset and Try Again
          </Button>
          <Button startIcon={<HomeIcon />} href="/" style={{ marginLeft: theme.spacing(4) }}>
            Return Home
          </Button>
        </div>
      </div>
      <input
        type="hidden"
        data-gtm="react-page-run-time-error.stack"
        value={`${stack}`}
      />
    </Container>
  );
};

NeonErrorPage.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    stack: PropTypes.string,
  }).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

export default NeonErrorPage;
