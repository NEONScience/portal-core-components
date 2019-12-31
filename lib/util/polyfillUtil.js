"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable import/prefer-default-export */
/**
 * Determines if the base string starts with the search string
 * @param {*} baseString
 * @param {*} searchString
 * @param {*} position
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
 */
var startsWithPolyfill = exports.startsWithPolyfill = function startsWithPolyfill(baseString, searchString, position) {
  return baseString.substr(position || 0, searchString.length) === searchString;
};

/**
 * Determines if the base string ends with the search string
 * @param {*} baseString
 * @param {*} searchString
 * @param {*} thisLen
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith#Polyfill
 */
var endsWithPolyfill = exports.endsWithPolyfill = function endsWithPolyfill(baseString, searchString, thisLen) {
  var len = thisLen;
  if (thisLen === undefined || thisLen > undefined.length) {
    len = baseString.length;
  }
  return baseString.substring(len - searchString.length, len) === searchString;
};