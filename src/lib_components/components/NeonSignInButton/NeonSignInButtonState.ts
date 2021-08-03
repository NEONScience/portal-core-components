import { Subject, Observable } from 'rxjs';

// Instantiate the subject and observable.
const subject = new Subject<void>();
const observable = subject.asObservable();

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

const NeonSignInButtonState: INeonSignInButtonState = {
  getSubject: () => subject,
  sendNotification: () => subject.next(),
  getObservable: () => observable,
};

Object.freeze(NeonSignInButtonState);
export default NeonSignInButtonState;
