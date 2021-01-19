/**
   Material UI Slider Mock

   Slider has been shown to cause fatal problems related to event listeners when present in
   components undergoing snapshot testing. Use this mock to simplify it.

   Usage:
   import 'path/to/src/__mocks__/MuiSlider';
*/

import mockMuiComponent from './mockMuiComponent';

jest.mock('@material-ui/core/Slider', () => mockMuiComponent('@material-ui/core/Slider'));
