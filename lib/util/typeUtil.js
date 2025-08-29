"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveAny = exports.isStringNonEmpty = exports.isNum = exports.existsNonEmpty = exports.exists = void 0;
const exists = o => typeof o !== 'undefined' && o !== null;
exports.exists = exists;
const isStringNonEmpty = o => typeof o === 'string' && o.trim().length > 0;
exports.isStringNonEmpty = isStringNonEmpty;
const isNum = o => typeof o === 'number' && !Number.isNaN(o);
exports.isNum = isNum;
const existsNonEmpty = o => exists(o) && o.length > 0;

/**
 * Resolves any value to a record by
 * drilling down nested props to coerce to a usable type.
 * @param o the object to interrogate
 * @param drillProps array of nested props to drill down to
 * @return The coerced inner prop
 */
exports.existsNonEmpty = existsNonEmpty;
const resolveAny = (o, ...drillProps) => {
  if (!exists(o) || !existsNonEmpty(drillProps)) {
    return {};
  }
  const curProp = drillProps[0];
  if (drillProps.length === 1) {
    if (!exists(o[curProp])) {
      return {};
    }
    return o[curProp];
  }
  const next = o[curProp];
  if (!exists(next)) {
    return {};
  }
  return resolveAny(next, ...drillProps.slice(1, drillProps.length));
};
exports.resolveAny = resolveAny;