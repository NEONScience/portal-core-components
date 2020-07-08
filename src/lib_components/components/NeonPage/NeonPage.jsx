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

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Backdrop from '@material-ui/core/Backdrop';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import CollapseIcon from '@material-ui/icons/ExpandLess';
import ErrorIcon from '@material-ui/icons/Warning';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import HomeIcon from '@material-ui/icons/Home';

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

const SIDEBAR_WIDTH = 300;

// NOTE: because these are defined outside the ThemeProvider any theme vars will come from
// MUI default, NOT the NeonTheme. Hence why some definitions use COLORS directly.
const useStyles = makeStyles(theme => ({
  outerPageContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    minHeight: theme.spacing(30),
    borderTop: '2px solid transparent',
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(2.5),
      flexDirection: 'column',
    },
  },
  sidebarLinksContainer: {
    // overflowY: 'scroll',
    backgroundColor: COLORS.GREY[50],
    padding: theme.spacing(5, 4),
    [theme.breakpoints.up('md')]: {
      height: '100%',
      width: `${SIDEBAR_WIDTH}px`,
      position: 'absolute',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: theme.spacing(2.5, 2),
      position: 'sticky',
      top: '0px',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.5),
    },
  },
  sidebarLinksInnerContainer: {
    position: 'sticky',
    top: theme.spacing(3),
  },
  sidebarLinksInnernmostContainer: {
    [theme.breakpoints.down('sm')]: {
      overflowY: 'scroll',
      maxHeight: '200px',
    },
  },
  sidebarTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  sidebarDivider: {
    margin: '24px 0px',
    [theme.breakpoints.down('sm')]: {
      margin: '16px 0px',
    },
  },
  pageContainer: {
    maxWidth: '2000px',
    padding: theme.spacing(5, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 2.5),
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
  pageContainerWithSidebar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${SIDEBAR_WIDTH + 24}px)`,
      marginLeft: `${SIDEBAR_WIDTH + 24}px`,
    },
  },
  backdropPaper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '4px',
    padding: theme.spacing(3, 3, 4, 3),
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
    margin: theme.spacing(3, 0, 4, 0),
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(3, 0, 4, 0),
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

const DRUPAL_CSS_URL = 'https://preview.neonscience.org/themes/custom/neon/build/components/theme/theme.css';

const NeonPage = (props) => {
  const {
    breadcrumbs,
    error,
    loading,
    notification,
    outerPageContainerMaxWidth,
    progress,
    sidebarLinks,
    sidebarLinksAsStandaloneChildren: sidebarLinksAsStandaloneChildrenProp,
    sidebarSubtitle,
    sidebarTitle,
    subtitle,
    title,
    useCoreHeader,
    unstickyDrupalHeader,
    children,
  } = props;

  const classes = useStyles(Theme);
  const [{ isActive: neonContextIsActive }] = NeonContext.useNeonContextState();
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const sidebarRef = useRef(null);
  const belowMd = useMediaQuery(Theme.breakpoints.down('sm'));

  /**
    Sidebar Links Setup
  */
  const hasSidebar = Array.isArray(sidebarLinks) && sidebarLinks.length > 0;
  // sidebarLinksAsStandaloneChildren can only be true if all sidebar links have a defined component
  const sidebarLinksAsStandaloneChildren = hasSidebar && sidebarLinksAsStandaloneChildrenProp
    ? sidebarLinks.every(link => link.component)
    : false;
  const sidebarHashMap = !hasSidebar ? {} : Object.fromEntries(
    sidebarLinks.map((link, idx) => [link.hash || '#', idx]),
  );
  const initialCurrectSidebarHash = hasSidebar ? sidebarLinks[0].hash || '#' : '#';
  const [currentSidebarHash, setCurrentSidebarHash] = useState(initialCurrectSidebarHash);
  const [hashInitialized, setHashInitialized] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // for small viewports only

  // Get the vertical pixel offset for the content associated to any sidebar link by hash
  const getSidebarLinkScrollPosition = useCallback((hash) => {
    if (!hasSidebar || sidebarLinksAsStandaloneChildren || !contentRef.current) { return -1; }
    const headerOffset = (headerRef.current || {}).offsetHeight || 0;
    const stickyOffset = belowMd ? (sidebarRef.current || {}).offsetHeight || 0 : 0;
    if (hash === '#') { return 0; }
    const anchor = contentRef.current.querySelector(hash);
    return !anchor ? -1 : anchor.offsetTop + headerOffset - stickyOffset - Theme.spacing(5);
  }, [hasSidebar, sidebarLinksAsStandaloneChildren, belowMd]);

  // For sidebarLinks pages, on successful load, if hash is present then update the current
  useLayoutEffect(() => {
    if (error || loading || !hasSidebar) { return () => {}; }
    // Handle URL-defined hash on initial load
    if (document.location.hash && !hashInitialized) {
      // Ensure the document hash maps to a defined hash or '#' at all times
      if (!Object.keys(sidebarHashMap).includes(document.location.hash)) {
        document.location.hash = '#';
      }
      const { hash } = document.location;
      if (currentSidebarHash !== hash) {
        setCurrentSidebarHash(hash);
        // If standard sidebar mode (scroll to content) also perform the scroll offset here
        if (!sidebarLinksAsStandaloneChildren) {
          window.setTimeout(() => {
            window.scrollTo(0, getSidebarLinkScrollPosition(hash));
          }, 0);
        }
      }
      setHashInitialized(true);
    }
    // Set up event listener / handler for user-input scroll events for standard scrolling pages
    if (sidebarLinksAsStandaloneChildren) { return () => {}; }
    const handleScroll = () => {
      const scrollBreaks = sidebarLinks.map(link => ({
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
    hasSidebar,
    sidebarLinks,
    sidebarHashMap,
    hashInitialized,
    setHashInitialized,
    currentSidebarHash,
    setCurrentSidebarHash,
    getSidebarLinkScrollPosition,
    sidebarLinksAsStandaloneChildren,
  ]);

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
  }, [useCoreHeader, drupalCssLoaded, setDrupalCssLoaded]);

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
    if ((!title || !title.length) && !sidebarLinksAsStandaloneChildren) {
      return null;
    }
    let titleString = title || '';
    if (sidebarLinksAsStandaloneChildren) {
      const sidebarLink = sidebarLinks[sidebarHashMap[currentSidebarHash] || 0];
      titleString = sidebarLink.pageTitle || sidebarLink.name;
    }
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };

  const renderBreadcrumbs = () => (!breadcrumbs.length ? null : (
    <Breadcrumbs
      aria-label="Breadcrumbs"
      data-selenium="neon-page.breadcrumbs"
    >
      <Link key={uniqueId()} href="/">
        <HomeIcon title="Home" fontSize="small" style={{ marginBottom: '-4px' }} />
      </Link>
      {breadcrumbs.map(
        (breadcrumb, idx) => (idx !== breadcrumbs.length - 1
          ? (<Link key={uniqueId()} href={breadcrumb.href}>{breadcrumb.name}</Link>)
          : (<Typography key="{idx}" color="textPrimary">{breadcrumb.name}</Typography>)),
      )}
    </Breadcrumbs>
  ));

  const renderOverlay = overlayChildren => (
    <Backdrop open>
      <Paper className={classes.backdropPaper}>
        {overlayChildren}
      </Paper>
    </Backdrop>
  );

  const renderLoading = () => (!loading || error ? null : renderOverlay(
    <React.Fragment>
      <Typography variant="h5" component="h3" gutterBottom>
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
      <Typography variant="h5" component="h3" style={{ marginTop: Theme.spacing(1) }}>
        {error}
      </Typography>
    </React.Fragment>,
  ));

  const renderSidebarLinks = () => {
    if (!hasSidebar) { return null; }
    const subtitleStyle = { color: COLORS.GREY[300], marginTop: Theme.spacing(1) };
    const sideBarTitle = !sidebarTitle && !title ? null : (
      <div>
        <Typography variant="h5" component="h3" style={{ fontWeight: 700 }}>
          {sidebarTitle || title}
        </Typography>
        {!sidebarSubtitle ? null : (
          <Typography variant="subtitle2" component="h4" style={subtitleStyle}>
            {sidebarSubtitle}
          </Typography>
        )}
      </div>
    );
    const renderLink = (link, standalone = false) => {
      if (!link) { return null; }
      const { name, hash = '#', icon: IconComponent } = link;
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
      <React.Fragment>
        <div className={classes.sidebarLinksInnerMostContainer}>
          {sidebarLinks.map(link => renderLink(link))}
        </div>
        <Divider className={classes.sidebarDivider} style={{ marginBottom: '0px' }} />
      </React.Fragment>
    );
    const currentLinkOnly = (
      <div className={classes.sidebarLinksInnerMostContainer}>
        {renderLink(sidebarLinks[sidebarHashMap[currentSidebarHash]], true)}
      </div>
    );
    return (
      <div ref={sidebarRef} className={classes.sidebarLinksContainer}>
        <div className={classes.sidebarLinksInnerContainer}>
          <div className={classes.sidebarTitleContainer}>
            {sideBarTitle}
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
          <Divider className={classes.sidebarDivider} />
          {belowMd && !sidebarExpanded ? currentLinkOnly : fullLinks}
        </div>
      </div>
    );
  };

  const renderNeonPage = () => {
    const outerPageContainerStyles = outerPageContainerMaxWidth ? {
      maxWidth: outerPageContainerMaxWidth,
    } : null;
    const pageContainerClassName = hasSidebar
      ? `${classes.pageContainer} ${classes.pageContainerWithSidebar}`
      : classes.pageContainer;
    let content = children;
    if (hasSidebar && sidebarLinksAsStandaloneChildren) {
      const CurrentComponent = sidebarLinks[sidebarHashMap[currentSidebarHash] || 0].component;
      content = <CurrentComponent />;
    }
    return (
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <GlobalCss />
        <NeonHeader
          ref={headerRef}
          useCoreHeader={useCoreHeader}
          unstickyDrupalHeader={unstickyDrupalHeader}
          notifications={notifications}
          onShowNotifications={handleShowNotifications}
        />
        <Container className={classes.outerPageContainer} style={outerPageContainerStyles}>
          {renderSidebarLinks()}
          <Container
            className={pageContainerClassName}
            data-selenium="neon-page.content"
            ref={contentRef}
          >
            {renderBreadcrumbs()}
            {renderTitle()}
            {content}
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
    <NeonContext.Provider useCoreAuth useCoreHeader={useCoreHeader}>
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
  error: PropTypes.string,
  loading: PropTypes.string,
  notification: PropTypes.string,
  outerPageContainerMaxWidth: PropTypes.string,
  progress: PropTypes.number,
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
  sidebarLinksAsStandaloneChildren: PropTypes.bool,
  sidebarSubtitle: PropTypes.string,
  sidebarTitle: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  useCoreHeader: PropTypes.bool,
  unstickyDrupalHeader: PropTypes.bool,
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
  error: null,
  loading: null,
  notification: null,
  outerPageContainerMaxWidth: '2000px',
  progress: null,
  sidebarLinks: null,
  sidebarLinksAsStandaloneChildren: false,
  sidebarSubtitle: null,
  sidebarTitle: null,
  subtitle: null,
  title: null,
  useCoreHeader: false,
  unstickyDrupalHeader: true,
};

export default NeonPage;
