import { Nullable } from '../types/core';

const exists = (o: any): boolean => (typeof o !== 'undefined') && (o !== null);
const isStringNonEmpty = (o: any): boolean => (typeof o === 'string') && ((o as string).trim().length > 0);
const isNum = (o: any): boolean => (typeof o === 'number') && (!isNaN(o));
const existsNonEmpty = (o: Nullable<any[]>): boolean => exists(o) && ((o as any[]).length > 0);

export {
  exists,
  isStringNonEmpty,
  isNum,
  existsNonEmpty,
};
