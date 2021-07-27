import { Subject } from 'rxjs';

// observable for sharing button state with other components
const buttonSubject = new Subject<void>();

export const getSignInButtonSubject = () => buttonSubject;

export const getSignInButtonObservable = () => buttonSubject.asObservable();
