"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveAny = exports.isStringNonEmpty = exports.isNum = exports.existsNonEmpty = exports.exists = void 0;
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var exists = function exists(o) {
  return typeof o !== 'undefined' && o !== null;
};
exports.exists = exists;
var isStringNonEmpty = function isStringNonEmpty(o) {
  return typeof o === 'string' && o.trim().length > 0;
};
exports.isStringNonEmpty = isStringNonEmpty;
var isNum = function isNum(o) {
  return typeof o === 'number' && !Number.isNaN(o);
};
exports.isNum = isNum;
var existsNonEmpty = function existsNonEmpty(o) {
  return exists(o) && o.length > 0;
};

/**
 * Resolves any value to a record by
 * drilling down nested props to coerce to a usable type.
 * @param o the object to interrogate
 * @param drillProps array of nested props to drill down to
 * @return The coerced inner prop
 */
exports.existsNonEmpty = existsNonEmpty;
var resolveAny = function resolveAny(o) {
  for (var _len = arguments.length, drillProps = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    drillProps[_key - 1] = arguments[_key];
  }
  if (!exists(o) || !existsNonEmpty(drillProps)) {
    return {};
  }
  var curProp = drillProps[0];
  if (drillProps.length === 1) {
    if (!exists(o[curProp])) {
      return {};
    }
    return o[curProp];
  }
  var next = o[curProp];
  if (!exists(next)) {
    return {};
  }
  return resolveAny.apply(void 0, [next].concat(_toConsumableArray(drillProps.slice(1, drillProps.length))));
};
exports.resolveAny = resolveAny;