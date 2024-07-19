"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _StorageService = _interopRequireDefault(require("./StorageService"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Interface for a simple application state storage service.
 */

/**
 * Function to create application state storage.
 * @param key The key to identify the entry in storage.
 * @returns A StateStorage object with functions to store and retrieve application state.
 */
const makeStateStorage = key => ({
  saveState: state => _StorageService.default.setObject(key, state),
  readState: () => _StorageService.default.getObject(key),
  removeState: () => _StorageService.default.remove(key)
});
var _default = exports.default = makeStateStorage;