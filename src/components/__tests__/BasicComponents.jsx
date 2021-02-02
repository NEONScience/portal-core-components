import React from 'react';
import ReactDOM from 'react-dom';

import BasicComponents from '../BasicComponents';

describe('BasicComponents Page', () => {
  test('Renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<BasicComponents />, div);
  });
});
