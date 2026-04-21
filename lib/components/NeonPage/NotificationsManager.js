"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = require("prop-types");
var _universalCookie = _interopRequireDefault(require("universal-cookie"));
var _rxjs = require("rxjs");
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _LiferayNotifications = _interopRequireDefault(require("./LiferayNotifications"));
var _liferayNotificationsUtil = require("../../util/liferayNotificationsUtil");
var _rxUtil = require("../../util/rxUtil");
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const myAccountLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
  href: _NeonEnvironment.default.route.buildAccountRoute(),
  target: "_blank"
}, "My Account");
const contactUsLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
  href: _RouteService.default.getContactUsPath(),
  target: "_blank"
}, "Contact Us");

/* eslint-disable react/jsx-one-expression-per-line */
const TOKEN_EXPIRY_MESSAGE = /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
  variant: "subtitle2",
  gutterBottom: true
}, "API Token Expiration Notice"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
  variant: "body2"
}, "An API Token associated with your account is expiring soon. If you would like a new token, please navigate to your ", myAccountLink, " page. At the bottom of your account page, click on the \u201CGet API Token\u201D button. You can delete an expired token by clicking the three dots under the Actions column. If you have any questions or issues, please let us know through our ", contactUsLink, " form."));
/* eslint-enable react/jsx-one-expression-per-line */

const cookies = new _universalCookie.default();
const NotificationsManager = props => {
  const {
    initialNotification
  } = props;
  const notificationDismissals = cookies.get('dismissed-notifications') || [];
  const cancellationSubject$ = new _rxjs.Subject();
  let initialNotifications = [];
  if (initialNotification !== null && initialNotification.length) {
    const notificationPropId = (0, _liferayNotificationsUtil.generateNotificationId)(initialNotification);
    initialNotifications = [{
      id: notificationPropId,
      message: initialNotification,
      dismissed: notificationDismissals.includes(notificationPropId)
    }];
  }
  const [{
    isActive,
    auth: {
      userData
    }
  }] = _NeonContext.default.useNeonContextState();
  const [fetchNotificationsStatus, setFetchNotificationsStatus] = (0, _react.useState)(null);
  const [manualNotifications, setManualNotifications] = (0, _react.useState)(initialNotifications);
  const [liferayNotifications, setLiferayNotifications] = (0, _react.useState)([]);
  const [userInfoNotifications, setUserInfoNotifications] = (0, _react.useState)([]);
  const [isUserStatusNotificationsFetched, setIsUserStatusNotificationsFetched] = (0, _react.useState)(false);
  const handleFetchNotificationsSuccess = response => {
    setFetchNotificationsStatus('success');
    if (!Array.isArray(response.notifications)) {
      return;
    }
    const newNotifications = [...liferayNotifications];
    response.notifications.forEach(message => {
      const id = (0, _liferayNotificationsUtil.generateNotificationId)(message);
      const dismissed = notificationDismissals.includes(id);
      newNotifications.push({
        id,
        message,
        dismissed
      });
    });
    setLiferayNotifications(newNotifications);
  };
  const handleUserInfoNotifications = () => {
    var _userData$data, _userData$data2;
    // verifies user is logged in
    if (!isActive || !(userData !== null && userData !== void 0 && (_userData$data = userData.data) !== null && _userData$data !== void 0 && _userData$data.user)) {
      return;
    }
    setIsUserStatusNotificationsFetched(true);
    if ((userData === null || userData === void 0 || (_userData$data2 = userData.data) === null || _userData$data2 === void 0 ? void 0 : _userData$data2.expiringApiToken) === true) {
      const idObject = {
        message: TOKEN_EXPIRY_MESSAGE
      };
      const id = (0, _liferayNotificationsUtil.generateNotificationId)(JSON.stringify(idObject));
      const dismissed = notificationDismissals.includes(id);
      const newNotifications = [...userInfoNotifications];
      const newNotification = {
        id,
        dismissed,
        message: TOKEN_EXPIRY_MESSAGE,
        isReactNode: true
      };
      newNotifications.push(newNotification);
      setUserInfoNotifications(newNotifications);
    }
  };

  // If the endpoint fails don't bother with any visible error. Just let it go.
  const handleFetchNotificationsError = () => {
    setFetchNotificationsStatus('error');
  };
  const handleHideNotifications = () => {
    const dismissNotifications = [...manualNotifications, ...liferayNotifications, ...userInfoNotifications];
    const updatedDismissals = dismissNotifications.map(n => n.id);
    cookies.set('dismissed-notifications', updatedDismissals, {
      path: '/',
      maxAge: 86400
    });
    if ((0, _typeUtil.existsNonEmpty)(manualNotifications)) {
      setManualNotifications(manualNotifications.map(n => _extends({}, n, {
        dismissed: true
      })));
    }
    if ((0, _typeUtil.existsNonEmpty)(liferayNotifications)) {
      setLiferayNotifications(liferayNotifications.map(n => _extends({}, n, {
        dismissed: true
      })));
    }
    if ((0, _typeUtil.existsNonEmpty)(userInfoNotifications)) {
      setUserInfoNotifications(userInfoNotifications.map(n => _extends({}, n, {
        dismissed: true
      })));
    }
  };

  /**
   Effect - Fetch liferay notifications
  */
  (0, _react.useEffect)(() => {
    if (fetchNotificationsStatus !== null) {
      return;
    }
    setFetchNotificationsStatus('fetching');
    (0, _rxUtil.getJson)((0, _liferayNotificationsUtil.getLiferayNotificationsApiPath)(), handleFetchNotificationsSuccess, handleFetchNotificationsError, cancellationSubject$, undefined, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNotificationsStatus]);

  /**
   Effect - Listen for userData/auth fetch
  */
  (0, _react.useEffect)(() => {
    if (!userData || isUserStatusNotificationsFetched) {
      return;
    }
    handleUserInfoNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, isUserStatusNotificationsFetched]);
  const appliedNotifications = [...manualNotifications, ...liferayNotifications, ...userInfoNotifications];
  return /*#__PURE__*/_react.default.createElement(_LiferayNotifications.default, {
    notifications: appliedNotifications,
    onHideNotifications: handleHideNotifications
  });
};
NotificationsManager.propTypes = {
  initialNotification: _propTypes.string
};
NotificationsManager.defaultProps = {
  initialNotification: null
};
var _default = exports.default = NotificationsManager;