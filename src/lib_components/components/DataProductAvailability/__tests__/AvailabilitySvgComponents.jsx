import React from 'react';
import renderer from 'react-test-renderer';

import { SvgDefs, JsxCell, CELL_ATTRS } from '../AvailabilitySvgComponents';

describe('DataProductAvailability - AvailabilitySvgComponents', () => {
  test('renders SvgDefs correctly', () => {
    const tree = renderer
      .create(<SvgDefs />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  describe('renders JsxCell correctly for every status', () => {
    Object.keys(CELL_ATTRS).forEach((status) => {
      test(`JsxCell for status: ${status}`, () => {
        const tree = renderer
          .create(<JsxCell status={status} x={10} y={20} />)
          .toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });
});
