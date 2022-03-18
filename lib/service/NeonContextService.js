"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var NeonContextService = {
  getContextUserReleases: function getContextUserReleases(neonContextState) {
    var _neonContextState$aut, _neonContextState$aut2, _neonContextState$aut3;

    return (neonContextState === null || neonContextState === void 0 ? void 0 : (_neonContextState$aut = neonContextState.auth) === null || _neonContextState$aut === void 0 ? void 0 : (_neonContextState$aut2 = _neonContextState$aut.userData) === null || _neonContextState$aut2 === void 0 ? void 0 : (_neonContextState$aut3 = _neonContextState$aut2.data) === null || _neonContextState$aut3 === void 0 ? void 0 : _neonContextState$aut3.releases) || [];
  }
};
var _default = NeonContextService;
exports.default = _default;