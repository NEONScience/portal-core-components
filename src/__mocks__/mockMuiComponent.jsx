/**
   Material UI Component Mock

   Because jest.mock calls can't be dynmaic / must hard-code an import path we still need individual
   mocks for every Mui Component that requires mocking. This format at least allows us to define the
   mock implementation for serialization in one place (here) and keep all distinct component mocks
   very lightweight with little repetition.

   Do not use this directly in tests; this is meant for specific component mocks to use which are in
   turn used in tests.

   Usage:

   --

   import './mockMuiComponent';

   jest.mock('@material-ui/core/Component', () => mockMuiComponent('@material-ui/core/Component'));
*/

import React from 'react';

export default function mockMuiComponent(path) {
  return (props) => {
    const dataProps = {};
    Object.keys(props).forEach((prop) => {
      if (prop === 'children') { return; }
      const value = props[prop];
      let renderableValue = value;
      try {
        if (typeof value === 'object') { renderableValue = JSON.stringify(value); }
        if (typeof value === 'function') { renderableValue = value.toString(); }
      } catch (error) {
        renderableValue = `Non-renderable ${typeof value} (${error})`;
      }
      dataProps[`prop-${prop}`] = renderableValue;
    });
    return <div MuiComponent={path} {...dataProps} />;
  };
}
