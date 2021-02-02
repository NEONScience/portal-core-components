"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@material-ui/core/styles");

var _List = _interopRequireDefault(require("@material-ui/core/List"));

var _ListItem = _interopRequireDefault(require("@material-ui/core/ListItem"));

var _ListItemIcon = _interopRequireDefault(require("@material-ui/core/ListItemIcon"));

var _ListItemText = _interopRequireDefault(require("@material-ui/core/ListItemText"));

var _Collapse = _interopRequireDefault(require("@material-ui/core/Collapse"));

var _HomeOutlined = _interopRequireDefault(require("@material-ui/icons/HomeOutlined"));

var _ExpandLess = _interopRequireDefault(require("@material-ui/icons/ExpandLess"));

var _ExpandMore = _interopRequireDefault(require("@material-ui/icons/ExpandMore"));

var _SaveAlt = _interopRequireDefault(require("@material-ui/icons/SaveAlt"));

var _InfoOutlined = _interopRequireDefault(require("@material-ui/icons/InfoOutlined"));

var _LiveHelpOutlined = _interopRequireDefault(require("@material-ui/icons/LiveHelpOutlined"));

var _ListAltOutlined = _interopRequireDefault(require("@material-ui/icons/ListAltOutlined"));

var _PersonOutline = _interopRequireDefault(require("@material-ui/icons/PersonOutline"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var menuItemIconMap = {
  Home: /*#__PURE__*/_react.default.createElement(_HomeOutlined.default, null),
  About: /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, null),
  'Download Data': /*#__PURE__*/_react.default.createElement(_SaveAlt.default, null),
  Resources: /*#__PURE__*/_react.default.createElement(_ListAltOutlined.default, null),
  'Contact Us': /*#__PURE__*/_react.default.createElement(_LiveHelpOutlined.default, null),
  'My Datasets': /*#__PURE__*/_react.default.createElement(_PersonOutline.default, null)
};
var domParser = new DOMParser();

var decodeName = function decodeName(name) {
  return domParser.parseFromString(name, 'text/html').documentElement.textContent;
};

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    },
    listItemIcon: {
      minWidth: theme.spacing(5)
    },
    listItemText: {
      paddingRight: theme.spacing(4)
    }
  };
});

var NeonDrawerMenu = function NeonDrawerMenu(props) {
  var classes = useStyles(_Theme.default);
  var items = props.items; // Menu items need a unique identifier so we can map their
  // open states, if they have children. One isn't discretely
  // provided so the function can be used to make one.

  var getMenuId = function getMenuId(item) {
    return "".concat(item.name, "|").concat(item.url);
  };

  var initialState = items.reduce(function (acc, cur) {
    if (cur.children.length) {
      acc[getMenuId(cur)] = false;
    }

    return acc;
  }, {});

  var _React$useState = _react.default.useState(initialState),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      open = _React$useState2[0],
      setOpen = _React$useState2[1];

  var handleClick = function handleClick(id) {
    setOpen(_extends({}, open, _defineProperty({}, id, !open[id])));
  };

  var renderMenuItem = function renderMenuItem(item) {
    var nesting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (item.url === '/home') {
      return null;
    }

    var id = getMenuId(item);
    var listItemIcon = menuItemIconMap[item.name] ? /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, {
      className: classes.listItemIcon
    }, menuItemIconMap[item.name]) : null;
    var expandIcon = null;
    var collapse = null;
    var listItemProps = {
      component: 'a',
      href: item.url,
      onClick: null
    };
    var seleniumKey = item.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    if (item.children.length) {
      // Throw out the item's URL.
      //
      // Sometimes we have items that have children that also are supposed to have
      // a working URL. In Liferay menus all items have URLs whether they're links
      // or not, but if an item has children and isContainer is true then we treat
      // the menu item as "only a container" and don't wire up an <a> tag.
      //
      // But for a small viewport menu like this that's not workable. Phones and
      // tablets don't have hover states. A "parent" menu item MUST be ONLY a menu
      // item and NOT a link, since the click is the only interaction and it must
      // be used for expand/collapse. Thus, if this item has children, don't ever
      // allow it to be a link here in the drawer menu for small viewports.
      listItemProps.href = null;
      listItemProps.component = 'div';

      listItemProps.onClick = function () {
        return handleClick(id);
      };

      expandIcon = open[id] ? /*#__PURE__*/_react.default.createElement(_ExpandLess.default, null) : /*#__PURE__*/_react.default.createElement(_ExpandMore.default, null);
      collapse = /*#__PURE__*/_react.default.createElement(_Collapse.default, {
        in: open[id],
        timeout: "auto",
        unmountOnExit: true
      }, /*#__PURE__*/_react.default.createElement(_List.default, {
        "data-selenium": "neon-drawer-menu.submenu.".concat(seleniumKey),
        component: "div",
        disablePadding: true
      }, item.children.map(function (child) {
        return renderMenuItem(child, nesting + 1);
      })));
    }

    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
      key: id
    }, /*#__PURE__*/_react.default.createElement(_ListItem.default, _extends({
      button: true,
      "data-selenium": "neon-drawer-menu.link.".concat(seleniumKey),
      style: {
        paddingLeft: _Theme.default.spacing(2 + nesting * 3)
      }
    }, listItemProps), listItemIcon, /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
      primary: decodeName(item.name),
      className: classes.listItemText
    }), expandIcon), collapse);
  };

  return /*#__PURE__*/_react.default.createElement(_List.default, {
    component: "nav",
    className: classes.root
  }, renderMenuItem({
    name: 'Home',
    url: '/',
    children: []
  }), items.map(function (item) {
    return renderMenuItem(item);
  }));
}; // for nested proptypes


function lazyFunction(f) {
  // eslint-disable-next-line func-names
  return function () {
    // eslint-disable-next-line prefer-rest-params
    return f().apply(this, arguments);
  };
}

var itemShape; // eslint-disable-next-line prefer-const

itemShape = _propTypes.default.shape({
  name: _propTypes.default.string.isRequired,
  url: _propTypes.default.string.isRequired,
  children: _propTypes.default.arrayOf(lazyFunction(function () {
    return itemShape;
  }))
});
NeonDrawerMenu.propTypes = {
  items: _propTypes.default.arrayOf(itemShape).isRequired
};
var _default = NeonDrawerMenu;
exports.default = _default;