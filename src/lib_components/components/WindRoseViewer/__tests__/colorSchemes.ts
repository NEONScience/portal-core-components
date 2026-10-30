import { describe, expect, test } from '@jest/globals';

import {
  DEFAULT_WIND_ROSE_COLOR_SCHEME,
  getWindRosePalette,
  isWindRoseColorScheme,
  resolveWindRoseColorScheme,
  WIND_ROSE_COLOR_SCHEME_LABELS,
  WIND_ROSE_COLOR_SCHEMES,
  WIND_ROSE_PALETTES,
  WindRoseColorScheme,
} from '../colorSchemes';
import { VELOCITY_BINS } from '../windRoseUtil';

// WCAG relative luminance of a #rrggbb color
const getLuminance = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((start: number): number => {
    const channel = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return (channel <= 0.04045) ? (channel / 12.92) : (((channel + 0.055) / 1.055) ** 2.4);
  });
  return (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
};

const COLOR_SCHEMES: WindRoseColorScheme[] = Object.values(WIND_ROSE_COLOR_SCHEMES);

describe('WindRoseViewer - colorSchemes', () => {
  test('defines a NEON color scheme and a colorVisionAccessible safe color scheme', () => {
    expect(WIND_ROSE_COLOR_SCHEMES)
      .toEqual({ NEON: 'neon', COLOR_VISION_ACCESSIBLE: 'colorVisionAccessible' });
    expect(DEFAULT_WIND_ROSE_COLOR_SCHEME).toBe('neon');
  });

  describe.each(COLOR_SCHEMES)('%s color scheme', (colorScheme: WindRoseColorScheme) => {
    const palette = WIND_ROSE_PALETTES[colorScheme];
    test('has a label', () => {
      expect(WIND_ROSE_COLOR_SCHEME_LABELS[colorScheme].length).toBeGreaterThan(0);
    });
    test('has a distinct color for every velocity bin', () => {
      expect(palette).toHaveLength(VELOCITY_BINS.length);
      palette.forEach((color: string) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
      expect(new Set(palette.map((color: string) => color.toLowerCase())).size)
        .toBe(palette.length);
    });
    test('draws the slowest winds lighter than the fastest', () => {
      expect(getLuminance(palette[0])).toBeGreaterThan(getLuminance(palette[palette.length - 1]));
    });
  });

  test('colorVisionAccessible palette lightness strictly decreases from the slowest bin', () => {
    const luminances = WIND_ROSE_PALETTES[WIND_ROSE_COLOR_SCHEMES.COLOR_VISION_ACCESSIBLE]
      .map(getLuminance);
    luminances.slice(1).forEach((luminance: number, index: number) => {
      expect(luminance).toBeLessThan(luminances[index]);
    });
  });

  test('resolves color schemes, falling back to the default', () => {
    expect(isWindRoseColorScheme('colorVisionAccessible')).toBe(true);
    expect(isWindRoseColorScheme('classic')).toBe(false);
    expect(isWindRoseColorScheme(undefined)).toBe(false);
    expect(resolveWindRoseColorScheme('colorVisionAccessible')).toBe('colorVisionAccessible');
    expect(resolveWindRoseColorScheme('classic')).toBe(DEFAULT_WIND_ROSE_COLOR_SCHEME);
    expect(resolveWindRoseColorScheme(null)).toBe(DEFAULT_WIND_ROSE_COLOR_SCHEME);
    expect(getWindRosePalette('colorVisionAccessible'))
      .toBe(WIND_ROSE_PALETTES.colorVisionAccessible);
    expect(getWindRosePalette(undefined)).toBe(WIND_ROSE_PALETTES.neon);
  });
});
