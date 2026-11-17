import { describe, expect, test } from '@jest/globals';

import {
  AVAILABILITY_INHERITANCE_MODES,
  AvailabilityInheritanceMode,
  DEFAULT_AVAILABILITY_INHERITANCE_MODE,
  isAvailabilityInheritanceMode,
  resolveInheritanceMode,
} from '../EnhancedAvailabilityInheritance';

const { TECHNICAL_AVAILABILITY, CATEGORICAL_STATUS, NONE } = AvailabilityInheritanceMode;

describe('DataProductAvailability - EnhancedAvailabilityInheritance', () => {
  describe('isAvailabilityInheritanceMode()', () => {
    test('is true only for inheritance modes', () => {
      expect(AVAILABILITY_INHERITANCE_MODES).toEqual([
        'TECHNICAL_AVAILABILITY',
        'CATEGORICAL_STATUS',
        'NONE',
      ]);
      expect(isAvailabilityInheritanceMode('TECHNICAL_AVAILABILITY')).toBe(true);
      expect(isAvailabilityInheritanceMode('CATEGORICAL_STATUS')).toBe(true);
      expect(isAvailabilityInheritanceMode('NONE')).toBe(true);
      expect(isAvailabilityInheritanceMode('none')).toBe(false);
      expect(isAvailabilityInheritanceMode(null)).toBe(false);
      expect(isAvailabilityInheritanceMode(undefined)).toBe(false);
    });
  });

  describe('resolveInheritanceMode()', () => {
    test('resolves an inheritance mode to itself', () => {
      expect(resolveInheritanceMode(TECHNICAL_AVAILABILITY)).toBe(TECHNICAL_AVAILABILITY);
      expect(resolveInheritanceMode(CATEGORICAL_STATUS)).toBe(CATEGORICAL_STATUS);
      expect(resolveInheritanceMode(NONE)).toBe(NONE);
    });
    test('resolves anything else to the default inheritance mode', () => {
      expect(DEFAULT_AVAILABILITY_INHERITANCE_MODE).toBe(TECHNICAL_AVAILABILITY);
      expect(resolveInheritanceMode('none')).toBe(TECHNICAL_AVAILABILITY);
      expect(resolveInheritanceMode(null)).toBe(TECHNICAL_AVAILABILITY);
      expect(resolveInheritanceMode(undefined)).toBe(TECHNICAL_AVAILABILITY);
    });
  });
});
