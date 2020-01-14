'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styles = require('@material-ui/core/styles');

var _Divider = require('@material-ui/core/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _SnackbarContent = require('@material-ui/core/SnackbarContent');

var _SnackbarContent2 = _interopRequireDefault(_SnackbarContent);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _ExpandLess = require('@material-ui/icons/ExpandLess');

var _ExpandLess2 = _interopRequireDefault(_ExpandLess);

var _ExpandMore = require('@material-ui/icons/ExpandMore');

var _ExpandMore2 = _interopRequireDefault(_ExpandMore);

var _Info = require('@material-ui/icons/Info');

var _Info2 = _interopRequireDefault(_Info);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

var _ExternalHost = require('../ExternalHost/ExternalHost');

var _ExternalHost2 = _interopRequireDefault(_ExternalHost);

var _ExternalHostProductSpecificLinks = require('../ExternalHostProductSpecificLinks/ExternalHostProductSpecificLinks');

var _ExternalHostProductSpecificLinks2 = _interopRequireDefault(_ExternalHostProductSpecificLinks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    startFlex: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    infoSnackbar: {
      backgroundColor: theme.palette.grey[50],
      color: '#000',
      border: '1px solid ' + theme.palette.primary.main + '80',
      margin: _Theme2.default.spacing(0.5, 0, 3, 0),
      padding: _Theme2.default.spacing(0, 2),
      '& div': {
        width: '100%'
      }
    },
    infoSnackbarIcon: {
      color: theme.palette.grey[300],
      marginRight: theme.spacing(2)
    }
  };
});

var ExternalHostInfo = function ExternalHostInfo(props) {
  var classes = useStyles(_Theme2.default);

  var productCode = props.productCode,
      expandable = props.expandable,
      otherProps = _objectWithoutProperties(props, ['productCode', 'expandable']);

  var _useState = (0, _react.useState)(!expandable),
      _useState2 = _slicedToArray(_useState, 2),
      expanded = _useState2[0],
      setExpanded = _useState2[1];

  var externalHost = _ExternalHost2.default.getByProductCode(productCode);
  if (!externalHost) {
    return null;
  }

  // Not only _should_ the info have specific links (links in addition to the top-level
  // one for the host), but _does_ it?
  var hasSpecificLinks = externalHost.linkType === _ExternalHost2.default.LINK_TYPES.BY_PRODUCT && externalHost.getProductLinks(productCode).length || externalHost.linkType === _ExternalHost2.default.LINK_TYPES.BY_SITE;

  // Remaining setup
  var externalGeneralLink = externalHost.renderLink(productCode);
  var expandTitle = (expanded ? 'hide' : 'show') + ' external host links to data';
  var rootProps = {};
  Object.keys(otherProps).filter(function (key) {
    return ['data-selenium', 'style', 'className'].includes(key);
  }).forEach(function (key) {
    rootProps[key] = otherProps[key];
  });

  var blurb = null;
  var dataVariety = externalHost.hostDataVariety || 'Data';
  if (externalHost.hostType === _ExternalHost2.default.HOST_TYPES.REFORMATTED_DATA) {
    blurb = _react2.default.createElement(
      _react2.default.Fragment,
      null,
      dataVariety + ' for this product are available in other formats from',
      '\xA0',
      externalGeneralLink
    );
  }
  if (externalHost.hostType === _ExternalHost2.default.HOST_TYPES.EXCLUSIVE_DATA) {
    blurb = _react2.default.createElement(
      _react2.default.Fragment,
      null,
      dataVariety + ' for this product are only available from',
      '\xA0',
      externalGeneralLink
    );
  }
  // Default: ExternalHost.HOST_TYPES.ADDITIONAL_DATA:
  if (!blurb) {
    dataVariety = externalHost.hostDataVariety || 'Additional data';
    var are = hasSpecificLinks ? 'are' : 'may be';
    blurb = _react2.default.createElement(
      _react2.default.Fragment,
      null,
      dataVariety + ' associated with this product ' + are + ' available from',
      '\xA0',
      externalGeneralLink
    );
  }

  var content = _react2.default.createElement(
    _react2.default.Fragment,
    null,
    _react2.default.createElement(
      'div',
      { className: classes.startFlex, style: { width: '100%' } },
      _react2.default.createElement(_Info2.default, { fontSize: 'large', className: classes.infoSnackbarIcon }),
      _react2.default.createElement(
        _Typography2.default,
        { variant: 'subtitle2', style: { flexGrow: 1 } },
        blurb
      ),
      hasSpecificLinks && expandable ? _react2.default.createElement(
        _IconButton2.default,
        {
          title: expandTitle,
          'aria-label': expandTitle,
          onClick: function onClick() {
            return setExpanded(!expanded);
          },
          style: { marginLeft: _Theme2.default.spacing(2) }
        },
        expanded ? _react2.default.createElement(_ExpandLess2.default, null) : _react2.default.createElement(_ExpandMore2.default, null)
      ) : null
    ),
    _react2.default.createElement(
      'div',
      { style: { width: '100%', display: hasSpecificLinks && expanded ? 'block' : 'none' } },
      _react2.default.createElement(_Divider2.default, { style: { margin: _Theme2.default.spacing(1.5, 0) } }),
      _react2.default.createElement(_ExternalHostProductSpecificLinks2.default, { productCode: productCode })
    )
  );

  return _react2.default.createElement(
    'div',
    rootProps,
    _react2.default.createElement(_SnackbarContent2.default, {
      className: classes.infoSnackbar,
      message: content
    })
  );
};

ExternalHostInfo.propTypes = {
  productCode: _propTypes2.default.string.isRequired,
  expandable: _propTypes2.default.bool
};

ExternalHostInfo.defaultProps = {
  expandable: false
};

exports.default = ExternalHostInfo;