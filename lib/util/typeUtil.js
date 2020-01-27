"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.existsNonEmpty = exports.isNum = exports.isStringNonEmpty = exports.exists = void 0;

/* eslint-disable import/no-unresolved, import/extensions */
var exists = function exists(o) {
  return typeof o !== 'undefined' && o !== null;
};

exports.exists = exists;

var isStringNonEmpty = function isStringNonEmpty(o) {
  return typeof o === 'string' && o.trim().length > 0;
};

exports.isStringNonEmpty = isStringNonEmpty;

var isNum = function isNum(o) {
  return typeof o === 'number';
};

exports.isNum = isNum;

var existsNonEmpty = function existsNonEmpty(o) {
  return exists(o) && o.length > 0;
};

exports.existsNonEmpty = existsNonEmpty;