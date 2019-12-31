'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _PopupBase = require('../PopupBase/PopupBase');

var _PopupBase2 = _interopRequireDefault(_PopupBase);

require('./PopupLoading.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable react/prop-types, react/jsx-filename-extension, react/destructuring-assignment, react/prefer-stateless-function, max-len */


var PopupLoading = function (_Component) {
  _inherits(PopupLoading, _Component);

  function PopupLoading() {
    _classCallCheck(this, PopupLoading);

    return _possibleConstructorReturn(this, (PopupLoading.__proto__ || Object.getPrototypeOf(PopupLoading)).apply(this, arguments));
  }

  _createClass(PopupLoading, [{
    key: 'render',
    value: function render() {
      var popupBackground = _react2.default.createElement('div', { className: 'popup-loading__background' });

      var spinner = null;
      if (this.props.showSpinner) {
        spinner = _react2.default.createElement(
          'div',
          { className: 'popup-loading__row' },
          _react2.default.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-2x fa-fw' })
        );
      }

      var popupWidth = 320;
      var popupHeight = 120;
      var marginLeft = -(popupWidth / 2);
      var marginTop = -(popupHeight / 2);
      var top = '35%';
      var left = '50%';
      var zIndex = 198;

      return _react2.default.createElement(
        _PopupBase2.default,
        {
          popupWidth: popupWidth,
          popupHeight: popupHeight,
          marginTop: marginTop,
          marginLeft: marginLeft,
          top: top,
          left: left,
          zIndex: zIndex
        },
        popupBackground,
        _react2.default.createElement(
          'div',
          { className: 'popup-loading' },
          _react2.default.createElement(
            'div',
            { className: 'popup-loading__row' },
            this.props.message
          ),
          spinner
        )
      );
    }
  }]);

  return PopupLoading;
}(_react.Component);

exports.default = PopupLoading;