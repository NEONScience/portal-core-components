import React from 'react';
import { render } from '@testing-library/react';

import { SvgDefs, JsxCell, CELL_ATTRS } from '../AvailabilitySvgComponents';

describe('DataProductAvailability - AvailabilitySvgComponents', () => {
  test('renders SvgDefs correctly', () => {
    const tree = render(<SvgDefs />);
    expect(tree).toMatchSnapshot();
  });
  describe('renders JsxCell correctly for every status', () => {
    Object.keys(CELL_ATTRS).forEach((status) => {
      test(`JsxCell for status: ${status}`, () => {
        const tree = render(<svg><JsxCell status={status} x={10} y={20} /></svg>);
        expect(tree).toMatchSnapshot();
      });
    });
  });
});
