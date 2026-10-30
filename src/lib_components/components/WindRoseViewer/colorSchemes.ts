import { COLORS } from '../Theme/Theme';
import { Nullable } from '../../types/core';

/**
 * Color schemes to draw the wind speed (velocity) bins of a wind rose in.
 * Both schemes are sequential: the slowest winds are the lightest and the fastest the darkest.
 * - neon: built from the NEON style guide palette; gold through green and teal to NEON blue.
 * - colorVisionAccessible: a yellow, green, blue, purple ramp tuned so that every pair of adjacent
 *   bins remains distinguishable with protanopia, deuteranopia and tritanopia.
 */
export const WIND_ROSE_COLOR_SCHEMES = {
  NEON: 'neon',
  COLOR_VISION_ACCESSIBLE: 'colorVisionAccessible',
} as const;

export type WindRoseColorScheme = typeof WIND_ROSE_COLOR_SCHEMES[
  keyof typeof WIND_ROSE_COLOR_SCHEMES
];

// Color scheme used wherever one is not specified
export const DEFAULT_WIND_ROSE_COLOR_SCHEME: WindRoseColorScheme = WIND_ROSE_COLOR_SCHEMES.NEON;

export const WIND_ROSE_COLOR_SCHEME_LABELS: Record<WindRoseColorScheme, string> = {
  [WIND_ROSE_COLOR_SCHEMES.NEON]: 'NEON',
  [WIND_ROSE_COLOR_SCHEMES.COLOR_VISION_ACCESSIBLE]: 'Color Vision Accessible',
};

/**
 * One color per velocity bin (see VELOCITY_BINS), ordered from the slowest bin to the fastest.
 *
 * The color vision accessible palette maximizes the smallest CIEDE2000 difference between adjacent
 * bins under simulated protanopia, deuteranopia and tritanopia (Machado et al. 2009) while keeping
 * lightness strictly decreasing. Adjacent bins differ by at least 9 (vs. roughly 4 to 6 for
 * 10 classes sampled from viridis or cividis) for every simulated vision type.
 */
export const WIND_ROSE_PALETTES: Record<WindRoseColorScheme, readonly string[]> = {
  [WIND_ROSE_COLOR_SCHEMES.NEON]: [
    COLORS.GOLD[100],
    COLORS.GOLD[300],
    COLORS.GREEN[400],
    COLORS.GREEN[500],
    // Teal bridging the NEON green and blue families
    '#3a8f8f',
    COLORS.LIGHT_BLUE[300],
    COLORS.LIGHT_BLUE[500],
    COLORS.NEON_BLUE[500],
    COLORS.NEON_BLUE[700],
    COLORS.NEON_BLUE[900],
  ],
  [WIND_ROSE_COLOR_SCHEMES.COLOR_VISION_ACCESSIBLE]: [
    '#fee7bc',
    '#dbe44e',
    '#8bd984',
    '#52bfa1',
    '#499da4',
    '#407b99',
    '#3a578d',
    '#402d73',
    '#3c0044',
    '#1e000e',
  ],
};

const WIND_ROSE_COLOR_SCHEME_SET: Set<string> = new Set(Object.values(WIND_ROSE_COLOR_SCHEMES));

export const isWindRoseColorScheme = (value: unknown): value is WindRoseColorScheme => (
  (typeof value === 'string') && WIND_ROSE_COLOR_SCHEME_SET.has(value)
);

export const resolveWindRoseColorScheme = (
  colorScheme: Nullable<string>,
): WindRoseColorScheme => (
  isWindRoseColorScheme(colorScheme) ? colorScheme : DEFAULT_WIND_ROSE_COLOR_SCHEME
);

export const getWindRosePalette = (colorScheme: Nullable<string>): readonly string[] => (
  WIND_ROSE_PALETTES[resolveWindRoseColorScheme(colorScheme)]
);
