import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Cookies from 'universal-cookie';

import uniqueId from 'lodash/uniqueId';

import { Subject } from 'rxjs';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Warning';
import Skeleton from '@material-ui/lab/Skeleton';

import Theme, { COLORS } from '../Theme/Theme';
import NeonHeader from '../NeonHeader/NeonHeader';
import NeonFooter from '../NeonFooter/NeonFooter';
import NeonContext from '../NeonContext/NeonContext';
import BrowserWarning from './BrowserWarning';
import LiferayNotifications from './LiferayNotifications';

import { getJson } from '../../util/rxUtil';
import {
  generateNotificationId,
  getLiferayNotificationsApiPath,
} from '../../util/liferayNotificationsUtil';

const cookies = new Cookies();

// Global CSS
const GlobalCss = withStyles({
  '@global': {
    code: {
      fontSize: '115%',
      padding: Theme.spacing(0.25, 0.5),
      backgroundColor: 'rgba(0, 0, 0, 0.11)',
    },
  },
})(() => null);

// Google Tag Manager Data Layer
// Define if not already defined. This must be set in the public/index.html for any apps/pages that
// would seek top use it. More info: https://developers.google.com/tag-manager/devguide
if (!window.gtmDataLayer) {
  window.gtmDataLayer = [];
}

const useStyles = makeStyles(theme => ({
  outerPageContainer: {
    position: 'relative',
    minHeight: theme.spacing(30),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(2.5),
    },
  },
  pageContainer: {
    maxWidth: '2000px',
    padding: theme.spacing(3, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5, 2.5),
    },
    // These override links created with a naked <a> tag, as opposed to a <Link>
    // component, to appear the same as the <Link> component. This is especially
    // useful for rendered markdown where injecting Mui Links isn't possible.
    '& a:not([class]), a[class=""]': {
      color: COLORS.LIGHT_BLUE[500], // MUST come from COLORS, not palette
      textDecoration: 'none',
    },
    '& a:hover:not([class]), a:hover[class=""]': {
      textDecoration: 'underline',
    },
  },
  pageOverlay: {
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    position: 'absolute',
    minHeight: theme.spacing(30),
    top: '0px',
    left: '0px',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: theme.spacing(12, 3, 3, 3),
    zIndex: 10000,
  },
  pageOverlayPaper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    padding: theme.spacing(3),
    position: 'sticky',
    top: theme.spacing(12),
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '70%',
    [theme.breakpoints.up('lg')]: {
      width: '50%',
    },
  },
  pageTitle: {
    // The font size at larger breakpoints introduces noticeable letter spacing before
    // the first letter in the title. The negative left margins nudge it back into alignment.
    margin: theme.spacing(3, 0, 4, -0.25),
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(3, 0, 4, -0.5),
    },
  },
  pageSubtitle: {
    maxWidth: '660px',
    color: COLORS.GREY[500],
    lineHeight: '1.5',
    fontSize: '1.1rem',
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(4),
  },
}));

const DRUPAL_CSS_URL = 'https://master-7rqtwti-di4alr4iwbwyg.us-2.platformsh.site/themes/custom/neon/build/components/theme/theme.css';

const NeonPage = (props) => {
  const {
    breadcrumbs,
    title,
    subtitle,
    children,
    loading,
    progress,
    error,
    notification,
    outerPageContainerMaxWidth,
    useCoreHeader,
  } = props;
  const classes = useStyles(Theme);
  const [{ isActive: neonContextIsActive }] = NeonContext.useNeonContextState();

  /**
     Drupal CSS Loading
  */
  const [drupalCssLoaded, setDrupalCssLoaded] = useState(false);
  useEffect(() => {
    if (useCoreHeader || drupalCssLoaded) { return; }
    setDrupalCssLoaded(true);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = DRUPAL_CSS_URL;
    document.body.appendChild(link);
  }, [drupalCssLoaded, setDrupalCssLoaded]);

  /**
     Liferay Notifications
   */
  const cancellationSubject$ = new Subject();
  const notificationDismissals = cookies.get('dismissed-notifications') || [];

  let initialFetchStatus = null;
  let initialNotifications = [];
  if (notification !== null && notification.length) {
    const notificationPropId = generateNotificationId(notification);
    initialFetchStatus = 'success';
    initialNotifications = [{
      id: notificationPropId,
      message: notification,
      dismissed: notificationDismissals.includes(notificationPropId),
    }];
  }

  const [fetchNotificationsStatus, setFetchNotificationsStatus] = useState(initialFetchStatus);
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleFetchNotificationsSuccess = (response) => {
    setFetchNotificationsStatus('success');
    if (!Array.isArray(response.notifications)) { return; }
    setNotifications(
      response.notifications.map((message) => {
        const id = generateNotificationId(message);
        const dismissed = notificationDismissals.includes(id);
        return { id, message, dismissed };
      }),
    );
  };

  // If the endpoint fails don't bother with any visible error. Just let it go.
  const handleFetchNotificationsError = () => {
    setFetchNotificationsStatus('error');
    setNotifications([]);
  };

  const handleHideNotifications = () => {
    const updatedDismissals = notifications.map(n => n.id);
    cookies.set('dismissed-notifications', updatedDismissals, { path: '/', maxAge: 86400 });
    setNotifications(notifications.map(n => ({ ...n, dismissed: true })));
  };

  const handleShowNotifications = () => {
    cookies.remove('dismissed-notifications');
    setNotifications(notifications.map(n => ({ ...n, dismissed: false })));
  };

  useEffect(() => {
    if (fetchNotificationsStatus !== null) { return; }
    setFetchNotificationsStatus('fetching');
    getJson(
      getLiferayNotificationsApiPath(),
      handleFetchNotificationsSuccess,
      handleFetchNotificationsError,
      cancellationSubject$,
    );
  }, [fetchNotificationsStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
     Render functions
   */
  const renderTitle = () => {
    if ((loading || error) && !title) {
      return (
        <Skeleton width="45%" height={24} style={{ margin: Theme.spacing(2, 0, 4, 0) }} />
      );
    }
    if (!title || !title.length) {
      return null;
    }
    return (
      <React.Fragment>
        <Typography
          data-selenium="neon-page.title"
          variant="h3"
          component="h1"
          className={classes.pageTitle}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            data-selenium="neon-page.subtitle"
            variant="subtitle1"
            component="p"
            className={classes.pageSubtitle}
          >
            {subtitle}
          </Typography>
        ) : null}
      </React.Fragment>
    );
  };

  const renderBreadcrumbs = () => (!breadcrumbs.length ? null : (
    <Breadcrumbs
      separator="›"
      aria-label="Breadcrumbs"
      variant="overline"
      data-selenium="neon-page.breadcrumbs"
    >
      <Link color="inherit" key={uniqueId()} href="/">
        Home
      </Link>
      {breadcrumbs.map(
        (breadcrumb, idx) => (idx !== breadcrumbs.length - 1
          ? (<Link key={uniqueId()} color="inherit" href={breadcrumb.href}>{breadcrumb.name}</Link>)
          : (<Typography key="{idx}" color="textPrimary">{breadcrumb.name}</Typography>)),
      )}
    </Breadcrumbs>
  ));

  const renderOverlay = overlayChildren => (
    <div className={classes.pageOverlay}>
      <Paper className={classes.pageOverlayPaper}>
        {overlayChildren}
      </Paper>
    </div>
  );

  const renderLoading = () => (!loading || error ? null : renderOverlay(
    <React.Fragment>
      <Typography variant="h6" component="h3" gutterBottom>
        {loading}
      </Typography>
      {progress === null ? (
        <CircularProgress />
      ) : (
        <CircularProgress variant="static" value={progress} />
      )}
    </React.Fragment>,
  ));

  const renderError = () => (!error ? null : renderOverlay(
    <React.Fragment>
      <ErrorIcon fontSize="large" color="error" />
      <Typography variant="h6" component="h3" style={{ marginTop: Theme.spacing(1) }}>
        {error}
      </Typography>
    </React.Fragment>,
  ));

  const renderNeonPage = () => {
    const outerPageContainerStyles = outerPageContainerMaxWidth ? {
      maxWidth: outerPageContainerMaxWidth,
    } : null;
    return (
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <GlobalCss />
        <NeonHeader
          useCoreHeader
          notifications={notifications}
          onShowNotifications={handleShowNotifications}
        />
        <Container className={classes.outerPageContainer} styles={outerPageContainerStyles}>
          <Container className={classes.pageContainer} data-selenium="neon-page.content">
            {renderBreadcrumbs()}
            {renderTitle()}
            {children}
          </Container>
          {renderLoading()}
          {renderError()}
          <LiferayNotifications
            notifications={notifications}
            onHideNotifications={handleHideNotifications}
          />
          <BrowserWarning />
        </Container>
        <NeonFooter />
      </ThemeProvider>
    );
  };

  return neonContextIsActive ? renderNeonPage() : (
    <NeonContext.Provider useCoreAuth>
      {renderNeonPage()}
    </NeonContext.Provider>
  );
};

NeonPage.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string,
    }),
  ),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  loading: PropTypes.string,
  progress: PropTypes.number,
  error: PropTypes.string,
  notification: PropTypes.string,
  outerPageContainerMaxWidth: PropTypes.string,
  useCoreHeader: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ])),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};

NeonPage.defaultProps = {
  breadcrumbs: [],
  title: null,
  subtitle: null,
  loading: null,
  progress: null,
  error: null,
  notification: null,
  outerPageContainerMaxWidth: '2000px',
  useCoreHeader: false,
};

export default NeonPage;
