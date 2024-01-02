"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSafari = exports.default = void 0;
/* eslint-disable dot-notation, wrap-iife, arrow-body-style, func-names */
// @ts-nocheck

const isSafariStore = /constructor/i.test(window.HTMLElement) || function (p) {
  return p.toString() === '[object SafariRemoteNotification]';
}(!window['safari'] || typeof window.safari !== 'undefined' && window.safari.pushNotification);

/**
 * Duck typing method for determing if the browser is safari
 */
const isSafari = () => isSafariStore;
exports.isSafari = isSafari;
const BrowserService = {
  getIsSafari: isSafari
};
var _default = exports.default = BrowserService;