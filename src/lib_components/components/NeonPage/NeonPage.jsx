import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Cookies from 'universal-cookie';

import uniq from 'lodash/uniq';

import { Subject } from 'rxjs';

import { makeStyles } from '@material-ui/core/styles';
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
import BrowserWarning from './BrowserWarning';
import LiferayNotifications from './LiferayNotifications';

import { getJson } from '../../util/rxUtil';
import {
  generateNotificationId,
  getLiferayNotificationsApiPath,
} from '../../util/liferayNotificationsUtil';

const cookies = new Cookies();

// Google Tag Manager Data Layer
// Define if not already defined. This must be set in the public/index.html for any apps/pages that
// would seek top use it. More info: https://developers.google.com/tag-manager/devguide
if (!window.gtmDataLayer) {
  window.gtmDataLayer = [];
}

const createUseStyles = props => (makeStyles(theme => ({
  outerPageContainer: {
    position: 'relative',
    minHeight: theme.spacing(30),
    maxWidth: props.outerPageContainerMaxWidth,
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
      color: COLORS.SECONDARY_BLUE[500], // MUST come from COLORS, not palette
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
    margin: theme.spacing(1, 0, 3, -0.25),
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(1, 0, 3, -0.5),
    },
  },
})));

const NeonPage = (props) => {
  const {
    breadcrumbs,
    title,
    children,
    loading,
    progress,
    error,
    notification,
    outerPageContainerMaxWidth,
  } = props;
  const useStylesProps = {
    theme: Theme,
    outerPageContainerMaxWidth,
  };
  const useStyles = createUseStyles(props);
  const classes = useStyles(useStylesProps);

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
      <Typography
        data-selenium="neon-page.title"
        variant="h3"
        component="h1"
        className={classes.pageTitle}
      >
        {title}
      </Typography>
    );
  };

  const renderBreadcrumbs = () => (!breadcrumbs.length ? null : (
    <Breadcrumbs
      separator="›"
      aria-label="Breadcrumbs"
      variant="overline"
      data-selenium="neon-page.breadcrumbs"
    >
      <Link color="inherit" key={uniq()} href="/">
        Home
      </Link>
      {breadcrumbs.map(
        (breadcrumb, idx) => (idx !== breadcrumbs.length - 1
          ? (<Link key={uniq()} color="inherit" href={breadcrumb.href}>{breadcrumb.name}</Link>)
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

  return (
    <React.Fragment>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <NeonHeader
          notifications={notifications}
          onShowNotifications={handleShowNotifications}
        />
        <Container className={classes.outerPageContainer}>
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
    </React.Fragment>
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
  loading: PropTypes.string,
  progress: PropTypes.number,
  error: PropTypes.string,
  notification: PropTypes.string,
  outerPageContainerMaxWidth: PropTypes.string,
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
  loading: null,
  progress: null,
  error: null,
  notification: null,
  outerPageContainerMaxWidth: '2000px',
};

export default NeonPage;
