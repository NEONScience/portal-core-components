import { Nullable, NullableRecord, UnknownRecord } from '../types/core';

const exists = (o: any): boolean => (typeof o !== 'undefined') && (o !== null);
const isStringNonEmpty = (o: any): boolean => (typeof o === 'string') && ((o as string).trim().length > 0);
const isNum = (o: any): boolean => (typeof o === 'number') && (!Number.isNaN(o));
const existsNonEmpty = (o: Nullable<any[]>): boolean => exists(o) && ((o as any[]).length > 0);

/**
 * Resolves any value to a record by
 * drilling down nested props to coerce to a usable type.
 * @param o the object to interrogate
 * @param drillProps array of nested props to drill down to
 * @return The coerced inner prop
 */
export const resolveAny = (
  o: never,
  ...drillProps: string[]
): UnknownRecord => {
  if (!exists(o) || !existsNonEmpty(drillProps)) {
    return {};
  }
  const curProp: string = drillProps[0];
  if (drillProps.length === 1) {
    if (!exists(o[curProp])) {
      return {};
    }
    return o[curProp] as UnknownRecord;
  }
  const next: NullableRecord = o[curProp] as NullableRecord;
  if (!exists(next)) {
    return {};
  }
  return resolveAny(
    next as never,
    ...drillProps.slice(1, drillProps.length),
  );
};

export {
  exists,
  isStringNonEmpty,
  isNum,
  existsNonEmpty,
};
