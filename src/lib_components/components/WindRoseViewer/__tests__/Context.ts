import { describe, expect, test } from '@jest/globals';

import {
  ActionCreator,
  getTestableItems,
  isReleaseLoginRequired,
  WindRoseAggregation,
  WindRoseViewerQueryState,
  WindRoseViewerState,
} from '../Context';
import {
  buildWindRoseData,
  WindRoseDataFilesInfo,
  WindRoseQualityFilter,
} from '../windRoseUtil';
import { AsyncStateType } from '../../../types/asyncFlow';

const { getDefaultState, reducer } = getTestableItems();

const product = {
  productCode: 'DP1.00001.001',
  productName: '2D wind speed and direction',
  siteCodes: [{ siteCode: 'CPER', availableMonths: ['2026-05', '2026-06', '2026-07'] }],
};

const dataFilesInfo: WindRoseDataFilesInfo = {
  dataFileUrls: [],
  dataFileMatcher: null,
  variablesFileUrl: null,
  positions: [{ horizontal: '000', vertical: '010' }],
  positionOptions: [],
};

const getQuery = (month: string): WindRoseViewerQueryState => ({
  changeType: null,
  sites: ['CPER'],
  months: [month],
  positions: [],
});

const getInitialState = (): WindRoseViewerState => ({
  ...getDefaultState(),
  productCode: product.productCode,
  product,
});

// Fulfills a fetch for the month with one Quality Flag validated observation on each of the days,
// and one observation failing the wind direction quality flag on each of the failing days
const fulfill = (
  state: WindRoseViewerState,
  month: string,
  days: string[],
  failingDays: string[] = [],
): WindRoseViewerState => {
  const toRow = (day: string, windDirFinalQF: string) => ({
    startDateTime: `${day}T12:00:00Z`,
    windDirMean: '270',
    windSpeedMean: '2.5',
    windSpeedFinalQF: '0',
    windDirFinalQF,
  });
  const rows = [
    ...days.map((day: string) => toRow(day, '0')),
    ...failingDays.map((day: string) => toRow(day, '1')),
  ];
  return reducer(
    state,
    ActionCreator.fetchWindRoseFullfilled(
      buildWindRoseData([{ data: rows }], dataFilesInfo),
      getQuery(month),
    ),
  );
};

const filterBy = (
  state: WindRoseViewerState,
  qualityFilter: WindRoseQualityFilter,
): WindRoseViewerState => reducer(state, ActionCreator.setQualityFilter(qualityFilter));

const JUNE_DAYS = ['2026-06-01', '2026-06-02', '2026-06-15', '2026-06-30'];

describe('WindRoseViewer - Context reducer', () => {
  test('defaults to the monthly aggregation', () => {
    const state = getDefaultState();
    expect(state.aggregation).toBe(WindRoseAggregation.MONTHLY);
    expect(state.selectedDay).toBeNull();
    expect(state.isPlaying).toBe(false);
    expect(state.data).toEqual({ monthly: null, daily: {}, days: [] });
  });

  test('stores the monthly and daily wind roses of a fetched month', () => {
    const state = fulfill(getInitialState(), '2026-06', JUNE_DAYS);
    expect(state.fetchState.data?.status).toBe(AsyncStateType.FULLFILLED);
    expect(state.data.monthly?.samples).toBe(JUNE_DAYS.length);
    expect(state.data.days).toEqual(JUNE_DAYS);
    expect(state.data.daily['2026-06-15'].samples).toBe(1);
    expect(state.selectedDay).toBe('2026-06-01');
    expect(state.aggregation).toBe(WindRoseAggregation.MONTHLY);
    expect(state.query.months).toEqual(['2026-06']);
    expect(state.monthOptions.map((option) => option.value))
      .toEqual(['2026-07', '2026-06', '2026-05']);
  });

  test('selecting a day switches to the daily aggregation', () => {
    const fulfilled = fulfill(getInitialState(), '2026-06', JUNE_DAYS);
    const state = reducer(fulfilled, ActionCreator.selectDay('2026-06-15'));
    expect(state.aggregation).toBe(WindRoseAggregation.DAILY);
    expect(state.selectedDay).toBe('2026-06-15');
  });

  test('defaults to the wind roses of all observations', () => {
    expect(getDefaultState().qualityFilter).toBe(WindRoseQualityFilter.ALL);
    const state = fulfill(getInitialState(), '2026-06', JUNE_DAYS);
    expect(state.data.days).toEqual(JUNE_DAYS);
    expect(state.data.monthly?.samples).toBe(JUNE_DAYS.length);
  });

  test('switches between Quality Flag validated and all observations of the fetched month', () => {
    const fulfilled = fulfill(getInitialState(), '2026-06', JUNE_DAYS, ['2026-06-20']);
    const all = filterBy(fulfilled, WindRoseQualityFilter.ALL);
    expect(all.qualityFilter).toBe(WindRoseQualityFilter.ALL);
    expect(all.data.days)
      .toEqual(['2026-06-01', '2026-06-02', '2026-06-15', '2026-06-20', '2026-06-30']);
    expect(all.data.monthly?.samples).toBe(JUNE_DAYS.length + 1);
    const validated = filterBy(all, WindRoseQualityFilter.VALIDATED);
    expect(validated.qualityFilter).toBe(WindRoseQualityFilter.VALIDATED);
    expect(all.data).toEqual(fulfilled.data);
  });

  test('switching quality filters resolves the selected day and playback', () => {
    const all = filterBy(
      fulfill(getInitialState(), '2026-06', JUNE_DAYS, ['2026-06-20']),
      WindRoseQualityFilter.ALL,
    );
    const validated = filterBy(
      reducer(all, ActionCreator.selectDay('2026-06-20')),
      WindRoseQualityFilter.VALIDATED,
    );
    // The closest day with Quality Flag validated observations
    expect(validated.selectedDay).toBe('2026-06-15');
    const playing = reducer(
      filterBy(
        fulfill(getInitialState(), '2026-06', ['2026-06-01'], ['2026-06-02']),
        WindRoseQualityFilter.ALL,
      ),
      ActionCreator.setPlaying(true),
    );
    expect(playing.isPlaying).toBe(true);
    expect(filterBy(playing, WindRoseQualityFilter.VALIDATED).isPlaying).toBe(false);
  });

  test('keeps a day selected in another month once that month is fetched', () => {
    const june = reducer(
      fulfill(getInitialState(), '2026-06', JUNE_DAYS),
      ActionCreator.selectDay('2026-07-20'),
    );
    expect(fulfill(june, '2026-07', ['2026-07-01', '2026-07-20']).selectedDay).toBe('2026-07-20');
    // Without data for the day, the closest day of the month is selected
    expect(fulfill(june, '2026-07', ['2026-07-01', '2026-07-18']).selectedDay).toBe('2026-07-18');
  });

  test('switching aggregations resolves the day and stops playback', () => {
    const fulfilled = fulfill(getInitialState(), '2026-06', JUNE_DAYS);
    const daily = reducer(fulfilled, ActionCreator.setAggregation(WindRoseAggregation.DAILY));
    expect(daily.aggregation).toBe(WindRoseAggregation.DAILY);
    expect(daily.selectedDay).toBe('2026-06-01');
    const playing = reducer(daily, ActionCreator.setPlaying(true));
    expect(playing.isPlaying).toBe(true);
    const monthly = reducer(playing, ActionCreator.setAggregation(WindRoseAggregation.MONTHLY));
    expect(monthly.aggregation).toBe(WindRoseAggregation.MONTHLY);
    expect(monthly.isPlaying).toBe(false);
  });

  test('playback steps through and wraps around the days of the month', () => {
    const fulfilled = fulfill(getInitialState(), '2026-06', JUNE_DAYS);
    const playing = reducer(
      reducer(fulfilled, ActionCreator.selectDay('2026-06-30')),
      ActionCreator.setPlaying(true),
    );
    expect(playing.aggregation).toBe(WindRoseAggregation.DAILY);
    const stepped = reducer(playing, ActionCreator.stepDay(1, true, true));
    expect(stepped.selectedDay).toBe('2026-06-01');
    expect(stepped.isPlaying).toBe(true);
  });

  test('stepping, selecting or fetching stops playback', () => {
    const fulfilled = fulfill(getInitialState(), '2026-06', JUNE_DAYS);
    const playing = reducer(fulfilled, ActionCreator.setPlaying(true));
    const stepped = reducer(playing, ActionCreator.stepDay(1));
    expect(stepped.selectedDay).toBe('2026-06-02');
    expect(stepped.isPlaying).toBe(false);
    expect(reducer(playing, ActionCreator.selectDay('2026-06-15')).isPlaying).toBe(false);
    const fetching = reducer(
      playing,
      ActionCreator.fetchWindRose(product, undefined, getQuery('2026-07')),
    );
    expect(fetching.isPlaying).toBe(false);
  });

  test('playback requires more than one day with data', () => {
    const fulfilled = fulfill(getInitialState(), '2026-06', ['2026-06-01']);
    expect(reducer(fulfilled, ActionCreator.setPlaying(true)).isPlaying).toBe(false);
  });

  test('clears the wind roses when a fetch fails', () => {
    const fulfilled = fulfill(getInitialState(), '2026-06', JUNE_DAYS);
    const failed = reducer(
      fulfilled,
      ActionCreator.fetchWindRoseFailed(
        'error',
        null,
        ActionCreator.fetchWindRose(product, undefined, getQuery('2026-07')),
      ),
    );
    expect(failed.fetchState.data?.status).toBe(AsyncStateType.FAILED);
    expect(failed.data).toEqual({ monthly: null, daily: {}, days: [] });
    expect(failed.dataSets[WindRoseQualityFilter.ALL]).toEqual(failed.data);
    expect(failed.query.months).toEqual(['2026-07']);
  });

  test('keeps site descriptions in the site options when switching releases', () => {
    const neonContextState = {
      ...getDefaultState().neonContextState,
      data: { sites: { CPER: { description: 'Central Plains Experimental Range NEON' } } },
    };
    const stored = reducer(
      getInitialState(),
      ActionCreator.storeFinalizedNeonContextState(neonContextState),
    );
    const siteLabel = 'CPER (Central Plains Experimental Range NEON)';
    expect(fulfill(stored, '2026-06', JUNE_DAYS).siteOptions[0].label).toBe(siteLabel);
    // Switching releases reinitializes the viewer, which then refetches the product and data
    const reinitialized = reducer(
      fulfill(stored, '2026-06', JUNE_DAYS),
      ActionCreator.reinitialize(product.productCode, 'RELEASE-2026'),
    );
    expect(reinitialized.release).toBe('RELEASE-2026');
    expect(reinitialized.product).toBeNull();
    expect(reinitialized.neonContextState).toEqual(neonContextState);
    const refetched = fulfill(
      reducer(reinitialized, ActionCreator.fetchProductSucceeded(product)),
      '2026-06',
      JUNE_DAYS,
    );
    expect(refetched.siteOptions[0].label).toBe(siteLabel);
  });

  test('tracks the limited mode the product was fetched in until reinitialized', () => {
    const state = getInitialState();
    expect(state.isViewerLimitedMode).toBeNull();
    const fetching = reducer(state, ActionCreator.fetchProduct(product.productCode, undefined, true));
    expect(fetching.isViewerLimitedMode).toBe(true);
    const reinitialized = reducer(
      fetching,
      ActionCreator.reinitialize(product.productCode, undefined),
    );
    expect(reinitialized.isViewerLimitedMode).toBeNull();
  });
});

describe('WindRoseViewer - isReleaseLoginRequired', () => {
  test('requires signing in to view a release in limited mode', () => {
    expect(isReleaseLoginRequired(true, 'RELEASE-2026')).toBe(true);
  });
  test('allows latest and provisional data in limited mode and any data when signed in', () => {
    expect(isReleaseLoginRequired(true, undefined)).toBe(false);
    expect(isReleaseLoginRequired(true, '')).toBe(false);
    expect(isReleaseLoginRequired(false, 'RELEASE-2026')).toBe(false);
    expect(isReleaseLoginRequired(false, null)).toBe(false);
  });
});
