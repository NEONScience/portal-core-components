"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * Interface to define a service for data storage.
 */

const StorageService = {
  setItem: (key, value) => sessionStorage.setItem(key, value),
  getItem: key => sessionStorage.getItem(key),
  setObject: (key, object) => {
    if (object) {
      sessionStorage.setItem(key, JSON.stringify(object));
    }
  },
  getObject: key => {
    const value = sessionStorage.getItem(key);
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  },
  getKey: index => sessionStorage.key(index),
  remove: key => sessionStorage.removeItem(key),
  clear: () => sessionStorage.clear(),
  getLength: () => sessionStorage.length
};
Object.freeze(StorageService);
var _default = exports.default = StorageService;