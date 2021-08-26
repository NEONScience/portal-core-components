"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Interface to define a service for persisting state.
 */
var StateService = {
  setItem: function setItem(key, value) {
    return sessionStorage.setItem(key, value);
  },
  getItem: function getItem(key) {
    return sessionStorage.getItem(key);
  },
  setObject: function setObject(key, object) {
    return sessionStorage.setItem(key, JSON.stringify(object));
  },
  getObject: function getObject(key) {
    var value = sessionStorage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  },
  key: function key(index) {
    return sessionStorage.key(index);
  },
  removeItem: function removeItem(key) {
    return sessionStorage.removeItem(key);
  },
  clear: function clear() {
    return sessionStorage.clear();
  },
  length: function length() {
    return sessionStorage.length;
  }
};
Object.freeze(StateService);
var _default = StateService;
exports.default = _default;