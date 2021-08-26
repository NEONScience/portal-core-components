import { Subject, Observable } from 'rxjs';
/**
 * Interface for sharing sign in button state.
 */
export interface INeonSignInButtonState {
    /**
     * Get the subject.
     * @returns the subject.
     */
    getSubject: () => Subject<void>;
    /**
     * Tell all observers the button has been clicked.
     * @returns void
     */
    sendNotification: () => void;
    /**
     * Get the observable.
     * @returns the observable.
     */
    getObservable: () => Observable<void>;
}
declare const NeonSignInButtonState: INeonSignInButtonState;
export default NeonSignInButtonState;
