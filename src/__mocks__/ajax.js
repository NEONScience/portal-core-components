/**
   Ajax Mock

   Tests for any components using rjsx/ajax.getJSON can use this to inject a synchronous response.

   Usage:
   import mockAjaxResponse from ''path/to/src/__mocks__/ajax';
   mockAjaxResponse({ ...response });
*/


import { of } from 'rxjs';

jest.mock('rxjs/ajax', () => ({
  ...(jest.requireActual('rxjs/ajax'))
}));

import { ajax } from 'rxjs/ajax';

ajax.getJSON = jest.fn();
ajax.getJSON.mockReturnValue(of({}));

export default function mockAjaxResponse(response = {}) {
  ajax.getJSON.mockReset();
  ajax.getJSON.mockReturnValue(of(response));
};
