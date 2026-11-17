import React from 'react';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import WindRoseMonthCalendar from '../WindRoseMonthCalendar';
import { DIRECTION_BINS, VELOCITY_BINS, WindRoseAggregate } from '../windRoseUtil';
import { WindRosePeriodDataState, WindRosePeriodType } from '../windRosePeriodUtil';
import { getEmptyTimeSeries } from '../windRoseTimeSeriesUtil';

// Observations from the north at the slowest speed
const buildAggregate = (samples: number): WindRoseAggregate => ({
  bins: DIRECTION_BINS.map((angle: string) => {
    const counts = VELOCITY_BINS.map(() => 0);
    if (angle === '0') {
      counts[0] = samples;
    }
    return { angle, counts, total: counts.reduce((sum, count) => sum + count, 0) };
  }),
  samples,
  calm: 0,
  meanSpeed: 0.1,
});

const dataSet: WindRosePeriodDataState = {
  aggregate: buildAggregate(30),
  monthly: {
    '2026-06': buildAggregate(10),
    '2026-08': buildAggregate(20),
  },
  months: ['2026-06', '2026-08'],
  timeSeries: getEmptyTimeSeries(),
};

describe('WindRoseViewer - WindRoseMonthCalendar', () => {
  test('shows a thumbnail wind rose for each month of the season with data', () => {
    const onSelectMonth = jest.fn<(month: string) => void>();
    render(
      <MockTheme>
        <WindRoseMonthCalendar
          periodType={WindRosePeriodType.SEASON}
          month="2026-07"
          periodLabel="Summer 2026"
          dataSet={dataSet}
          pendingMonths={[]}
          colorScheme="neon"
          onSelectMonth={onSelectMonth}
        />
      </MockTheme>,
    );
    expect(screen.getByText('Months in Summer 2026')).toBeTruthy();
    expect(screen.getByText('2 with data')).toBeTruthy();
    expect(screen.getByText('Jul')).toBeTruthy();
    const months = screen.getAllByRole('button');
    expect(months).toHaveLength(2);
    expect(months[1].getAttribute('aria-label')).toBe(
      'August 2026: 20 observations, prevailing wind from N, mean speed 0.1 m/s. '
        + 'View the monthly wind rose.',
    );
    fireEvent.click(months[1]);
    expect(onSelectMonth).toHaveBeenCalledWith('2026-08');
  });

  test('shows the months of a year still being fetched', () => {
    const { container } = render(
      <MockTheme>
        <WindRoseMonthCalendar
          periodType={WindRosePeriodType.YEAR}
          month="2026-07"
          periodLabel="2026"
          dataSet={dataSet}
          pendingMonths={['2026-09', '2026-10']}
          colorScheme="neon"
          onSelectMonth={() => {}}
        />
      </MockTheme>,
    );
    expect(screen.getByText('Months in 2026')).toBeTruthy();
    expect(screen.getByText('Loading 2 of 12')).toBeTruthy();
    expect(screen.getByText('Dec')).toBeTruthy();
    expect(container.querySelectorAll('[role="progressbar"]')).toHaveLength(2);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
