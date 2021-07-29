import { Subject, Observable } from 'rxjs';

// Instantiate the subject which is triggered without any.
const buttonSubject = new Subject<void>();

/**
 * Interface with functions for sharing sign in button state with other components
 */
export interface INeonSignInButtonState {
  /**
   * Get the button subject.
   * @returns the button subject.
   */
  getSignInButtonSubject: () => Subject<void>;
  /**
   * Indicate to observers the button has been clicked.
   * @returns void
   */
  sendClickNotification: () => void;
  /**
   * Get the button observable.
   * @returns the observable.
   */
  getSignInButtonObservable: () => Observable<void>;
}

const NeonSignInButtonState: INeonSignInButtonState = {
  getSignInButtonSubject: () => buttonSubject,
  sendClickNotification: () => buttonSubject.next(),
  getSignInButtonObservable: () => buttonSubject.asObservable(),
};

Object.freeze(NeonSignInButtonState);
export default NeonSignInButtonState;
