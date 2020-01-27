/* eslint-disable import/no-unresolved, import/extensions */

import { Nullable } from '../types/coreTypes';

const exists = (o: any): boolean => (typeof o !== 'undefined') && (o !== null);
const isStringNonEmpty = (o: any): boolean => (typeof o === 'string') && ((o as string).trim().length > 0);
const isNum = (o: any): boolean => (typeof o === 'number');
const existsNonEmpty = (o: Nullable<any[]>): boolean => exists(o) && ((o as any[]).length > 0);

export {
  exists,
  isStringNonEmpty,
  isNum,
  existsNonEmpty,
};