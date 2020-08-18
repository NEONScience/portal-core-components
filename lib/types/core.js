"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthSilentType = void 0;

/**
 * General convenience type definitions
 */

/**
 * Type to encapsulate silent authentication allowance
 */
var AuthSilentType;
exports.AuthSilentType = AuthSilentType;

(function (AuthSilentType) {
  AuthSilentType["PREVENT_ALL"] = "PREVENT_ALL";
  AuthSilentType["PREVENT_BROWSER"] = "PREVENT_BROWSER";
  AuthSilentType["ALLOW_ALL"] = "ALLOW_ALL";
})(AuthSilentType || (exports.AuthSilentType = AuthSilentType = {}));