/* eslint-disable import/prefer-default-export */
/**
 * Determines if the base string starts with the search string
 * @param {*} baseString
 * @param {*} searchString
 * @param {*} position
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
 */
export const startsWithPolyfill = (baseString, searchString, position) => baseString.substr(position || 0, searchString.length) === searchString;

/**
 * Determines if the base string ends with the search string
 * @param {*} baseString
 * @param {*} searchString
 * @param {*} thisLen
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith#Polyfill
 */
export const endsWithPolyfill = (baseString, searchString, thisLen) => {
  if (thisLen === undefined || thisLen > this.length) {
    thisLen = baseString.length;
  }
  return baseString.substring(thisLen - searchString.length, thisLen) === searchString;
};
