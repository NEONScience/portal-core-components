import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';

import uniqueId from 'lodash/uniqueId';

import { ErrorBoundary } from 'react-error-boundary';

import useMediaQuery from '@mui/material/useMediaQuery';
import Backdrop from '@mui/material/Backdrop';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import ClearIcon from '@mui/icons-material/Clear';
import CollapseIcon from '@mui/icons-material/ExpandLess';
import ErrorIcon from '@mui/icons-material/Warning';
import ExpandIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import ResetIcon from '@mui/icons-material/Autorenew';

import REMOTE_ASSETS from '../../remoteAssetsMap/remoteAssetsMap';
import { COLORS, getThemeSpacingNumber } from '../Theme/Theme';
import NeonHeader from '../NeonHeader/NeonHeader';
import NeonFooter from '../NeonFooter/NeonFooter';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';
import BrowserWarning from './BrowserWarning';
import NotificationsManager from './NotificationsManager';
import DrupalAssetService from '../../service/DrupalAssetService';

import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';

import NeonLogo from '../../images/NSF-NEON-logo.png';

import './styles.css';

const DRUPAL_THEME_CSS = REMOTE_ASSETS.DRUPAL_THEME_CSS.KEY;

// Function to determine if we're effectively scrolled to the bottom of the page. Used to set
// current sidebar link to the last one automatically when the associated content for the last link
// can't be scrolled past (i.e. is not taller than the page height less the footer height)
const isAtMaxScroll = () => {
  const windowHeight = window.innerHeight
    || (document.documentElement || document.body).clientHeight;
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight,
  );
  const scrollTop = window.pageYOffset
    || (document.documentElement || document.body.parentNode || document.body).scrollTop;
  const trackLength = documentHeight - windowHeight;
  return (scrollTop / trackLength) >= 0.99;
};

// Google Tag Manager Data Layer
// Define if not already defined. This must be set in the index.html for any apps/pages that
// would seek to use it. More info: https://developers.google.com/tag-manager/devguide
if (!window.gtmDataLayer) {
  window.gtmDataLayer = [];
}

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
  breadcrumbs: {
    margin: theme.spacing(2, 0, 4, 0),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1, 0, 2, 0),
    },
  },
  sidebarContainer: {
    display: 'block',
    verticalAlign: 'top',
    backgroundColor: COLORS.GREY[50],
    padding: theme.spacing(5, 4),
    [theme.breakpoints.down('md')]: {
      display: 'inline-block',
      width: '100%',
      maxHeight: 'calc(100vh - 84px)',
      padding: theme.spacing(2.5, 2),
      position: 'sticky',
      top: '-2px',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
      zIndex: 2,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
    },
  },
  sidebarInnerStickyContainer: {
    // Sticky properties injected via CSS to handle webkit position prop
    top: '40px',
  },
  sidebarTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebarTitle: {
    fontWeight: 700,
    [theme.breakpoints.down('md')]: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    [theme.breakpoints.only('sm')]: {
      marginRight: theme.spacing(1.5),
    },
  },
  sidebarSubtitle: {
    color: COLORS.GREY[300],
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      marginTop: '0px',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  sidebarTitlesContainer: {
    minWidth: '0px',
    paddingRight: theme.spacing(1),
    [theme.breakpoints.only('sm')]: {
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
    [theme.breakpoints.down('md')]: {
      margin: '16px 0px',
    },
    [theme.breakpoints.down('sm')]: {
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
  dismissOverlay: {
    width: '100%',
    textAlign: 'right',
    marginTop: theme.spacing(2),
  },
}));

/**
  NEON Error Page
  Shown as the fallback for a general error boundary around all NEON page instances
 */
export const NeonErrorPage = (props) => {
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

const drupalAssetsReducer = (state, action) => {
  const newState = { ...state };
  switch (action.type) {
    case 'fetchDrupalCss':
      newState.fetchStatus = FETCH_STATUS.FETCHING;
      return newState;
    case 'fetchDrupalCssSuccess':
      newState.fetchStatus = FETCH_STATUS.SUCCESS;
      return newState;
    case 'fetchDrupalCssError':
      newState.fetchStatus = FETCH_STATUS.ERROR;
      return newState;
    default:
      return state;
  }
};

const defaultProps = {
  breadcrumbHomeHref: '/',
  breadcrumbs: [],
  customHeader: null,
  customFooter: null,
  customizeAuthContainer: false,
  showHeaderSkeleton: false,
  showFooterSkeleton: false,
  error: null,
  loading: null,
  notification: null,
  outerPageContainerMaxWidth: '2000px',
  progress: null,
  resetStateAfterRuntimeError: () => { },
  sidebarContent: null,
  sidebarContentResponsive: false,
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
  unstickyDrupalHeader: true,
  NeonContextProviderProps: {},
};

const NeonPage = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const {
    breadcrumbHomeHref,
    breadcrumbs,
    customHeader,
    customFooter,
    customizeAuthContainer,
    showHeaderSkeleton,
    showFooterSkeleton,
    error,
    loading,
    notification,
    outerPageContainerMaxWidth,
    progress,
    resetStateAfterRuntimeError,
    sidebarContent,
    sidebarContentResponsive,
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
    unstickyDrupalHeader,
    NeonContextProviderProps,
    children,
  } = props;

  /**
    Sidebar Setup
  */
  // Sidebar can have content OR links, not both. If both are set then content wins.
  const hasSidebarContent = sidebarContent !== null;
  const hasSidebarLinks = !sidebarContent && Array.isArray(sidebarLinks) && sidebarLinks.length > 0;
  const hasSidebar = hasSidebarContent || hasSidebarLinks;

  const { classes, theme } = useStyles({ sidebarWidth: hasSidebar ? sidebarWidth : 0 });
  const [{ isActive: neonContextIsActive }] = NeonContext.useNeonContextState();
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const sidebarRef = useRef(null);
  const sidebarLinksContainerRef = useRef(null);
  const belowMd = useMediaQuery(theme.breakpoints.down('md'));
  const [overlayDismissed, setOverlayDismissed] = useState(false);

  // Boolean - whether any Drupal assets are used; only false if both header and footer are custom
  const useSomeDrupalAssets = NeonEnvironment.fetchDrupalAssets && !(customHeader && customFooter);

  /**
    Continue Sidebar Setup
  */
  // sidebarLinksAsStandaloneChildren can only be true if all sidebar links have a defined component
  const sidebarLinksAsStandaloneChildren = hasSidebarLinks && sidebarLinksAsStandaloneChildrenProp
    ? sidebarLinks.every((link) => link.component)
    : false;
  const sidebarHashMap = useMemo(() => ((
    !hasSidebarLinks ? {} : Object.fromEntries(
      sidebarLinks.map((link, idx) => [link.hash || '#', idx]),
    )
  // Note that the compiler is not aware that this value is not being modified
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  )), [hasSidebarLinks, sidebarLinks]);
  const initialCurrentSidebarHash = hasSidebarLinks ? sidebarLinks[0].hash || '#' : '#';
  const [currentSidebarHash, setCurrentSidebarHash] = useState(initialCurrentSidebarHash);
  const hashInitializedRef = useRef(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // for small viewports only

  // Get the vertical pixel offset for the content associated to any sidebar link by hash
  const sidebarLinkScrollPositionNudge = getThemeSpacingNumber(theme.spacing(5));
  const getSidebarLinkScrollPosition = useCallback((hash, inSidebarLinksAsStandaloneChildren) => {
    if (!hasSidebarLinks || inSidebarLinksAsStandaloneChildren || !contentRef.current) {
      return -1;
    }
    const headerOffset = (headerRef.current || {}).offsetHeight || 0;
    const stickyOffset = belowMd ? (sidebarRef.current || {}).offsetHeight || 0 : 0;
    if (hash === '#') { return 0; }
    const anchor = contentRef.current.querySelector(hash);
    return !anchor
      ? -1
      : anchor.offsetTop + headerOffset - stickyOffset - sidebarLinkScrollPositionNudge;
  }, [
    hasSidebarLinks,
    belowMd,
    contentRef,
    headerRef,
    sidebarRef,
    sidebarLinkScrollPositionNudge,
  ]);

  const handleHashNav = useCallback((hashNav) => {
    window.location.hash = hashNav;
  }, []);

  /**
     Effect - For sidebarLinks pages, on successful load, if hash is present then update the current
  */
  useLayoutEffect(() => {
    if (error || loading || !hasSidebarLinks) { return () => { }; }
    const handleHashChange = () => {
      const { hash } = document.location;
      if (currentSidebarHash === hash) { return; }
      setCurrentSidebarHash(hash);
      // If standard sidebar mode (scroll to content) also perform the scroll offset here
      if (!sidebarLinksAsStandaloneChildren) {
        window.setTimeout(() => {
          window.scrollTo(0, getSidebarLinkScrollPosition(hash, sidebarLinksAsStandaloneChildren));
        }, 0);
      }
    };
    // Handle URL-defined hash on initial load
    if (document.location.hash && !hashInitializedRef.current) {
      hashInitializedRef.current = true;
      // Ensure the document hash maps to a defined hash or '#' at all times
      if (!Object.keys(sidebarHashMap).includes(document.location.hash)) {
        handleHashNav('#');
      }
      handleHashChange();
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
        y: getSidebarLinkScrollPosition(link.hash || '#', sidebarLinksAsStandaloneChildren),
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
    hashInitializedRef,
    currentSidebarHash,
    setCurrentSidebarHash,
    handleHashNav,
    sidebarLinksContainerRef,
    getSidebarLinkScrollPosition,
    sidebarLinksAsStandaloneChildren,
  ]);

  /**
     Effect - Load Drupal CSS
  */
  const initialDrupalFetchStatusState = {
    fetchStatus: useSomeDrupalAssets
      ? FETCH_STATUS.AWAITING_CALL
      : FETCH_STATUS.SUCCESS,
  };
  const [fetchDrupalCssState, fetchDrupalCssDispatch] = useReducer(
    drupalAssetsReducer,
    initialDrupalFetchStatusState,
  );
  const isDrupalCssStatusFinished = (fetchDrupalCssState.fetchStatus === FETCH_STATUS.SUCCESS);
  useEffect(() => {
    if (!useSomeDrupalAssets) {
      return;
    }
    if (fetchDrupalCssState.fetchStatus !== FETCH_STATUS.AWAITING_CALL) {
      return;
    }
    fetchDrupalCssDispatch({ type: 'fetchDrupalCss' });
    fetch(REMOTE_ASSETS[DRUPAL_THEME_CSS].url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch Drupal theme CSS');
        }
        return response.text();
      })
      .then((data) => {
        const drupalStyle = document.createElement('style');
        drupalStyle.setAttribute('data-meta', 'drupal-theme');
        drupalStyle.setAttribute('data-meta-runtime', 'drupal-theme');
        const appliedData = DrupalAssetService.cleanCss(data, true);
        drupalStyle.textContent = appliedData;
        document.head.appendChild(drupalStyle);
        try {
          const existingBlock = document.head.querySelector('link[data-meta="drupal-theme"]');
          if ((typeof existingBlock !== 'undefined') && (existingBlock !== null)) {
            existingBlock.remove();
          }
        } catch (e) {
          console.error(e); // eslint-disable-line no-console
        }
        fetchDrupalCssDispatch({ type: 'fetchDrupalCssSuccess' });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        fetchDrupalCssDispatch({ type: 'fetchDrupalCssSuccess' });
      });
  }, [useSomeDrupalAssets, fetchDrupalCssState, fetchDrupalCssDispatch]);

  /**
     Render functions
   */
  const renderTitle = () => {
    if ((loading || error) && !title) {
      return (
        <Skeleton width="45%" height={24} style={{ margin: theme.spacing(2, 0, 4, 0) }} />
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
        <CircularProgress variant="determinate" value={progress} />
      )}
    </>,
  ));

  const renderError = () => (!error ? null : renderOverlay(
    <>
      <ErrorIcon fontSize="large" color="error" />
      <Typography variant="h5" component="h3" style={{ marginTop: theme.spacing(1) }}>
        {error}
      </Typography>
    </>,
  ));

  const renderSidebar = () => {
    if (!hasSidebar) { return null; }
    const sidebarContainerStyle = belowMd ? {} : { width: `${sidebarWidth}px` };
    const dividerStyle = !belowMd
      ? { width: `${sidebarWidth - getThemeSpacingNumber(theme.spacing(8))}px` }
      : {};
    const sidebarClassName = sidebarContainerClassNameProp
      ? `${classes.sidebarContainer} ${sidebarContainerClassNameProp}`
      : classes.sidebarContainer;
    // Arbitrary Content Sidebar (no automatic skeleton)
    if (hasSidebarContent && !sidebarContentResponsive) {
      return (
        <div ref={sidebarRef} className={sidebarClassName} style={sidebarContainerStyle}>
          {sidebarContent}
        </div>
      );
    }
    // Render Sidebar Title
    const renderSidebarTitle = () => {
      if (!sidebarTitle && !title) { return null; }
      return (
        <div className={classes.sidebarTitlesContainer}>
          {loading || error ? (
            <>
              <Skeleton width={200} height={22} style={{ marginBottom: theme.spacing(1) }} />
              {!sidebarSubtitle ? null : (
                <Skeleton width={120} height={16} style={{ marginBottom: theme.spacing(1) }} />
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
    // Arbitrary Content Sidebar (no automatic skeleton)
    if (hasSidebarContent) {
      return (
        <div ref={sidebarRef} className={sidebarClassName} style={sidebarContainerStyle}>
          <div
            className={!sidebarUnsticky && !belowMd
              ? `${classes.sidebarInnerStickyContainer} neon__sidebar-sticky`
              : null}
          >
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
            {(!belowMd || sidebarExpanded) ? (
              <>
                <Divider className={classes.sidebarDivider} style={{ ...dividerStyle }} />
                {sidebarContent}
              </>
            ) : null}
          </div>
        </div>
      );
    }
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
        <div
          className={!sidebarUnsticky && !belowMd
            ? `${classes.sidebarInnerStickyContainer} neon__sidebar-sticky`
            : null}
        >
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
      <>
        {customHeader ? (
          <header ref={headerRef}>
            {customHeader}
          </header>
        ) : (
          <NeonHeader
            customizeAuthContainer={customizeAuthContainer}
            ref={headerRef}
            unstickyDrupalHeader={unstickyDrupalHeader}
            drupalCssLoaded={isDrupalCssStatusFinished}
            showSkeleton={showHeaderSkeleton}
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
        <NotificationsManager
          initialNotification={notification}
        />
        <BrowserWarning />
        {customFooter ? (
          <footer>
            {customFooter}
          </footer>
        ) : (
          <NeonFooter
            drupalCssLoaded={isDrupalCssStatusFinished}
            showSkeleton={showFooterSkeleton}
          />
        )}
        {renderLoading()}
        {renderError()}
      </>
    );
  };

  const renderedPage = neonContextIsActive ? renderNeonPage() : (
    <NeonContext.Provider
      useCoreAuth
      fetchPartials={useSomeDrupalAssets}
      {...NeonContextProviderProps}
    >
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
  customizeAuthContainer: PropTypes.bool,
  showHeaderSkeleton: PropTypes.bool,
  showFooterSkeleton: PropTypes.bool,
  error: PropTypes.string,
  loading: PropTypes.string,
  notification: PropTypes.string,
  outerPageContainerMaxWidth: PropTypes.string,
  progress: PropTypes.number,
  resetStateAfterRuntimeError: PropTypes.func,
  sidebarContent: children,
  sidebarContentResponsive: PropTypes.bool,
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
  unstickyDrupalHeader: PropTypes.bool,
  NeonContextProviderProps: PropTypes.shape(NeonContext.ProviderPropTypes),
  children: children.isRequired,
};

export default NeonPage;
