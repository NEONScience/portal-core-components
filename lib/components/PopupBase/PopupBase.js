'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./PopupBase.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
   DEPRECATED - Use DialogBase Instead!
*/

var PopupBase = function (_Component) {
  _inherits(PopupBase, _Component);

  function PopupBase() {
    _classCallCheck(this, PopupBase);

    return _possibleConstructorReturn(this, (PopupBase.__proto__ || Object.getPrototypeOf(PopupBase)).apply(this, arguments));
  }

  _createClass(PopupBase, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // keep the background from scrolling when the popup is visible
      document.body.classList.add('popup__base--noscroll');
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.body.classList.remove('popup__base--noscroll');
    }
  }, {
    key: 'render',
    value: function render() {
      var popupBaseStyle = {
        height: this.props.popupHeight,
        width: this.props.popupWidth,
        top: this.props.top,
        left: this.props.left,
        marginTop: this.props.marginTop,
        marginLeft: this.props.marginLeft
      };

      if (this.props.zIndex) {
        popupBaseStyle.zIndex = this.props.zIndex;
      }

      return _react2.default.createElement(
        'div',
        { style: popupBaseStyle, className: 'popup__base' },
        this.props.children
      );
    }
  }]);

  return PopupBase;
}(_react.Component);

exports.default = PopupBase;