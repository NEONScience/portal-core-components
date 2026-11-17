import { describe, expect, test } from '@jest/globals';

import cloneDeep from 'lodash/cloneDeep';

import siteMonthSample from '../../../../sampleData/DataProductAvailability/enhanced-availability-site-month.json';
import componentSample from '../../../../sampleData/DataProductAvailability/enhanced-availability-components.json';

import {
  AVAILABILITY_DATA_LEVELS,
  AvailabilityDataLevel,
  componentAvailabilitySchema,
  detectAvailabilityDataLevel,
  isAvailabilityDataLevel,
  monthlyAvailabilitySchema,
  validateEnhancedAvailability,
} from '../EnhancedAvailabilitySchema';

const { MONTHLY, COMPONENT } = AvailabilityDataLevel;

const buildAvailability = (months: unknown[]) => ({
  productCode: 'DP1.00000.001',
  siteCodes: [
    {
      siteCode: 'JERC',
      availableReleases: [{ release: 'PROVISIONAL', months }],
    },
  ],
});

const componentMonth = {
  month: '2020-03',
  available: false,
  status: null,
  packages: [
    {
      packageType: 'basic',
      components: [{ name: 't1', type: 'tablename', status: 'Partial' }],
    },
  ],
};

describe('DataProductAvailability - EnhancedAvailabilitySchema', () => {
  describe('isAvailabilityDataLevel()', () => {
    test('is true only for data levels', () => {
      expect(AVAILABILITY_DATA_LEVELS).toEqual(['MONTHLY', 'COMPONENT']);
      expect(isAvailabilityDataLevel('MONTHLY')).toBe(true);
      expect(isAvailabilityDataLevel('COMPONENT')).toBe(true);
      expect(isAvailabilityDataLevel('monthly')).toBe(false);
      expect(isAvailabilityDataLevel(null)).toBe(false);
      expect(isAvailabilityDataLevel(undefined)).toBe(false);
    });
  });

  describe('schemas', () => {
    test('validate the monthly sample against both data levels', () => {
      expect(monthlyAvailabilitySchema.safeParse(siteMonthSample.data).success).toBe(true);
      expect(componentAvailabilitySchema.safeParse(siteMonthSample.data).success).toBe(true);
    });
    test('validate the component sample against the component data level only', () => {
      expect(monthlyAvailabilitySchema.safeParse(componentSample.data).success).toBe(false);
      expect(componentAvailabilitySchema.safeParse(componentSample.data).success).toBe(true);
    });
    test('allow monthly months without packages to report null or empty packages', () => {
      const availability = buildAvailability([
        { month: '2020-01', available: true, status: null },
        {
          month: '2020-02',
          available: false,
          status: 'Expected',
          packages: null,
        },
        {
          month: '2020-03',
          available: false,
          status: 'Partial',
          packages: [],
        },
      ]);
      expect(monthlyAvailabilitySchema.safeParse(availability).success).toBe(true);
    });
    test('allow statuses not known to the parser', () => {
      const availability = buildAvailability([
        { month: '2020-01', available: false, status: 'Some New Status' },
      ]);
      expect(monthlyAvailabilitySchema.safeParse(availability).success).toBe(true);
    });
    test('strip properties outside of the schema', () => {
      const availability = {
        ...buildAvailability([{ month: '2020-01', available: true, extra: 'month' }]),
        extra: 'availability',
      };
      const result = monthlyAvailabilitySchema.safeParse(availability);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(buildAvailability([{ month: '2020-01', available: true }]));
    });
  });

  describe('detectAvailabilityDataLevel()', () => {
    test('detects the data level of each sample', () => {
      expect(detectAvailabilityDataLevel(siteMonthSample.data)).toBe(MONTHLY);
      expect(detectAvailabilityDataLevel(componentSample.data)).toBe(COMPONENT);
    });
    test('detects availability without package components as monthly', () => {
      expect(detectAvailabilityDataLevel({ productCode: 'DP1.00000.001', siteCodes: [] }))
        .toBe(MONTHLY);
      expect(detectAvailabilityDataLevel({ siteCodes: [] })).toBe(MONTHLY);
    });
    test('detects availability with any package components as component level', () => {
      const availability = buildAvailability([
        { month: '2020-01', available: true, status: null },
        componentMonth,
      ]);
      expect(detectAvailabilityDataLevel(availability)).toBe(COMPONENT);
    });
    test('detects no data level for data that are not valid availability', () => {
      expect(detectAvailabilityDataLevel(null)).toBeNull();
      expect(detectAvailabilityDataLevel(undefined)).toBeNull();
      expect(detectAvailabilityDataLevel('availability')).toBeNull();
      expect(detectAvailabilityDataLevel({})).toBeNull();
      expect(detectAvailabilityDataLevel(siteMonthSample)).toBeNull();
      expect(detectAvailabilityDataLevel(buildAvailability([
        { month: '2020-13', available: true, status: null },
      ]))).toBeNull();
      expect(detectAvailabilityDataLevel(buildAvailability([
        { month: '2020-01', status: null },
      ]))).toBeNull();
      expect(detectAvailabilityDataLevel(buildAvailability([
        { ...componentMonth, packages: [{ packageType: 'basic' }] },
      ]))).toBeNull();
    });
  });

  describe('validateEnhancedAvailability()', () => {
    test('detects the data level without a specified data level', () => {
      const monthly = validateEnhancedAvailability(siteMonthSample.data);
      expect(monthly.dataLevel).toBe(MONTHLY);
      expect(monthly.error).toBeNull();
      expect(monthly.availability).toEqual(siteMonthSample.data);
      const component = validateEnhancedAvailability(componentSample.data, null);
      expect(component.dataLevel).toBe(COMPONENT);
      expect(component.error).toBeNull();
      expect(component.availability).toEqual(componentSample.data);
    });
    test('does not modify the validated data', () => {
      const data = cloneDeep(componentSample.data);
      const { availability } = validateEnhancedAvailability(data, COMPONENT);
      expect(availability).not.toBe(data);
      expect(data).toEqual(componentSample.data);
    });
    test('accepts availability that agrees with the specified data level', () => {
      expect(validateEnhancedAvailability(siteMonthSample.data, MONTHLY)).toEqual({
        availability: siteMonthSample.data,
        dataLevel: MONTHLY,
        error: null,
      });
      expect(validateEnhancedAvailability(componentSample.data, COMPONENT)).toEqual({
        availability: componentSample.data,
        dataLevel: COMPONENT,
        error: null,
      });
    });
    test('accepts availability without package components as component level', () => {
      expect(validateEnhancedAvailability(siteMonthSample.data, COMPONENT)).toEqual({
        availability: siteMonthSample.data,
        dataLevel: COMPONENT,
        error: null,
      });
    });
    test('rejects component level availability for the monthly data level', () => {
      expect(validateEnhancedAvailability(componentSample.data, MONTHLY)).toEqual({
        availability: null,
        dataLevel: MONTHLY,
        error: 'Expected MONTHLY level availability data but found COMPONENT level data',
      });
    });
    test('rejects availability that is not valid for the specified data level', () => {
      const availability = buildAvailability([
        { month: '2020-01', available: 'yes', status: null },
        { month: 'Jan 2020', available: true, status: null },
      ]);
      expect(validateEnhancedAvailability(availability, COMPONENT)).toEqual({
        availability: null,
        dataLevel: COMPONENT,
        error: 'Invalid COMPONENT level availability data: '
          + 'siteCodes[0].availableReleases[0].months[0].available: '
          + 'Invalid input: expected boolean, received string; '
          + 'siteCodes[0].availableReleases[0].months[1].month: Expected a YYYY-MM month',
      });
    });
    test('reports the first few issues of availability that is not valid', () => {
      const availability = buildAvailability([1, 2, 3, 4, 5]);
      const { error } = validateEnhancedAvailability(availability, MONTHLY);
      expect(error).toMatch(/^Invalid MONTHLY level availability data: /);
      expect(error).toMatch(/months\[2\]: Invalid input: expected object, received number \(and 2 more\)$/);
    });
    test('rejects data that do not match any data level', () => {
      expect(validateEnhancedAvailability({ productCode: 'DP1.00000.001' })).toEqual({
        availability: null,
        dataLevel: null,
        error: 'Availability data do not match a MONTHLY or COMPONENT level schema: '
          + 'siteCodes: Invalid input: expected array, received undefined',
      });
      expect(validateEnhancedAvailability('availability').error).toBe(
        'Availability data do not match a MONTHLY or COMPONENT level schema: '
          + 'Invalid input: expected object, received string',
      );
    });
    test('detects the data level when the specified data level is not valid', () => {
      const result = validateEnhancedAvailability(
        componentSample.data,
        'monthly' as AvailabilityDataLevel,
      );
      expect(result.dataLevel).toBe(COMPONENT);
      expect(result.error).toBeNull();
    });
  });
});
