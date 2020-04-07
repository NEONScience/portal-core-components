"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _universalCookie = _interopRequireDefault(require("universal-cookie"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

var _rxjs = require("rxjs");

var _styles = require("@material-ui/core/styles");

var _styles2 = require("@material-ui/styles");

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _Container = _interopRequireDefault(require("@material-ui/core/Container"));

var _CssBaseline = _interopRequireDefault(require("@material-ui/core/CssBaseline"));

var _Breadcrumbs = _interopRequireDefault(require("@material-ui/core/Breadcrumbs"));

var _Link = _interopRequireDefault(require("@material-ui/core/Link"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));

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

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var cookies = new _universalCookie.default(); // Google Tag Manager Data Layer
// Define if not already defined. This must be set in the public/index.html for any apps/pages that
// would seek top use it. More info: https://developers.google.com/tag-manager/devguide

if (!window.gtmDataLayer) {
  window.gtmDataLayer = [];
}

var createUseStyles = function createUseStyles(props) {
  return (0, _styles.makeStyles)(function (theme) {
    var _pageContainer;

    return {
      outerPageContainer: _defineProperty({
        position: 'relative',
        minHeight: theme.spacing(30),
        maxWidth: props.outerPageContainerMaxWidth,
        paddingBottom: theme.spacing(3)
      }, theme.breakpoints.down('sm'), {
        paddingBottom: theme.spacing(2.5)
      }),
      pageContainer: (_pageContainer = {
        maxWidth: '2000px',
        padding: theme.spacing(3, 4)
      }, _defineProperty(_pageContainer, theme.breakpoints.down('sm'), {
        padding: theme.spacing(1.5, 2.5)
      }), _defineProperty(_pageContainer, '& a:not([class]), a[class=""]', {
        color: _Theme.COLORS.SECONDARY_BLUE[500],
        // MUST come from COLORS, not palette
        textDecoration: 'none'
      }), _defineProperty(_pageContainer, '& a:hover:not([class]), a:hover[class=""]', {
        textDecoration: 'underline'
      }), _pageContainer),
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
        zIndex: 10000
      },
      pageOverlayPaper: _defineProperty({
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
        width: '70%'
      }, theme.breakpoints.up('lg'), {
        width: '50%'
      }),
      pageTitle: _defineProperty({
        // The font size at larger breakpoints introduces noticeable letter spacing before
        // the first letter in the title. The negative left margins nudge it back into alignment.
        margin: theme.spacing(1, 0, 3, -0.25)
      }, theme.breakpoints.up('sm'), {
        margin: theme.spacing(1, 0, 3, -0.5)
      })
    };
  });
};

var NeonPage = function NeonPage(props) {
  var breadcrumbs = props.breadcrumbs,
      title = props.title,
      children = props.children,
      loading = props.loading,
      progress = props.progress,
      error = props.error,
      notification = props.notification,
      outerPageContainerMaxWidth = props.outerPageContainerMaxWidth;
  var useStylesProps = {
    theme: _Theme.default,
    outerPageContainerMaxWidth: outerPageContainerMaxWidth
  };
  var useStyles = createUseStyles(props);
  var classes = useStyles(useStylesProps);

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      neonContextIsActive = _NeonContext$useNeonC2[0].isActive;
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

  var _useState = (0, _react.useState)(initialFetchStatus),
      _useState2 = _slicedToArray(_useState, 2),
      fetchNotificationsStatus = _useState2[0],
      setFetchNotificationsStatus = _useState2[1];

  var _useState3 = (0, _react.useState)(initialNotifications),
      _useState4 = _slicedToArray(_useState3, 2),
      notifications = _useState4[0],
      setNotifications = _useState4[1];

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
      return _extends({}, n, {
        dismissed: true
      });
    }));
  };

  var handleShowNotifications = function handleShowNotifications() {
    cookies.remove('dismissed-notifications');
    setNotifications(notifications.map(function (n) {
      return _extends({}, n, {
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

    if (!title || !title.length) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement(_Typography.default, {
      "data-selenium": "neon-page.title",
      variant: "h3",
      component: "h1",
      className: classes.pageTitle
    }, title);
  };

  var renderBreadcrumbs = function renderBreadcrumbs() {
    return !breadcrumbs.length ? null : /*#__PURE__*/_react.default.createElement(_Breadcrumbs.default, {
      separator: "\u203A",
      "aria-label": "Breadcrumbs",
      variant: "overline",
      "data-selenium": "neon-page.breadcrumbs"
    }, /*#__PURE__*/_react.default.createElement(_Link.default, {
      color: "inherit",
      key: (0, _uniq.default)(),
      href: "/"
    }, "Home"), breadcrumbs.map(function (breadcrumb, idx) {
      return idx !== breadcrumbs.length - 1 ? /*#__PURE__*/_react.default.createElement(_Link.default, {
        key: (0, _uniq.default)(),
        color: "inherit",
        href: breadcrumb.href
      }, breadcrumb.name) : /*#__PURE__*/_react.default.createElement(_Typography.default, {
        key: "{idx}",
        color: "textPrimary"
      }, breadcrumb.name);
    }));
  };

  var renderOverlay = function renderOverlay(overlayChildren) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.pageOverlay
    }, /*#__PURE__*/_react.default.createElement(_Paper.default, {
      className: classes.pageOverlayPaper
    }, overlayChildren));
  };

  var renderLoading = function renderLoading() {
    return !loading || error ? null : renderOverlay( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
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
      variant: "h6",
      component: "h3",
      style: {
        marginTop: _Theme.default.spacing(1)
      }
    }, error)));
  };

  var renderNeonPage = function renderNeonPage() {
    return /*#__PURE__*/_react.default.createElement(_styles2.ThemeProvider, {
      theme: _Theme.default
    }, /*#__PURE__*/_react.default.createElement(_CssBaseline.default, null), /*#__PURE__*/_react.default.createElement(_NeonHeader.default, {
      notifications: notifications,
      onShowNotifications: handleShowNotifications
    }), /*#__PURE__*/_react.default.createElement(_Container.default, {
      className: classes.outerPageContainer
    }, /*#__PURE__*/_react.default.createElement(_Container.default, {
      className: classes.pageContainer,
      "data-selenium": "neon-page.content"
    }, renderBreadcrumbs(), renderTitle(), children), renderLoading(), renderError(), /*#__PURE__*/_react.default.createElement(_LiferayNotifications.default, {
      notifications: notifications,
      onHideNotifications: handleHideNotifications
    }), /*#__PURE__*/_react.default.createElement(_BrowserWarning.default, null)), /*#__PURE__*/_react.default.createElement(_NeonFooter.default, null));
  };

  return neonContextIsActive ? renderNeonPage() : /*#__PURE__*/_react.default.createElement(_NeonContext.default.Provider, null, renderNeonPage());
};

NeonPage.propTypes = {
  breadcrumbs: _propTypes.default.arrayOf(_propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    href: _propTypes.default.string
  })),
  title: _propTypes.default.string,
  loading: _propTypes.default.string,
  progress: _propTypes.default.number,
  error: _propTypes.default.string,
  notification: _propTypes.default.string,
  outerPageContainerMaxWidth: _propTypes.default.string,
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]).isRequired
};
NeonPage.defaultProps = {
  breadcrumbs: [],
  title: null,
  loading: null,
  progress: null,
  error: null,
  notification: null,
  outerPageContainerMaxWidth: '2000px'
};
var _default = NeonPage;
exports.default = _default;