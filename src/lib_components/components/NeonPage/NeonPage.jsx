import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';

import Cookies from 'universal-cookie';

import uniqueId from 'lodash/uniqueId';

import { Subject } from 'rxjs';

import { ErrorBoundary } from 'react-error-boundary';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Backdrop from '@material-ui/core/Backdrop';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ClearIcon from '@material-ui/icons/Clear';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import ErrorIcon from '@material-ui/icons/Warning';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import HomeIcon from '@material-ui/icons/Home';
import ResetIcon from '@material-ui/icons/Autorenew';

import Skeleton from '@material-ui/lab/Skeleton';

import REMOTE_ASSETS from '../../remoteAssetsMap/remoteAssetsMap';
import Theme, { COLORS } from '../Theme/Theme';
import NeonHeader from '../NeonHeader/NeonHeader';
import NeonFooter from '../NeonFooter/NeonFooter';
import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';
import BrowserWarning from './BrowserWarning';
import LiferayNotifications from './LiferayNotifications';

import { getJson } from '../../util/rxUtil';
import {
  generateNotificationId,
  getLiferayNotificationsApiPath,
} from '../../util/liferayNotificationsUtil';

import NeonLogo from '../../images/NSF-NEON-logo.png';

const DRUPAL_THEME_CSS = REMOTE_ASSETS.DRUPAL_THEME_CSS.KEY;

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

// Function to determine if we're effectively scrolled to the bottom of the page. Used to set
// current sidebar link to the last one automatically when the associated content for the last link
// can't be scrolled past (i.e. is not taller than the page height less the footer height)
const isAtMaxScroll = () => {
  const windowHeight = window.innerHeight
    || (document.documentElement || document.body).clientHeight;
  const documentHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight,
  );
  const scrollTop = window.pageYOffset
    || (document.documentElement || document.body.parentNode || document.body).scrollTop;
  const trackLength = documentHeight - windowHeight;
  return (scrollTop / trackLength) >= 0.99;
};

// Google Tag Manager Data Layer
// Define if not already defined. This must be set in the public/index.html for any apps/pages that
// would seek top use it. More info: https://developers.google.com/tag-manager/devguide
if (!window.gtmDataLayer) {
  window.gtmDataLayer = [];
}

// NOTE: because these are defined outside the ThemeProvider any theme vars must come directly from
// the Theme import, unlike most other useStyles() instances where the Theme import is passed to the
// hook as an argument.
const useStyles = makeStyles(() => ({
  outerPageContainer: {
    position: 'relative',
    minHeight: Theme.spacing(30),
    borderTop: '2px solid transparent',
    paddingLeft: '0px',
    paddingRight: '0px',
    [Theme.breakpoints.up('md')]: {
      display: 'table',
      tableLayout: 'fixed',
    },
    [Theme.breakpoints.down('sm')]: {
      paddingBottom: Theme.spacing(2.5),
      flexDirection: 'column',
    },
  },
  pageContent: {
    display: 'table-cell',
    verticalAlign: 'top',
    position: 'relative',
    padding: Theme.spacing(4, 8, 12, 8),
    [Theme.breakpoints.down('sm')]: {
      display: 'block',
      padding: Theme.spacing(3, 5, 8, 5),
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
  breadcrumbs: {
    margin: Theme.spacing(2, 0, 4, 0),
    [Theme.breakpoints.down('sm')]: {
      margin: Theme.spacing(1, 0, 2, 0),
    },
  },
  sidebarContainer: {
    display: 'table-cell',
    verticalAlign: 'top',
    backgroundColor: COLORS.GREY[50],
    padding: Theme.spacing(5, 4),
    [Theme.breakpoints.down('sm')]: {
      display: 'inline-block',
      width: '100%',
      maxHeight: 'calc(100vh - 84px)',
      padding: Theme.spacing(2.5, 2),
      position: 'sticky',
      top: '-2px',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
      zIndex: 2,
    },
    [Theme.breakpoints.down('xs')]: {
      padding: Theme.spacing(1.5),
    },
  },
  sidebarInnerStickyContainer: {
    position: 'sticky',
    top: '40px',
  },
  sidebarTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebarTitle: {
    fontWeight: 700,
    [Theme.breakpoints.down('sm')]: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    [Theme.breakpoints.only('sm')]: {
      marginRight: Theme.spacing(1.5),
    },
  },
  sidebarSubtitle: {
    color: COLORS.GREY[300],
    marginTop: Theme.spacing(1),
    [Theme.breakpoints.down('sm')]: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      marginTop: '0px',
    },
    [Theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  sidebarTitlesContainer: {
    minWidth: '0px',
    paddingRight: Theme.spacing(1),
    [Theme.breakpoints.only('sm')]: {
      display: 'flex',
      alignItems: 'baseline',
    },
  },
  sidebarLink: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '0.9rem',
    marginBottom: '12px',
  },
  sidebarLinkCurrent: {
    fontWeight: 700,
    color: COLORS.GREY[500],
    textDecoration: 'none',
    '&:hover': {
      transition: 'all 0.45s',
      color: COLORS.GREY[900],
    },
  },
  sidebarLinkIcon: {
    marginBottom: '-5px',
    marginRight: '5px',
    fontSize: '1.3rem',
  },
  sidebarLinksContainer: {
    flex: '1 1 auto',
    overflowY: 'auto',
    minHeight: '0px',
  },
  sidebarDivider: {
    margin: '24px 0px',
    [Theme.breakpoints.down('sm')]: {
      margin: '16px 0px',
    },
    [Theme.breakpoints.down('xs')]: {
      margin: '8px 0px 12px 0px',
    },
  },
  backdropPaper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '4px',
    padding: Theme.spacing(3),
    position: 'sticky',
    top: Theme.spacing(12),
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '70%',
    [Theme.breakpoints.up('lg')]: {
      width: '50%',
    },
  },
  pageTitle: {
    margin: Theme.spacing(3, 0, 4, 0),
    [Theme.breakpoints.up('sm')]: {
      margin: Theme.spacing(3, 0, 4, 0),
    },
  },
  pageSubtitle: {
    maxWidth: '660px',
    color: COLORS.GREY[500],
    lineHeight: '1.5',
    fontSize: '1.1rem',
    marginTop: Theme.spacing(-1),
    marginBottom: Theme.spacing(4),
  },
  errorPageTitleIcon: {
    marginRight: Theme.spacing(1.5),
    color: Theme.palette.error.dark,
    fontSize: '2.3rem',
    marginBottom: '-3px',
  },
  errorPageCaption: {
    display: 'block',
    fontSize: '1rem',
    fontFamily: 'monospace, monospace',
    marginBottom: Theme.spacing(4),
  },
  errorPageLogo: {
    height: '6em',
    marginTop: Theme.spacing(3),
    marginBottom: Theme.spacing(4),
  },
  dismissOverlay: {
    width: '100%',
    textAlign: 'right',
    marginTop: Theme.spacing(2),
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
  const classes = useStyles();
  // eslint-disable-next-line no-console
  console.error(stack);
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <GlobalCss />
      <Container className={classes.outerPageContainer}>
        <div className={classes.pageContent} data-selenium="neon-page.content">
          <img
            title="NEON Data Portal"
            alt="NEON Data Portal"
            className={classes.errorPageLogo}
            src={NeonLogo}
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
            <Button startIcon={<HomeIcon />} href="/" style={{ marginLeft: Theme.spacing(4) }}>
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
    </ThemeProvider>
  );
};

NeonErrorPage.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    stack: PropTypes.string,
  }).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

const NeonPage = (props) => {
  const {
    breadcrumbHomeHref,
    breadcrumbs,
    customHeader,
    customFooter,
    error,
    loading,
    notification,
    outerPageContainerMaxWidth,
    progress,
    resetStateAfterRuntimeError,
    sidebarContent,
    sidebarContainerClassName: sidebarContainerClassNameProp,
    sidebarLinks,
    sidebarLinksAdditionalContent,
    sidebarLinksAsStandaloneChildren: sidebarLinksAsStandaloneChildrenProp,
    sidebarSubtitle,
    sidebarTitle,
    sidebarWidth,
    sidebarUnsticky,
    subtitle,
    title,
    useCoreHeader,
    unstickyDrupalHeader,
    NeonContextProviderProps,
    children,
  } = props;

  const classes = useStyles();
  const [{ isActive: neonContextIsActive }] = NeonContext.useNeonContextState();
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const sidebarRef = useRef(null);
  const sidebarLinksContainerRef = useRef(null);
  const belowMd = useMediaQuery(Theme.breakpoints.down('sm'));
  const [overlayDismissed, setOverlayDismissed] = useState(false);

  /**
    Sidebar Setup
  */
  // Sidebar can have content OR links, not both. If both are set then content wins.
  const hasSidebarContent = sidebarContent !== null;
  const hasSidebarLinks = !sidebarContent && Array.isArray(sidebarLinks) && sidebarLinks.length > 0;
  const hasSidebar = hasSidebarContent || hasSidebarLinks;
  // sidebarLinksAsStandaloneChildren can only be true if all sidebar links have a defined component
  const sidebarLinksAsStandaloneChildren = hasSidebarLinks && sidebarLinksAsStandaloneChildrenProp
    ? sidebarLinks.every((link) => link.component)
    : false;
  const sidebarHashMap = !hasSidebarLinks ? {} : Object.fromEntries(
    sidebarLinks.map((link, idx) => [link.hash || '#', idx]),
  );
  const initialCurrentSidebarHash = hasSidebarLinks ? sidebarLinks[0].hash || '#' : '#';
  const [currentSidebarHash, setCurrentSidebarHash] = useState(initialCurrentSidebarHash);
  const [hashInitialized, setHashInitialized] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // for small viewports only

  // Get the vertical pixel offset for the content associated to any sidebar link by hash
  const getSidebarLinkScrollPosition = useCallback((hash) => {
    if (!hasSidebarLinks || sidebarLinksAsStandaloneChildren || !contentRef.current) { return -1; }
    const headerOffset = (headerRef.current || {}).offsetHeight || 0;
    const stickyOffset = belowMd ? (sidebarRef.current || {}).offsetHeight || 0 : 0;
    if (hash === '#') { return 0; }
    const anchor = contentRef.current.querySelector(hash);
    return !anchor ? -1 : anchor.offsetTop + headerOffset - stickyOffset - Theme.spacing(5);
  }, [hasSidebarLinks, sidebarLinksAsStandaloneChildren, belowMd]);

  /**
     Effect - For sidebarLinks pages, on successful load, if hash is present then update the current
  */
  useLayoutEffect(() => {
    if (error || loading || !hasSidebarLinks) { return () => {}; }
    const handleHashChange = () => {
      const { hash } = document.location;
      if (currentSidebarHash === hash) { return; }
      setCurrentSidebarHash(hash);
      // If standard sidebar mode (scroll to content) also perform the scroll offset here
      if (!sidebarLinksAsStandaloneChildren) {
        window.setTimeout(() => {
          window.scrollTo(0, getSidebarLinkScrollPosition(hash));
        }, 0);
      }
    };
    // Handle URL-defined hash on initial load
    if (document.location.hash && !hashInitialized) {
      // Ensure the document hash maps to a defined hash or '#' at all times
      if (!Object.keys(sidebarHashMap).includes(document.location.hash)) {
        document.location.hash = '#';
      }
      handleHashChange();
      setHashInitialized(true);
    }
    // Set max-height on sidebar links container when the sidebar is sticky so the links get
    // a dedicated scrollbar instead of clipping
    if (!sidebarUnsticky && hasSidebarLinks && sidebarLinksContainerRef.current) {
      const maxHeight = window.innerHeight - sidebarLinksContainerRef.current.offsetTop - 104;
      sidebarLinksContainerRef.current.style.maxHeight = `${maxHeight}px`;
    }
    // For sidebarLinksAsStandaloneChildren listen for hash changes to trigger a "redirect".
    if (sidebarLinksAsStandaloneChildren) {
      window.addEventListener('hashchange', handleHashChange);
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
      };
    }
    // Set up event listener / handler for user-input scroll events for standard scrolling pages
    const handleScroll = () => {
      const scrollBreaks = sidebarLinks.map((link) => ({
        y: getSidebarLinkScrollPosition(link.hash || '#'),
        hash: link.hash || '#',
      }));
      // Determine the current scrolled-to hash. If at the max scroll always go to the last hash.
      // Otherwise choose from scroll position relative to scroll breakpoints.
      const detectionBuffer = 80; // Extra pixels to highlight the next link when we're close enough
      const currentScrolledHash = isAtMaxScroll()
        ? scrollBreaks[scrollBreaks.length - 1].hash
        : scrollBreaks.reduce((acc, curr) => (
          (curr.y !== -1 && window.scrollY >= curr.y - detectionBuffer) ? curr.hash : acc
        ), sidebarLinks[0].hash || '#');
      if (currentScrolledHash !== currentSidebarHash) {
        setCurrentSidebarHash(currentScrolledHash);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    error,
    loading,
    sidebarLinks,
    sidebarHashMap,
    sidebarUnsticky,
    hasSidebarLinks,
    hashInitialized,
    setHashInitialized,
    currentSidebarHash,
    setCurrentSidebarHash,
    sidebarLinksContainerRef,
    getSidebarLinkScrollPosition,
    sidebarLinksAsStandaloneChildren,
  ]);

  /**
     Effect - Load Drupal CSS
  */
  const [drupalCssStatus, setDrupalCssStatus] = useState(FETCH_STATUS.AWAITING_CALL);
  useEffect(() => {
    if (useCoreHeader || drupalCssStatus !== FETCH_STATUS.AWAITING_CALL) { return; }
    setDrupalCssStatus(FETCH_STATUS.FETCHING);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = REMOTE_ASSETS[DRUPAL_THEME_CSS].url;
    link.crossOrigin = 'anonymous';
    link.onload = (() => {
      setDrupalCssStatus(FETCH_STATUS.SUCCESS);
    });
    link.onerror = (() => {
      // eslint-disable-next-line no-unused-expressions
      import('../../remoteAssets/drupal-theme.css');
      // Assume this local import worked and still report the load as successful
      // We do this because props on header and footer express whether the CSS is loaded and we want
      // to simplify that as a boolean. The header and footer don't care where the CSS came from
      // so long as it's there.
      setDrupalCssStatus(FETCH_STATUS.SUCCESS);
    });
    document.body.appendChild(link);
  }, [useCoreHeader, drupalCssStatus, setDrupalCssStatus]);

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

  // Handle a successful response from the notifications endpoint
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
    const updatedDismissals = notifications.map((n) => n.id);
    cookies.set('dismissed-notifications', updatedDismissals, { path: '/', maxAge: 86400 });
    setNotifications(notifications.map((n) => ({ ...n, dismissed: true })));
  };

  const handleShowNotifications = () => {
    cookies.remove('dismissed-notifications');
    setNotifications(notifications.map((n) => ({ ...n, dismissed: false })));
  };

  /**
     Effect - Fetch notifications
  */
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
    if ((!title || !title.length) && !sidebarLinksAsStandaloneChildren) {
      return null;
    }
    let titleString = title || '';
    if (sidebarLinksAsStandaloneChildren) {
      const sidebarLink = sidebarLinks[sidebarHashMap[currentSidebarHash] || 0];
      titleString = sidebarLink.pageTitle || sidebarLink.name;
    }
    return (
      <>
        <Typography
          data-selenium="neon-page.title"
          variant="h3"
          component="h1"
          className={classes.pageTitle}
        >
          {titleString}
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
      </>
    );
  };

  const renderBreadcrumbs = () => (!breadcrumbs.length ? null : (
    <Breadcrumbs
      aria-label="Breadcrumbs"
      data-selenium="neon-page.breadcrumbs"
      className={classes.breadcrumbs}
    >
      <Link key={uniqueId()} href={breadcrumbHomeHref}>
        <HomeIcon title="Home" fontSize="small" style={{ marginBottom: '-4px' }} />
      </Link>
      {breadcrumbs.map(
        (breadcrumb, idx) => (idx !== breadcrumbs.length - 1
          ? (<Link key={uniqueId()} href={breadcrumb.href}>{breadcrumb.name}</Link>)
          : (<Typography key="{idx}" color="textPrimary">{breadcrumb.name}</Typography>)),
      )}
    </Breadcrumbs>
  ));

  const renderOverlay = (overlayChildren) => (
    <Backdrop open={!overlayDismissed}>
      <Paper className={classes.backdropPaper}>
        {overlayChildren}
        <div className={classes.dismissOverlay}>
          <Button
            size="small"
            startIcon={<ClearIcon />}
            variant="outlined"
            onClick={() => { setOverlayDismissed(true); }}
          >
            Dismiss
          </Button>
        </div>
      </Paper>
    </Backdrop>
  );

  const renderLoading = () => (!loading || error ? null : renderOverlay(
    <>
      <Typography variant="h5" component="h3" gutterBottom>
        {loading}
      </Typography>
      {progress === null ? (
        <CircularProgress />
      ) : (
        <CircularProgress variant="static" value={progress} />
      )}
    </>,
  ));

  const renderError = () => (!error ? null : renderOverlay(
    <>
      <ErrorIcon fontSize="large" color="error" />
      <Typography variant="h5" component="h3" style={{ marginTop: Theme.spacing(1) }}>
        {error}
      </Typography>
    </>,
  ));

  const renderSidebar = () => {
    if (!hasSidebar) { return null; }
    const sidebarContainerStyle = belowMd ? {} : { width: `${sidebarWidth}px` };
    const dividerStyle = !belowMd ? { width: `${sidebarWidth - Theme.spacing(8)}px` } : {};
    const sidebarClassName = sidebarContainerClassNameProp
      ? `${classes.sidebarContainer} ${sidebarContainerClassNameProp}`
      : classes.sidebarContainer;
    // Arbitrary Content Sidebar (no automatic skeleton)
    if (hasSidebarContent) {
      return (
        <>
          <div ref={sidebarRef} className={sidebarClassName} style={sidebarContainerStyle}>
            {sidebarContent}
          </div>
        </>
      );
    }
    // Render Sidebar Title
    const renderSidebarTitle = () => {
      if (!sidebarTitle && !title) { return null; }
      return (
        <div className={classes.sidebarTitlesContainer}>
          {loading || error ? (
            <>
              <Skeleton width={200} height={22} style={{ marginBottom: Theme.spacing(1) }} />
              {!sidebarSubtitle ? null : (
                <Skeleton width={120} height={16} style={{ marginBottom: Theme.spacing(1) }} />
              )}
            </>
          ) : (
            <>
              <Typography variant="h5" component="h3" className={classes.sidebarTitle}>
                {sidebarTitle || title}
              </Typography>
              {!sidebarSubtitle ? null : (
                <Typography variant="subtitle2" component="h4" className={classes.sidebarSubtitle}>
                  {sidebarSubtitle}
                </Typography>
              )}
            </>
          )}
        </div>
      );
    };
    // Render Single Sidebar Link
    const renderLink = (link, standalone = false) => {
      if (!link) { return null; }
      const { name, hash = '#', icon: IconComponent } = link;
      if (loading || error) {
        return (
          <Skeleton
            key={name}
            width={`${Math.floor(50 + Math.random() * 50)}%`}
            height={16}
            style={{ marginBottom: '16px' }}
          />
        );
      }
      const icon = IconComponent ? <IconComponent className={classes.sidebarLinkIcon} /> : null;
      return (
        <Link
          key={name}
          href={hash}
          onClick={(
            sidebarLinksAsStandaloneChildren ? () => {
              setCurrentSidebarHash(hash);
              if (sidebarExpanded) { setSidebarExpanded(false); }
            } : null
          )}
          className={(
            currentSidebarHash === hash
              ? `${classes.sidebarLink} ${classes.sidebarLinkCurrent}`
              : classes.sidebarLink
          )}
          style={standalone ? { marginBottom: '0px' } : {}}
        >
          {icon}
          {name}
        </Link>
      );
    };
    const fullLinks = (
      <>
        <div
          ref={sidebarLinksContainerRef}
          className={classes.sidebarLinksContainer}
        >
          {sidebarLinks.map((link) => renderLink(link))}
        </div>
        {belowMd ? null : (
          <Divider
            className={classes.sidebarDivider}
            style={{ marginBottom: '0px', ...dividerStyle }}
          />
        )}
      </>
    );
    const currentLinkOnly = (
      <div className={classes.sidebarLinksContainer}>
        {renderLink(sidebarLinks[sidebarHashMap[currentSidebarHash]], true)}
      </div>
    );
    return (
      <div ref={sidebarRef} className={sidebarClassName} style={sidebarContainerStyle}>
        <div className={!sidebarUnsticky && !belowMd ? classes.sidebarInnerStickyContainer : null}>
          <div className={classes.sidebarTitleContainer}>
            {renderSidebarTitle()}
            {!belowMd ? null : (
              <IconButton size="small" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
                {(
                  sidebarExpanded
                    ? <CollapseIcon fontSize="large" />
                    : <ExpandIcon fontSize="large" />
                )}
              </IconButton>
            )}
          </div>
          <Divider className={classes.sidebarDivider} style={{ ...dividerStyle }} />
          {(sidebarLinksAdditionalContent && (!belowMd || sidebarExpanded)) ? (
            <>
              {sidebarLinksAdditionalContent}
              <Divider className={classes.sidebarDivider} style={{ ...dividerStyle }} />
            </>
          ) : null}
          {belowMd && !sidebarExpanded ? currentLinkOnly : fullLinks}
        </div>
      </div>
    );
  };

  const renderNeonPage = () => {
    const outerPageContainerStyles = {};
    if (outerPageContainerMaxWidth) {
      outerPageContainerStyles.maxWidth = !hasSidebar || belowMd
        ? outerPageContainerMaxWidth
        : `calc(${outerPageContainerMaxWidth} - ${sidebarWidth + 48}px)`;
    }
    let content = children;
    if (hasSidebarLinks && sidebarLinksAsStandaloneChildren) {
      const CurrentComponent = sidebarLinks[sidebarHashMap[currentSidebarHash] || 0].component;
      content = <CurrentComponent />;
    }
    return (
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <GlobalCss />
        {customHeader ? (
          <header ref={headerRef}>
            {customHeader}
          </header>
        ) : (
          <NeonHeader
            ref={headerRef}
            useCoreHeader={useCoreHeader}
            unstickyDrupalHeader={unstickyDrupalHeader}
            notifications={notifications}
            onShowNotifications={handleShowNotifications}
            drupalCssLoaded={drupalCssStatus === FETCH_STATUS.SUCCESS}
          />
        )}
        <Container className={classes.outerPageContainer} style={outerPageContainerStyles}>
          {renderSidebar()}
          <div
            className={classes.pageContent}
            style={{ top: hasSidebar && !breadcrumbs.length ? '12px' : '0px' }}
            data-selenium="neon-page.content"
            ref={contentRef}
          >
            {renderBreadcrumbs()}
            {renderTitle()}
            {content}
          </div>
        </Container>
        <LiferayNotifications
          notifications={notifications}
          onHideNotifications={handleHideNotifications}
        />
        <BrowserWarning />
        {customFooter ? (
          <footer>
            {customFooter}
          </footer>
        ) : (
          <NeonFooter
            useCoreHeader={useCoreHeader}
            drupalCssLoaded={drupalCssStatus === FETCH_STATUS.SUCCESS}
          />
        )}
        {renderLoading()}
        {renderError()}
      </ThemeProvider>
    );
  };

  const renderedPage = neonContextIsActive ? renderNeonPage() : (
    <NeonContext.Provider useCoreAuth useCoreHeader={useCoreHeader} {...NeonContextProviderProps}>
      {renderNeonPage()}
    </NeonContext.Provider>
  );

  return (
    <ErrorBoundary
      FallbackComponent={NeonErrorPage}
      onReset={resetStateAfterRuntimeError}
    >
      {renderedPage}
    </ErrorBoundary>
  );
};

const children = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ])),
  PropTypes.node,
  PropTypes.string,
]);

NeonPage.propTypes = {
  breadcrumbHomeHref: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string,
    }),
  ),
  customHeader: PropTypes.node,
  customFooter: PropTypes.node,
  error: PropTypes.string,
  loading: PropTypes.string,
  notification: PropTypes.string,
  outerPageContainerMaxWidth: PropTypes.string,
  progress: PropTypes.number,
  resetStateAfterRuntimeError: PropTypes.func,
  sidebarContent: children,
  sidebarContainerClassName: PropTypes.string,
  sidebarLinks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      pageTitle: PropTypes.string,
      hash: PropTypes.string,
      icon: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object,
      ]),
      component: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object,
      ]),
    }),
  ),
  sidebarLinksAdditionalContent: children,
  sidebarLinksAsStandaloneChildren: PropTypes.bool,
  sidebarSubtitle: PropTypes.string,
  sidebarTitle: PropTypes.string,
  sidebarWidth: PropTypes.number,
  sidebarUnsticky: PropTypes.bool,
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    children,
  ]),
  title: PropTypes.oneOfType([
    PropTypes.string,
    children,
  ]),
  useCoreHeader: PropTypes.bool,
  unstickyDrupalHeader: PropTypes.bool,
  NeonContextProviderProps: PropTypes.shape(NeonContext.ProviderPropTypes),
  children: children.isRequired,
};

NeonPage.defaultProps = {
  breadcrumbHomeHref: '/',
  breadcrumbs: [],
  customHeader: null,
  customFooter: null,
  error: null,
  loading: null,
  notification: null,
  outerPageContainerMaxWidth: '2000px',
  progress: null,
  resetStateAfterRuntimeError: () => {},
  sidebarContent: null,
  sidebarContainerClassName: null,
  sidebarLinks: null,
  sidebarLinksAdditionalContent: null,
  sidebarLinksAsStandaloneChildren: false,
  sidebarSubtitle: null,
  sidebarTitle: null,
  sidebarWidth: 300,
  sidebarUnsticky: false,
  subtitle: null,
  title: null,
  useCoreHeader: false,
  unstickyDrupalHeader: true,
  NeonContextProviderProps: {},
};

export default NeonPage;
