import React from 'react';
import renderer from 'react-test-renderer';

import cloneDeep from 'lodash/cloneDeep';

import MockTheme from '../../../../__mocks__/MockTheme';
import TimeSeriesViewerContext, { DEFAULT_STATE } from '../TimeSeriesViewerContext';
import { TimeSeriesViewerSummary } from '../TimeSeriesViewerContainer';

// Mock the SiteMapContext state
jest.mock('../TimeSeriesViewerContext', () => ({
  ...(jest.requireActual('../TimeSeriesViewerContext').default),
  DEFAULT_STATE: jest.requireActual('../TimeSeriesViewerContext').DEFAULT_STATE,
  summarizeTimeSteps: jest.requireActual('../TimeSeriesViewerContext').summarizeTimeSteps,
  Y_AXIS_RANGE_MODE_DETAILS: jest.requireActual('../TimeSeriesViewerContext').Y_AXIS_RANGE_MODE_DETAILS,
  useTimeSeriesViewerState: jest.fn(),
}));

const { useTimeSeriesViewerState } = TimeSeriesViewerContext;

describe('TimeSeriesViewerContainer', () => {
  describe('TimeSeriesViewerSummary', () => {
    test('Renders for default state', () => {
      useTimeSeriesViewerState.mockReturnValue([{
        ...cloneDeep(DEFAULT_STATE),
      }]);
      const tree = renderer
        .create(<MockTheme><TimeSeriesViewerSummary /></MockTheme>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('Renders for defined product without sensor / with default selection', () => {
      useTimeSeriesViewerState.mockReturnValue([{
        ...cloneDeep(DEFAULT_STATE),
        product: {
          productName: 'Foo product',
          productCode: 'DP0.00000.000',
          productDescription: 'This is a product that products',
        },
      }]);
      const tree = renderer
        .create(<MockTheme><TimeSeriesViewerSummary /></MockTheme>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('Renders for defined product with sensor / with default selection', () => {
      useTimeSeriesViewerState.mockReturnValue([{
        ...cloneDeep(DEFAULT_STATE),
        product: {
          productName: 'Foo product',
          productCode: 'DP0.00000.000',
          productDescription: 'This is a product that products',
          productSensor: 'product sensor 123',
        },
      }]);
      const tree = renderer
        .create(<MockTheme><TimeSeriesViewerSummary /></MockTheme>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('Renders for selection with only sites', () => {
      useTimeSeriesViewerState.mockReturnValue([{
        ...cloneDeep(DEFAULT_STATE),
        product: {
          productName: 'Foo product',
          productCode: 'DP0.00000.000',
          productDescription: 'This is a product that products',
        },
        selection: {
          ...cloneDeep(DEFAULT_STATE.selection),
          sites: [
            { siteCode: 'ABBY', positions: ['000.010', '000.020'] },
            { siteCode: 'BARR', positions: ['000.030'] },
          ],
        },
      }]);
      const tree = renderer
        .create(<MockTheme><TimeSeriesViewerSummary /></MockTheme>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('Renders for selection with only date range', () => {
      useTimeSeriesViewerState.mockReturnValue([{
        ...cloneDeep(DEFAULT_STATE),
        product: {
          productName: 'Foo product',
          productCode: 'DP0.00000.000',
          productDescription: 'This is a product that products',
        },
        selection: {
          ...cloneDeep(DEFAULT_STATE.selection),
          dateRange: ['2018-04', '2020-01'],
        },
      }]);
      const tree = renderer
        .create(<MockTheme><TimeSeriesViewerSummary /></MockTheme>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('Renders for selection with only variables', () => {
      useTimeSeriesViewerState.mockReturnValue([{
        ...cloneDeep(DEFAULT_STATE),
        product: {
          productName: 'Foo product',
          productCode: 'DP0.00000.000',
          productDescription: 'This is a product that products',
        },
        selection: {
          ...cloneDeep(DEFAULT_STATE.selection),
          variables: ['var1', 'var2'],
        },
      }]);
      const tree = renderer
        .create(<MockTheme><TimeSeriesViewerSummary /></MockTheme>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('Renders for selection with variables and qualityFlags', () => {
      useTimeSeriesViewerState.mockReturnValue([{
        ...cloneDeep(DEFAULT_STATE),
        product: {
          productName: 'Foo product',
          productCode: 'DP0.00000.000',
          productDescription: 'This is a product that products',
        },
        selection: {
          ...cloneDeep(DEFAULT_STATE.selection),
          variables: ['var1', 'var2'],
          qualityFlags: ['qfA', 'qfB', 'qfC'],
        },
      }]);
      const tree = renderer
        .create(<MockTheme><TimeSeriesViewerSummary /></MockTheme>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('Renders for selection with axes', () => {
      useTimeSeriesViewerState.mockReturnValue([{
        ...cloneDeep(DEFAULT_STATE),
        product: {
          productName: 'Foo product',
          productCode: 'DP0.00000.000',
          productDescription: 'This is a product that products',
        },
        selection: {
          ...cloneDeep(DEFAULT_STATE.selection),
          timeStep: '30min',
          rollPeriod: 10,
          yAxes: {
            y1: { units: 'meters', rangeMode: 'FROM_ZERO', axisRange: [0, 36.7] },
            y2: { units: 'degrees', rangeMode: 'CENTERED', axisRange: [10, 30] },
          },
        },
      }]);
      const tree = renderer
        .create(<MockTheme><TimeSeriesViewerSummary /></MockTheme>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
