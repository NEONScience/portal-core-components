export default class Authenticate {
    /**
     * Performs auth0 login action
     */
    login(): void;
    /**
     * Performs auth0 logout action
     */
    logout(): void;
    /**
     * Determines if the user is authenticated
     * @param {callback} callback Success callback for the observable
     * @param {errorCallback} errorCallback Error callback for the observable
     * @return The RxJS subscription
     */
    isAuthenticated(callback: any, errorCallback: any): import("rxjs").Subscription;
    /**
     * Gets the user info from the API
     * @param {callback} callback The success callback for the observable to emit
     * @param {errorCallback} errorCallback The error callback for the observable to emit
     * @return The user info object
     */
    getUserInfo(callback: any, errorCallback: any): import("rxjs").Subscription;
    cancellationSubject$: Subject<any>;
    cancellationEmitter(): void;
    /**
     * Checks the authentication response to determine if the user is authenticated
     * @param {response} response The response from the user info endpoint
     * @return True if the user is authenticated
     */
    checkAuthResponse(response: any): boolean;
    /**
     * Handler for calling the user info endpoint
     * @param {callback} callback The success callback for the observable to emit
     * @param {errorCallback} errorCallback The error callback for the observable to emit
     * @return The RxJS subscription
     */
    handleUserInfo(callback: any, errorCallback: any): import("rxjs").Subscription;
}
import { Subject } from "rxjs";
