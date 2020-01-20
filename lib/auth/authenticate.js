"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rxjs = require("rxjs");

var _rxUtil = require("../util/rxUtil");

var _routes = require("../routing/routes");

var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var REDIRECT_URI = 'redirectUri';

var Authenticate =
/*#__PURE__*/
function () {
  function Authenticate() {
    _classCallCheck(this, Authenticate);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.cancellationSubject$ = new _rxjs.Subject();
    this.cancellationEmitter = this.cancellationEmitter.bind(this);
  }
  /**
   * Performs auth0 login action
   */


  _createClass(Authenticate, [{
    key: "login",
    value: function login() {
      window.location.href = "".concat(_NeonEnvironment.default.getFullAuthPath('login'), "?").concat(REDIRECT_URI, "=").concat((0, _routes.getFullRoute)((0, _routes.getHomeRoute)()));
    }
    /**
     * Performs auth0 logout action
     */

  }, {
    key: "logout",
    value: function logout() {
      window.location.href = "".concat(_NeonEnvironment.default.getFullAuthPath('logout'), "?").concat(REDIRECT_URI, "=").concat(_NeonEnvironment.default.getHost()).concat((0, _routes.getFullRoute)((0, _routes.getHomeRoute)()));
    }
  }, {
    key: "cancellationEmitter",
    value: function cancellationEmitter() {
      this.cancellationSubject$.next(true);
      this.cancellationSubject$.unsubscribe();
    }
    /**
     * Determines if the user is authenticated
     * @param {callback} callback Success callback for the observable
     * @param {errorCallback} errorCallback Error callback for the observable
     * @return The RxJS subscription
     */

  }, {
    key: "isAuthenticated",
    value: function isAuthenticated(callback, errorCallback) {
      return this.handleUserInfo(callback, errorCallback);
    }
    /**
     * Checks the authentication response to determine if the user is authenticated
     * @param {response} response The response from the user info endpoint
     * @return True if the user is authenticated
     */

  }, {
    key: "checkAuthResponse",
    value: function checkAuthResponse(response) {
      return response && response.data && response.data.user && typeof response.data.user.user_id === 'string' && response.data.user.user_id.length > 0 && typeof response.data.user.email === 'string' && response.data.user.email.length > 0;
    }
    /**
     * Gets the user info from the API
     * @param {callback} callback The success callback for the observable to emit
     * @param {errorCallback} errorCallback The error callback for the observable to emit
     * @return The user info object
     */

  }, {
    key: "getUserInfo",
    value: function getUserInfo(callback, errorCallback) {
      return this.handleUserInfo(callback, errorCallback);
    }
    /**
     * Handler for calling the user info endpoint
     * @param {callback} callback The success callback for the observable to emit
     * @param {errorCallback} errorCallback The error callback for the observable to emit
     * @return The RxJS subscription
     */

  }, {
    key: "handleUserInfo",
    value: function handleUserInfo(callback, errorCallback) {
      return (0, _rxUtil.getJson)(_NeonEnvironment.default.getFullAuthPath('userInfo'), callback, errorCallback, this.cancellationSubject$);
    }
  }]);

  return Authenticate;
}();

exports.default = Authenticate;