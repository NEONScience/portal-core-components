"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const NeonContextService = {
  getContextUserReleases: neonContextState => neonContextState?.auth?.userData?.data?.releases || []
};
var _default = exports.default = NeonContextService;