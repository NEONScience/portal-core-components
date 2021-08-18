import React from 'react';
import renderer from 'react-test-renderer';

import cloneDeep from 'lodash/cloneDeep';

import '../../../../__mocks__/NeonContext';

import TimeSeriesViewerContext, { DEFAULT_STATE } from '../TimeSeriesViewerContext';

import { getTestableItems } from '../TimeSeriesViewerSites';

// Mock the SiteMapContext state
jest.mock('../TimeSeriesViewerContext', () => ({
  ...(jest.requireActual('../TimeSeriesViewerContext').default),
  DEFAULT_STATE: jest.requireActual('../TimeSeriesViewerContext').DEFAULT_STATE,
  useTimeSeriesViewerState: jest.fn(),
}));

const { useTimeSeriesViewerState } = TimeSeriesViewerContext;

const {
  ucWord,
  PositionHistoryButton,
  PositionDetail,
  SelectedPosition,
  SelectPositionsButton,
  SitesControl,
  SiteOption,
  SelectedSite,
} = getTestableItems();

const history010 = [
  {
    'HOR.VER': '000.010',
    start: '2019-02-02',
    end: '2020-01-09',
    azimuth: '0',
    pitch: '0',
    roll: '0',
    xOffset: '2',
    yOffset: '1',
    zOffset: '0',
    referenceLatitude: '67.82',
    referenceLongitude: '120.03',
    referenceElevation: '980',
  },
  {
    'HOR.VER': '000.010',
    azimuth: '0',
    pitch: '0',
    roll: '0',
    xOffset: '5',
    yOffset: '6',
    zOffset: '1',
    referenceLatitude: '67.82',
    referenceLongitude: '120.03',
    referenceElevation: '990',
  },
];

describe('TimeSeriesViewerSites', () => {
  // ucWord
  describe('ucWord', () => {
    test('capitalizes as expected', () => {
      const cases = [
        ['FOO', 'Foo'],
        ['bar', 'Bar'],
        ['Qux', 'Qux'],
      ];
      cases.forEach((c) => {
        expect(ucWord(c[0])).toBe(c[1]);
      });
    });
  });

  // PositionHistoryButton
  describe('PositionHistoryButton', () => {
    test('Renders disabled when history has less than two entries', () => {
      const tree = renderer.create(
        <PositionHistoryButton siteCode="ABBY" position="000.010" history={[]} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('Renders enabled when history has two or more entries', () => {
      const tree = renderer.create(
        <PositionHistoryButton siteCode="ABBY" position="000.010" history={history010} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // PositionDetail
  describe('PositionDetail', () => {
    test('Renders trimmed down detail when position not present in state', () => {
      useTimeSeriesViewerState.mockReturnValue([{
        ...cloneDeep(DEFAULT_STATE),
        product: {
          sites: {
            ABBY: {
              positions: {},
            },
          },
        },
      }]);
      const tree = renderer.create(
        <PositionDetail siteCode="ABBY" position="000.010" />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('Renders full detail when position history is present', () => {
      useTimeSeriesViewerState.mockReturnValue([{
        ...cloneDeep(DEFAULT_STATE),
        product: {
          sites: {
            ABBY: {
              positions: {
                '000.010': { history: history010 },
              },
            },
          },
        },
      }]);
      const tree = renderer.create(
        <PositionDetail siteCode="ABBY" position="000.010" />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('Renders full wide detail when position history is present', () => {
      useTimeSeriesViewerState.mockReturnValue([{
        ...cloneDeep(DEFAULT_STATE),
        product: {
          sites: {
            ABBY: {
              positions: {
                '000.010': { history: history010 },
              },
            },
          },
        },
      }]);
      const tree = renderer.create(
        <PositionDetail siteCode="ABBY" position="000.010" wide />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // SelectedPosition
  describe('SelectedPosition', () => {
    test('Renders as expected', () => {
      useTimeSeriesViewerState.mockReturnValue([{
        ...cloneDeep(DEFAULT_STATE),
        product: {
          sites: {
            ABBY: {
              positions: {},
            },
          },
        },
      }]);
      const tree = renderer.create(
        <SelectedPosition siteCode="ABBY" position="000.010" />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // SelectPositionsButton
  describe('SelectPositionsButton', () => {
    test('Renders as expected', () => {
      useTimeSeriesViewerState.mockReturnValue([{
        ...cloneDeep(DEFAULT_STATE),
        product: {
          sites: {
            ABBY: {
              positions: {
                '000.010': { history: history010 },
                '000.020': { history: [] },
              },
            },
          },
        },
      }]);
      const tree = renderer.create(
        <SelectPositionsButton
          selectedSite={{ siteCode: 'ABBY', positions: ['000.020', '000.010'] }}
        />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // SitesControl
  describe('SitesControl', () => {
    test('Renders as expected', () => {
      const tree = renderer.create(
        <SitesControl
          innerProps={{ 'data-inner': 'foo', onMouseDown: () => {} }}
          selectProps={{ TextFieldProps: { 'data-textField': 'bar' } }}
          innerRef={() => {}}
        >
          <div>children</div>
        </SitesControl>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // SiteOption
  describe('SiteOption', () => {
    test('Renders as expected without stateCode', () => {
      const data = {
        siteCode: 'ABBY',
        description: 'Abby Road',
        type: 'GRADIENT',
        stateCode: 'WA',
        domainCode: 'D16',
        domainName: 'D16 Name',
        terrain: 'TERRESTRIAL',
        latitude: 45.762439,
        longitude: -122.330317,
      };
      const tree = renderer.create(
        <SiteOption
          innerProps={{ tabIndex: 2, id: 'bar', onMouseDown: () => {} }}
          innerRef={() => {}}
          data={data}
          isSelected
          isFocused
        />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // SelectedSite
  describe('SelectedSite', () => {
    beforeEach(() => {
      useTimeSeriesViewerState.mockReturnValue([cloneDeep(DEFAULT_STATE), () => {}]);
    });
    test('Renders as expected (terrestrial / gradient)', () => {
      const tree = renderer.create(
        <SelectedSite site={{ siteCode: 'ABBY', positions: ['000.020', '000.010'] }} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('Renders as expected (terrestrial / core)', () => {
      const tree = renderer.create(
        <SelectedSite site={{ siteCode: 'CPER', positions: ['000.050', '000.040'] }} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('Renders as expected (aquatic / gradient)', () => {
      const tree = renderer.create(
        <SelectedSite site={{ siteCode: 'BIGC', positions: ['000.030', '000.010'] }} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('Renders as expected (aquatic / core)', () => {
      const tree = renderer.create(
        <SelectedSite site={{ siteCode: 'CUPE', positions: ['000.010'] }} />,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
