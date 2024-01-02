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
let AuthSilentType = exports.AuthSilentType = /*#__PURE__*/function (AuthSilentType) {
  AuthSilentType["DISABLED"] = "DISABLED";
  AuthSilentType["PREVENT_ALL"] = "PREVENT_ALL";
  AuthSilentType["PREVENT_BROWSER"] = "PREVENT_BROWSER";
  AuthSilentType["ALLOW_ALL"] = "ALLOW_ALL";
  return AuthSilentType;
}({});