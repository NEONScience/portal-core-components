/**
   Ajax Mock

   Tests for any components using rjsx/ajax.getJSON can use this to inject a synchronous response.

   Usage:
   import { mockAjaxResponse, mockAjaxError } from ''path/to/src/__mocks__/ajax';
   mockAjaxResponse({ ...response });
   mockAjaxError('fail');
*/

import { of, throwError } from 'rxjs';

jest.mock('rxjs/ajax');

import { ajax } from 'rxjs/ajax';

ajax.mockReturnValue(of({}));

ajax.getJSON = jest.fn();
ajax.getJSON.mockReturnValue(of({}));

export function mockAjaxResponse(response = {}) {
  ajax.getJSON.mockReset();
  ajax.getJSON.mockReturnValue(of(response));
};

export function mockAjaxError(error = '') {
  ajax.getJSON.mockReset();
  ajax.getJSON.mockImplementation(() => throwError(new Error(error)));
};

export function mockRawAjaxResponse(response = {}) {
  ajax.mockReset();
  ajax.mockReturnValue(of(response));
};

export function mockRawAjaxError(error = '') {
  ajax.mockReset();
  ajax.mockImplementation(() => throwError(new Error(error)));
};
