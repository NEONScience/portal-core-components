"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _authenticate = _interopRequireDefault(require("../../auth/authenticate"));

var _routes = require("../../routing/routes");

var _history = require("../../routing/history");

var _NeonAuthLogin = _interopRequireDefault(require("../NeonAuthLogin/NeonAuthLogin"));

var _NeonAuthLogout = _interopRequireDefault(require("../NeonAuthLogout/NeonAuthLogout"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var NeonAuthRoot =
/*#__PURE__*/
function (_Component) {
  _inherits(NeonAuthRoot, _Component);

  function NeonAuthRoot(props) {
    var _this;

    _classCallCheck(this, NeonAuthRoot);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NeonAuthRoot).call(this, props));
    _this.auth = new _authenticate.default(); // Prettify the path

    if (props.cleanPath !== false) {
      (0, _history.cleanPath)((0, _history.getHistory)());
    }

    return _this;
  }

  _createClass(NeonAuthRoot, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement(_reactRouterDom.Router, {
        history: (0, _history.getHistory)()
      }, _react.default.createElement(_reactRouterDom.Switch, null, _react.default.createElement(_reactRouterDom.Route, {
        exact: true,
        path: _routes.ROUTES.HOME,
        render: function render(props) {
          return _this2.props.app.apply(_this2.props.app, [props]);
        }
      }), _react.default.createElement(_reactRouterDom.Route, {
        path: _routes.ROUTES.LOGIN,
        render: function render(props) {
          return _react.default.createElement(_NeonAuthLogin.default, _extends({
            auth: _this2.auth
          }, props));
        }
      }), _react.default.createElement(_reactRouterDom.Route, {
        path: _routes.ROUTES.LOGOUT,
        render: function render(props) {
          return _react.default.createElement(_NeonAuthLogout.default, _extends({
            auth: _this2.auth
          }, props));
        }
      }), _react.default.createElement(_reactRouterDom.Route, {
        render: function render(props) {
          if (_this2.props.disableRedirect) {
            return _this2.props.app.apply(_this2.props.app, [props]);
          }

          return _react.default.createElement(_reactRouterDom.Redirect, {
            to: _routes.ROUTES.HOME
          });
        }
      })));
    }
  }]);

  return NeonAuthRoot;
}(_react.Component);

var _default = NeonAuthRoot;
exports.default = _default;