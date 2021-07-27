import { Subject } from 'rxjs';

// observable for sharing button state with other components
const buttonSubject = new Subject();

export const getSignInButtonSubject = () => buttonSubject;

export const getSignInButtonObservable = () => buttonSubject.asObservable();
