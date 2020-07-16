"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _universalCookie = _interopRequireDefault(require("universal-cookie"));

var _uniqueId = _interopRequireDefault(require("lodash/uniqueId"));

var _rxjs = require("rxjs");

var _styles = require("@material-ui/core/styles");

var _styles2 = require("@material-ui/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _Backdrop = _interopRequireDefault(require("@material-ui/core/Backdrop"));

var _Breadcrumbs = _interopRequireDefault(require("@material-ui/core/Breadcrumbs"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _Container = _interopRequireDefault(require("@material-ui/core/Container"));

var _CssBaseline = _interopRequireDefault(require("@material-ui/core/CssBaseline"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _Link = _interopRequireDefault(require("@material-ui/core/Link"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _ExpandLess = _interopRequireDefault(require("@material-ui/icons/ExpandLess"));

var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));

var _ExpandMore = _interopRequireDefault(require("@material-ui/icons/ExpandMore"));

var _Home = _interopRequireDefault(require("@material-ui/icons/Home"));

var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));

var _Theme = _interopRequireWildcard(require("../Theme/Theme"));

var _NeonHeader = _interopRequireDefault(require("../NeonHeader/NeonHeader"));

var _NeonFooter = _interopRequireDefault(require("../NeonFooter/NeonFooter"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _BrowserWarning = _interopRequireDefault(require("./BrowserWarning"));

var _LiferayNotifications = _interopRequireDefault(require("./LiferayNotifications"));

var _rxUtil = require("../../util/rxUtil");

var _liferayNotificationsUtil = require("../../util/liferayNotificationsUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var cookies = new _universalCookie.default(); // Global CSS

var GlobalCss = (0, _styles.withStyles)({
  '@global': {
    code: {
      fontSize: '115%',
      padding: _Theme.default.spacing(0.25, 0.5),
      backgroundColor: 'rgba(0, 0, 0, 0.11)'
    }
  }
})(function () {
  return null;
}); // Function to determine if we're effectively scrolled to the bottom of the page. Used to set
// current sidebar link to the last one automatically when the associated content for the last link
// can't be scrolled past (i.e. is not taller than the page height less the footer height)

var isAtMaxScroll = function isAtMaxScroll() {
  var windowHeight = window.innerHeight || (document.documentElement || document.body).clientHeight;
  var documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
  var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
  var trackLength = documentHeight - windowHeight;
  return scrollTop / trackLength >= 0.99;
}; // Google Tag Manager Data Layer
// Define if not already defined. This must be set in the public/index.html for any apps/pages that
// would seek top use it. More info: https://developers.google.com/tag-manager/devguide


if (!window.gtmDataLayer) {
  window.gtmDataLayer = [];
} // NOTE: because these are defined outside the ThemeProvider any theme vars will come from
// MUI default, NOT the NeonTheme. Hence why some definitions use COLORS directly.


var useStyles = (0, _styles.makeStyles)(function (theme) {
  var _outerPageContainer, _pageContent, _sidebarContainer, _sidebarSubtitle, _sidebarDivider;

  return {
    outerPageContainer: (_outerPageContainer = {
      position: 'relative',
      minHeight: theme.spacing(30),
      borderTop: '2px solid transparent'
    }, _defineProperty(_outerPageContainer, theme.breakpoints.up('md'), {
      display: 'table',
      tableLayout: 'fixed'
    }), _defineProperty(_outerPageContainer, theme.breakpoints.down('sm'), {
      paddingBottom: theme.spacing(2.5),
      flexDirection: 'column'
    }), _outerPageContainer),
    pageContent: (_pageContent = {
      display: 'table-cell',
      position: 'relative',
      padding: theme.spacing(4),
      paddingBottom: theme.spacing(8)
    }, _defineProperty(_pageContent, theme.breakpoints.down('sm'), {
      display: 'block',
      padding: theme.spacing(3),
      paddingBottom: theme.spacing(6)
    }), _defineProperty(_pageContent, '& a:not([class]), a[class=""]', {
      color: _Theme.COLORS.LIGHT_BLUE[500],
      textDecoration: 'none'
    }), _defineProperty(_pageContent, '& a:hover:not([class]), a:hover[class=""]', {
      textDecoration: 'underline'
    }), _pageContent),
    sidebarContainer: (_sidebarContainer = {
      display: 'table-cell',
      backgroundColor: _Theme.COLORS.GREY[50],
      padding: theme.spacing(5, 4)
    }, _defineProperty(_sidebarContainer, theme.breakpoints.down('sm'), {
      display: 'inline-block',
      width: '100%',
      maxHeight: 'calc(100vh - 84px)',
      padding: theme.spacing(2.5, 2),
      position: 'sticky',
      top: '-2px',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
      zIndex: 1
    }), _defineProperty(_sidebarContainer, theme.breakpoints.down('xs'), {
      padding: theme.spacing(1.5)
    }), _sidebarContainer),
    sidebarInnerStickyContainer: {
      position: 'sticky',
      top: '40px'
    },
    sidebarTitleContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    sidebarTitle: _defineProperty({
      fontWeight: 700
    }, theme.breakpoints.down('sm'), {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }),
    sidebarSubtitle: (_sidebarSubtitle = {
      color: _Theme.COLORS.GREY[300],
      marginTop: _Theme.default.spacing(1)
    }, _defineProperty(_sidebarSubtitle, theme.breakpoints.down('sm'), {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }), _defineProperty(_sidebarSubtitle, theme.breakpoints.down('xs'), {
      display: 'none'
    }), _sidebarSubtitle),
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
    sidebarDivider: (_sidebarDivider = {
      margin: '24px 0px'
    }, _defineProperty(_sidebarDivider, theme.breakpoints.down('sm'), {
      margin: '16px 0px'
    }), _defineProperty(_sidebarDivider, theme.breakpoints.down('xs'), {
      margin: '8px 0px 12px 0px'
    }), _sidebarDivider),
    breadcrumbs: {
      marginTop: '24px'
    },
    backdropPaper: _defineProperty({
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
      width: '70%'
    }, theme.breakpoints.up('lg'), {
      width: '50%'
    }),
    pageTitle: _defineProperty({
      margin: theme.spacing(3, 0, 4, 0)
    }, theme.breakpoints.up('sm'), {
      margin: theme.spacing(3, 0, 4, 0)
    }),
    pageSubtitle: {
      maxWidth: '660px',
      color: _Theme.COLORS.GREY[500],
      lineHeight: '1.5',
      fontSize: '1.1rem',
      marginTop: theme.spacing(-1),
      marginBottom: theme.spacing(4)
    }
  };
});
var DRUPAL_CSS_URL = 'https://preview.neonscience.org/themes/custom/neon/build/components/theme/theme.css';

var NeonPage = function NeonPage(props) {
  var breadcrumbs = props.breadcrumbs,
      error = props.error,
      loading = props.loading,
      notification = props.notification,
      outerPageContainerMaxWidth = props.outerPageContainerMaxWidth,
      progress = props.progress,
      sidebarContent = props.sidebarContent,
      sidebarContainerClassNameProp = props.sidebarContainerClassName,
      sidebarLinks = props.sidebarLinks,
      sidebarLinksAsStandaloneChildrenProp = props.sidebarLinksAsStandaloneChildren,
      sidebarSubtitle = props.sidebarSubtitle,
      sidebarTitle = props.sidebarTitle,
      sidebarWidth = props.sidebarWidth,
      sidebarUnsticky = props.sidebarUnsticky,
      subtitle = props.subtitle,
      title = props.title,
      useCoreHeader = props.useCoreHeader,
      unstickyDrupalHeader = props.unstickyDrupalHeader,
      children = props.children;
  var classes = useStyles(_Theme.default);

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      neonContextIsActive = _NeonContext$useNeonC2[0].isActive;

  var headerRef = (0, _react.useRef)(null);
  var contentRef = (0, _react.useRef)(null);
  var sidebarRef = (0, _react.useRef)(null);
  var belowMd = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm'));
  /**
    Sidebar Setup
  */
  // Sidebar can have content OR links, not both. If both are set then content wins.

  var hasSidebarContent = sidebarContent !== null;
  var hasSidebarLinks = !sidebarContent && Array.isArray(sidebarLinks) && sidebarLinks.length > 0;
  var hasSidebar = hasSidebarContent || hasSidebarLinks; // sidebarLinksAsStandaloneChildren can only be true if all sidebar links have a defined component

  var sidebarLinksAsStandaloneChildren = hasSidebarLinks && sidebarLinksAsStandaloneChildrenProp ? sidebarLinks.every(function (link) {
    return link.component;
  }) : false;
  var sidebarHashMap = !hasSidebarLinks ? {} : Object.fromEntries(sidebarLinks.map(function (link, idx) {
    return [link.hash || '#', idx];
  }));
  var initialCurrectSidebarHash = hasSidebarLinks ? sidebarLinks[0].hash || '#' : '#';

  var _useState = (0, _react.useState)(initialCurrectSidebarHash),
      _useState2 = _slicedToArray(_useState, 2),
      currentSidebarHash = _useState2[0],
      setCurrentSidebarHash = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      hashInitialized = _useState4[0],
      setHashInitialized = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      sidebarExpanded = _useState6[0],
      setSidebarExpanded = _useState6[1]; // for small viewports only
  // Get the vertical pixel offset for the content associated to any sidebar link by hash


  var getSidebarLinkScrollPosition = (0, _react.useCallback)(function (hash) {
    if (!hasSidebarLinks || sidebarLinksAsStandaloneChildren || !contentRef.current) {
      return -1;
    }

    var headerOffset = (headerRef.current || {}).offsetHeight || 0;
    var stickyOffset = belowMd ? (sidebarRef.current || {}).offsetHeight || 0 : 0;

    if (hash === '#') {
      return 0;
    }

    var anchor = contentRef.current.querySelector(hash);
    return !anchor ? -1 : anchor.offsetTop + headerOffset - stickyOffset - _Theme.default.spacing(5);
  }, [hasSidebarLinks, sidebarLinksAsStandaloneChildren, belowMd]); // For sidebarLinks pages, on successful load, if hash is present then update the current

  (0, _react.useLayoutEffect)(function () {
    if (error || loading || !hasSidebarLinks) {
      return function () {};
    } // Handle URL-defined hash on initial load


    if (document.location.hash && !hashInitialized) {
      // Ensure the document hash maps to a defined hash or '#' at all times
      if (!Object.keys(sidebarHashMap).includes(document.location.hash)) {
        document.location.hash = '#';
      }

      var hash = document.location.hash;

      if (currentSidebarHash !== hash) {
        setCurrentSidebarHash(hash); // If standard sidebar mode (scroll to content) also perform the scroll offset here

        if (!sidebarLinksAsStandaloneChildren) {
          window.setTimeout(function () {
            window.scrollTo(0, getSidebarLinkScrollPosition(hash));
          }, 0);
        }
      }

      setHashInitialized(true);
    } // Set up event listener / handler for user-input scroll events for standard scrolling pages


    if (sidebarLinksAsStandaloneChildren) {
      return function () {};
    }

    var handleScroll = function handleScroll() {
      var scrollBreaks = sidebarLinks.map(function (link) {
        return {
          y: getSidebarLinkScrollPosition(link.hash || '#'),
          hash: link.hash || '#'
        };
      }); // Determine the current scrolled-to hash. If at the max scroll always go to the last hash.
      // Otherwise choose from scroll position relative to scroll breakpoints.

      var detectionBuffer = 80; // Extra pixels to highlight the next link when we're close enough

      var currentScrolledHash = isAtMaxScroll() ? scrollBreaks[scrollBreaks.length - 1].hash : scrollBreaks.reduce(function (acc, curr) {
        return curr.y !== -1 && window.scrollY >= curr.y - detectionBuffer ? curr.hash : acc;
      }, sidebarLinks[0].hash || '#');

      if (currentScrolledHash !== currentSidebarHash) {
        setCurrentSidebarHash(currentScrolledHash);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return function () {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [error, loading, hasSidebarLinks, sidebarLinks, sidebarHashMap, hashInitialized, setHashInitialized, currentSidebarHash, setCurrentSidebarHash, getSidebarLinkScrollPosition, sidebarLinksAsStandaloneChildren]);
  /**
     Drupal CSS Loading
  */

  var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      drupalCssLoaded = _useState8[0],
      setDrupalCssLoaded = _useState8[1];

  (0, _react.useEffect)(function () {
    if (useCoreHeader || drupalCssLoaded) {
      return;
    }

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = DRUPAL_CSS_URL;
    document.body.appendChild(link);
    setDrupalCssLoaded(true);
  }, [useCoreHeader, drupalCssLoaded, setDrupalCssLoaded]);
  /**
     Liferay Notifications
   */

  var cancellationSubject$ = new _rxjs.Subject();
  var notificationDismissals = cookies.get('dismissed-notifications') || [];
  var initialFetchStatus = null;
  var initialNotifications = [];

  if (notification !== null && notification.length) {
    var notificationPropId = (0, _liferayNotificationsUtil.generateNotificationId)(notification);
    initialFetchStatus = 'success';
    initialNotifications = [{
      id: notificationPropId,
      message: notification,
      dismissed: notificationDismissals.includes(notificationPropId)
    }];
  }

  var _useState9 = (0, _react.useState)(initialFetchStatus),
      _useState10 = _slicedToArray(_useState9, 2),
      fetchNotificationsStatus = _useState10[0],
      setFetchNotificationsStatus = _useState10[1];

  var _useState11 = (0, _react.useState)(initialNotifications),
      _useState12 = _slicedToArray(_useState11, 2),
      notifications = _useState12[0],
      setNotifications = _useState12[1]; // Handle a successful response from the notifications endpoint


  var handleFetchNotificationsSuccess = function handleFetchNotificationsSuccess(response) {
    setFetchNotificationsStatus('success');

    if (!Array.isArray(response.notifications)) {
      return;
    }

    setNotifications(response.notifications.map(function (message) {
      var id = (0, _liferayNotificationsUtil.generateNotificationId)(message);
      var dismissed = notificationDismissals.includes(id);
      return {
        id: id,
        message: message,
        dismissed: dismissed
      };
    }));
  }; // If the endpoint fails don't bother with any visible error. Just let it go.


  var handleFetchNotificationsError = function handleFetchNotificationsError() {
    setFetchNotificationsStatus('error');
    setNotifications([]);
  };

  var handleHideNotifications = function handleHideNotifications() {
    var updatedDismissals = notifications.map(function (n) {
      return n.id;
    });
    cookies.set('dismissed-notifications', updatedDismissals, {
      path: '/',
      maxAge: 86400
    });
    setNotifications(notifications.map(function (n) {
      return _extends(_extends({}, n), {}, {
        dismissed: true
      });
    }));
  };

  var handleShowNotifications = function handleShowNotifications() {
    cookies.remove('dismissed-notifications');
    setNotifications(notifications.map(function (n) {
      return _extends(_extends({}, n), {}, {
        dismissed: false
      });
    }));
  };

  (0, _react.useEffect)(function () {
    if (fetchNotificationsStatus !== null) {
      return;
    }

    setFetchNotificationsStatus('fetching');
    (0, _rxUtil.getJson)((0, _liferayNotificationsUtil.getLiferayNotificationsApiPath)(), handleFetchNotificationsSuccess, handleFetchNotificationsError, cancellationSubject$);
  }, [fetchNotificationsStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
     Render functions
   */

  var renderTitle = function renderTitle() {
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

    var titleString = title || '';

    if (sidebarLinksAsStandaloneChildren) {
      var sidebarLink = sidebarLinks[sidebarHashMap[currentSidebarHash] || 0];
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

  var renderBreadcrumbs = function renderBreadcrumbs() {
    return !breadcrumbs.length ? null : /*#__PURE__*/_react.default.createElement(_Breadcrumbs.default, {
      "aria-label": "Breadcrumbs",
      "data-selenium": "neon-page.breadcrumbs",
      className: classes.breadcrumbs
    }, /*#__PURE__*/_react.default.createElement(_Link.default, {
      key: (0, _uniqueId.default)(),
      href: "/"
    }, /*#__PURE__*/_react.default.createElement(_Home.default, {
      title: "Home",
      fontSize: "small",
      style: {
        marginBottom: '-4px'
      }
    })), breadcrumbs.map(function (breadcrumb, idx) {
      return idx !== breadcrumbs.length - 1 ? /*#__PURE__*/_react.default.createElement(_Link.default, {
        key: (0, _uniqueId.default)(),
        href: breadcrumb.href
      }, breadcrumb.name) : /*#__PURE__*/_react.default.createElement(_Typography.default, {
        key: "{idx}",
        color: "textPrimary"
      }, breadcrumb.name);
    }));
  };

  var renderOverlay = function renderOverlay(overlayChildren) {
    return /*#__PURE__*/_react.default.createElement(_Backdrop.default, {
      open: true
    }, /*#__PURE__*/_react.default.createElement(_Paper.default, {
      className: classes.backdropPaper
    }, overlayChildren));
  };

  var renderLoading = function renderLoading() {
    return !loading || error ? null : renderOverlay( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h5",
      component: "h3",
      gutterBottom: true
    }, loading), progress === null ? /*#__PURE__*/_react.default.createElement(_CircularProgress.default, null) : /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
      variant: "static",
      value: progress
    })));
  };

  var renderError = function renderError() {
    return !error ? null : renderOverlay( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Warning.default, {
      fontSize: "large",
      color: "error"
    }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h5",
      component: "h3",
      style: {
        marginTop: _Theme.default.spacing(1)
      }
    }, error)));
  };

  var renderSidebar = function renderSidebar() {
    if (!hasSidebar) {
      return null;
    }

    var sidebarContainerStyle = belowMd ? {} : {
      width: "".concat(sidebarWidth, "px")
    };
    var dividerStyle = !belowMd ? {
      width: "".concat(sidebarWidth - _Theme.default.spacing(8), "px")
    } : {};
    var sidebarClassName = sidebarContainerClassNameProp ? "".concat(classes.sidebarContainer, " ").concat(sidebarContainerClassNameProp) : classes.sidebarContainer; // Arbitrary Content Sidebar (no automatic skeleton)

    if (hasSidebarContent) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
        ref: sidebarRef,
        className: sidebarClassName,
        style: sidebarContainerStyle
      }, sidebarContent));
    } // Render Sidebar Title


    var renderSidebarTitle = function renderSidebarTitle() {
      if (!sidebarTitle && !title) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement("div", {
        style: {
          minWidth: '0px',
          paddingRight: '8px'
        }
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
    }; // Render Single Sidebar Link


    var renderLink = function renderLink(link) {
      var standalone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!link) {
        return null;
      }

      var name = link.name,
          _link$hash = link.hash,
          hash = _link$hash === void 0 ? '#' : _link$hash,
          IconComponent = link.icon;

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

      var icon = IconComponent ? /*#__PURE__*/_react.default.createElement(IconComponent, {
        className: classes.sidebarLinkIcon
      }) : null;
      return /*#__PURE__*/_react.default.createElement(_Link.default, {
        key: name,
        href: hash,
        onClick: sidebarLinksAsStandaloneChildren ? function () {
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

    var fullLinks = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.sidebarLinksContainer
    }, sidebarLinks.map(function (link) {
      return renderLink(link);
    })), belowMd ? null : /*#__PURE__*/_react.default.createElement(_Divider.default, {
      className: classes.sidebarDivider,
      style: _extends({
        marginBottom: '0px'
      }, dividerStyle)
    }));

    var currentLinkOnly = /*#__PURE__*/_react.default.createElement("div", {
      className: classes.sidebarLinksContainer
    }, renderLink(sidebarLinks[sidebarHashMap[currentSidebarHash]], true));

    return /*#__PURE__*/_react.default.createElement("div", {
      ref: sidebarRef,
      className: sidebarClassName,
      style: sidebarContainerStyle
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: !sidebarUnsticky && !belowMd ? classes.sidebarInnerStickyContainer : null
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.sidebarTitleContainer
    }, renderSidebarTitle(), !belowMd ? null : /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      size: "small",
      onClick: function onClick() {
        return setSidebarExpanded(!sidebarExpanded);
      }
    }, sidebarExpanded ? /*#__PURE__*/_react.default.createElement(_ExpandLess.default, {
      fontSize: "large"
    }) : /*#__PURE__*/_react.default.createElement(_ExpandMore.default, {
      fontSize: "large"
    }))), /*#__PURE__*/_react.default.createElement(_Divider.default, {
      className: classes.sidebarDivider,
      style: _extends({}, dividerStyle)
    }), belowMd && !sidebarExpanded ? currentLinkOnly : fullLinks));
  };

  var renderNeonPage = function renderNeonPage() {
    var outerPageContainerStyles = {};

    if (outerPageContainerMaxWidth) {
      outerPageContainerStyles.maxWidth = !hasSidebar || belowMd ? outerPageContainerMaxWidth : "calc(".concat(outerPageContainerMaxWidth, " - ").concat(sidebarWidth + 48, "px)");
    }

    var content = children;

    if (hasSidebarLinks && sidebarLinksAsStandaloneChildren) {
      var CurrentComponent = sidebarLinks[sidebarHashMap[currentSidebarHash] || 0].component;
      content = /*#__PURE__*/_react.default.createElement(CurrentComponent, null);
    }

    return /*#__PURE__*/_react.default.createElement(_styles2.ThemeProvider, {
      theme: _Theme.default
    }, /*#__PURE__*/_react.default.createElement(_CssBaseline.default, null), /*#__PURE__*/_react.default.createElement(GlobalCss, null), /*#__PURE__*/_react.default.createElement(_NeonHeader.default, {
      ref: headerRef,
      useCoreHeader: useCoreHeader,
      unstickyDrupalHeader: unstickyDrupalHeader,
      notifications: notifications,
      onShowNotifications: handleShowNotifications,
      drupalCssLoaded: drupalCssLoaded
    }), /*#__PURE__*/_react.default.createElement(_Container.default, {
      className: classes.outerPageContainer,
      style: outerPageContainerStyles
    }, renderSidebar(), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.pageContent,
      style: {
        top: breadcrumbs.length ? '0px' : '12px'
      },
      "data-selenium": "neon-page.content",
      ref: contentRef
    }, renderBreadcrumbs(), renderTitle(), content), renderLoading(), renderError(), /*#__PURE__*/_react.default.createElement(_LiferayNotifications.default, {
      notifications: notifications,
      onHideNotifications: handleHideNotifications
    }), /*#__PURE__*/_react.default.createElement(_BrowserWarning.default, null)), /*#__PURE__*/_react.default.createElement(_NeonFooter.default, {
      drupalCssLoaded: drupalCssLoaded
    }));
  };

  return neonContextIsActive ? renderNeonPage() : /*#__PURE__*/_react.default.createElement(_NeonContext.default.Provider, {
    useCoreAuth: true,
    useCoreHeader: useCoreHeader
  }, renderNeonPage());
};

var children = _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]);

NeonPage.propTypes = {
  breadcrumbs: _propTypes.default.arrayOf(_propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    href: _propTypes.default.string
  })),
  error: _propTypes.default.string,
  loading: _propTypes.default.string,
  notification: _propTypes.default.string,
  outerPageContainerMaxWidth: _propTypes.default.string,
  progress: _propTypes.default.number,
  sidebarContent: children,
  sidebarContainerClassName: _propTypes.default.string,
  sidebarLinks: _propTypes.default.arrayOf(_propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    pageTitle: _propTypes.default.string,
    hash: _propTypes.default.string,
    icon: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object]),
    component: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object])
  })),
  sidebarLinksAsStandaloneChildren: _propTypes.default.bool,
  sidebarSubtitle: _propTypes.default.string,
  sidebarTitle: _propTypes.default.string,
  sidebarWidth: _propTypes.default.number,
  sidebarUnsticky: _propTypes.default.bool,
  subtitle: _propTypes.default.string,
  title: _propTypes.default.string,
  useCoreHeader: _propTypes.default.bool,
  unstickyDrupalHeader: _propTypes.default.bool,
  children: children.isRequired
};
NeonPage.defaultProps = {
  breadcrumbs: [],
  error: null,
  loading: null,
  notification: null,
  outerPageContainerMaxWidth: '2000px',
  progress: null,
  sidebarContent: null,
  sidebarContainerClassName: null,
  sidebarLinks: null,
  sidebarLinksAsStandaloneChildren: false,
  sidebarSubtitle: null,
  sidebarTitle: null,
  sidebarWidth: 300,
  sidebarUnsticky: false,
  subtitle: null,
  title: null,
  useCoreHeader: false,
  unstickyDrupalHeader: true
};
var _default = NeonPage;
exports.default = _default;