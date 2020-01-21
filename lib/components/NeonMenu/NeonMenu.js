'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _rcMenu = require('rc-menu');

var _rcMenu2 = _interopRequireDefault(_rcMenu);

var _rxjs = require('rxjs');

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _Grid = require('@material-ui/core/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Hidden = require('@material-ui/core/Hidden');

var _Hidden2 = _interopRequireDefault(_Hidden);

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _ButtonGroup = require('@material-ui/core/ButtonGroup');

var _ButtonGroup2 = _interopRequireDefault(_ButtonGroup);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Drawer = require('@material-ui/core/Drawer');

var _Drawer2 = _interopRequireDefault(_Drawer);

var _Divider = require('@material-ui/core/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _CircularProgress = require('@material-ui/core/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _Menu = require('@material-ui/icons/Menu');

var _Menu2 = _interopRequireDefault(_Menu);

var _ChevronLeft = require('@material-ui/icons/ChevronLeft');

var _ChevronLeft2 = _interopRequireDefault(_ChevronLeft);

var _Home = require('@material-ui/icons/Home');

var _Home2 = _interopRequireDefault(_Home);

var _Notifications = require('@material-ui/icons/Notifications');

var _Notifications2 = _interopRequireDefault(_Notifications);

var _NeonDrawerMenu = require('./NeonDrawerMenu');

var _NeonDrawerMenu2 = _interopRequireDefault(_NeonDrawerMenu);

var _authenticate = require('../../auth/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

var _NeonEnvironment = require('../NeonEnvironment/NeonEnvironment');

var _NeonEnvironment2 = _interopRequireDefault(_NeonEnvironment);

var _Theme = require('../Theme/Theme');

var _rxUtil = require('../../util/rxUtil');

require('./NeonMenu.css');

var _logoBlueNeonData = require('./images/logo--blue-neon-data.png');

var _logoBlueNeonData2 = _interopRequireDefault(_logoBlueNeonData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
      return generateRCMenuItem(childItem, index.toString() + '-' + childIndex.toString(), depth + 1);
    });
  }

  var key = index.toString() + '-1';
  var seleniumKey = item.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  var linkElement = _react2.default.createElement(
    'a',
    { href: item.url, 'data-selenium': 'neon-menu.link.' + seleniumKey },
    decodeName(item.name)
  );
  var element = null;

  if (childElements.length > 0) {
    // isContainer is a Liferay boolean that means "has children but is not a link"
    // Liferay also mandates all menu items have a non-empty url EVEN IF they are not links
    // So this bit here updates the href we're actually going to use accordingly.
    var titleElement = decodeName(item.name);
    if (!item.isContainer) {
      titleElement = linkElement;
    }

    // NOTE: We want to put data-selenium={`neon-menu.submenu.${seleniumKey}`} as a
    // prop on this element but unfortunately rc-menu doesn't preserve unsupported
    // props as attributes on the final DOM nodes.
    element = _react2.default.createElement(
      _rcMenu.SubMenu,
      {
        key: key,
        title: titleElement,
        className: depth ? null : 'neon-menu__item--relative'
      },
      childElements
    );
  } else {
    element = _react2.default.createElement(
      _rcMenu.MenuItem,
      {
        key: index,
        className: depth ? null : 'neon-menu__item--relative neon-menu__nochild'
      },
      linkElement
    );
  }

  return element;
};

var neonLogo = _react2.default.createElement('img', {
  'data-selenium': 'neon-menu.logo',
  title: 'NEON Data Portal',
  alt: 'NEON Data Portal',
  className: 'neon-menu__logo',
  src: _logoBlueNeonData2.default
});

var NeonMenu = function (_Component) {
  _inherits(NeonMenu, _Component);

  function NeonMenu(props) {
    _classCallCheck(this, NeonMenu);

    var _this = _possibleConstructorReturn(this, (NeonMenu.__proto__ || Object.getPrototypeOf(NeonMenu)).call(this, props));

    _this.auth = new _authenticate2.default();
    _this.menuFromResponse = _this.menuFromResponse.bind(_this);
    _this.menuErrorCallback = _this.menuErrorCallback.bind(_this);
    _this.authCallback = _this.authCallback.bind(_this);
    _this.authErrorCallback = _this.authErrorCallback.bind(_this);
    _this.handleDrawerOpen = _this.handleDrawerOpen.bind(_this);
    _this.handleDrawerClose = _this.handleDrawerClose.bind(_this);

    // RxJS cancellation subject
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
    key: 'componentDidMount',
    value: function componentDidMount() {
      (0, _rxUtil.getJson)(_NeonEnvironment2.default.getFullApiPath('menu'), this.menuFromResponse, this.menuErrorCallback, this.cancellationSubject$);
      this.auth.isAuthenticated(this.authCallback, this.authErrorCallback);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.cancellationSubject$.next(true);
      this.cancellationSubject$.unsubscribe();
      this.auth.cancellationEmitter();
    }
  }, {
    key: 'authCallback',
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
    key: 'authErrorCallback',
    value: function authErrorCallback(error) {
      console.error(error); // eslint-disable-line no-console
      this.setState({
        isFetchingAuthentication: false,
        isAuthenticated: false
      });
    }
  }, {
    key: 'menuFromResponse',
    value: function menuFromResponse(response) {
      this.setState({
        fetched: true,
        menuItems: (0, _get2.default)(response || {}, 'data.menuItems', defaultStaticMenuItems)
      });
    }
  }, {
    key: 'menuErrorCallback',
    value: function menuErrorCallback() {
      this.setState({
        fetched: true,
        menuItems: defaultStaticMenuItems
      });
    }
  }, {
    key: 'handleDrawerOpen',
    value: function handleDrawerOpen() {
      this.setState({
        drawerIsOpen: true
      });
    }
  }, {
    key: 'handleDrawerClose',
    value: function handleDrawerClose() {
      this.setState({
        drawerIsOpen: false
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          loginPath = _props.loginPath,
          logoutPath = _props.logoutPath,
          accountPath = _props.accountPath,
          notifications = _props.notifications,
          onShowNotifications = _props.onShowNotifications;
      var _state = this.state,
          isFetchingAuthentication = _state.isFetchingAuthentication,
          isAuthenticated = _state.isAuthenticated,
          fetched = _state.fetched,
          menuItems = _state.menuItems,
          drawerIsOpen = _state.drawerIsOpen;


      var notificationsDisabled = notifications.some(function (n) {
        return !n.dismissed;
      });
      var notificationsColor = notificationsDisabled ? _Theme.COLORS.GREY[200] : _Theme.COLORS.YELLOW[700];
      var notificationsContent = notifications.length ? _react2.default.createElement(
        _IconButton2.default,
        {
          key: 'show-notifications',
          'aria-label': 'show-notifications',
          title: 'Show Notifications',
          onClick: onShowNotifications,
          style: { marginRight: '12px' },
          disabled: notificationsDisabled
        },
        _react2.default.createElement(_Notifications2.default, { style: { color: notificationsColor, fontSize: '1.65rem !important' } })
      ) : null;

      var authContent = _react2.default.createElement(
        _Button2.default,
        { href: loginPath, size: 'small', variant: 'outlined', 'data-selenium': 'neon-menu.sign-in-button' },
        'Sign In'
      );
      if (isFetchingAuthentication) {
        authContent = _react2.default.createElement(_CircularProgress2.default, { size: 24 });
      }
      if (isAuthenticated) {
        authContent = _react2.default.createElement(
          _ButtonGroup2.default,
          { size: 'small', 'aria-label': 'Authentication' },
          _react2.default.createElement(
            _Button2.default,
            { href: logoutPath, style: { whiteSpace: 'nowrap' }, 'data-selenium': 'neon-menu.sign-out-button' },
            'Sign Out'
          ),
          _react2.default.createElement(
            _Button2.default,
            { href: accountPath, style: { whiteSpace: 'nowrap' }, 'data-selenium': 'neon-menu.my-account-button' },
            'My Account'
          )
        );
      }
      var authContainer = _react2.default.createElement(
        'div',
        { className: 'neon-menu__auth' },
        notificationsContent,
        authContent
      );

      var menu = _react2.default.createElement(
        _rcMenu2.default,
        { id: 'main-menu', mode: 'horizontal' },
        _react2.default.createElement(
          _rcMenu.MenuItem,
          null,
          _react2.default.createElement(_CircularProgress2.default, { size: 24 })
        )
      );
      if (fetched) {
        menu = _react2.default.createElement(
          _rcMenu2.default,
          { id: 'main-menu', mode: 'horizontal' },
          _react2.default.createElement(
            _rcMenu.MenuItem,
            {
              key: 'home',
              className: 'rc-menu-item',
              role: 'menuitem'
            },
            _react2.default.createElement(
              'a',
              { href: '/', title: 'NEON Data Portal | Home' },
              _react2.default.createElement(_Home2.default, null)
            )
          ),
          (menuItems.length ? menuItems : defaultStaticMenuItems).map(generateRCMenuItem)
        );
      }

      return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(
          'div',
          { className: 'neon-menu__container', 'data-selenium': 'neon-menu' },
          _react2.default.createElement(
            _Grid2.default,
            {
              container: true,
              direction: 'row',
              justify: 'space-around',
              alignItems: 'center',
              spacing: 0
            },
            _react2.default.createElement(
              _Hidden2.default,
              { mdUp: true },
              _react2.default.createElement(
                _Grid2.default,
                { item: true, xs: 7, style: { whiteSpace: 'nowrap' } },
                _react2.default.createElement(
                  _IconButton2.default,
                  {
                    'data-selenium': 'neon-menu.drawer-iconbutton.open',
                    edge: 'start',
                    'aria-label': 'Menu',
                    onClick: this.handleDrawerOpen,
                    style: { margin: '4px 0px 4px 12px' }
                  },
                  _react2.default.createElement(_Menu2.default, null)
                ),
                neonLogo
              ),
              _react2.default.createElement(
                _Grid2.default,
                { item: true, xs: 5 },
                authContainer
              )
            ),
            _react2.default.createElement(
              _Hidden2.default,
              { smDown: true },
              _react2.default.createElement(
                _Grid2.default,
                { item: true, md: 9 },
                _react2.default.createElement(
                  'div',
                  { className: 'neon-menu__header-container' },
                  neonLogo,
                  menu
                )
              ),
              _react2.default.createElement(
                _Grid2.default,
                { item: true, md: 3 },
                authContainer
              )
            )
          )
        ),
        _react2.default.createElement(
          _Hidden2.default,
          { mdUp: true },
          _react2.default.createElement(
            _Drawer2.default,
            { open: drawerIsOpen, onClose: this.handleDrawerClose },
            _react2.default.createElement(
              'div',
              { className: 'neon-menu__drawer-header-container' },
              neonLogo,
              _react2.default.createElement(
                _IconButton2.default,
                {
                  'data-selenium': 'neon-menu.drawer-iconbutton.close',
                  color: 'primary',
                  'aria-label': 'Close Menu',
                  onClick: this.handleDrawerClose,
                  style: { margin: '8px 0px' }
                },
                _react2.default.createElement(_ChevronLeft2.default, null)
              )
            ),
            _react2.default.createElement(_Divider2.default, null),
            _react2.default.createElement(_NeonDrawerMenu2.default, { items: menuItems })
          )
        )
      );
    }
  }]);

  return NeonMenu;
}(_react.Component);

NeonMenu.propTypes = {
  loginPath: _propTypes2.default.string,
  logoutPath: _propTypes2.default.string,
  accountPath: _propTypes2.default.string,
  notifications: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired,
    message: _propTypes2.default.string.isRequired,
    dismissed: _propTypes2.default.bool.isRequired
  })),
  onShowNotifications: _propTypes2.default.func
};

NeonMenu.defaultProps = {
  loginPath: '',
  logoutPath: '',
  accountPath: '',
  notifications: [],
  onShowNotifications: null
};

exports.default = NeonMenu;