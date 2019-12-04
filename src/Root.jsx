import React from 'react';

import NeonAuthRoot from './node_modules/components/NeonAuthRoot/NeonAuthRoot';
import App from './App';

const Root = () => (
  <div>
    <NeonAuthRoot
      app={props => (<App {...props} />)}
    />
  </div>
);

export default Root;
