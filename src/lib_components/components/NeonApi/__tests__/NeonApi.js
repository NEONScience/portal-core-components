import { of } from 'rxjs';

jest.mock('rxjs/ajax', () => ({
  ajax: jest.fn().mockImplementation((arg1) => arg1),
}));
import { ajax } from 'rxjs/ajax';
ajax.getJSON = jest.fn().mockImplementation((arg1, arg2) => [arg1, arg2]);

import NeonApi, { getTestableItems } from '../NeonApi';

// Mock some NeonEnvironment functions
jest.mock('../../NeonEnvironment/NeonEnvironment', () => ({
  __esModule: true,
  default: {
    getApiTokenHeader: jest.fn(),
    getApiToken: jest.fn(),
  },
}));
import NeonEnvironment from '../../NeonEnvironment/NeonEnvironment';

const {
  getApiTokenHeader,
  getJsonObservable,
  postJsonObservable,
} = getTestableItems();

describe('NeonApi', () => {
  beforeEach(() => {
    NeonEnvironment.getApiTokenHeader.mockReset();
    NeonEnvironment.getApiToken.mockReset();
  });

  describe('getApiTokenHeader()', () => {
    test('returns only token headers in object if passed nothing', () => {
      NeonEnvironment.getApiTokenHeader.mockReturnValue('x-mock-token-header');
      NeonEnvironment.getApiToken.mockReturnValue('mockToken123');
      const expectedHeaders = { 'x-mock-token-header': 'mockToken123', };
      expect(getApiTokenHeader()).toStrictEqual(expectedHeaders);
    });
    test('does not modify headers if not both token header and token are defined', () => {
      const headers = { 'x-foo': 'bar' };
      NeonEnvironment.getApiTokenHeader.mockReturnValue(null);
      NeonEnvironment.getApiToken.mockReturnValue('');
      expect(getApiTokenHeader(headers)).toStrictEqual(headers);
      NeonEnvironment.getApiTokenHeader.mockReturnValue('x-mock-token-header');
      NeonEnvironment.getApiToken.mockReturnValue('');
      expect(getApiTokenHeader(headers)).toStrictEqual(headers);
      NeonEnvironment.getApiTokenHeader.mockReturnValue('');
      NeonEnvironment.getApiToken.mockReturnValue('mockToken123');
      expect(getApiTokenHeader(headers)).toStrictEqual(headers);
    });
    test('does not apply token header if already present', () => {
      const headers = { 'x-foo': 'bar', 'x-mock-token-header': 'otherMockToken123', };
      NeonEnvironment.getApiTokenHeader.mockReturnValue('x-mock-token-header');
      NeonEnvironment.getApiToken.mockReturnValue('mockToken123');
      expect(getApiTokenHeader(headers)).toStrictEqual(headers);
    });
    test('applies token header if not already present', () => {
      const headers = { 'x-foo': 'bar' };
      NeonEnvironment.getApiTokenHeader.mockReturnValue('x-mock-token-header');
      NeonEnvironment.getApiToken.mockReturnValue('mockToken123');
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
    test('returns ajax.getJSON observable with token if url is valid', () => {
      NeonEnvironment.getApiTokenHeader.mockReturnValue('x-mock-token-header');
      NeonEnvironment.getApiToken.mockReturnValue('mockToken123');
      const res = getJsonObservable('test', { 'x-foo': 'bar' });
      expect(res[0]).toBe('test');
      expect(res[1]).toStrictEqual({
        'x-foo': 'bar',
        'x-mock-token-header': 'mockToken123',        
      });
    });
    test('returns ajax.getJSON observable without token if url is valid but includeToken is false', () => {
      NeonEnvironment.getApiTokenHeader.mockReturnValue('x-mock-token-header');
      NeonEnvironment.getApiToken.mockReturnValue('mockToken123');
      const res = getJsonObservable('test', { 'x-foo': 'bar' }, false);
      expect(res[0]).toBe('test');
      expect(res[1]).toStrictEqual({
        'x-foo': 'bar',    
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
    test('returns ajax POST observable with token if url is valid', () => {
      NeonEnvironment.getApiTokenHeader.mockReturnValue('x-mock-token-header');
      NeonEnvironment.getApiToken.mockReturnValue('mockToken123');
      const res = postJsonObservable('test', { foo: 'bar' }, { 'x-foo': 'bar' });
      expect(res).toStrictEqual({
        url: 'test',
        method: 'POST',
        crossDomain: true,
        responseType: 'json',
        headers: {
          'x-foo': 'bar',
          'x-mock-token-header': 'mockToken123', 
          'Content-Type': 'application/json',
        },
        body: '{"foo":"bar"}',
      });
    });
    test('returns ajax POST observable without token if url is valid but includeToken is false', () => {
      NeonEnvironment.getApiTokenHeader.mockReturnValue('x-mock-token-header');
      NeonEnvironment.getApiToken.mockReturnValue('mockToken123');
      const res = postJsonObservable('test', { foo: 'bar' }, { 'x-foo': 'bar' }, false);
      expect(res).toStrictEqual({
        url: 'test',
        method: 'POST',
        crossDomain: true,
        responseType: 'json',
        headers: {
          'x-foo': 'bar',
          'Content-Type': 'application/json',
        },
        body: '{"foo":"bar"}',
      });
    });
  });
});
