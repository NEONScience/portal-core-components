"use strict";

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

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _ButtonGroup = _interopRequireDefault(require("@material-ui/core/ButtonGroup"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _Drawer = _interopRequireDefault(require("@material-ui/core/Drawer"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _Menu = _interopRequireDefault(require("@material-ui/icons/Menu"));

var _ChevronLeft = _interopRequireDefault(require("@material-ui/icons/ChevronLeft"));

var _Home = _interopRequireDefault(require("@material-ui/icons/Home"));

var _NeonDrawerMenu = _interopRequireDefault(require("./NeonDrawerMenu"));

var _authenticate = _interopRequireDefault(require("../../auth/authenticate"));

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

var _rxUtil = require("../../util/rxUtil");

require("./NeonMenu.css");

var _logoBlueNeonData = _interopRequireDefault(require("./images/logo--blue-neon-data.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var defaultStaticMenuItems = [{
  name: 'About',
  url: '/about',
  isContainer: true,
  children: [{
    name: 'Usage and Citation Policies',
    url: '/data-policy',
    isContainer: false,
    children: []
  }, {
    name: 'Data Quality Program',
    url: '/data-quality',
    isContainer: false,
    children: []
  }, {
    name: 'Data Portal News',
    url: '/news',
    isContainer: false,
    children: []
  }]
}, {
  name: 'Download Data',
  url: '/download-data',
  isContainer: true,
  children: [{
    name: 'Data Products',
    url: '/browse-data',
    isContainer: false,
    children: []
  }, {
    name: 'API',
    url: '/data-api',
    isContainer: false,
    children: []
  }, {
    name: 'Prototype Data',
    url: '/prototype-search',
    isContainer: false,
    children: []
  }]
}, {
  name: 'Resources',
  url: '/resources',
  isContainer: true,
  children: [{
    name: 'Document Library',
    url: '/documents',
    isContainer: false,
    children: []
  }, {
    name: 'Data Product Catalog',
    url: '/data-product-catalog',
    isContainer: false,
    children: []
  }, {
    name: 'Data Availability Chart',
    url: '/view-data-availability',
    isContainer: false,
    children: []
  }, {
    name: 'Taxonomy Lists',
    url: '/apps/taxon',
    type: 'url',
    isContainer: false,
    children: []
  }, {
    name: 'Sample Viewer',
    url: '/apps/samples',
    type: 'url',
    isContainer: false,
    children: []
  }, {
    name: 'Frequently Asked Questions',
    url: '/faq',
    type: 'url',
    isContainer: false,
    children: []
  }, {
    name: 'Using NEON Data',
    url: '/using-neon-data',
    isContainer: true,
    children: [{
      name: 'File Naming Conventions',
      url: '/file-naming-conventions',
      type: 'portlet',
      isContainer: false,
      children: []
    }, {
      name: 'Data Tutorials, Workshops & More',
      url: 'https://neonscience.org/resources',
      isContainer: false,
      children: []
    }, {
      name: 'Software @ GitHub',
      url: 'https://github.com/NEONScience',
      isContainer: false,
      isExternalLink: true,
      navExternalLink: null,
      isExpanded: false,
      children: []
    }]
  }, {
    name: 'Learn More',
    url: '/learn-more',
    isContainer: true,
    children: [{
      name: 'Field Sites',
      url: 'https://www.neonscience.org/field-sites',
      isContainer: false,
      children: []
    }, {
      name: 'Airborne Data',
      url: 'https://www.neonscience.org/data-resources/get-data/airborne-data',
      isContainer: false,
      children: []
    }, {
      name: 'Data Collection',
      url: 'https://www.neonscience.org/data-collection',
      isContainer: false,
      children: []
    }, {
      name: 'Sampling Schedules',
      url: 'https://www.neonscience.org/resources/information-researchers#schedules',
      isContainer: false,
      children: []
    }]
  }]
}, {
  name: 'Contact Us',
  url: '/feedback',
  isContainer: false,
  children: []
}];
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

  var linkElement = _react.default.createElement("a", {
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


    element = _react.default.createElement(_rcMenu.SubMenu, {
      key: key,
      title: titleElement,
      className: depth ? null : 'neon-menu__item--relative'
    }, childElements);
  } else {
    element = _react.default.createElement(_rcMenu.MenuItem, {
      key: index,
      className: depth ? null : 'neon-menu__item--relative neon-menu__nochild'
    }, linkElement);
  }

  return element;
};

var neonLogo = _react.default.createElement("img", {
  "data-selenium": "neon-menu.logo",
  title: "NEON Data Portal",
  alt: "NEON Data Portal",
  className: "neon-menu__logo",
  src: _logoBlueNeonData.default
});

var NeonMenu =
/*#__PURE__*/
function (_Component) {
  _inherits(NeonMenu, _Component);

  function NeonMenu(props) {
    var _this;

    _classCallCheck(this, NeonMenu);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NeonMenu).call(this, props));
    _this.auth = new _authenticate.default();
    _this.menuFromResponse = _this.menuFromResponse.bind(_assertThisInitialized(_this));
    _this.menuErrorCallback = _this.menuErrorCallback.bind(_assertThisInitialized(_this));
    _this.authCallback = _this.authCallback.bind(_assertThisInitialized(_this));
    _this.authErrorCallback = _this.authErrorCallback.bind(_assertThisInitialized(_this));
    _this.handleDrawerOpen = _this.handleDrawerOpen.bind(_assertThisInitialized(_this));
    _this.handleDrawerClose = _this.handleDrawerClose.bind(_assertThisInitialized(_this)); // RxJS cancellation subject

    _this.cancellationSubject$ = new _rxjs.Subject();
    _this.state = {
      fetched: false,
      menuItems: [],
      isFetchingAuthentication: true,
      isAuthenticated: false,
      drawerIsOpen: false
    };
    return _this;
  }

  _createClass(NeonMenu, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      (0, _rxUtil.getJson)(_NeonEnvironment.default.getFullApiPath('menu'), this.menuFromResponse, this.menuErrorCallback, this.cancellationSubject$);
      this.auth.isAuthenticated(this.authCallback, this.authErrorCallback);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.cancellationSubject$.next(true);
      this.cancellationSubject$.unsubscribe();
      this.auth.cancellationEmitter();
    }
  }, {
    key: "authCallback",
    value: function authCallback(response) {
      if (this.auth.checkAuthResponse(response)) {
        this.setState({
          isFetchingAuthentication: false,
          isAuthenticated: true
        });
      } else {
        this.setState({
          isFetchingAuthentication: false,
          isAuthenticated: false
        });
      }
    }
  }, {
    key: "authErrorCallback",
    value: function authErrorCallback(error) {
      console.error(error); // eslint-disable-line no-console

      this.setState({
        isFetchingAuthentication: false,
        isAuthenticated: false
      });
    }
  }, {
    key: "menuFromResponse",
    value: function menuFromResponse(response) {
      this.setState({
        fetched: true,
        menuItems: (0, _get.default)(response || {}, 'data.menuItems', defaultStaticMenuItems)
      });
    }
  }, {
    key: "menuErrorCallback",
    value: function menuErrorCallback() {
      this.setState({
        fetched: true,
        menuItems: defaultStaticMenuItems
      });
    }
  }, {
    key: "handleDrawerOpen",
    value: function handleDrawerOpen() {
      this.setState({
        drawerIsOpen: true
      });
    }
  }, {
    key: "handleDrawerClose",
    value: function handleDrawerClose() {
      this.setState({
        drawerIsOpen: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loginPath = _this$props.loginPath,
          logoutPath = _this$props.logoutPath,
          accountPath = _this$props.accountPath;
      var _this$state = this.state,
          isFetchingAuthentication = _this$state.isFetchingAuthentication,
          isAuthenticated = _this$state.isAuthenticated,
          fetched = _this$state.fetched,
          menuItems = _this$state.menuItems,
          drawerIsOpen = _this$state.drawerIsOpen;

      var authContent = _react.default.createElement(_Button.default, {
        href: loginPath,
        size: "small",
        variant: "outlined",
        "data-selenium": "neon-menu.sign-in-button"
      }, "Sign In");

      if (isFetchingAuthentication) {
        authContent = _react.default.createElement(_CircularProgress.default, {
          size: 24
        });
      }

      if (isAuthenticated) {
        authContent = _react.default.createElement(_ButtonGroup.default, {
          size: "small",
          "aria-label": "Authentication"
        }, _react.default.createElement(_Button.default, {
          href: logoutPath,
          style: {
            whiteSpace: 'nowrap'
          },
          "data-selenium": "neon-menu.sign-out-button"
        }, "Sign Out"), _react.default.createElement(_Button.default, {
          href: accountPath,
          style: {
            whiteSpace: 'nowrap'
          },
          "data-selenium": "neon-menu.my-account-button"
        }, "My Account"));
      }

      var authContainer = _react.default.createElement("div", {
        className: "neon-menu__auth"
      }, authContent);

      var menu = _react.default.createElement(_rcMenu.default, {
        id: "main-menu",
        mode: "horizontal"
      }, _react.default.createElement(_rcMenu.MenuItem, null, _react.default.createElement(_CircularProgress.default, {
        size: 24
      })));

      if (fetched) {
        menu = _react.default.createElement(_rcMenu.default, {
          id: "main-menu",
          mode: "horizontal"
        }, _react.default.createElement(_rcMenu.MenuItem, {
          key: "home",
          className: "rc-menu-item",
          role: "menuitem"
        }, _react.default.createElement("a", {
          href: "/",
          title: "NEON Data Portal | Home"
        }, _react.default.createElement(_Home.default, null))), (menuItems.length ? menuItems : defaultStaticMenuItems).map(generateRCMenuItem));
      }

      return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
        className: "neon-menu__container",
        "data-selenium": "neon-menu"
      }, _react.default.createElement(_Grid.default, {
        container: true,
        direction: "row",
        justify: "space-around",
        alignItems: "center",
        spacing: 0
      }, _react.default.createElement(_Hidden.default, {
        mdUp: true
      }, _react.default.createElement(_Grid.default, {
        item: true,
        xs: 7,
        style: {
          whiteSpace: 'nowrap'
        }
      }, _react.default.createElement(_IconButton.default, {
        "data-selenium": "neon-menu.drawer-iconbutton.open",
        edge: "start",
        "aria-label": "Menu",
        onClick: this.handleDrawerOpen,
        style: {
          margin: '4px 0px 4px 12px'
        }
      }, _react.default.createElement(_Menu.default, null)), neonLogo), _react.default.createElement(_Grid.default, {
        item: true,
        xs: 5
      }, authContainer)), _react.default.createElement(_Hidden.default, {
        smDown: true
      }, _react.default.createElement(_Grid.default, {
        item: true,
        md: 9
      }, _react.default.createElement("div", {
        className: "neon-menu__header-container"
      }, neonLogo, menu)), _react.default.createElement(_Grid.default, {
        item: true,
        md: 3
      }, authContainer)))), _react.default.createElement(_Hidden.default, {
        mdUp: true
      }, _react.default.createElement(_Drawer.default, {
        open: drawerIsOpen,
        onClose: this.handleDrawerClose
      }, _react.default.createElement("div", {
        className: "neon-menu__drawer-header-container"
      }, neonLogo, _react.default.createElement(_IconButton.default, {
        "data-selenium": "neon-menu.drawer-iconbutton.close",
        color: "primary",
        "aria-label": "Close Menu",
        onClick: this.handleDrawerClose,
        style: {
          margin: '8px 0px'
        }
      }, _react.default.createElement(_ChevronLeft.default, null))), _react.default.createElement(_Divider.default, null), _react.default.createElement(_NeonDrawerMenu.default, {
        items: menuItems
      }))));
    }
  }]);

  return NeonMenu;
}(_react.Component);

NeonMenu.propTypes = {
  loginPath: _propTypes.default.string,
  logoutPath: _propTypes.default.string,
  accountPath: _propTypes.default.string
};
NeonMenu.defaultProps = {
  loginPath: '',
  logoutPath: '',
  accountPath: ''
};
var _default = NeonMenu;
exports.default = _default;