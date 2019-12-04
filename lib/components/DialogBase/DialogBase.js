'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styles = require('@material-ui/core/styles');

var _useMediaQuery = require('@material-ui/core/useMediaQuery');

var _useMediaQuery2 = _interopRequireDefault(_useMediaQuery);

var _AppBar = require('@material-ui/core/AppBar');

var _AppBar2 = _interopRequireDefault(_AppBar);

var _Dialog = require('@material-ui/core/Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Paper = require('@material-ui/core/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

var _Slide = require('@material-ui/core/Slide');

var _Slide2 = _interopRequireDefault(_Slide);

var _Toolbar = require('@material-ui/core/Toolbar');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _Close = require('@material-ui/icons/Close');

var _Close2 = _interopRequireDefault(_Close);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Transition = (0, _react.forwardRef)(function (props, ref) {
  return _react2.default.createElement(_Slide2.default, _extends({ direction: 'up', ref: ref }, props));
});

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    dialogTitle: {
      marginLeft: theme.spacing(2),
      flex: 1
    },
    dialogPaper: {
      backgroundColor: theme.palette.grey[200],
      position: 'relative'
    },
    contentPaper: {
      margin: theme.spacing(2),
      padding: theme.spacing(3)
    }
  };
});

var DialogBase = function DialogBase(props) {
  var classes = useStyles(_Theme2.default);
  var belowSm = (0, _useMediaQuery2.default)(_Theme2.default.breakpoints.only('xs'));

  var open = props.open,
      onClose = props.onClose,
      title = props.title,
      toolbarChildren = props.toolbarChildren,
      children = props.children,
      closeButtonProps = props.closeButtonProps,
      other = _objectWithoutProperties(props, ['open', 'onClose', 'title', 'toolbarChildren', 'children', 'closeButtonProps']);

  return _react2.default.createElement(
    _Dialog2.default,
    _extends({
      open: open,
      onClose: onClose,
      TransitionComponent: Transition,
      fullScreen: true,
      PaperProps: {
        className: classes.dialogPaper,
        style: {
          top: _Theme2.default.spacing(belowSm ? 0.5 : 4),
          height: 'calc(100% - ' + _Theme2.default.spacing(belowSm ? 13 : 8) + 'px)'
        }
      }
    }, other),
    _react2.default.createElement(
      _AppBar2.default,
      null,
      _react2.default.createElement(
        _Toolbar2.default,
        null,
        _react2.default.createElement(
          _IconButton2.default,
          _extends({
            'data-selenium': 'dialog-close-button',
            edge: 'start',
            color: 'inherit',
            onClick: onClose,
            'aria-label': 'cancel'
          }, closeButtonProps),
          _react2.default.createElement(_Close2.default, null)
        ),
        _react2.default.createElement(
          _Typography2.default,
          { variant: 'h5', className: classes.dialogTitle, noWrap: true },
          title
        ),
        toolbarChildren
      )
    ),
    _react2.default.createElement(
      _Paper2.default,
      { className: classes.contentPaper },
      children
    )
  );
};

DialogBase.propTypes = {
  open: _propTypes2.default.bool,
  onClose: _propTypes2.default.func.isRequired,
  title: _propTypes2.default.string.isRequired,
  toolbarChildren: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.string])), _propTypes2.default.node, _propTypes2.default.string]),
  children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.string])), _propTypes2.default.node, _propTypes2.default.string]).isRequired,
  closeButtonProps: _propTypes2.default.objectOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]))
};

DialogBase.defaultProps = {
  open: true,
  toolbarChildren: null,
  closeButtonProps: {}
};

exports.default = DialogBase;