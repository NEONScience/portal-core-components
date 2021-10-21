/* eslint no-underscore-dangle: 0 */
import { ajax } from 'rxjs/ajax';

import { getTestableItems } from '../NeonApi';
import NeonEnvironment from '../../NeonEnvironment/NeonEnvironment';

jest.mock('rxjs/ajax', () => {
  const RxAjax = require('rxjs/internal/observable/dom/AjaxObservable');
  return {
    ajax: jest.fn().mockImplementation((arg1) => new RxAjax.AjaxObservable(arg1)),
  };
});
ajax.getJSON = jest.fn().mockImplementation((arg1, arg2) => [arg1, arg2]);

// Mock some NeonEnvironment functions
jest.mock('../../NeonEnvironment/NeonEnvironment', () => ({
  __esModule: true,
  default: {
    getApiTokenHeader: jest.fn(),
    getApiToken: jest.fn(),
    requireCors: jest.fn(),
  },
}));

const {
  getApiTokenHeader,
  getJsonObservable,
  postJsonObservable,
} = getTestableItems();

describe('NeonApi', () => {
  beforeEach(() => {
    NeonEnvironment.getApiTokenHeader.mockReset();
    NeonEnvironment.getApiToken.mockReset();
    NeonEnvironment.requireCors.mockReset();
  });

  describe('getApiTokenHeader()', () => {
    test('returns only token headers in object if passed nothing', () => {
      NeonEnvironment.getApiTokenHeader.mockReturnValue('x-mock-token-header');
      NeonEnvironment.getApiToken.mockReturnValue('mockToken123');
      NeonEnvironment.requireCors.mockReturnValue(false);
      const expectedHeaders = { 'x-mock-token-header': 'mockToken123' };
      expect(getApiTokenHeader()).toStrictEqual(expectedHeaders);
    });
    test('does not modify headers if not both token header and token are defined', () => {
      const headers = { 'x-foo': 'bar' };
      NeonEnvironment.getApiTokenHeader.mockReturnValue(null);
      NeonEnvironment.getApiToken.mockReturnValue('');
      NeonEnvironment.requireCors.mockReturnValue(false);
      expect(getApiTokenHeader(headers)).toStrictEqual(headers);
      NeonEnvironment.getApiTokenHeader.mockReturnValue('x-mock-token-header');
      NeonEnvironment.getApiToken.mockReturnValue('');
      NeonEnvironment.requireCors.mockReturnValue(false);
      expect(getApiTokenHeader(headers)).toStrictEqual(headers);
      NeonEnvironment.getApiTokenHeader.mockReturnValue('');
      NeonEnvironment.getApiToken.mockReturnValue('mockToken123');
      NeonEnvironment.requireCors.mockReturnValue(false);
      expect(getApiTokenHeader(headers)).toStrictEqual(headers);
    });
    test('does not apply token header if already present', () => {
      const headers = { 'x-foo': 'bar', 'x-mock-token-header': 'otherMockToken123' };
      NeonEnvironment.getApiTokenHeader.mockReturnValue('x-mock-token-header');
      NeonEnvironment.getApiToken.mockReturnValue('mockToken123');
      NeonEnvironment.requireCors.mockReturnValue(false);
      expect(getApiTokenHeader(headers)).toStrictEqual(headers);
    });
    test('applies token header if not already present', () => {
      const headers = { 'x-foo': 'bar' };
      NeonEnvironment.getApiTokenHeader.mockReturnValue('x-mock-token-header');
      NeonEnvironment.getApiToken.mockReturnValue('mockToken123');
      NeonEnvironment.requireCors.mockReturnValue(false);
      const expectedHeaders = {
        'x-foo': 'bar',
        'x-mock-token-header': 'mockToken123',
      };
      expect(getApiTokenHeader(headers)).toStrictEqual(expectedHeaders);
    });
  });

  describe('getJsonObservable()', () => {
    test('returns null observable when no url is supplied', () => {
      [undefined, false, ''].forEach((arg) => {
        const result = getJsonObservable(arg);
        expect(result.constructor.name).toBe('Observable');
        expect(result._isScalar).toBe(true);
        expect(result.value).toBe(null);
      });
    });
  });

  describe('postJsonObservable()', () => {
    test('returns null observable when no url is supplied', () => {
      [undefined, false, ''].forEach((arg) => {
        const result = postJsonObservable(arg);
        expect(result.constructor.name).toBe('Observable');
        expect(result._isScalar).toBe(true);
        expect(result.value).toBe(null);
      });
    });
  });
});
