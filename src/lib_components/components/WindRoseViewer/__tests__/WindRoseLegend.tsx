import React from 'react';

import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import WindRoseLegend from '../WindRoseLegend';
import { WindRoseColorScheme } from '../colorSchemes';
import {
  DIRECTION_BINS,
  VELOCITY_BIN_LABELS,
  VELOCITY_BINS,
  WindRoseAggregate,
} from '../windRoseUtil';

// 10 non-calm observations: 6 from N (4 slowest, 2 fastest) and 4 from E (2-3 m/s)
const buildAggregate = (calm = 0): WindRoseAggregate => ({
  bins: DIRECTION_BINS.map((angle: string) => {
    const counts = VELOCITY_BINS.map(() => 0);
    if (angle === '0') {
      counts[0] = 4;
      counts[VELOCITY_BINS.length - 1] = 2;
    }
    if (angle === '90') {
      counts[VELOCITY_BINS.indexOf('2-3')] = 4;
    }
    return { angle, counts, total: counts.reduce((sum, count) => sum + count, 0) };
  }),
  samples: 10 + calm,
  calm,
  meanSpeed: 3.25,
});

const getRowValue = (label: string): string => {
  const row = screen.getByText(label).closest('li');
  return row?.lastElementChild?.textContent || '';
};

describe('WindRoseViewer - WindRoseLegend', () => {
  test('lists calm and every wind speed bin with its share of observations', () => {
    render(
      <MockTheme>
        <WindRoseLegend
          aggregate={buildAggregate()}
          colorScheme="neon"
          onColorSchemeChange={() => {}}
        />
      </MockTheme>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(VELOCITY_BINS.length + 1);
    VELOCITY_BINS.forEach((velocityBin: string) => {
      expect(screen.getByText(VELOCITY_BIN_LABELS[velocityBin])).toBeTruthy();
    });
    expect(getRowValue('Calm')).toBe('0%');
    expect(screen.getAllByText('40.0%')).toHaveLength(2);
    expect(screen.getAllByText('20.0%')).toHaveLength(1);
    expect(screen.getAllByText('0%')).toHaveLength(VELOCITY_BINS.length - 3 + 1);
  });

  test('reports calm observations as a share of every observation', () => {
    render(
      <MockTheme>
        <WindRoseLegend
          aggregate={buildAggregate(10)}
          colorScheme="neon"
          onColorSchemeChange={() => {}}
        />
      </MockTheme>,
    );
    expect(getRowValue('Calm')).toBe('50.0%');
    expect(getRowValue(VELOCITY_BIN_LABELS['0-.25'])).toBe('20.0%');
    expect(getRowValue(VELOCITY_BIN_LABELS['>8'])).toBe('10.0%');
  });

  test('shows no shares without observations', () => {
    render(
      <MockTheme>
        <WindRoseLegend aggregate={null} colorScheme="neon" onColorSchemeChange={() => {}} />
      </MockTheme>,
    );
    expect(screen.getAllByText('-')).toHaveLength(VELOCITY_BINS.length + 1);
  });

  test('switches color schemes with the palette toggle', () => {
    const onColorSchemeChange = jest.fn<(colorScheme: WindRoseColorScheme) => void>();
    render(
      <MockTheme>
        <WindRoseLegend
          aggregate={buildAggregate()}
          colorScheme="neon"
          onColorSchemeChange={onColorSchemeChange}
        />
      </MockTheme>,
    );
    expect(screen.getByRole('button', { name: 'NEON' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Color Vision Accessible' }));
    expect(onColorSchemeChange).toHaveBeenCalledWith('colorVisionAccessible');
    // Clicking the selected color scheme leaves it selected
    fireEvent.click(screen.getByRole('button', { name: 'NEON' }));
    expect(onColorSchemeChange).toHaveBeenCalledTimes(1);
  });
});
