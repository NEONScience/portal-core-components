import { Subject } from 'rxjs';
// Instantiate the subject and observable.
const subject = new Subject();
const observable = subject.asObservable();
const NeonSignInButtonState = {
    getSubject: ()=>subject,
    sendNotification: ()=>subject.next(),
    getObservable: ()=>observable
};
Object.freeze(NeonSignInButtonState);
export default NeonSignInButtonState;
