"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * Interface to define a service for data storage.
 */

var StorageService = {
  setItem: function setItem(key, value) {
    return sessionStorage.setItem(key, value);
  },
  getItem: function getItem(key) {
    return sessionStorage.getItem(key);
  },
  setObject: function setObject(key, object) {
    if (object) {
      sessionStorage.setItem(key, JSON.stringify(object));
    }
  },
  getObject: function getObject(key) {
    var value = sessionStorage.getItem(key);
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  },
  getKey: function getKey(index) {
    return sessionStorage.key(index);
  },
  remove: function remove(key) {
    return sessionStorage.removeItem(key);
  },
  clear: function clear() {
    return sessionStorage.clear();
  },
  getLength: function getLength() {
    return sessionStorage.length;
  }
};
Object.freeze(StorageService);
var _default = StorageService;
exports.default = _default;