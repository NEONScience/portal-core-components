/* eslint-disable dot-notation, wrap-iife, func-names, @typescript-eslint/ban-ts-comment */ // @ts-nocheck
const isSafariStore = /constructor/i.test(window.HTMLElement) || function(p) {
    return p.toString() === '[object SafariRemoteNotification]';
}(!window['safari'] || typeof window.safari !== 'undefined' && window.safari.pushNotification);
/**
 * Duck typing method for determing if the browser is safari
 */ export const isSafari = ()=>isSafariStore;
const BrowserService = {
    getIsSafari: isSafari
};
export default BrowserService;
