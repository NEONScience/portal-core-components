/**
   Ajax Mock

   Tests for any components using rjsx/ajax.getJSON can use this to inject a synchronous response.

   Usage:

   import { mockAjaxResponse, mockAjaxError } from 'path/to/src/__mocks__/ajax';

   // Set a mock response (for ajax() AND ajax.getJSON() methods)
   mockAjaxResponse({ ...response });

   // Set a mock error (for ajax() AND ajax.getJSON() methods)
   mockAjaxError('fail');
*/

import { of, throwError } from 'rxjs';

import { ajax } from 'rxjs/ajax';

jest.mock('rxjs/ajax');

ajax.mockReturnValue(of({}));

ajax.getJSON = jest.fn();
ajax.getJSON.mockReturnValue(of({}));

export function mockRawAjaxResponse(response = {}) {
  ajax.mockReset();
  ajax.mockReturnValue(of(response));
}

export function mockRawAjaxError(error = '') {
  ajax.mockReset();
  ajax.mockImplementation(() => throwError(new Error(error)));
}

export function mockGetJSONAjaxResponse(response = {}) {
  ajax.getJSON.mockReset();
  ajax.getJSON.mockReturnValue(of(response));
}

export function mockGetJSONAjaxError(error = '') {
  ajax.getJSON.mockReset();
  ajax.getJSON.mockImplementation(() => throwError(new Error(error)));
}

export function mockAjaxResponse(response = {}) {
  mockRawAjaxResponse(response);
  mockGetJSONAjaxResponse(response);
}

export function mockAjaxError(error = '') {
  mockRawAjaxError(error);
  mockGetJSONAjaxError(error);
}
