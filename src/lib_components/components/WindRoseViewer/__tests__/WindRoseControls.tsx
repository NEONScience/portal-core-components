import React from 'react';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import { WindRosePeriodPicker } from '../WindRoseControls';
import { WindRoseAggregation } from '../Context';

// Months with data, sorted ascending
const AVAILABLE_MONTHS = [
  '2025-06',
  '2025-07',
  '2025-12',
  '2026-01',
  '2026-06',
  '2026-07',
  '2026-08',
];

const renderPicker = (aggregation: WindRoseAggregation, month: string) => {
  const onChange = jest.fn<(month: string) => void>();
  const { unmount } = render(
    <MockTheme>
      <WindRosePeriodPicker
        aggregation={aggregation}
        month={month}
        availableMonths={AVAILABLE_MONTHS}
        onChange={onChange}
      />
    </MockTheme>,
  );
  return { onChange, unmount };
};

describe('WindRoseViewer - WindRosePeriodPicker', () => {
  test('picks months when viewing a month or a day of it', () => {
    [WindRoseAggregation.MONTHLY, WindRoseAggregation.DAILY].forEach((aggregation) => {
      const { onChange, unmount } = renderPicker(aggregation, '2026-06');
      expect(screen.getAllByText('Month').length).toBeGreaterThan(0);
      fireEvent.click(screen.getByRole('button', { name: 'Previous month with data' }));
      expect(onChange).toHaveBeenLastCalledWith('2026-01');
      fireEvent.click(screen.getByRole('button', { name: 'Next month with data' }));
      expect(onChange).toHaveBeenLastCalledWith('2026-07');
      unmount();
    });
  });

  test('picks years when viewing a year', () => {
    const { onChange } = renderPicker(WindRoseAggregation.ANNUAL, '2026-07');
    expect(screen.getAllByText('Year').length).toBeGreaterThan(0);
    // Keeps to the same month of the year where it has data
    fireEvent.click(screen.getByRole('button', { name: 'Previous year with data' }));
    expect(onChange).toHaveBeenLastCalledWith('2025-07');
    expect(
      screen.getByRole('button', { name: 'Next year with data' }).hasAttribute('disabled'),
    ).toBe(true);
  });

  test('picks seasons when viewing a season', () => {
    const { onChange } = renderPicker(WindRoseAggregation.SEASONAL, '2026-07');
    expect(screen.getAllByText('Season').length).toBeGreaterThan(0);
    expect(screen.getByRole('combobox').textContent).toBe('Summer 2026');
    // Skips spring, which has no data, keeping to the second month of the season
    fireEvent.click(screen.getByRole('button', { name: 'Previous season with data' }));
    expect(onChange).toHaveBeenLastCalledWith('2026-01');
    fireEvent.mouseDown(screen.getByRole('combobox'));
    expect(screen.getAllByRole('option').map((option) => option.textContent))
      .toEqual(['Summer 2026', 'Winter 2025-26', 'Summer 2025']);
    fireEvent.click(screen.getByRole('option', { name: 'Summer 2025' }));
    expect(onChange).toHaveBeenLastCalledWith('2025-07');
  });
});
