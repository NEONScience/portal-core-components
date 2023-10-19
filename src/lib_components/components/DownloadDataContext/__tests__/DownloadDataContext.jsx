import React from 'react';
import renderer from 'react-test-renderer';
import { renderHook } from '@testing-library/react-hooks';

// import cloneDeep from 'lodash/cloneDeep';

import DownloadDataContext, { getTestableItems } from '../DownloadDataContext';

// Force moment into a fixed point in time
jest.mock('moment', () => () => jest.requireActual('moment')('2020-01-15T12:00:00.000Z'));

const {
  Provider,
  useDownloadDataState,
  DEFAULT_STATE,
  // reducer,
} = DownloadDataContext;

const {
  productDataIsValid,
  yearMonthIsValid,
  newStateIsAllowable,
  newStateIsValid,
  mutateNewStateIntoRange,
  estimatePostSize,
  getValidValuesFromProductData,
  getInitialStateFromProps,
  // getS3FilesFilteredFileCount,
  // getAndValidateNewS3FilesState,
  // regenerateS3FilesFiltersAndValidValues,
  // getAndValidateNewState,
  ALL_POSSIBLE_VALID_DATE_RANGE,
  ALL_POSSIBLE_VALID_DOCUMENTATION,
  ALL_POSSIBLE_VALID_PACKAGE_TYPE,
} = getTestableItems();

describe('DownloadDataContext', () => {
  describe('Provider', () => {
    test('renders with basic productData', (done) => {
      const productData = {
        productCode: 'DP1.00001.001',
        productName: 'foo',
        siteCodes: [
          { siteCode: 'JERC', availableMonths: ['2020-01', '2020-03'] },
          { siteCode: 'BONA', availableMonths: ['2020-02', '2020-04'] },
        ],
      };
      setTimeout(() => {
        const tree = renderer
          .create(
            <Provider productData={productData}>
              <div>children</div>
            </Provider>,
          ).toJSON();
        expect(tree).toMatchSnapshot();
        done();
      });
    });
  });

  describe('useDownloadDataState()', () => {
    test('returns default state and a passthough when invoked outside of a provider', (done) => {
      setTimeout(() => {
        const { result } = renderHook(() => useDownloadDataState());
        expect(Array.isArray(result.current)).toBe(true);
        expect(result.current.length).toBe(2);
        const [state, dispatch] = result.current;
        expect(state).toStrictEqual({ ...DEFAULT_STATE, downloadContextIsActive: false });
        expect(typeof dispatch).toBe('function');
        expect(dispatch()).toBeUndefined();
        done();
      });
    });
  });

  describe('productDataIsValid()', () => {
    test('returns expected boolean value for naive check', () => {
      expect(productDataIsValid()).toBe(false);
      expect(productDataIsValid(null)).toBe(false);
      expect(productDataIsValid({})).toBe(false);
      expect(productDataIsValid({ productName: 'foo' })).toBe(false);
      expect(productDataIsValid({ productName: 'foo', siteCodes: [] })).toBe(true);
    });
  });

  describe('yearMonthIsValid()', () => {
    test('returns false for anything not matching the yearMonth type', () => {
      expect(yearMonthIsValid()).toBe(false);
      expect(yearMonthIsValid(null)).toBe(false);
      expect(yearMonthIsValid(false)).toBe(false);
      expect(yearMonthIsValid({})).toBe(false);
    });
    test('returns false for anything not matching the yearMonth format', () => {
      expect(yearMonthIsValid('')).toBe(false);
      expect(yearMonthIsValid('2020')).toBe(false);
      expect(yearMonthIsValid('202001')).toBe(false);
      expect(yearMonthIsValid('2020-1')).toBe(false);
    });
    test('returns false for any validly formatted string that is before 2010 or beyond next year', () => {
      expect(yearMonthIsValid('1900-01')).toBe(false);
      expect(yearMonthIsValid('2000-05')).toBe(false);
      expect(yearMonthIsValid('2400-01')).toBe(false);
      expect(yearMonthIsValid('3000-01')).toBe(false);
    });
    test('returns false for any validly formatted string in the range with an invalid month', () => {
      expect(yearMonthIsValid('2020-00')).toBe(false);
      expect(yearMonthIsValid('2020-13')).toBe(false);
    });
    test('returns true for valid strings', () => {
      expect(yearMonthIsValid('2020-01')).toBe(true);
      expect(yearMonthIsValid('2015-12')).toBe(true);
    });
  });

  describe('newStateIsAllowable()', () => {
    test('returns false for unrecignized keys regardless of value', () => {
      expect(newStateIsAllowable('foo', true)).toBe(false);
      expect(newStateIsAllowable('bar', 'valid')).toBe(false);
    });
    test('release', () => {
      expect(newStateIsAllowable('release')).toBe(false);
      expect(newStateIsAllowable('release', false)).toBe(false);
      expect(newStateIsAllowable('release', null)).toBe(true);
      expect(newStateIsAllowable('release', 'foo')).toBe(true);
      expect(newStateIsAllowable('release', '')).toBe(false);
      expect(newStateIsAllowable('release', [])).toBe(false);
    });
    test('sites', () => {
      expect(newStateIsAllowable('sites')).toBe(false);
      expect(newStateIsAllowable('sites', [])).toBe(true);
      expect(newStateIsAllowable('sites', [true])).toBe(false);
      expect(newStateIsAllowable('sites', ['JERC', ''])).toBe(false);
      expect(newStateIsAllowable('sites', ['JERC', 'BONA'])).toBe(true);
    });
    test('dateRange', () => {
      expect(newStateIsAllowable('dateRange')).toBe(false);
      expect(newStateIsAllowable('dateRange', [])).toBe(false);
      expect(newStateIsAllowable('dateRange', ['2020-10', '2020-11', '2020-12'])).toBe(false);
      expect(newStateIsAllowable('dateRange', ['2020-00', '2020-02'])).toBe(false);
      expect(newStateIsAllowable('dateRange', ['2020-04', '2020-5'])).toBe(false);
      expect(newStateIsAllowable('dateRange', ['2009-12', '2010-12'])).toBe(false);
      expect(newStateIsAllowable('dateRange', ['2012-12', '2020-09'])).toBe(false);
      expect(newStateIsAllowable('dateRange', ['2017-12', '2014-09'])).toBe(false);
      expect(newStateIsAllowable('dateRange', ['2012-12', '2014-09'])).toBe(true);
    });
    test('provisionalData', () => {
      expect(newStateIsAllowable('provisionalData')).toBe(false);
      expect(newStateIsAllowable('provisionalData', 'foo')).toBe(false);
      expect(newStateIsAllowable('provisionalData', 'exclude')).toBe(true);
      expect(newStateIsAllowable('provisionalData', null)).toBe(true);
    });
    test('documentation', () => {
      expect(newStateIsAllowable('documentation')).toBe(false);
      expect(newStateIsAllowable('documentation', 'foo')).toBe(false);
      expect(newStateIsAllowable('documentation', 'include')).toBe(true);
      expect(newStateIsAllowable('documentation', null)).toBe(true);
    });
    test('packageType', () => {
      expect(newStateIsAllowable('packageType')).toBe(false);
      expect(newStateIsAllowable('packageType', 'foo')).toBe(false);
      expect(newStateIsAllowable('packageType', 'expanded')).toBe(true);
      expect(newStateIsAllowable('packageType', null)).toBe(true);
    });
    test('s3Files', () => {
      expect(newStateIsAllowable('s3Files')).toBe(false);
      expect(newStateIsAllowable('s3Files', [])).toBe(true);
      expect(newStateIsAllowable('s3Files', [null])).toBe(false);
      expect(newStateIsAllowable('s3Files', ['foo'])).toBe(true);
      expect(newStateIsAllowable('s3Files', ['foo', { id: 'bar' }])).toBe(false);
    });
    test('policies', () => {
      expect(newStateIsAllowable('policies')).toBe(false);
      expect(newStateIsAllowable('policies', 'truthy')).toBe(false);
      expect(newStateIsAllowable('policies', 1)).toBe(false);
      expect(newStateIsAllowable('policies', true)).toBe(true);
    });
  });

  describe('newStateIsValid()', () => {
    test('returns false for unrecignized keys regardless of value', () => {
      expect(newStateIsValid('foo', true)).toBe(false);
      expect(newStateIsValid('bar', 'valid')).toBe(false);
    });
    test('sites', () => {
      expect(newStateIsValid('sites', ['JERC', 'BONA'], 'bad')).toBe(false);
      expect(newStateIsValid('sites', ['JERC', 'BONA'], ['JERC', 'COMO'])).toBe(false);
      expect(newStateIsValid('sites', [], ['JERC', 'COMO'])).toBe(false);
      expect(newStateIsValid('sites', ['COMO'], ['JERC', 'COMO'])).toBe(true);
    });
    test('dateRange', () => {
      expect(newStateIsValid('dateRange', ['2012-12', '2014-00'], ['2010-12', '2018-01'])).toBe(false);
      expect(newStateIsValid('dateRange', ['2012-12', '2014-01'], ['2010-14', '2018-01'])).toBe(false);
      expect(newStateIsValid('dateRange', ['2010-06', '2014-01'], ['2010-12', '2018-01'])).toBe(false);
      expect(newStateIsValid('dateRange', ['2012-12', '2019-07'], ['2010-12', '2018-01'])).toBe(false);
      expect(newStateIsValid('dateRange', ['2012-12', '2014-07'], ['2010-12', '2018-01'])).toBe(true);
    });
    test('s3Files', () => {
      expect(
        newStateIsValid('s3Files', [], null),
      ).toBe(false);
      expect(
        newStateIsValid('s3Files', [], []),
      ).toBe(false);
      expect(
        newStateIsValid('s3Files', [], [{ url: 'foo' }, 'bar']),
      ).toBe(false);
      expect(
        newStateIsValid('s3Files', [], [{ url: 'foo' }, null]),
      ).toBe(false);
      expect(
        newStateIsValid('s3Files', [], [{ url: 'foo' }, { foo: 'bar' }]),
      ).toBe(false);
      expect(
        newStateIsValid('s3Files', [], [{ url: 'foo' }, { url: null }]),
      ).toBe(false);
      expect(
        newStateIsValid('s3Files', [], [{ url: 'foo' }, { url: '' }]),
      ).toBe(false);
      expect(
        newStateIsValid('s3Files', 'bad', [{ url: 'foo' }, { url: 'bar' }]),
      ).toBe(false);
      expect(
        newStateIsValid('s3Files', [], [{ url: 'foo' }, { url: 'bar' }]),
      ).toBe(false);
      expect(
        newStateIsValid('s3Files', ['foo', 'qux'], [{ url: 'foo' }, { url: 'bar' }]),
      ).toBe(false);
      expect(
        newStateIsValid('s3Files', ['bar'], [{ url: 'foo' }, { url: 'bar' }]),
      ).toBe(true);
    });
  });

  describe('mutateNewStateIntoRange()', () => {
    test('coerces missing validValues to array', () => {
      expect(
        mutateNewStateIntoRange('sites', ['COMO']),
      ).toStrictEqual([]);
    });
    test('reflects back valid values', () => {
      expect(
        mutateNewStateIntoRange('sites', ['COMO'], ['JERC', 'COMO']),
      ).toStrictEqual(['COMO']);
      expect(
        mutateNewStateIntoRange('dateRange', ['2012-12', '2014-07'], ['2010-12', '2018-01']),
      ).toStrictEqual(['2012-12', '2014-07']);
    });
    describe('sites', () => {
      test('renders unallowable sites array to an empty array', () => {
        expect(
          mutateNewStateIntoRange('sites', 'foo', ['JERC', 'COMO']),
        ).toStrictEqual([]);
      });
      test('filters allowable sites to intersection with validValues', () => {
        expect(
          mutateNewStateIntoRange('sites', ['JERC', 'BONA'], ['JERC', 'COMO']),
        ).toStrictEqual(['JERC']);
      });
    });
    describe('dateRange', () => {
      test('renders unallowable range to validValues', () => {
        expect(
          mutateNewStateIntoRange('dateRange', ['1900-01', '2015-06'], ['2015-01', '2015-12']),
        ).toStrictEqual(['2015-01', '2015-12']);
      });
      test('renders all possible range input to validValues', () => {
        expect(
          mutateNewStateIntoRange('dateRange', ALL_POSSIBLE_VALID_DATE_RANGE, ['2015-01', '2015-12']),
        ).toStrictEqual(['2015-01', '2015-12']);
      });
      test('pulls range into validValues', () => {
        expect(
          mutateNewStateIntoRange('dateRange', ['2014-04', '2015-06'], ['2015-01', '2015-12']),
        ).toStrictEqual(['2015-01', '2015-06']);
        expect(
          mutateNewStateIntoRange('dateRange', ['2015-03', '2017-06'], ['2015-01', '2015-12']),
        ).toStrictEqual(['2015-03', '2015-12']);
      });
    });
  });

  describe('estimatePostSize()', () => {
    test('returns numerical estimates for state inputs', () => {
      expect(
        estimatePostSize(
          { value: ['foo', 'barbar', 'quxquxqux'] },
          { value: ['JERC', 'BONA'] },
        ),
      ).toBe(616);
      expect(
        estimatePostSize(
          { value: ['lorem', 'ispum dolor', 'sit amet lorem'] },
          { value: ['JERC', 'BONA', 'HARV', 'BLUE', 'FLNT'] },
        ),
      ).toBe(820);
    });
  });

  describe('getValidValuesFromProductData()', () => {
    test('extracts releases', () => {
      expect(getValidValuesFromProductData({}, 'release')).toStrictEqual([]);
      const productData = {
        releases: [{ release: 'foo' }, { release: 'bar' }],
      };
      expect(getValidValuesFromProductData(productData, 'release')).toStrictEqual(['foo', 'bar']);
    });
    test('extracts sites', () => {
      expect(getValidValuesFromProductData({}, 'sites')).toStrictEqual([]);
      const productData = {
        siteCodes: [{ siteCode: 'foo' }, { siteCode: 'bar' }],
      };
      expect(getValidValuesFromProductData(productData, 'sites')).toStrictEqual(['foo', 'bar']);
    });
    test('extracts dateRange', () => {
      expect(getValidValuesFromProductData({}, 'dateRange')).toStrictEqual([null, null]);
      let productData = {
        siteCodes: [
          { siteCode: 'foo' },
          { siteCode: 'bar' },
        ],
      };
      expect(getValidValuesFromProductData(productData, 'dateRange')).toStrictEqual([null, null]);
      productData = {
        siteCodes: [
          { siteCode: 'foo', availableMonths: ['2015-04', '2015-08', '2015-09'] },
          { siteCode: 'bar', availableMonths: ['2015-07', '2015-10', '2015-11'] },
        ],
      };
      expect(getValidValuesFromProductData(productData, 'dateRange'))
        .toStrictEqual(['2015-04', '2015-11']);
    });
    test('extracts documentation', () => {
      expect(getValidValuesFromProductData({}, 'documentation')).toStrictEqual([
        ...ALL_POSSIBLE_VALID_DOCUMENTATION,
      ]);
    });
    test('extracts packageType', () => {
      expect(getValidValuesFromProductData({}, 'packageType')).toStrictEqual([
        ...ALL_POSSIBLE_VALID_PACKAGE_TYPE,
      ]);
    });
    test('returns null for policies', () => {
      expect(getValidValuesFromProductData({}, 'policies')).toBe(null);
    });
    test('returns empty array for unrecognized attribute', () => {
      expect(getValidValuesFromProductData({}, 'foo')).toStrictEqual([]);
    });
  });

  describe('getInitialStateFromProps()', () => {
    test('returns default state with no required steps if productData is invalid', () => {
      const initialState = getInitialStateFromProps({
        productData: {},
        availabilityView: 'domains',
      });
      expect(initialState.availabilityView).toBe('domains');
      expect(initialState.requiredSteps).toStrictEqual([]);
    });
    test('builds required steps appropriately when AOP pipeline is detected', () => {
      const props = {
        productData: {
          productName: 'foo',
          siteCodes: [
            { siteCode: 'foo', availableMonths: ['2015-04', '2015-08', '2015-09'] },
            { siteCode: 'bar', availableMonths: ['2015-07', '2015-10', '2015-11'] },
          ],
          productScienceTeam: 'AOP',
          productPublicationFormatType: 'AOP',
          releases: [
            { release: 'r0', generationDate: '2019-01-01T00:00:00' },
            { release: 'r1', generationDate: '2020-01-01T00:00:00' },
          ],
        },
        availabilityView: 'domains',
      };
      const initialState = getInitialStateFromProps(props);
      expect(initialState.availabilityView).toBe(props.availabilityView);
      expect(initialState.productData).toStrictEqual(props.productData);
      expect(initialState.latestRelease).toBe('r1');
      expect(initialState.fromManifest).toBe(false);
      expect(initialState.fromAOPManifest).toBe(true);
      expect(initialState.fromExternalHost).toBe(false);
      expect(initialState.requiredSteps).toStrictEqual([
        { key: 'sitesAndDateRange', isComplete: false },
        { key: 's3Files', isComplete: false },
        { key: 'documentation', isComplete: true },
        { key: 'policies', isComplete: false },
        { key: 'summary', isComplete: null },
      ]);
      expect(initialState.s3FileFetches).toStrictEqual({
        'foo.2015-04': 'notRequested',
        'foo.2015-08': 'notRequested',
        'foo.2015-09': 'notRequested',
        'bar.2015-07': 'notRequested',
        'bar.2015-10': 'notRequested',
        'bar.2015-11': 'notRequested',
      });
    });
    test('removes packageType required step is product does not have expanded data', () => {
      const props = {
        productData: {
          productName: 'foo',
          productHasExpanded: false,
          siteCodes: [],
          releases: [
            { release: 'r1', generationDate: '2020-01-01T00:00:00' },
            { release: 'r0', generationDate: '2019-01-01T00:00:00' },
          ],
        },
        availabilityView: 'states',
      };
      const initialState = getInitialStateFromProps(props);
      expect(initialState.availabilityView).toBe(props.availabilityView);
      expect(initialState.productData).toStrictEqual(props.productData);
      expect(initialState.latestRelease).toBe('r1');
      expect(initialState.fromManifest).toBe(true);
      expect(initialState.fromAOPManifest).toBe(false);
      expect(initialState.fromExternalHost).toBe(false);
      expect(initialState.requiredSteps).toStrictEqual([
        { key: 'sitesAndDateRange', isComplete: false },
        { key: 'documentation', isComplete: true },
        { key: 'policies', isComplete: false },
        { key: 'summary', isComplete: null },
      ]);
    });
    test('preserves packageType required step is product has expanded data', () => {
      const props = {
        productData: {
          productName: 'foo',
          productHasExpanded: true,
          siteCodes: [],
          releases: [
            { release: 'r1', generationDate: '2020-01-01T00:00:00' },
            { release: 'r0', generationDate: '2019-01-01T00:00:00' },
          ],
        },
        availabilityView: 'states',
      };
      const initialState = getInitialStateFromProps(props);
      expect(initialState.availabilityView).toBe(props.availabilityView);
      expect(initialState.productData).toStrictEqual(props.productData);
      expect(initialState.latestRelease).toBe('r1');
      expect(initialState.fromManifest).toBe(true);
      expect(initialState.fromAOPManifest).toBe(false);
      expect(initialState.fromExternalHost).toBe(false);
      expect(initialState.requiredSteps).toStrictEqual([
        { key: 'sitesAndDateRange', isComplete: false },
        { key: 'packageType', isComplete: false },
        { key: 'documentation', isComplete: true },
        { key: 'policies', isComplete: false },
        { key: 'summary', isComplete: null },
      ]);
    });
    test('properly detects externally hosted products - reformatted data', () => {
      const props = {
        productData: {
          productName: 'foo',
          productCode: 'DP1.00001.001', // Host-type: reformatted data
          productHasExpanded: true,
          siteCodes: [],
          releases: [
            { release: 'r1', generationDate: '2020-01-01T00:00:00' },
            { release: 'r0', generationDate: '2019-01-01T00:00:00' },
          ],
        },
        availabilityView: 'sites',
      };
      const initialState = getInitialStateFromProps(props);
      expect(initialState.availabilityView).toBe(props.availabilityView);
      expect(initialState.productData).toStrictEqual(props.productData);
      expect(initialState.latestRelease).toBe('r1');
      expect(initialState.fromManifest).toBe(true);
      expect(initialState.fromAOPManifest).toBe(false);
      expect(initialState.fromExternalHost).toBe(true);
      expect(initialState.requiredSteps).toStrictEqual([
        { key: 'sitesAndDateRange', isComplete: false },
        { key: 'packageType', isComplete: false },
        { key: 'documentation', isComplete: true },
        { key: 'policies', isComplete: false },
        { key: 'summary', isComplete: null },
      ]);
    });
    test('properly detects externally hosted products - exclusive data', () => {
      const props = {
        productData: {
          productName: 'foo',
          productCode: 'DP1.00043.001', // Host-type: exclusive data
          productHasExpanded: true,
          siteCodes: [],
          releases: [
            { release: 'r1', generationDate: '2020-01-01T00:00:00' },
          ],
        },
        availabilityView: 'sites',
      };
      const initialState = getInitialStateFromProps(props);
      expect(initialState.availabilityView).toBe(props.availabilityView);
      expect(initialState.productData).toStrictEqual(props.productData);
      expect(initialState.latestRelease).toBe('r1');
      expect(initialState.fromManifest).toBe(false);
      expect(initialState.fromAOPManifest).toBe(false);
      expect(initialState.fromExternalHost).toBe(true);
      expect(initialState.requiredSteps).toStrictEqual([
        { key: 'externalExclusive', isComplete: null },
      ]);
    });
  });

  /*
  describe('getS3FilesFilteredFileCount()', () => {
    test('', () => {
    });
  });

  describe('getAndValidateNewS3FilesState()', () => {
    test('', () => {
    });
  });

  describe('regenerateS3FilesFiltersAndValidValues()', () => {
    test('', () => {
    });
  });

  describe('getAndValidateNewState()', () => {
    test('', () => {
    });
  });
  */
});
