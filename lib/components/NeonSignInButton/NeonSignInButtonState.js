"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _rxjs = require("rxjs");
// Instantiate the subject and observable.
const subject = new _rxjs.Subject();
const observable = subject.asObservable();

/**
 * Interface for sharing sign in button state.
 */

const NeonSignInButtonState = {
  getSubject: () => subject,
  sendNotification: () => subject.next(),
  getObservable: () => observable
};
Object.freeze(NeonSignInButtonState);
var _default = exports.default = NeonSignInButtonState;