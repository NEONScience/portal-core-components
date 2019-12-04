'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rxjs = require('rxjs');

var _rxUtil = require('../util/rxUtil');

var _routes = require('../routing/routes');

var _NeonEnvironment = require('../components/NeonEnvironment/NeonEnvironment');

var _NeonEnvironment2 = _interopRequireDefault(_NeonEnvironment);

var _typeUtil = require('../util/typeUtil');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REDIRECT_URI = 'redirectUri';

var Authenticate = function () {
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
    key: 'login',
    value: function login() {
      window.location.href = _NeonEnvironment2.default.getFullAuthPath('login') + '?' + REDIRECT_URI + '=' + (0, _routes.getFullRoute)((0, _routes.getHomeRoute)());
    }

    /**
     * Performs auth0 logout action
     */

  }, {
    key: 'logout',
    value: function logout() {
      window.location.href = _NeonEnvironment2.default.getFullAuthPath('logout') + '?' + REDIRECT_URI + '=' + _NeonEnvironment2.default.getHost() + (0, _routes.getFullRoute)((0, _routes.getHomeRoute)());
    }
  }, {
    key: 'cancellationEmitter',
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
    key: 'isAuthenticated',
    value: function isAuthenticated(callback, errorCallback) {
      return this.handleUserInfo(callback, errorCallback);
    }

    /**
     * Checks the authentication response to determine if the user is authenticated
     * @param {response} response The response from the user info endpoint
     * @return True if the user is authenticated
     */

  }, {
    key: 'checkAuthResponse',
    value: function checkAuthResponse(response) {
      return (0, _typeUtil.exists)(response) && (0, _typeUtil.exists)(response.data) && (0, _typeUtil.exists)(response.data.user) && (0, _typeUtil.exists)(response.data.user.user_id) && response.data.user.user_id.length > 0 && (0, _typeUtil.exists)(response.data.user.email) && response.data.user.email.length > 0;
    }

    /**
     * Gets the user info from the API
     * @param {callback} callback The success callback for the observable to emit
     * @param {errorCallback} errorCallback The error callback for the observable to emit
     * @return The user info object
     */

  }, {
    key: 'getUserInfo',
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
    key: 'handleUserInfo',
    value: function handleUserInfo(callback, errorCallback) {
      return (0, _rxUtil.getJson)(_NeonEnvironment2.default.getFullAuthPath('userInfo'), callback, errorCallback, this.cancellationSubject$);
    }
  }]);

  return Authenticate;
}();

exports.default = Authenticate;