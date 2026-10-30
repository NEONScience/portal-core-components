import React from 'react';

import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import WindRoseChart from '../WindRoseChart';
import { WIND_ROSE_PALETTES } from '../colorSchemes';
import {
  DIRECTION_BIN_LOOKUP,
  DIRECTION_BINS,
  VELOCITY_BINS,
  WindRoseAggregate,
} from '../windRoseUtil';

// 10 observations: 6 from N (4 slowest, 2 fastest) and 4 from E (2-3 m/s)
const buildAggregate = (): WindRoseAggregate => ({
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
  samples: 10,
  calm: 0,
  meanSpeed: 3.25,
});

const getTexts = (container: HTMLElement): string[] => (
  Array.from(container.querySelectorAll('text')).map((text) => text.textContent || '')
);

const getSegmentFills = (container: HTMLElement): string[] => (
  Array.from(container.querySelectorAll('path[fill]')).map((path) => path.getAttribute('fill') || '')
);

describe('WindRoseViewer - WindRoseChart', () => {
  test('renders a segment for every direction and wind speed bin with observations', () => {
    const { container } = render(
      <MockTheme>
        <WindRoseChart aggregate={buildAggregate()} colorScheme="neon" title="Monthly wind rose" />
      </MockTheme>,
    );
    const svg = container.querySelector('svg[role="img"]');
    expect(svg).not.toBeNull();
    expect(container.querySelector('title')?.textContent).toBe('Monthly wind rose');
    const palette = WIND_ROSE_PALETTES.neon;
    expect(getSegmentFills(container)).toEqual([
      palette[0],
      palette[VELOCITY_BINS.length - 1],
      palette[VELOCITY_BINS.indexOf('2-3')],
    ]);
    const texts = getTexts(container);
    DIRECTION_BINS.forEach((angle: string) => {
      expect(texts).toContain(DIRECTION_BIN_LOOKUP[angle].direction);
    });
    // The largest sector (60%) fits within the outer ring
    expect(texts).toEqual(expect.arrayContaining(['20%', '40%', '60%']));
  });

  test('draws segments in the colorVisionAccessible palette', () => {
    const { container } = render(
      <MockTheme>
        <WindRoseChart
          aggregate={buildAggregate()}
          colorScheme="colorVisionAccessible"
          title="Monthly wind rose"
        />
      </MockTheme>,
    );
    const palette = WIND_ROSE_PALETTES.colorVisionAccessible;
    expect(getSegmentFills(container)).toEqual([
      palette[0],
      palette[VELOCITY_BINS.length - 1],
      palette[VELOCITY_BINS.indexOf('2-3')],
    ]);
  });

  test('renders an empty grid without observations', () => {
    const { container } = render(
      <MockTheme>
        <WindRoseChart aggregate={null} colorScheme="neon" title="Monthly wind rose" />
      </MockTheme>,
    );
    expect(getSegmentFills(container)).toEqual([]);
    expect(getTexts(container)).toHaveLength(DIRECTION_BINS.length);
  });

  test('does not draw calm observations', () => {
    const allCalm: WindRoseAggregate = {
      bins: DIRECTION_BINS.map((angle: string) => ({
        angle,
        counts: VELOCITY_BINS.map(() => 0),
        total: 0,
      })),
      samples: 5,
      calm: 5,
      meanSpeed: 0,
    };
    const { container } = render(
      <MockTheme>
        <WindRoseChart aggregate={allCalm} colorScheme="neon" title="Daily wind rose" />
      </MockTheme>,
    );
    expect(getSegmentFills(container)).toEqual([]);
    // No ring labels without anything to measure
    expect(getTexts(container)).toHaveLength(DIRECTION_BINS.length);
  });
});
