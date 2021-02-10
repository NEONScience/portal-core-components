/* eslint react/prop-types: 0 */
/**
   Mock React Component

   Because jest.mock calls can't be dynamic / must hard-code an import path we still need individual
   mocks for every React component that requires mocking. This format defines a generic mock
   implementation for any react component that will appear in snapshots as a div with props mapped
   safely to attributes and any children intact.

   Usage:

   --

   import 'path/to/__mocks__/mockReactComponent';

   jest.mock('path/to/Component', () => mockReactComponent('path/to/Component'));
*/

import React from 'react';

export default function mockReactComponent(path) {
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
    const { children } = props;
    return children ? (
      <div ComponentPath={path} {...dataProps}>
        {children}
      </div>
    ) : (
      <div ComponentPath={path} {...dataProps} />
    );
  };
}
