'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styles = require('@material-ui/core/styles');

var _List = require('@material-ui/core/List');

var _List2 = _interopRequireDefault(_List);

var _ListItem = require('@material-ui/core/ListItem');

var _ListItem2 = _interopRequireDefault(_ListItem);

var _ListItemIcon = require('@material-ui/core/ListItemIcon');

var _ListItemIcon2 = _interopRequireDefault(_ListItemIcon);

var _ListItemText = require('@material-ui/core/ListItemText');

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _Collapse = require('@material-ui/core/Collapse');

var _Collapse2 = _interopRequireDefault(_Collapse);

var _HomeOutlined = require('@material-ui/icons/HomeOutlined');

var _HomeOutlined2 = _interopRequireDefault(_HomeOutlined);

var _ExpandLess = require('@material-ui/icons/ExpandLess');

var _ExpandLess2 = _interopRequireDefault(_ExpandLess);

var _ExpandMore = require('@material-ui/icons/ExpandMore');

var _ExpandMore2 = _interopRequireDefault(_ExpandMore);

var _CloudDownloadOutlined = require('@material-ui/icons/CloudDownloadOutlined');

var _CloudDownloadOutlined2 = _interopRequireDefault(_CloudDownloadOutlined);

var _InfoOutlined = require('@material-ui/icons/InfoOutlined');

var _InfoOutlined2 = _interopRequireDefault(_InfoOutlined);

var _LiveHelpOutlined = require('@material-ui/icons/LiveHelpOutlined');

var _LiveHelpOutlined2 = _interopRequireDefault(_LiveHelpOutlined);

var _ListAltOutlined = require('@material-ui/icons/ListAltOutlined');

var _ListAltOutlined2 = _interopRequireDefault(_ListAltOutlined);

var _PersonOutline = require('@material-ui/icons/PersonOutline');

var _PersonOutline2 = _interopRequireDefault(_PersonOutline);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var menuItemIconMap = {
  Home: _react2.default.createElement(_HomeOutlined2.default, null),
  About: _react2.default.createElement(_InfoOutlined2.default, null),
  'Download Data': _react2.default.createElement(_CloudDownloadOutlined2.default, null),
  Resources: _react2.default.createElement(_ListAltOutlined2.default, null),
  'Contact Us': _react2.default.createElement(_LiveHelpOutlined2.default, null),
  'My Datasets': _react2.default.createElement(_PersonOutline2.default, null)
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
  var classes = useStyles(_Theme2.default);
  var items = props.items;

  // Menu items need a unique identifier so we can map their
  // open states, if they have children. One isn't discretely
  // provided so the function can be used to make one.

  var getMenuId = function getMenuId(item) {
    return item.name + '|' + item.url;
  };

  var initialState = items.reduce(function (acc, cur) {
    if (cur.children.length) {
      acc[getMenuId(cur)] = false;
    }
    return acc;
  }, {});

  var _React$useState = _react2.default.useState(initialState),
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
    var listItemIcon = menuItemIconMap[item.name] ? _react2.default.createElement(
      _ListItemIcon2.default,
      { className: classes.listItemIcon },
      menuItemIconMap[item.name]
    ) : null;
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
      expandIcon = open[id] ? _react2.default.createElement(_ExpandLess2.default, null) : _react2.default.createElement(_ExpandMore2.default, null);
      collapse = _react2.default.createElement(
        _Collapse2.default,
        { 'in': open[id], timeout: 'auto', unmountOnExit: true },
        _react2.default.createElement(
          _List2.default,
          { 'data-selenium': 'neon-drawer-menu.submenu.' + seleniumKey, component: 'div', disablePadding: true },
          item.children.map(function (child) {
            return renderMenuItem(child, nesting + 1);
          })
        )
      );
    }
    return _react2.default.createElement(
      _react2.default.Fragment,
      { key: id },
      _react2.default.createElement(
        _ListItem2.default,
        _extends({
          button: true,
          'data-selenium': 'neon-drawer-menu.link.' + seleniumKey,
          style: { paddingLeft: _Theme2.default.spacing(2 + nesting * 3) }
        }, listItemProps),
        listItemIcon,
        _react2.default.createElement(_ListItemText2.default, { primary: decodeName(item.name), className: classes.listItemText }),
        expandIcon
      ),
      collapse
    );
  };

  return _react2.default.createElement(
    _List2.default,
    {
      component: 'nav',
      className: classes.root
    },
    renderMenuItem({ name: 'Home', url: '/', children: [] }),
    items.map(function (item) {
      return renderMenuItem(item);
    })
  );
};

NeonDrawerMenu.propTypes = {
  items: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    name: _propTypes2.default.string.isRequired,
    url: _propTypes2.default.string.isRequired,
    children: _propTypes2.default.array.isRequired
  })).isRequired
};

exports.default = NeonDrawerMenu;