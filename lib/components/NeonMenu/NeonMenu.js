"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _rcMenu = _interopRequireWildcard(require("rc-menu"));

var _rxjs = require("rxjs");

var _get = _interopRequireDefault(require("lodash/get"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Hidden = _interopRequireDefault(require("@material-ui/core/Hidden"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _Drawer = _interopRequireDefault(require("@material-ui/core/Drawer"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _Menu = _interopRequireDefault(require("@material-ui/icons/Menu"));

var _ChevronLeft = _interopRequireDefault(require("@material-ui/icons/ChevronLeft"));

var _Home = _interopRequireDefault(require("@material-ui/icons/Home"));

var _Notifications = _interopRequireDefault(require("@material-ui/icons/Notifications"));

var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));

var _NeonAuth = _interopRequireWildcard(require("../NeonAuth/NeonAuth"));

var _NeonDrawerMenu = _interopRequireDefault(require("./NeonDrawerMenu"));

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

var _Theme = require("../Theme/Theme");

require("./NeonMenu.css");

var _NSFNEONLogo = _interopRequireDefault(require("../../images/NSF-NEON-logo.png"));

var _menuDefaultFallback = _interopRequireDefault(require("./menuDefaultFallback.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var domParser = new DOMParser();

var decodeName = function decodeName(name) {
  return domParser.parseFromString(name, 'text/html').documentElement.textContent;
};
/**
 * Generates the specified menu item for rc-menu (NOT material-ui)
 * @param {item} object The menu item definition to build from
 * @param {index} int The index of the menu item in the collection
 * @param {depth} int The relative depth of the menu item (0 is top-level)
 * @return The generate menu item JSX.Element
 */


var generateRCMenuItem = function generateRCMenuItem(item, index) {
  var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (item.url === '/home') {
    return null;
  }

  var childElements = [];

  if (item.children.length > 0) {
    childElements = item.children.map(function (childItem, childIndex) {
      return generateRCMenuItem(childItem, "".concat(index.toString(), "-").concat(childIndex.toString()), depth + 1);
    });
  }

  var key = "".concat(index.toString(), "-1");
  var seleniumKey = item.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  var linkElement = /*#__PURE__*/_react.default.createElement("a", {
    href: item.url,
    "data-selenium": "neon-menu.link.".concat(seleniumKey)
  }, decodeName(item.name));

  var element = null;

  if (childElements.length > 0) {
    // isContainer is a Liferay boolean that means "has children but is not a link"
    // Liferay also mandates all menu items have a non-empty url EVEN IF they are not links
    // So this bit here updates the href we're actually going to use accordingly.
    var titleElement = decodeName(item.name);

    if (!item.isContainer) {
      titleElement = linkElement;
    } // NOTE: We want to put data-selenium={`neon-menu.submenu.${seleniumKey}`} as a
    // prop on this element but unfortunately rc-menu doesn't preserve unsupported
    // props as attributes on the final DOM nodes.


    element = /*#__PURE__*/_react.default.createElement(_rcMenu.SubMenu, {
      key: key,
      title: titleElement,
      className: depth ? null : 'neon-menu__item--relative'
    }, childElements);
  } else {
    element = /*#__PURE__*/_react.default.createElement(_rcMenu.MenuItem, {
      key: index,
      className: depth ? null : 'neon-menu__item--relative neon-menu__nochild'
    }, linkElement);
  }

  return element;
};

var neonLogo = /*#__PURE__*/_react.default.createElement("img", {
  "data-selenium": "neon-menu.logo",
  title: "NEON Data Portal",
  alt: "NEON Data Portal",
  className: "neon-menu__logo",
  src: _NSFNEONLogo.default
});

var cancellationSubject$ = new _rxjs.Subject();

var NeonMenu = function NeonMenu(props) {
  var loginPath = props.loginPath,
      logoutPath = props.logoutPath,
      accountPath = props.accountPath,
      notifications = props.notifications,
      onShowNotifications = props.onShowNotifications;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      menuFetched = _useState2[0],
      setMenuFetched = _useState2[1];

  var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      menuItems = _useState4[0],
      setMenuItems = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      drawerIsOpen = _useState6[0],
      setDrawerIsOpen = _useState6[1];

  (0, _react.useEffect)(function () {
    _NeonApi.default.getJson(_NeonEnvironment.default.getFullApiPath('menu'), function (response) {
      setMenuItems((0, _get.default)(response || {}, 'data.menuItems', _menuDefaultFallback.default));
      setMenuFetched(true);
    }, function () {
      setMenuItems(_menuDefaultFallback.default);
      setMenuFetched(true);
    }, cancellationSubject$);

    return function () {
      cancellationSubject$.next(true);
      cancellationSubject$.unsubscribe();
    };
  }, [loginPath]);
  var notificationsDisabled = notifications.some(function (n) {
    return !n.dismissed;
  });
  var notificationsColor = notificationsDisabled ? _Theme.COLORS.GREY[200] : _Theme.COLORS.GOLD[500];
  var notificationsContent = notifications.length ? /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    key: "show-notifications",
    "aria-label": "show-notifications",
    title: "Show Notifications",
    onClick: onShowNotifications,
    style: {
      marginRight: '12px'
    },
    disabled: notificationsDisabled
  }, /*#__PURE__*/_react.default.createElement(_Notifications.default, {
    style: {
      color: notificationsColor,
      fontSize: '1.65rem !important'
    }
  })) : null;

  var authContainer = /*#__PURE__*/_react.default.createElement("div", {
    className: "neon-menu__auth"
  }, notificationsContent, /*#__PURE__*/_react.default.createElement(_NeonAuth.default, {
    loginPath: loginPath,
    logoutPath: logoutPath,
    accountPath: accountPath,
    loginType: _NeonAuth.NeonAuthType.INTERRUPT,
    logoutType: _NeonAuth.NeonAuthType.SILENT,
    displayType: _NeonAuth.NeonAuthDisplayType.MENU
  }));

  var menu = /*#__PURE__*/_react.default.createElement(_rcMenu.default, {
    id: "main-menu",
    mode: "horizontal"
  }, /*#__PURE__*/_react.default.createElement(_rcMenu.MenuItem, null, /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
    size: 24
  })));

  if (menuFetched) {
    menu = /*#__PURE__*/_react.default.createElement(_rcMenu.default, {
      id: "main-menu",
      mode: "horizontal"
    }, /*#__PURE__*/_react.default.createElement(_rcMenu.MenuItem, {
      key: "home",
      className: "rc-menu-item",
      role: "menuitem"
    }, /*#__PURE__*/_react.default.createElement("a", {
      href: "/",
      title: "NEON Data Portal | Home"
    }, /*#__PURE__*/_react.default.createElement(_Home.default, null))), (menuItems.length ? menuItems : _menuDefaultFallback.default).map(generateRCMenuItem));
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "neon-menu__container",
    "data-selenium": "neon-menu"
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    container: true,
    direction: "row",
    justify: "space-around",
    alignItems: "center",
    spacing: 0
  }, /*#__PURE__*/_react.default.createElement(_Hidden.default, {
    mdUp: true
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 7,
    style: {
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    "data-selenium": "neon-menu.drawer-iconbutton.open",
    edge: "start",
    "aria-label": "Menu",
    onClick: function onClick() {
      return setDrawerIsOpen(true);
    },
    style: {
      margin: '4px 0px 4px 12px'
    }
  }, /*#__PURE__*/_react.default.createElement(_Menu.default, null)), neonLogo), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 5
  }, authContainer)), /*#__PURE__*/_react.default.createElement(_Hidden.default, {
    smDown: true
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    md: 9
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "neon-menu__header-container"
  }, neonLogo, menu)), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    md: 3
  }, authContainer)))), /*#__PURE__*/_react.default.createElement(_Hidden.default, {
    mdUp: true
  }, /*#__PURE__*/_react.default.createElement(_Drawer.default, {
    open: drawerIsOpen,
    onClose: function onClose() {
      return setDrawerIsOpen(false);
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "neon-menu__drawer-header-container"
  }, neonLogo, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    "data-selenium": "neon-menu.drawer-iconbutton.close",
    color: "primary",
    "aria-label": "Close Menu",
    onClick: function onClick() {
      return setDrawerIsOpen(false);
    },
    style: {
      margin: '8px 0px'
    }
  }, /*#__PURE__*/_react.default.createElement(_ChevronLeft.default, null))), /*#__PURE__*/_react.default.createElement(_Divider.default, null), /*#__PURE__*/_react.default.createElement(_NeonDrawerMenu.default, {
    items: menuItems
  }))));
};

NeonMenu.propTypes = {
  loginPath: _propTypes.default.string,
  logoutPath: _propTypes.default.string,
  accountPath: _propTypes.default.string,
  notifications: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    message: _propTypes.default.string.isRequired,
    dismissed: _propTypes.default.bool.isRequired
  })),
  onShowNotifications: _propTypes.default.func
};
NeonMenu.defaultProps = {
  loginPath: '',
  logoutPath: '',
  accountPath: '',
  notifications: [],
  onShowNotifications: null
};
var _default = NeonMenu;
exports.default = _default;