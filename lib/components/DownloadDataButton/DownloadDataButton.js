'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = DownloadDataButton;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styles = require('@material-ui/core/styles');

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _CloudDownload = require('@material-ui/icons/CloudDownload');

var _CloudDownload2 = _interopRequireDefault(_CloudDownload);

var _DownloadDataDialog = require('../DownloadDataDialog/DownloadDataDialog');

var _DownloadDataDialog2 = _interopRequireDefault(_DownloadDataDialog);

var _DownloadDataContext = require('../DownloadDataContext/DownloadDataContext');

var _DownloadDataContext2 = _interopRequireDefault(_DownloadDataContext);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var useStyles = (0, _styles.makeStyles)(function () {
  return {
    gtmCaptureButton: {
      '& span': {
        pointerEvents: 'none'
      }
    }
  };
});

function DownloadDataButton(props) {
  var label = props.label,
      other = _objectWithoutProperties(props, ['label']);

  var classes = useStyles();

  var _DownloadDataContext$ = _DownloadDataContext2.default.useDownloadDataState(),
      _DownloadDataContext$2 = _slicedToArray(_DownloadDataContext$, 2),
      productData = _DownloadDataContext$2[0].productData,
      dispatch = _DownloadDataContext$2[1];

  function handleOpenDialog() {
    dispatch({ type: 'setDialogOpen', open: true });
  }

  var gtmProps = {};
  if (productData.productCode) {
    gtmProps.className = classes.gtmCaptureButton;
    gtmProps['data-gtm-product-code'] = productData.productCode;
  }

  return _react2.default.createElement(
    _react2.default.Fragment,
    null,
    _react2.default.createElement(
      _Button2.default,
      _extends({
        color: 'primary',
        variant: 'contained',
        onClick: handleOpenDialog,
        'data-selenium': 'download-data-button'
      }, gtmProps, other),
      label,
      _react2.default.createElement(_CloudDownload2.default, { style: { marginLeft: _Theme2.default.spacing(1) } })
    ),
    _react2.default.createElement(_DownloadDataDialog2.default, null)
  );
}

DownloadDataButton.propTypes = {
  label: _propTypes2.default.string
};

DownloadDataButton.defaultProps = {
  label: 'Download Data'
};