'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _authenticate = require('../../auth/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

var _routes = require('../../routing/routes');

var _history = require('../../routing/history');

var _typeUtil = require('../../util/typeUtil');

var _NeonAuthLogin = require('../NeonAuthLogin/NeonAuthLogin');

var _NeonAuthLogin2 = _interopRequireDefault(_NeonAuthLogin);

var _NeonAuthLogout = require('../NeonAuthLogout/NeonAuthLogout');

var _NeonAuthLogout2 = _interopRequireDefault(_NeonAuthLogout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NeonAuthRoot = function (_Component) {
  _inherits(NeonAuthRoot, _Component);

  function NeonAuthRoot(props) {
    _classCallCheck(this, NeonAuthRoot);

    var _this = _possibleConstructorReturn(this, (NeonAuthRoot.__proto__ || Object.getPrototypeOf(NeonAuthRoot)).call(this, props));

    _this.auth = new _authenticate2.default();

    // Prettify the path
    if (!(0, _typeUtil.exists)(props.cleanPath) || props.cleanPath) {
      (0, _history.cleanPath)((0, _history.getHistory)());
    }
    return _this;
  }

  _createClass(NeonAuthRoot, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        _reactRouterDom.Router,
        { history: (0, _history.getHistory)() },
        _react2.default.createElement(
          _reactRouterDom.Switch,
          null,
          _react2.default.createElement(_reactRouterDom.Route, {
            exact: true,
            path: _routes.ROUTES.HOME,
            render: function render(props) {
              return _this2.props.app.apply(_this2.props.app, [props]);
            }
          }),
          _react2.default.createElement(_reactRouterDom.Route, {
            path: _routes.ROUTES.LOGIN,
            render: function render(props) {
              return _react2.default.createElement(_NeonAuthLogin2.default, _extends({ auth: _this2.auth }, props));
            }
          }),
          _react2.default.createElement(_reactRouterDom.Route, {
            path: _routes.ROUTES.LOGOUT,
            render: function render(props) {
              return _react2.default.createElement(_NeonAuthLogout2.default, _extends({ auth: _this2.auth }, props));
            }
          }),
          _react2.default.createElement(_reactRouterDom.Route, {
            render: function render(props) {
              if (!(0, _typeUtil.exists)(_this2.props.disableRedirect) || !_this2.props.disableRedirect) {
                return _react2.default.createElement(_reactRouterDom.Redirect, { to: _routes.ROUTES.HOME });
              } else {
                return _this2.props.app.apply(_this2.props.app, [props]);
              }
            }
          })
        )
      );
    }
  }]);

  return NeonAuthRoot;
}(_react.Component);

exports.default = NeonAuthRoot;