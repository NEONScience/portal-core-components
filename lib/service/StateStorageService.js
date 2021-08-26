"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _StorageService = _interopRequireDefault(require("./StorageService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Function to create application state storage.
 * @param key The key to identify the entry in storage.
 * @returns A StateStorage object with functions to store and retrieve application state.
 */
var makeStateStorage = function makeStateStorage(key) {
  return {
    saveState: function saveState(state) {
      return _StorageService.default.setObject(key, state);
    },
    readState: function readState() {
      return _StorageService.default.getObject(key);
    },
    removeState: function removeState() {
      return _StorageService.default.remove(key);
    }
  };
};

var _default = makeStateStorage;
exports.default = _default;