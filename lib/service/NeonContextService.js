"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const NeonContextService = {
  getContextUserReleases: neonContextState => {
    var _neonContextState$aut;
    return (neonContextState === null || neonContextState === void 0 || (_neonContextState$aut = neonContextState.auth) === null || _neonContextState$aut === void 0 || (_neonContextState$aut = _neonContextState$aut.userData) === null || _neonContextState$aut === void 0 || (_neonContextState$aut = _neonContextState$aut.data) === null || _neonContextState$aut === void 0 ? void 0 : _neonContextState$aut.releases) || [];
  }
};
var _default = exports.default = NeonContextService;