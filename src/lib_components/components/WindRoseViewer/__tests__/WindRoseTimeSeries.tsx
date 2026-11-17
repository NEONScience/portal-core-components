import React from 'react';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import WindRoseTimeSeries, { WindRoseTimeSeriesProps } from '../WindRoseTimeSeries';
import { WIND_SPEED_SERIES_PALETTES } from '../colorSchemes';
import { getEmptyTimeSeries, WindSpeedTimeSeries } from '../windRoseTimeSeriesUtil';

const WIDTH = 1100;

const timeSeries: WindSpeedTimeSeries = {
  interval: 10 * 60 * 1000,
  points: [
    {
      time: Date.UTC(2026, 5, 1, 6),
      samples: 5,
      mean: 2.5,
      min: 0.4,
      max: 7.9,
    },
    {
      time: Date.UTC(2026, 5, 1, 12),
      samples: 5,
      mean: 4.2,
      min: 1.1,
      max: 11.3,
    },
    {
      time: Date.UTC(2026, 5, 15, 12),
      samples: 5,
      mean: 3.1,
      min: 0.8,
      max: 9.6,
    },
  ],
};

const renderTimeSeries = (props: Partial<WindRoseTimeSeriesProps> = {}) => {
  const allProps: WindRoseTimeSeriesProps = {
    timeSeries,
    rangeStart: Date.UTC(2026, 5, 1),
    rangeEnd: Date.UTC(2026, 6, 1),
    rangeName: 'month',
    day: null,
    selectionUnit: 'day',
    colorScheme: 'neon',
    title: 'Wind speed over time, CPER, June 2026',
    isLoading: false,
    onSelect: () => {},
    ...props,
  };
  const result = render(
    <MockTheme>
      <WindRoseTimeSeries {...allProps} />
    </MockTheme>,
  );
  return {
    ...result,
    rerender: (nextProps: Partial<WindRoseTimeSeriesProps>) => result.rerender(
      <MockTheme>
        <WindRoseTimeSeries {...allProps} {...nextProps} />
      </MockTheme>,
    ),
  };
};

const getPath = (container: HTMLElement, key: string): SVGPathElement => (
  container.querySelector(`path[data-path="${key}"]`) as SVGPathElement
);

const isDrawn = (path: SVGPathElement): boolean => (
  (path.getAttribute('display') !== 'none') && !!path.getAttribute('d')
);

describe('WindRoseViewer - WindRoseTimeSeries', () => {
  beforeEach(() => {
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: WIDTH,
      width: WIDTH,
      height: 0,
      toJSON: () => ({}),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('draws the hourly mean as water with the minimum and maximum', () => {
    const { container } = renderTimeSeries();
    expect(screen.getByRole('slider', { name: 'Wind speed over time, CPER, June 2026' }))
      .toBeTruthy();
    expect(screen.getByText('Hourly mean, minimum and maximum wind speed (m/s), UTC'))
      .toBeTruthy();
    ['water', 'meanLine', 'gust', 'maxLine', 'deep', 'minLine'].forEach((key: string) => {
      expect(isDrawn(getPath(container, key))).toBe(true);
    });
    const palette = WIND_SPEED_SERIES_PALETTES.neon;
    expect(getPath(container, 'meanLine').getAttribute('stroke')).toBe(palette.mean);
    expect(getPath(container, 'minLine').getAttribute('stroke')).toBe(palette.min);
    expect(getPath(container, 'maxLine').getAttribute('stroke')).toBe(palette.max);
    expect(screen.getByText('Peak 11.3 m/s')).toBeTruthy();
    // Labels the days of the month
    expect(screen.getByText('Jun 1')).toBeTruthy();
  });

  test('toggles the minimum and maximum', () => {
    const { container } = renderTimeSeries();
    const maximum = screen.getByRole('checkbox', { name: 'Maximum' }) as HTMLInputElement;
    expect(maximum.checked).toBe(true);
    fireEvent.click(maximum);
    expect(maximum.checked).toBe(false);
    expect(isDrawn(getPath(container, 'maxLine'))).toBe(false);
    expect(isDrawn(getPath(container, 'gust'))).toBe(false);
    // Hidden statistics are left out of downloaded images
    expect(maximum.closest('label')?.getAttribute('data-windrose-download-exclude')).toBe('true');
    expect(screen.getByText('Hourly mean and minimum wind speed (m/s), UTC')).toBeTruthy();
    expect(screen.getByText('Highest mean 4.2 m/s')).toBeTruthy();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Minimum' }));
    expect(isDrawn(getPath(container, 'minLine'))).toBe(false);
    expect(isDrawn(getPath(container, 'deep'))).toBe(false);
    expect(isDrawn(getPath(container, 'meanLine'))).toBe(true);
    expect(screen.getByText('Hourly mean wind speed (m/s), UTC')).toBeTruthy();
    fireEvent.click(maximum);
    expect(maximum.checked).toBe(true);
    expect(maximum.closest('label')?.getAttribute('data-windrose-download-exclude')).toBeNull();
    expect(screen.getByText('Hourly mean and maximum wind speed (m/s), UTC')).toBeTruthy();
  });

  test('fits the wind speed axis to the wind speeds shown', () => {
    const getSpeedTicks = (container: HTMLElement): string[] => (
      Array.from(container.querySelectorAll('.windRoseTimeSeriesSpeedAxis .tick text'))
        .map((text: Element): string => text.textContent || '')
    );
    const { container } = renderTimeSeries();
    // Up to the highest maximum of 11.3 m/s
    expect(getSpeedTicks(container)).toEqual(['0', '5', '10']);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Maximum' }));
    // Up to the highest mean of 4.2 m/s
    expect(getSpeedTicks(container)).toEqual(['0', '2', '4']);
  });

  test('draws in the color vision accessible palette', () => {
    const { container } = renderTimeSeries({ colorScheme: 'colorVisionAccessible' });
    const palette = WIND_SPEED_SERIES_PALETTES.colorVisionAccessible;
    expect(getPath(container, 'meanLine').getAttribute('stroke')).toBe(palette.mean);
    expect(getPath(container, 'minLine').getAttribute('stroke')).toBe(palette.min);
    expect(getPath(container, 'maxLine').getAttribute('stroke')).toBe(palette.max);
  });

  test('reads the wind speed through the month and selects a day with the keyboard', () => {
    const onSelectDay = jest.fn<(day: string) => void>();
    renderTimeSeries({ onSelect: onSelectDay });
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'End' });
    expect(slider.getAttribute('aria-valuetext'))
      .toBe('Tue, Jun 30, 23:00-24:00 UTC: no observations');
    // Days without observations cannot be selected
    fireEvent.keyDown(slider, { key: 'Enter' });
    expect(onSelectDay).not.toHaveBeenCalled();
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(slider.getAttribute('aria-valuetext'))
      .toBe('Mon, Jun 1, 00:00-01:00 UTC: no observations');
    for (let i = 0; i < 6; i += 1) {
      fireEvent.keyDown(slider, { key: 'ArrowRight' });
    }
    expect(slider.getAttribute('aria-valuetext')).toBe(
      'Mon, Jun 1, 06:00-07:00 UTC: maximum 7.9 m/s, mean 2.5 m/s, minimum 0.4 m/s',
    );
    expect(screen.getByText('5 observations')).toBeTruthy();
    fireEvent.keyDown(slider, { key: 'Enter' });
    expect(onSelectDay).toHaveBeenCalledWith('2026-06-01');
  });

  test('selects the day clicked on, wherever it is clicked', () => {
    const onSelectDay = jest.fn<(day: string) => void>();
    renderTimeSeries({ onSelect: onSelectDay });
    // 44px in from the edge of the plot
    const plotWidth = WIDTH - 44 - 16;
    const slider = screen.getByRole('slider');
    // Halfway through June 15, when there are observations
    fireEvent.click(slider, { clientX: 44 + (plotWidth * (14.5 / 30)) });
    expect(onSelectDay).toHaveBeenLastCalledWith('2026-06-15');
    expect(screen.getByText('Select to view this day\'s wind rose')).toBeTruthy();
    // Early on June 15, when there are none
    fireEvent.click(slider, { clientX: 44 + (plotWidth * (14.1 / 30)) });
    expect(onSelectDay).toHaveBeenCalledTimes(2);
    expect(onSelectDay).toHaveBeenLastCalledWith('2026-06-15');
    // June 20 has no observations
    fireEvent.click(slider, { clientX: 44 + (plotWidth * (19.5 / 30)) });
    expect(onSelectDay).toHaveBeenCalledTimes(2);
  });

  test('shows a day in 10 minute intervals', () => {
    const onSelectDay = jest.fn<(day: string) => void>();
    const { container } = renderTimeSeries({ day: '2026-06-15', onSelect: onSelectDay });
    expect(screen.getByText('10-minute mean, minimum and maximum wind speed (m/s), UTC'))
      .toBeTruthy();
    expect(screen.getByText('Peak 9.6 m/s')).toBeTruthy();
    expect(screen.getByText('12:00')).toBeTruthy();
    expect(isDrawn(getPath(container, 'meanLine'))).toBe(true);
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(slider.getAttribute('aria-valuetext'))
      .toBe('Mon, Jun 15, 00:00-00:10 UTC: no observations');
    fireEvent.keyDown(slider, { key: 'Enter' });
    expect(onSelectDay).not.toHaveBeenCalled();
  });

  test('keeps the time series shown while the next is fetched', () => {
    const { container, rerender } = renderTimeSeries();
    const meanLine = getPath(container, 'meanLine').getAttribute('d');
    const nextTimeSeries: WindSpeedTimeSeries = {
      ...timeSeries,
      points: timeSeries.points.map((point) => ({ ...point, mean: point.mean + 1 })),
    };
    rerender({ timeSeries: nextTimeSeries, isLoading: true });
    expect(getPath(container, 'meanLine').getAttribute('d')).toBe(meanLine);
    rerender({ timeSeries: nextTimeSeries, isLoading: false });
    expect(getPath(container, 'meanLine').getAttribute('d')).not.toBe(meanLine);
  });

  test('explains when there are no observations', () => {
    const { container } = renderTimeSeries({ timeSeries: getEmptyTimeSeries() });
    expect(screen.getByText('No wind speed observations to show for this month.')).toBeTruthy();
    expect(isDrawn(getPath(container, 'meanLine'))).toBe(false);
  });

  test('shows a season, selecting the month clicked on', () => {
    const onSelect = jest.fn<(month: string) => void>();
    const { container } = renderTimeSeries({
      timeSeries: {
        ...timeSeries,
        points: [
          ...timeSeries.points,
          {
            time: Date.UTC(2026, 7, 10, 12),
            samples: 5,
            mean: 5.2,
            min: 1.9,
            max: 14.1,
          },
        ],
      },
      rangeStart: Date.UTC(2026, 5, 1),
      rangeEnd: Date.UTC(2026, 8, 1),
      rangeName: 'season',
      selectionUnit: 'month',
      title: 'Wind speed over time, CPER, Summer 2026',
      onSelect,
    });
    expect(screen.getByText('3-hour mean, minimum and maximum wind speed (m/s), UTC'))
      .toBeTruthy();
    expect(Array.from(container.querySelectorAll('.windRoseTimeSeriesTimeAxis .tick text'))
      .map((text: Element) => text.textContent)).toEqual(['Jun 2026', 'Jul', 'Aug']);
    expect(screen.getByText('Peak 14.1 m/s')).toBeTruthy();
    expect(screen.getByText('Select a time to view the wind rose of that month.')).toBeTruthy();
    const plotWidth = WIDTH - 44 - 16;
    const slider = screen.getByRole('slider');
    // July has no observations
    fireEvent.click(slider, { clientX: 44 + (plotWidth * 0.5) });
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.click(slider, { clientX: 44 + (plotWidth * 0.8) });
    expect(onSelect).toHaveBeenCalledWith('2026-08');
    expect(screen.getByText('Select to view this month\'s wind rose')).toBeTruthy();
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(slider.getAttribute('aria-valuetext'))
      .toBe('Mon, Jun 1, 2026, 00:00-03:00 UTC: no observations');
  });
});
