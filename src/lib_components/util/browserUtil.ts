/* eslint-disable dot-notation, wrap-iife, arrow-body-style, func-names */
// @ts-nocheck

const isSafariStore: boolean = /constructor/i.test(window.HTMLElement)
  || (function (p) {
    return p.toString() === '[object SafariRemoteNotification]';
  })(!window['safari'] || (typeof window.safari !== 'undefined' && window.safari.pushNotification));

/**
 * Duck typing method for determing if the browser is safari
 */
export const isSafari = (): boolean => isSafariStore;

const BrowserService = {
  getIsSafari: isSafari,
};

export default BrowserService;
