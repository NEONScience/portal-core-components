/**
   Material UI Select Mock

   Select has been shown to throw warnings about an initial value being out of range even though
   children present corrobarate the value. Use this mock to simplify it.

   Usage:
   import 'path/to/src/__mocks__/MuiSelect';
*/

import mockMuiComponent from './mockMuiComponent';

jest.mock('@material-ui/core/Select', () => mockMuiComponent('@material-ui/core/Select'));
