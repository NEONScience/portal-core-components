"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NeonErrorPage = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _universalCookie = _interopRequireDefault(require("universal-cookie"));
var _uniqueId = _interopRequireDefault(require("lodash/uniqueId"));
var _rxjs = require("rxjs");
var _reactErrorBoundary = require("react-error-boundary");
var _styles = require("@material-ui/core/styles");
var _styles2 = require("@material-ui/styles");
var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));
var _Backdrop = _interopRequireDefault(require("@material-ui/core/Backdrop"));
var _Breadcrumbs = _interopRequireDefault(require("@material-ui/core/Breadcrumbs"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));
var _Container = _interopRequireDefault(require("@material-ui/core/Container"));
var _CssBaseline = _interopRequireDefault(require("@material-ui/core/CssBaseline"));
var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Clear = _interopRequireDefault(require("@material-ui/icons/Clear"));
var _ExpandLess = _interopRequireDefault(require("@material-ui/icons/ExpandLess"));
var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));
var _ExpandMore = _interopRequireDefault(require("@material-ui/icons/ExpandMore"));
var _Home = _interopRequireDefault(require("@material-ui/icons/Home"));
var _Autorenew = _interopRequireDefault(require("@material-ui/icons/Autorenew"));
var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));
var _remoteAssetsMap = _interopRequireDefault(require("../../remoteAssetsMap/remoteAssetsMap"));
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
var _NeonHeader = _interopRequireDefault(require("../NeonHeader/NeonHeader"));
var _NeonFooter = _interopRequireDefault(require("../NeonFooter/NeonFooter"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _NeonContext = _interopRequireWildcard(require("../NeonContext/NeonContext"));
var _BrowserWarning = _interopRequireDefault(require("./BrowserWarning"));
var _LiferayNotifications = _interopRequireDefault(require("./LiferayNotifications"));
var _DrupalAssetService = _interopRequireDefault(require("../../service/DrupalAssetService"));
var _rxUtil = require("../../util/rxUtil");
var _liferayNotificationsUtil = require("../../util/liferayNotificationsUtil");
var _NSFNEONLogo = _interopRequireDefault(require("../../images/NSF-NEON-logo.png"));
require("./styles.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DRUPAL_THEME_CSS = _remoteAssetsMap.default.DRUPAL_THEME_CSS.KEY;
const cookies = new _universalCookie.default();

// Global CSS
const GlobalCss = (0, _styles.withStyles)({
  '@global': {
    code: {
      fontSize: '115%',
      padding: _Theme.default.spacing(0.25, 0.5),
      backgroundColor: 'rgba(0, 0, 0, 0.11)'
    }
  }
})(() => null);

// Function to determine if we're effectively scrolled to the bottom of the page. Used to set
// current sidebar link to the last one automatically when the associated content for the last link
// can't be scrolled past (i.e. is not taller than the page height less the footer height)
const isAtMaxScroll = () => {
  const windowHeight = window.innerHeight || (document.documentElement || document.body).clientHeight;
  const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
  const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
  const trackLength = documentHeight - windowHeight;
  return scrollTop / trackLength >= 0.99;
};

// Google Tag Manager Data Layer
// Define if not already defined. This must be set in the public/index.html for any apps/pages that
// would seek to use it. More info: https://developers.google.com/tag-manager/devguide
if (!window.gtmDataLayer) {
  window.gtmDataLayer = [];
}

// NOTE: because these are defined outside the ThemeProvider any theme vars must come directly from
// the Theme import, unlike most other useStyles() instances where the Theme import is passed to the
// hook as an argument.
const useStyles = sidebarWidth => (0, _styles.makeStyles)(() => ({
  outerPageContainer: {
    display: 'flex',
    position: 'relative',
    minHeight: _Theme.default.spacing(30),
    borderTop: '2px solid transparent',
    paddingLeft: '0px',
    paddingRight: '0px',
    [_Theme.default.breakpoints.down('sm')]: {
      paddingBottom: _Theme.default.spacing(2.5),
      flexDirection: 'column'
    }
  },
  pageContent: {
    display: 'block',
    verticalAlign: 'top',
    position: 'relative',
    padding: _Theme.default.spacing(4, 8, 12, 8),
    width: "calc(100% - ".concat(sidebarWidth, "px)"),
    [_Theme.default.breakpoints.down('sm')]: {
      width: '100%',
      display: 'block',
      padding: _Theme.default.spacing(3, 5, 8, 5)
    },
    // These override links created with a naked <a> tag, as opposed to a <Link>
    // component, to appear the same as the <Link> component. This is especially
    // useful for rendered markdown where injecting Mui Links isn't possible.
    '& a:not([class]), a[class=""]': {
      color: _Theme.COLORS.LIGHT_BLUE[500],
      textDecoration: 'none'
    },
    '& a:hover:not([class]), a:hover[class=""]': {
      textDecoration: 'underline'
    }
  },
  breadcrumbs: {
    margin: _Theme.default.spacing(2, 0, 4, 0),
    [_Theme.default.breakpoints.down('sm')]: {
      margin: _Theme.default.spacing(1, 0, 2, 0)
    }
  },
  sidebarContainer: {
    display: 'block',
    verticalAlign: 'top',
    backgroundColor: _Theme.COLORS.GREY[50],
    padding: _Theme.default.spacing(5, 4),
    [_Theme.default.breakpoints.down('sm')]: {
      display: 'inline-block',
      width: '100%',
      maxHeight: 'calc(100vh - 84px)',
      padding: _Theme.default.spacing(2.5, 2),
      position: 'sticky',
      top: '-2px',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
      zIndex: 2
    },
    [_Theme.default.breakpoints.down('xs')]: {
      padding: _Theme.default.spacing(1.5)
    }
  },
  sidebarInnerStickyContainer: {
    // Sticky properties injected via CSS to handle webkit position prop
    top: '40px'
  },
  sidebarTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sidebarTitle: {
    fontWeight: 700,
    [_Theme.default.breakpoints.down('sm')]: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    },
    [_Theme.default.breakpoints.only('sm')]: {
      marginRight: _Theme.default.spacing(1.5)
    }
  },
  sidebarSubtitle: {
    color: _Theme.COLORS.GREY[300],
    marginTop: _Theme.default.spacing(1),
    [_Theme.default.breakpoints.down('sm')]: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      marginTop: '0px'
    },
    [_Theme.default.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  sidebarTitlesContainer: {
    minWidth: '0px',
    paddingRight: _Theme.default.spacing(1),
    [_Theme.default.breakpoints.only('sm')]: {
      display: 'flex',
      alignItems: 'baseline'
    }
  },
  sidebarLink: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '0.9rem',
    marginBottom: '12px'
  },
  sidebarLinkCurrent: {
    fontWeight: 700,
    color: _Theme.COLORS.GREY[500],
    textDecoration: 'none',
    '&:hover': {
      transition: 'all 0.45s',
      color: _Theme.COLORS.GREY[900]
    }
  },
  sidebarLinkIcon: {
    marginBottom: '-5px',
    marginRight: '5px',
    fontSize: '1.3rem'
  },
  sidebarLinksContainer: {
    flex: '1 1 auto',
    overflowY: 'auto',
    minHeight: '0px'
  },
  sidebarDivider: {
    margin: '24px 0px',
    [_Theme.default.breakpoints.down('sm')]: {
      margin: '16px 0px'
    },
    [_Theme.default.breakpoints.down('xs')]: {
      margin: '8px 0px 12px 0px'
    }
  },
  backdropPaper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '4px',
    padding: _Theme.default.spacing(3),
    position: 'sticky',
    top: _Theme.default.spacing(12),
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '70%',
    [_Theme.default.breakpoints.up('lg')]: {
      width: '50%'
    }
  },
  pageTitle: {
    margin: _Theme.default.spacing(3, 0, 4, 0),
    [_Theme.default.breakpoints.up('sm')]: {
      margin: _Theme.default.spacing(3, 0, 4, 0)
    }
  },
  pageSubtitle: {
    maxWidth: '660px',
    color: _Theme.COLORS.GREY[500],
    lineHeight: '1.5',
    fontSize: '1.1rem',
    marginTop: _Theme.default.spacing(-1),
    marginBottom: _Theme.default.spacing(4)
  },
  errorPageTitleIcon: {
    marginRight: _Theme.default.spacing(1.5),
    color: _Theme.default.palette.error.dark,
    fontSize: '2.3rem',
    marginBottom: '-3px'
  },
  errorPageCaption: {
    display: 'block',
    fontSize: '1rem',
    fontFamily: 'monospace, monospace',
    marginBottom: _Theme.default.spacing(4)
  },
  errorPageLogo: {
    height: '6em',
    marginTop: _Theme.default.spacing(3),
    marginBottom: _Theme.default.spacing(4)
  },
  dismissOverlay: {
    width: '100%',
    textAlign: 'right',
    marginTop: _Theme.default.spacing(2)
  }
}));

/**
  NEON Error Page
  Shown as the fallback for a general error boundary around all NEON page instances
 */
const NeonErrorPage = props => {
  const {
    error: {
      message,
      stack
    },
    resetErrorBoundary
  } = props;
  const classes = useStyles(0)();
  // eslint-disable-next-line no-console
  console.error(stack);
  return /*#__PURE__*/_react.default.createElement(_styles2.ThemeProvider, {
    theme: _Theme.default
  }, /*#__PURE__*/_react.default.createElement(_CssBaseline.default, null), /*#__PURE__*/_react.default.createElement(GlobalCss, null), /*#__PURE__*/_react.default.createElement(_Container.default, {
    className: classes.outerPageContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.pageContent,
    "data-selenium": "neon-page.content"
  }, /*#__PURE__*/_react.default.createElement("img", {
    title: "NEON Data Portal",
    alt: "NEON Data Portal",
    className: classes.errorPageLogo,
    src: _NSFNEONLogo.default
  }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h3",
    component: "h1",
    className: classes.pageTitle
  }, /*#__PURE__*/_react.default.createElement(_Warning.default, {
    className: classes.errorPageTitleIcon
  }), "Something broke."), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "caption",
    className: classes.errorPageCaption
  }, message)), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/_react.default.createElement(_Button.default, {
    startIcon: /*#__PURE__*/_react.default.createElement(_Autorenew.default, null),
    variant: "outlined",
    onClick: resetErrorBoundary
  }, "Reset and Try Again"), /*#__PURE__*/_react.default.createElement(_Button.default, {
    startIcon: /*#__PURE__*/_react.default.createElement(_Home.default, null),
    href: "/",
    style: {
      marginLeft: _Theme.default.spacing(4)
    }
  }, "Return Home"))), /*#__PURE__*/_react.default.createElement("input", {
    type: "hidden",
    "data-gtm": "react-page-run-time-error.stack",
    value: "".concat(stack)
  })));
};
exports.NeonErrorPage = NeonErrorPage;
NeonErrorPage.propTypes = {
  error: _propTypes.default.shape({
    message: _propTypes.default.string.isRequired,
    stack: _propTypes.default.string
  }).isRequired,
  resetErrorBoundary: _propTypes.default.func.isRequired
};
const NeonPage = props => {
  const {
    breadcrumbHomeHref,
    breadcrumbs,
    customHeader,
    customFooter,
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
    children
  } = props;

  /**
    Sidebar Setup
  */
  // Sidebar can have content OR links, not both. If both are set then content wins.
  const hasSidebarContent = sidebarContent !== null;
  const hasSidebarLinks = !sidebarContent && Array.isArray(sidebarLinks) && sidebarLinks.length > 0;
  const hasSidebar = hasSidebarContent || hasSidebarLinks;
  const classes = useStyles(hasSidebar ? sidebarWidth : 0)();
  const [{
    isActive: neonContextIsActive
  }] = _NeonContext.default.useNeonContextState();
  const headerRef = (0, _react.useRef)(null);
  const contentRef = (0, _react.useRef)(null);
  const sidebarRef = (0, _react.useRef)(null);
  const sidebarLinksContainerRef = (0, _react.useRef)(null);
  const belowMd = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm'));
  const [overlayDismissed, setOverlayDismissed] = (0, _react.useState)(false);

  // Boolean - whether any Drupal assets are used; only false if both header and footer are custom
  const useSomeDrupalAssets = _NeonEnvironment.default.fetchDrupalAssets && !(customHeader && customFooter);

  /**
    Continue Sidebar Setup
  */
  // sidebarLinksAsStandaloneChildren can only be true if all sidebar links have a defined component
  const sidebarLinksAsStandaloneChildren = hasSidebarLinks && sidebarLinksAsStandaloneChildrenProp ? sidebarLinks.every(link => link.component) : false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sidebarHashMap = !hasSidebarLinks ? {} : Object.fromEntries(sidebarLinks.map((link, idx) => [link.hash || '#', idx]));
  const initialCurrentSidebarHash = hasSidebarLinks ? sidebarLinks[0].hash || '#' : '#';
  const [currentSidebarHash, setCurrentSidebarHash] = (0, _react.useState)(initialCurrentSidebarHash);
  const [hashInitialized, setHashInitialized] = (0, _react.useState)(false);
  const [sidebarExpanded, setSidebarExpanded] = (0, _react.useState)(false); // for small viewports only

  // Get the vertical pixel offset for the content associated to any sidebar link by hash
  const getSidebarLinkScrollPosition = (0, _react.useCallback)(hash => {
    if (!hasSidebarLinks || sidebarLinksAsStandaloneChildren || !contentRef.current) {
      return -1;
    }
    const headerOffset = (headerRef.current || {}).offsetHeight || 0;
    const stickyOffset = belowMd ? (sidebarRef.current || {}).offsetHeight || 0 : 0;
    if (hash === '#') {
      return 0;
    }
    const anchor = contentRef.current.querySelector(hash);
    return !anchor ? -1 : anchor.offsetTop + headerOffset - stickyOffset - _Theme.default.spacing(5);
  }, [hasSidebarLinks, sidebarLinksAsStandaloneChildren, belowMd]);

  /**
     Effect - For sidebarLinks pages, on successful load, if hash is present then update the current
  */
  (0, _react.useLayoutEffect)(() => {
    if (error || loading || !hasSidebarLinks) {
      return () => {};
    }
    const handleHashChange = () => {
      const {
        hash
      } = document.location;
      if (currentSidebarHash === hash) {
        return;
      }
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
      sidebarLinksContainerRef.current.style.maxHeight = "".concat(maxHeight, "px");
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
      const scrollBreaks = sidebarLinks.map(link => ({
        y: getSidebarLinkScrollPosition(link.hash || '#'),
        hash: link.hash || '#'
      }));
      // Determine the current scrolled-to hash. If at the max scroll always go to the last hash.
      // Otherwise choose from scroll position relative to scroll breakpoints.
      const detectionBuffer = 80; // Extra pixels to highlight the next link when we're close enough
      const currentScrolledHash = isAtMaxScroll() ? scrollBreaks[scrollBreaks.length - 1].hash : scrollBreaks.reduce((acc, curr) => curr.y !== -1 && window.scrollY >= curr.y - detectionBuffer ? curr.hash : acc, sidebarLinks[0].hash || '#');
      if (currentScrolledHash !== currentSidebarHash) {
        setCurrentSidebarHash(currentScrolledHash);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [error, loading, sidebarLinks, sidebarHashMap, sidebarUnsticky, hasSidebarLinks, hashInitialized, setHashInitialized, currentSidebarHash, setCurrentSidebarHash, sidebarLinksContainerRef, getSidebarLinkScrollPosition, sidebarLinksAsStandaloneChildren]);

  /**
     Effect - Load Drupal CSS
  */
  const [drupalCssStatus, setDrupalCssStatus] = (0, _react.useState)(_NeonContext.FETCH_STATUS.AWAITING_CALL);
  (0, _react.useEffect)(() => {
    if (!useSomeDrupalAssets) {
      setDrupalCssStatus(_NeonContext.FETCH_STATUS.SUCCESS);
      return;
    }
    if (drupalCssStatus !== _NeonContext.FETCH_STATUS.AWAITING_CALL) {
      return;
    }
    setDrupalCssStatus(_NeonContext.FETCH_STATUS.FETCHING);
    fetch(_remoteAssetsMap.default[DRUPAL_THEME_CSS].url).then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch Drupal theme CSS');
      }
      return response.text();
    }).then(data => {
      const drupalStyle = document.createElement('style');
      const appliedData = _DrupalAssetService.default.cleanCss(data, true);
      drupalStyle.textContent = appliedData;
      document.head.appendChild(drupalStyle);
      try {
        const existingBlock = document.head.querySelector('link[data-meta="drupal-theme"]');
        if (typeof existingBlock !== 'undefined' && existingBlock !== null) {
          existingBlock.remove();
        }
      } catch (e) {
        console.error(e); // eslint-disable-line no-console
      }
      setDrupalCssStatus(_NeonContext.FETCH_STATUS.SUCCESS);
    }).catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);
      setDrupalCssStatus(_NeonContext.FETCH_STATUS.SUCCESS);
    });
  }, [useSomeDrupalAssets, drupalCssStatus, setDrupalCssStatus]);

  /**
     Liferay Notifications
   */
  const cancellationSubject$ = new _rxjs.Subject();
  const notificationDismissals = cookies.get('dismissed-notifications') || [];
  let initialFetchStatus = null;
  let initialNotifications = [];
  if (notification !== null && notification.length) {
    const notificationPropId = (0, _liferayNotificationsUtil.generateNotificationId)(notification);
    initialFetchStatus = 'success';
    initialNotifications = [{
      id: notificationPropId,
      message: notification,
      dismissed: notificationDismissals.includes(notificationPropId)
    }];
  }
  const [fetchNotificationsStatus, setFetchNotificationsStatus] = (0, _react.useState)(initialFetchStatus);
  const [notifications, setNotifications] = (0, _react.useState)(initialNotifications);

  // Handle a successful response from the notifications endpoint
  const handleFetchNotificationsSuccess = response => {
    setFetchNotificationsStatus('success');
    if (!Array.isArray(response.notifications)) {
      return;
    }
    setNotifications(response.notifications.map(message => {
      const id = (0, _liferayNotificationsUtil.generateNotificationId)(message);
      const dismissed = notificationDismissals.includes(id);
      return {
        id,
        message,
        dismissed
      };
    }));
  };

  // If the endpoint fails don't bother with any visible error. Just let it go.
  const handleFetchNotificationsError = () => {
    setFetchNotificationsStatus('error');
    setNotifications([]);
  };
  const handleHideNotifications = () => {
    const updatedDismissals = notifications.map(n => n.id);
    cookies.set('dismissed-notifications', updatedDismissals, {
      path: '/',
      maxAge: 86400
    });
    setNotifications(notifications.map(n => _extends({}, n, {
      dismissed: true
    })));
  };
  const handleShowNotifications = () => {
    cookies.remove('dismissed-notifications');
    setNotifications(notifications.map(n => _extends({}, n, {
      dismissed: false
    })));
  };

  /**
     Effect - Fetch notifications
  */
  (0, _react.useEffect)(() => {
    if (fetchNotificationsStatus !== null) {
      return;
    }
    setFetchNotificationsStatus('fetching');
    (0, _rxUtil.getJson)((0, _liferayNotificationsUtil.getLiferayNotificationsApiPath)(), handleFetchNotificationsSuccess, handleFetchNotificationsError, cancellationSubject$, undefined, true);
  }, [fetchNotificationsStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
     Render functions
   */
  const renderTitle = () => {
    if ((loading || error) && !title) {
      return /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
        width: "45%",
        height: 24,
        style: {
          margin: _Theme.default.spacing(2, 0, 4, 0)
        }
      });
    }
    if ((!title || !title.length) && !sidebarLinksAsStandaloneChildren) {
      return null;
    }
    let titleString = title || '';
    if (sidebarLinksAsStandaloneChildren) {
      const sidebarLink = sidebarLinks[sidebarHashMap[currentSidebarHash] || 0];
      titleString = sidebarLink.pageTitle || sidebarLink.name;
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      "data-selenium": "neon-page.title",
      variant: "h3",
      component: "h1",
      className: classes.pageTitle
    }, titleString), subtitle ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
      "data-selenium": "neon-page.subtitle",
      variant: "subtitle1",
      component: "p",
      className: classes.pageSubtitle
    }, subtitle) : null);
  };
  const renderBreadcrumbs = () => !breadcrumbs.length ? null : /*#__PURE__*/_react.default.createElement(_Breadcrumbs.default, {
    "aria-label": "Breadcrumbs",
    "data-selenium": "neon-page.breadcrumbs",
    className: classes.breadcrumbs
  }, /*#__PURE__*/_react.default.createElement(_Link.default, {
    key: (0, _uniqueId.default)(),
    href: breadcrumbHomeHref
  }, /*#__PURE__*/_react.default.createElement(_Home.default, {
    title: "Home",
    fontSize: "small",
    style: {
      marginBottom: '-4px'
    }
  })), breadcrumbs.map((breadcrumb, idx) => idx !== breadcrumbs.length - 1 ? /*#__PURE__*/_react.default.createElement(_Link.default, {
    key: (0, _uniqueId.default)(),
    href: breadcrumb.href
  }, breadcrumb.name) : /*#__PURE__*/_react.default.createElement(_Typography.default, {
    key: "{idx}",
    color: "textPrimary"
  }, breadcrumb.name)));
  const renderOverlay = overlayChildren => /*#__PURE__*/_react.default.createElement(_Backdrop.default, {
    open: !overlayDismissed
  }, /*#__PURE__*/_react.default.createElement(_Paper.default, {
    className: classes.backdropPaper
  }, overlayChildren, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.dismissOverlay
  }, /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    startIcon: /*#__PURE__*/_react.default.createElement(_Clear.default, null),
    variant: "outlined",
    onClick: () => {
      setOverlayDismissed(true);
    }
  }, "Dismiss"))));
  const renderLoading = () => !loading || error ? null : renderOverlay( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5",
    component: "h3",
    gutterBottom: true
  }, loading), progress === null ? /*#__PURE__*/_react.default.createElement(_CircularProgress.default, null) : /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
    variant: "determinate",
    value: progress
  })));
  const renderError = () => !error ? null : renderOverlay( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Warning.default, {
    fontSize: "large",
    color: "error"
  }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5",
    component: "h3",
    style: {
      marginTop: _Theme.default.spacing(1)
    }
  }, error)));
  const renderSidebar = () => {
    if (!hasSidebar) {
      return null;
    }
    const sidebarContainerStyle = belowMd ? {} : {
      width: "".concat(sidebarWidth, "px")
    };
    const dividerStyle = !belowMd ? {
      width: "".concat(sidebarWidth - _Theme.default.spacing(8), "px")
    } : {};
    const sidebarClassName = sidebarContainerClassNameProp ? "".concat(classes.sidebarContainer, " ").concat(sidebarContainerClassNameProp) : classes.sidebarContainer;
    // Arbitrary Content Sidebar (no automatic skeleton)
    if (hasSidebarContent && !sidebarContentResponsive) {
      return /*#__PURE__*/_react.default.createElement("div", {
        ref: sidebarRef,
        className: sidebarClassName,
        style: sidebarContainerStyle
      }, sidebarContent);
    }
    // Render Sidebar Title
    const renderSidebarTitle = () => {
      if (!sidebarTitle && !title) {
        return null;
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        className: classes.sidebarTitlesContainer
      }, loading || error ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
        width: 200,
        height: 22,
        style: {
          marginBottom: _Theme.default.spacing(1)
        }
      }), !sidebarSubtitle ? null : /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
        width: 120,
        height: 16,
        style: {
          marginBottom: _Theme.default.spacing(1)
        }
      })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "h5",
        component: "h3",
        className: classes.sidebarTitle
      }, sidebarTitle || title), !sidebarSubtitle ? null : /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2",
        component: "h4",
        className: classes.sidebarSubtitle
      }, sidebarSubtitle)));
    };
    // Arbitrary Content Sidebar (no automatic skeleton)
    if (hasSidebarContent) {
      return /*#__PURE__*/_react.default.createElement("div", {
        ref: sidebarRef,
        className: sidebarClassName,
        style: sidebarContainerStyle
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: !sidebarUnsticky && !belowMd ? "".concat(classes.sidebarInnerStickyContainer, " neon__sidebar-sticky") : null
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: classes.sidebarTitleContainer
      }, renderSidebarTitle(), !belowMd ? null : /*#__PURE__*/_react.default.createElement(_IconButton.default, {
        size: "small",
        onClick: () => setSidebarExpanded(!sidebarExpanded)
      }, sidebarExpanded ? /*#__PURE__*/_react.default.createElement(_ExpandLess.default, {
        fontSize: "large"
      }) : /*#__PURE__*/_react.default.createElement(_ExpandMore.default, {
        fontSize: "large"
      }))), !belowMd || sidebarExpanded ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Divider.default, {
        className: classes.sidebarDivider,
        style: _extends({}, dividerStyle)
      }), sidebarContent) : null));
    }
    // Render Single Sidebar Link
    const renderLink = function (link) {
      let standalone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (!link) {
        return null;
      }
      const {
        name,
        hash = '#',
        icon: IconComponent
      } = link;
      if (loading || error) {
        return /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
          key: name,
          width: "".concat(Math.floor(50 + Math.random() * 50), "%"),
          height: 16,
          style: {
            marginBottom: '16px'
          }
        });
      }
      const icon = IconComponent ? /*#__PURE__*/_react.default.createElement(IconComponent, {
        className: classes.sidebarLinkIcon
      }) : null;
      return /*#__PURE__*/_react.default.createElement(_Link.default, {
        key: name,
        href: hash,
        onClick: sidebarLinksAsStandaloneChildren ? () => {
          setCurrentSidebarHash(hash);
          if (sidebarExpanded) {
            setSidebarExpanded(false);
          }
        } : null,
        className: currentSidebarHash === hash ? "".concat(classes.sidebarLink, " ").concat(classes.sidebarLinkCurrent) : classes.sidebarLink,
        style: standalone ? {
          marginBottom: '0px'
        } : {}
      }, icon, name);
    };
    const fullLinks = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      ref: sidebarLinksContainerRef,
      className: classes.sidebarLinksContainer
    }, sidebarLinks.map(link => renderLink(link))), belowMd ? null : /*#__PURE__*/_react.default.createElement(_Divider.default, {
      className: classes.sidebarDivider,
      style: _extends({
        marginBottom: '0px'
      }, dividerStyle)
    }));
    const currentLinkOnly = /*#__PURE__*/_react.default.createElement("div", {
      className: classes.sidebarLinksContainer
    }, renderLink(sidebarLinks[sidebarHashMap[currentSidebarHash]], true));
    return /*#__PURE__*/_react.default.createElement("div", {
      ref: sidebarRef,
      className: sidebarClassName,
      style: sidebarContainerStyle
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: !sidebarUnsticky && !belowMd ? "".concat(classes.sidebarInnerStickyContainer, " neon__sidebar-sticky") : null
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.sidebarTitleContainer
    }, renderSidebarTitle(), !belowMd ? null : /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      size: "small",
      onClick: () => setSidebarExpanded(!sidebarExpanded)
    }, sidebarExpanded ? /*#__PURE__*/_react.default.createElement(_ExpandLess.default, {
      fontSize: "large"
    }) : /*#__PURE__*/_react.default.createElement(_ExpandMore.default, {
      fontSize: "large"
    }))), /*#__PURE__*/_react.default.createElement(_Divider.default, {
      className: classes.sidebarDivider,
      style: _extends({}, dividerStyle)
    }), sidebarLinksAdditionalContent && (!belowMd || sidebarExpanded) ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, sidebarLinksAdditionalContent, /*#__PURE__*/_react.default.createElement(_Divider.default, {
      className: classes.sidebarDivider,
      style: _extends({}, dividerStyle)
    })) : null, belowMd && !sidebarExpanded ? currentLinkOnly : fullLinks));
  };
  const renderNeonPage = () => {
    const outerPageContainerStyles = {};
    if (outerPageContainerMaxWidth) {
      outerPageContainerStyles.maxWidth = !hasSidebar || belowMd ? outerPageContainerMaxWidth : "calc(".concat(outerPageContainerMaxWidth, " - ").concat(sidebarWidth + 48, "px)");
    }
    let content = children;
    if (hasSidebarLinks && sidebarLinksAsStandaloneChildren) {
      const CurrentComponent = sidebarLinks[sidebarHashMap[currentSidebarHash] || 0].component;
      content = /*#__PURE__*/_react.default.createElement(CurrentComponent, null);
    }
    return /*#__PURE__*/_react.default.createElement(_styles2.ThemeProvider, {
      theme: _Theme.default
    }, /*#__PURE__*/_react.default.createElement(_CssBaseline.default, null), /*#__PURE__*/_react.default.createElement(GlobalCss, null), customHeader ? /*#__PURE__*/_react.default.createElement("header", {
      ref: headerRef
    }, customHeader) : /*#__PURE__*/_react.default.createElement(_NeonHeader.default, {
      ref: headerRef,
      unstickyDrupalHeader: unstickyDrupalHeader,
      notifications: notifications,
      onShowNotifications: handleShowNotifications,
      drupalCssLoaded: drupalCssStatus === _NeonContext.FETCH_STATUS.SUCCESS,
      showSkeleton: showHeaderSkeleton
    }), /*#__PURE__*/_react.default.createElement(_Container.default, {
      className: classes.outerPageContainer,
      style: outerPageContainerStyles
    }, renderSidebar(), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.pageContent,
      style: {
        top: hasSidebar && !breadcrumbs.length ? '12px' : '0px'
      },
      "data-selenium": "neon-page.content",
      ref: contentRef
    }, renderBreadcrumbs(), renderTitle(), content)), /*#__PURE__*/_react.default.createElement(_LiferayNotifications.default, {
      notifications: notifications,
      onHideNotifications: handleHideNotifications
    }), /*#__PURE__*/_react.default.createElement(_BrowserWarning.default, null), customFooter ? /*#__PURE__*/_react.default.createElement("footer", null, customFooter) : /*#__PURE__*/_react.default.createElement(_NeonFooter.default, {
      drupalCssLoaded: drupalCssStatus === _NeonContext.FETCH_STATUS.SUCCESS,
      showSkeleton: showFooterSkeleton
    }), renderLoading(), renderError());
  };
  const renderedPage = neonContextIsActive ? renderNeonPage() : /*#__PURE__*/_react.default.createElement(_NeonContext.default.Provider, _extends({
    useCoreAuth: true,
    fetchPartials: useSomeDrupalAssets
  }, NeonContextProviderProps), renderNeonPage());
  return /*#__PURE__*/_react.default.createElement(_reactErrorBoundary.ErrorBoundary, {
    FallbackComponent: NeonErrorPage,
    onReset: resetStateAfterRuntimeError
  }, renderedPage);
};
const children = _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]);
NeonPage.propTypes = {
  breadcrumbHomeHref: _propTypes.default.string,
  breadcrumbs: _propTypes.default.arrayOf(_propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    href: _propTypes.default.string
  })),
  customHeader: _propTypes.default.node,
  customFooter: _propTypes.default.node,
  showHeaderSkeleton: _propTypes.default.bool,
  showFooterSkeleton: _propTypes.default.bool,
  error: _propTypes.default.string,
  loading: _propTypes.default.string,
  notification: _propTypes.default.string,
  outerPageContainerMaxWidth: _propTypes.default.string,
  progress: _propTypes.default.number,
  resetStateAfterRuntimeError: _propTypes.default.func,
  sidebarContent: children,
  sidebarContentResponsive: _propTypes.default.bool,
  sidebarContainerClassName: _propTypes.default.string,
  sidebarLinks: _propTypes.default.arrayOf(_propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    pageTitle: _propTypes.default.string,
    hash: _propTypes.default.string,
    icon: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object]),
    component: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object])
  })),
  sidebarLinksAdditionalContent: children,
  sidebarLinksAsStandaloneChildren: _propTypes.default.bool,
  sidebarSubtitle: _propTypes.default.string,
  sidebarTitle: _propTypes.default.string,
  sidebarWidth: _propTypes.default.number,
  sidebarUnsticky: _propTypes.default.bool,
  subtitle: _propTypes.default.oneOfType([_propTypes.default.string, children]),
  title: _propTypes.default.oneOfType([_propTypes.default.string, children]),
  unstickyDrupalHeader: _propTypes.default.bool,
  NeonContextProviderProps: _propTypes.default.shape(_NeonContext.default.ProviderPropTypes),
  children: children.isRequired
};
NeonPage.defaultProps = {
  breadcrumbHomeHref: '/',
  breadcrumbs: [],
  customHeader: null,
  customFooter: null,
  showHeaderSkeleton: false,
  showFooterSkeleton: false,
  error: null,
  loading: null,
  notification: null,
  outerPageContainerMaxWidth: '2000px',
  progress: null,
  resetStateAfterRuntimeError: () => {},
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
  NeonContextProviderProps: {}
};
var _default = exports.default = NeonPage;