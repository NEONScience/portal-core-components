import { Nullable, UnknownRecord } from '../types/core';
declare const exists: (o: any) => boolean;
declare const isStringNonEmpty: (o: any) => boolean;
declare const isNum: (o: any) => boolean;
declare const existsNonEmpty: (o: Nullable<any[]>) => boolean;
/**
 * Resolves any value to a record by
 * drilling down nested props to coerce to a usable type.
 * @param o the object to interrogate
 * @param drillProps array of nested props to drill down to
 * @return The coerced inner prop
 */
export declare const resolveAny: (o: never, ...drillProps: string[]) => UnknownRecord;
export { exists, isStringNonEmpty, isNum, existsNonEmpty, };
