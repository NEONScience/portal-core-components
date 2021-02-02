import {
  mockAjaxResponse,
  mockAjaxError,
} from '../../../../__mocks__/ajax';

import parseDomainHierarchy from '../../../workers/parseDomainHierarchy';
import parseLocationsArray from '../../../workers/parseLocationsArray';

import {
  fetchDomainHierarchy,
  fetchSingleLocationREST,
  fetchManyLocationsGraphQL,
  getTestableItems,
} from '../FetchLocationUtils';

const {
  domainIsValid,
} = getTestableItems();

jest.mock('../../../workers/parseDomainHierarchy');
jest.mock('../../../workers/parseLocationsArray');

describe('SiteMap - FetchLocationUtils', () => {
  describe('domainIsValid()', () => {
    test('returns true for valid inputs', () => {
      for (let i = 1; i <= 20; i += 1) {
        const domain = `D${i.toString().padStart(2, '0')}`;
        expect(domainIsValid(domain)).toBe(true);
      }
    });
    test('returns false for invalid inputs', () => {
      expect(domainIsValid('D00')).toBe(false);
      expect(domainIsValid('D5')).toBe(false);
      expect(domainIsValid('D21')).toBe(false);
      expect(domainIsValid('foo')).toBe(false);
      expect(domainIsValid('')).toBe(false);
      expect(domainIsValid()).toBe(false);
      expect(domainIsValid(false)).toBe(false);
      expect(domainIsValid(null)).toBe(false);
    });
  });

  describe('fetchDomainHierarchy()', () => {
    test('rejects missing argument', () => (
      expect(fetchDomainHierarchy()).rejects.toBeInstanceOf(Error)
    ));
    test('rejects invalid domains', () => (
      expect(fetchDomainHierarchy('BAD')).rejects.toBeInstanceOf(Error)
    ));
    test('rejects if API call fails', () => {
      mockAjaxError('fail');
      return expect(fetchDomainHierarchy('D01')).rejects.toBeInstanceOf(Error);
    });
    test('rejects if response from API is not an object with a data attribute', () => {
      mockAjaxResponse('response');
      return expect(fetchDomainHierarchy('D01')).rejects.toBeInstanceOf(Error);
    });
    test('resolves by passing the fetched response to parseDomainHierarchy', () => {
      mockAjaxResponse({ data: 'foo' });
      parseDomainHierarchy.mockImplementation((input) => `parsed: ${input}`);
      return expect(fetchDomainHierarchy('D01')).resolves.toBe('parsed: foo');
    });
  });

  describe('fetchSingleLocationREST()', () => {
    test('rejects missing argument', () => (
      expect(fetchSingleLocationREST()).rejects.toBeInstanceOf(Error)
    ));
    test('rejects invalid location arguments', () => (
      expect(fetchSingleLocationREST('')).rejects.toBeInstanceOf(Error)
    ));
    test('rejects if API call fails', () => {
      mockAjaxError('fail');
      return expect(fetchSingleLocationREST('GUAN')).rejects.toBeInstanceOf(Error);
    });
    test('rejects if response from API is not an object with a data attribute', () => {
      mockAjaxResponse('response');
      return expect(fetchSingleLocationREST('GUAN')).rejects.toBeInstanceOf(Error);
    });
    test('resolves by passing the fetched response to parseLocationsArray', () => {
      mockAjaxResponse({ data: 'foo' });
      parseLocationsArray.mockImplementation(
        (input) => ({ GUAN: `parsed: ${input[0]}` }),
      );
      return expect(fetchSingleLocationREST('GUAN')).resolves.toBe('parsed: foo');
    });
  });

  describe('fetchManyLocationsGraphQL', () => {
    test('rejects missing argument', () => (
      expect(fetchManyLocationsGraphQL()).rejects.toBeInstanceOf(Error)
    ));
    test('rejects non-array argument', () => (
      expect(fetchManyLocationsGraphQL('GUAN')).rejects.toBeInstanceOf(Error)
    ));
    test('rejects array argument where not all elements are strings', () => (
      expect(fetchManyLocationsGraphQL(['GUAN', null])).rejects.toBeInstanceOf(Error)
    ));
    test('rejects if API call fails', () => {
      mockAjaxError('fail');
      return expect(fetchManyLocationsGraphQL(['GUAN', 'HEAL'])).rejects.toBeInstanceOf(Error);
    });
    test('rejects if response from API is not an object with a response.data.locations array', () => {
      mockAjaxResponse({
        response: {
          data: {
            locations: 'foo',
          },
        },
      });
      return expect(fetchManyLocationsGraphQL(['GUAN', 'HEAL'])).rejects.toBeInstanceOf(Error);
    });
    test('resolves by passing the fetched response.data.locations array to parseLocationsArray', () => {
      mockAjaxResponse({
        response: {
          data: {
            locations: ['foo', 'bar'],
          },
        },
      });
      parseLocationsArray.mockImplementation((input) => input.reverse());
      return expect(fetchManyLocationsGraphQL(['GUAN', 'HEAL'])).resolves.toStrictEqual(['bar', 'foo']);
    });
  });
});
