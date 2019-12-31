/* eslint-disable class-methods-use-this */
import { Subject } from 'rxjs';
import { getJson } from '../util/rxUtil';
import { getHomeRoute, getFullRoute } from '../routing/routes';
import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';

const REDIRECT_URI = 'redirectUri';

export default class Authenticate {
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.cancellationSubject$ = new Subject();
    this.cancellationEmitter = this.cancellationEmitter.bind(this);
  }

  /**
   * Performs auth0 login action
   */
  login() {
    window.location.href = `${NeonEnvironment.getFullAuthPath('login')
    }?${REDIRECT_URI}=${getFullRoute(getHomeRoute())}`;
  }

  /**
   * Performs auth0 logout action
   */
  logout() {
    window.location.href = `${NeonEnvironment.getFullAuthPath('logout')
    }?${REDIRECT_URI}=${NeonEnvironment.getHost()}${getFullRoute(getHomeRoute())}`;
  }

  cancellationEmitter() {
    this.cancellationSubject$.next(true);
    this.cancellationSubject$.unsubscribe();
  }

  /**
   * Determines if the user is authenticated
   * @param {callback} callback Success callback for the observable
   * @param {errorCallback} errorCallback Error callback for the observable
   * @return The RxJS subscription
   */
  isAuthenticated(callback, errorCallback) {
    return this.handleUserInfo(callback, errorCallback);
  }

  /**
   * Checks the authentication response to determine if the user is authenticated
   * @param {response} response The response from the user info endpoint
   * @return True if the user is authenticated
   */
  checkAuthResponse(response) {
    return response
      && response.data
      && response.data.user
      && typeof response.data.user.user_id === 'string'
      && (response.data.user.user_id.length > 0)
      && typeof response.data.user.email === 'string'
      && (response.data.user.email.length > 0);
  }

  /**
   * Gets the user info from the API
   * @param {callback} callback The success callback for the observable to emit
   * @param {errorCallback} errorCallback The error callback for the observable to emit
   * @return The user info object
   */
  getUserInfo(callback, errorCallback) {
    return this.handleUserInfo(callback, errorCallback);
  }

  /**
   * Handler for calling the user info endpoint
   * @param {callback} callback The success callback for the observable to emit
   * @param {errorCallback} errorCallback The error callback for the observable to emit
   * @return The RxJS subscription
   */
  handleUserInfo(callback, errorCallback) {
    return getJson(NeonEnvironment.getFullAuthPath('userInfo'), callback, errorCallback, this.cancellationSubject$);
  }
}
