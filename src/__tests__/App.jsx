import React from 'react';
import ReactDOM from 'react-dom';

import App from '../App';

describe('Portal Core Components App', () => {
  test('Renders without crashing and with the app version in the sidebar', () => {
    process.env.REACT_APP_VERSION = 'version';
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });
});
