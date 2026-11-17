import React from 'react';
import { render } from '@testing-library/react';
import { getContrastRatio } from '@mui/material/styles';

import {
  SvgDefs,
  JsxCell,
  NEON_GREEN_PALETTE,
  COLOR_VISION_ACCESSIBLE_PALETTE,
  CELL_ATTRS,
  CELL_ATTRS_BY_COLOR_SCHEME,
  CELL_STRIPES,
  CELL_STRIPES_BY_COLOR_SCHEME,
  getCellAttrs,
  getCellStripes,
  createStripeColumnGetter,
} from '../AvailabilitySvgComponents';
import {
  AVAILABILITY_COLOR_SCHEMES,
  DEFAULT_AVAILABILITY_COLOR_SCHEME,
  VALID_ENHANCED_STATUSES,
} from '../AvailabilityUtils';
import { COLORS } from '../../Theme/Theme';

const { NEON_BLUE, NEON_GREEN, COLOR_VISION_ACCESSIBLE } = AVAILABILITY_COLOR_SCHEMES;

// Absolute polygons from path data made up of M, m, h, v, l, and z commands
const getPathPolygons = (d) => {
  const polygons = [];
  let start = [0, 0];
  let current = [0, 0];
  let points = [];
  (d.match(/[a-zA-Z][^a-zA-Z]*/g) || []).forEach((segment) => {
    const command = segment[0];
    const [a = 0, b = 0] = segment.slice(1).split(',').map(Number);
    switch (command) {
      case 'M':
        current = [a, b];
        break;
      case 'm':
      case 'l':
        current = [current[0] + a, current[1] + b];
        break;
      case 'h':
        current = [current[0] + a, current[1]];
        break;
      case 'v':
        current = [current[0], current[1] + a];
        break;
      case 'z':
        polygons.push(points);
        current = start;
        points = [];
        return;
      default:
        throw new Error(`Unexpected path command: ${command}`);
    }
    if ((command === 'M') || (command === 'm')) { start = current; }
    points.push(current);
  });
  return polygons;
};

const getPolygonArea = (points) => Math.abs(points.reduce((acc, [x, y], idx) => {
  const [nextX, nextY] = points[(idx + 1) % points.length];
  return acc + ((x * nextY) - (nextX * y));
}, 0)) / 2;

// Markup of the patterns in SvgDefs without their ids and colors
const getSvgDefsPatternShapes = (colorScheme) => {
  const { container } = render(<SvgDefs colorScheme={colorScheme} />);
  return Array.from(container.querySelectorAll('pattern')).map((pattern) => {
    const shape = pattern.cloneNode(true);
    [shape, ...shape.querySelectorAll('*')].forEach((node) => {
      ['id', 'fill', 'stroke'].forEach((attr) => node.removeAttribute(attr));
    });
    return shape.outerHTML;
  });
};

const getPatternFills = (colorScheme) => Object.values(getCellAttrs(colorScheme))
  .map(({ fill }) => fill)
  .filter((fill) => fill.startsWith('url('));

// Fills of the shapes in the pattern a cell is filled with
const getPatternShapeFills = (colorScheme, status) => {
  const { container } = render(<SvgDefs colorScheme={colorScheme} />);
  const [, patternId] = /^url\(#(.+)\)$/.exec(getCellAttrs(colorScheme)[status].fill);
  return Array.from(container.querySelectorAll(`pattern[id="${patternId}"] path`))
    .map((path) => path.getAttribute('fill'));
};

// Striped over only the provisional half of a split cell, see MIXED_PATTERNS
const isHalfStriped = (colorScheme, status) => (
  (colorScheme === COLOR_VISION_ACCESSIBLE) && (status === 'mixed-available-provisional')
);

describe('DataProductAvailability - AvailabilitySvgComponents', () => {
  test('renders SvgDefs correctly', () => {
    const tree = render(<SvgDefs />);
    expect(tree).toMatchSnapshot();
  });
  describe('renders JsxCell correctly for every status', () => {
    Object.keys(CELL_ATTRS).forEach((status) => {
      test(`JsxCell for status: ${status}`, () => {
        const tree = render(<svg><JsxCell status={status} x={10} y={20} /></svg>);
        expect(tree).toMatchSnapshot();
      });
    });
  });
  describe.each([NEON_GREEN, COLOR_VISION_ACCESSIBLE])('%s color scheme', (colorScheme) => {
    test('renders SvgDefs correctly', () => {
      const tree = render(<SvgDefs colorScheme={colorScheme} />);
      expect(tree).toMatchSnapshot();
    });
    describe('renders JsxCell correctly for every status', () => {
      Object.keys(getCellAttrs(colorScheme)).forEach((status) => {
        test(`JsxCell for status: ${status}`, () => {
          const tree = render(
            <svg><JsxCell status={status} x={10} y={20} colorScheme={colorScheme} /></svg>,
          );
          expect(tree).toMatchSnapshot();
        });
      });
    });
  });
  describe('color schemes', () => {
    test('the NEON blue color scheme is CELL_ATTRS and CELL_STRIPES', () => {
      expect(CELL_ATTRS_BY_COLOR_SCHEME[NEON_BLUE]).toBe(CELL_ATTRS);
      expect(CELL_STRIPES_BY_COLOR_SCHEME[NEON_BLUE]).toBe(CELL_STRIPES);
    });
    test('falls back to the default color scheme', () => {
      [undefined, null, 'unknown', 'toString'].forEach((colorScheme) => {
        expect(getCellAttrs(colorScheme))
          .toBe(CELL_ATTRS_BY_COLOR_SCHEME[DEFAULT_AVAILABILITY_COLOR_SCHEME]);
        expect(getCellStripes(colorScheme))
          .toBe(CELL_STRIPES_BY_COLOR_SCHEME[DEFAULT_AVAILABILITY_COLOR_SCHEME]);
      });
    });
    test('fills cells in different color schemes with different patterns', () => {
      // Charts in different color schemes may be on the same page
      const patternFills = Object.values(AVAILABILITY_COLOR_SCHEMES).map(getPatternFills);
      patternFills.forEach((fills, idx) => {
        expect(fills).toHaveLength(patternFills[0].length);
        patternFills.slice(idx + 1).forEach((otherFills) => {
          fills.forEach((fill) => {
            expect(otherFills).not.toContain(fill);
          });
        });
      });
    });
    describe.each(Object.values(AVAILABILITY_COLOR_SCHEMES))('%s color scheme', (colorScheme) => {
      test('has cell attributes for every status', () => {
        expect(Object.keys(getCellAttrs(colorScheme)).sort())
          .toStrictEqual(Object.keys(VALID_ENHANCED_STATUSES).sort());
      });
      test('SvgDefs defines every pattern that cells are filled with', () => {
        const { container } = render(<SvgDefs colorScheme={colorScheme} />);
        getPatternFills(colorScheme).forEach((fill) => {
          const [, patternId] = /^url\(#(.+)\)$/.exec(fill);
          expect(container.querySelector(`pattern[id="${patternId}"]`)).not.toBeNull();
        });
      });
    });
  });
  describe('NEON green color scheme', () => {
    const neonGreenAttrs = getCellAttrs(NEON_GREEN);
    const neonGreenStripes = getCellStripes(NEON_GREEN);
    test.each([
      ['available', NEON_GREEN_PALETTE.AVAILABLE],
      ['expected', NEON_GREEN_PALETTE.EXPECTED],
      ['partial', NEON_GREEN_PALETTE.PARTIAL],
      ['tentative', NEON_GREEN_PALETTE.POTENTIAL],
      ['not collected', NEON_GREEN_PALETTE.NOT_COLLECTED],
      ['not expected', NEON_GREEN_PALETTE.NOT_PLANNED],
    ])('%s is a solid fill of its NEON green color', (status, color) => {
      expect(neonGreenAttrs[status]).toMatchObject({ fill: color, stroke: null });
      expect(neonGreenStripes[status]).toBeUndefined();
    });
    test('only provisional data are striped, in the available color', () => {
      expect(Object.keys(neonGreenStripes)).toStrictEqual(['available-provisional']);
      expect(neonGreenAttrs['available-provisional']).toMatchObject({
        fill: NEON_GREEN_PALETTE.PROVISIONAL_BACKGROUND,
        stroke: NEON_GREEN_PALETTE.AVAILABLE,
      });
      expect(neonGreenStripes['available-provisional'].fill).toBe(NEON_GREEN_PALETTE.AVAILABLE);
    });
    test('statuses without a NEON green color are drawn as in the NEON blue scheme', () => {
      expect(neonGreenAttrs['not available']).toStrictEqual(CELL_ATTRS['not available']);
      expect(neonGreenAttrs.tombstoned).toStrictEqual(CELL_ATTRS.tombstoned);
    });
    test('mixed statuses are drawn as in the NEON blue scheme in NEON green colors', () => {
      ['mixed-available-provisional', 'mixed some availability', 'mixed no availability']
        .forEach((status) => {
          const { fill, stroke, ...style } = neonGreenAttrs[status];
          const {
            fill: neonBlueFill,
            stroke: neonBlueStroke,
            ...neonBlueStyle
          } = CELL_ATTRS[status];
          expect(style).toStrictEqual(neonBlueStyle);
          expect(fill).not.toBe(neonBlueFill);
          expect(Object.values(NEON_GREEN_PALETTE)).toContain(stroke);
          expect(stroke).not.toBe(neonBlueStroke);
        });
      expect(getSvgDefsPatternShapes(NEON_GREEN)).toStrictEqual(getSvgDefsPatternShapes(NEON_BLUE));
    });
  });
  describe('color vision accessible color scheme', () => {
    const {
      AVAILABLE,
      PROVISIONAL_BACKGROUND,
      EXPECTED,
      POTENTIAL,
      NOT_PLANNED,
      NOT_COLLECTED,
      NOT_AVAILABLE,
    } = COLOR_VISION_ACCESSIBLE_PALETTE;
    const accessibleAttrs = getCellAttrs(COLOR_VISION_ACCESSIBLE);
    const accessibleStripes = getCellStripes(COLOR_VISION_ACCESSIBLE);
    test.each([
      ['available', AVAILABLE],
      ['not collected', NOT_COLLECTED],
      ['not available', NOT_AVAILABLE],
    ])('final status %s is a solid fill', (status, color) => {
      expect(accessibleAttrs[status]).toMatchObject({ fill: color, stroke: null });
      expect(accessibleStripes[status]).toBeUndefined();
    });
    test.each([
      ['expected', EXPECTED],
      ['tentative', POTENTIAL],
      ['not expected', NOT_PLANNED],
    ])('future status %s is outlined', (status, color) => {
      const { fill, stroke, ...style } = accessibleAttrs[status];
      const { fill: neonBlueFill, stroke: neonBlueStroke, ...neonBlueStyle } = CELL_ATTRS.expected;
      expect(fill).toBe('#ffffff');
      expect(stroke).toBe(color);
      expect(style).toStrictEqual(neonBlueStyle);
      expect(accessibleStripes[status]).toBeUndefined();
    });
    test('partial versions of solid statuses are striped in the same color', () => {
      expect(accessibleAttrs['available-provisional']).toMatchObject({
        fill: PROVISIONAL_BACKGROUND,
        stroke: AVAILABLE,
      });
      expect(accessibleStripes['available-provisional'].fill).toBe(AVAILABLE);
      expect(accessibleAttrs.partial).toMatchObject({ fill: '#ffffff', stroke: NOT_COLLECTED });
      expect(accessibleStripes.partial.fill).toBe(NOT_COLLECTED);
      // Borders as thin as those of mixed statuses leave room for the stripes
      ['available-provisional', 'partial'].forEach((status) => {
        expect(accessibleAttrs[status].strokeWidth)
          .toBe(CELL_ATTRS['mixed-available-provisional'].strokeWidth);
      });
    });
    test('mixed available and provisional cells are split, with a provisional half', () => {
      expect(getPatternShapeFills(COLOR_VISION_ACCESSIBLE, 'mixed-available-provisional'))
        .toStrictEqual([AVAILABLE, PROVISIONAL_BACKGROUND]);
      // Bordered and striped the same as provisional cells, over only the provisional half
      const { fill, ...style } = accessibleAttrs['mixed-available-provisional'];
      const { fill: provisionalFill, ...provisionalStyle } = (
        accessibleAttrs['available-provisional']
      );
      expect(style).toStrictEqual(provisionalStyle);
      expect(accessibleStripes['mixed-available-provisional'].fill).toBe(AVAILABLE);
    });
    test('the other mixed statuses are split between solid statuses without a border', () => {
      expect(getPatternShapeFills(COLOR_VISION_ACCESSIBLE, 'mixed some availability'))
        .toStrictEqual([AVAILABLE, NOT_COLLECTED]);
      expect(getPatternShapeFills(COLOR_VISION_ACCESSIBLE, 'mixed no availability'))
        .toStrictEqual([NOT_AVAILABLE, NOT_COLLECTED]);
      ['mixed some availability', 'mixed no availability'].forEach((status) => {
        const { fill, ...style } = accessibleAttrs[status];
        const { fill: solidFill, ...solidStyle } = accessibleAttrs.available;
        expect(style).toStrictEqual(solidStyle);
        expect(accessibleStripes[status]).toBeUndefined();
      });
    });
    test('statuses drawn in the same fill style differ in lightness', () => {
      [
        // Solid statuses, which are also the halves of mixed statuses, and striped statuses
        [AVAILABLE, NOT_COLLECTED, NOT_AVAILABLE],
        // Outlined statuses
        [EXPECTED, POTENTIAL, NOT_PLANNED],
      ].forEach((colors) => {
        colors.forEach((color, idx) => {
          colors.slice(idx + 1).forEach((otherColor) => {
            expect(getContrastRatio(color, otherColor)).toBeGreaterThan(2);
          });
        });
      });
    });
  });
  describe('CELL_STRIPES', () => {
    describe.each(Object.values(AVAILABILITY_COLOR_SCHEMES))('%s color scheme', (colorScheme) => {
      const cellAttrs = getCellAttrs(colorScheme);
      const cellStripes = getCellStripes(colorScheme);
      Object.keys(cellStripes).forEach((status) => {
        describe(`stripes for status: ${status}`, () => {
          const {
            nudge,
            width,
            height,
            fill,
            stroke,
          } = cellAttrs[status];
          // The cell rect, i.e. the middle of its border
          const x0 = nudge;
          const y0 = nudge;
          const x1 = nudge + parseFloat(width);
          const y1 = nudge + parseFloat(height);
          const halfStriped = isHalfStriped(colorScheme, status);
          // Where a point is between the top left (0) and bottom right (2) corners of the cell
          // rect, which is 1 on the diagonal from its top right to its bottom left corner
          const getDiagonalPosition = ([x, y]) => ((x - x0) / (x1 - x0)) + ((y - y0) / (y1 - y0));
          const polygons = getPathPolygons(cellStripes[status].getPath(0, 0));
          test('the cell itself has a solid fill, unless only its second half is striped', () => {
            expect(fill.startsWith('url(')).toBe(halfStriped);
          });
          test('stripes are the color of the cell border', () => {
            expect(cellStripes[status].fill).toBe(stroke);
          });
          test('stripes stay within the middle of the cell border', () => {
            expect(polygons.length).toBeGreaterThan(1);
            polygons.flat().forEach(([x, y]) => {
              expect(x).toBeGreaterThanOrEqual(x0 - 0.01);
              expect(x).toBeLessThanOrEqual(x1 + 0.01);
              expect(y).toBeGreaterThanOrEqual(y0 - 0.01);
              expect(y).toBeLessThanOrEqual(y1 + 0.01);
              // Stripes over the second half stay below the diagonal it is split on
              expect(getDiagonalPosition([x, y]))
                .toBeGreaterThanOrEqual((halfStriped ? 1 : 0) - 0.01);
            });
          });
          test('stripes cover their share of the cell', () => {
            // Stripes are 1.25 thick and 3 apart
            const stripesArea = polygons.reduce((acc, points) => acc + getPolygonArea(points), 0);
            const stripedArea = (x1 - x0) * (y1 - y0) * (halfStriped ? 0.5 : 1);
            expect(stripesArea / stripedArea).toBeCloseTo(1.25 / 3, 1);
          });
          test('stripes are placed at the given cell position', () => {
            const placedPolygons = getPathPolygons(cellStripes[status].getPath(110.5, 32));
            expect(placedPolygons).toHaveLength(polygons.length);
            placedPolygons.forEach((points, polygonIdx) => {
              expect(points).toHaveLength(polygons[polygonIdx].length);
              points.forEach(([x, y], pointIdx) => {
                expect(x).toBeCloseTo(polygons[polygonIdx][pointIdx][0] + 110.5, 5);
                expect(y).toBeCloseTo(polygons[polygonIdx][pointIdx][1] + 32, 5);
              });
            });
          });
        });
      });
    });
  });
  describe('createStripeColumnGetter()', () => {
    const rowStatuses = [
      { '2020-01': 'available-provisional', '2020-02': 'partial' },
      { '2020-01': 'available', '2020-02': 'not collected' },
      { '2020-01': 'available-provisional', '2020-02': 'available-provisional' },
    ];
    const getterConfig = {
      rowCount: rowStatuses.length,
      getStatus: (rowIdx, month) => rowStatuses[rowIdx][month],
      getMonthX: (month) => (month === '2020-01' ? 10 : 21),
      getRowY: (rowIdx) => 4 + (rowIdx * 16),
    };
    const getStripeColumns = createStripeColumnGetter(getterConfig);
    const provisional = CELL_STRIPES['available-provisional'];
    test('combines the stripes in a month into one path for each stripe fill', () => {
      expect(getStripeColumns('2020-01')).toStrictEqual([
        {
          key: `2020-01 ${provisional.fill}`,
          fill: provisional.fill,
          d: `${provisional.getPath(10, 4)}${provisional.getPath(10, 36)}`,
        },
      ]);
      expect(getStripeColumns('2020-02')).toStrictEqual([
        {
          key: `2020-02 ${COLORS.GOLD[400]}`,
          fill: COLORS.GOLD[400],
          d: CELL_STRIPES.partial.getPath(21, 4),
        },
        {
          key: `2020-02 ${COLORS.NEON_BLUE[700]}`,
          fill: COLORS.NEON_BLUE[700],
          d: provisional.getPath(21, 36),
        },
      ]);
    });
    test('has no paths for a month without striped cells', () => {
      expect(getStripeColumns('2020-03')).toStrictEqual([]);
    });
    test('gets the stripes of the given color scheme', () => {
      const getNeonGreenStripeColumns = createStripeColumnGetter({
        ...getterConfig,
        colorScheme: NEON_GREEN,
      });
      const neonGreenProvisional = getCellStripes(NEON_GREEN)['available-provisional'];
      // Partial data are not striped in the NEON green color scheme
      expect(getNeonGreenStripeColumns('2020-02')).toStrictEqual([
        {
          key: `2020-02 ${NEON_GREEN_PALETTE.AVAILABLE}`,
          fill: NEON_GREEN_PALETTE.AVAILABLE,
          d: neonGreenProvisional.getPath(21, 36),
        },
      ]);
    });
    test('builds each month once', () => {
      expect(getStripeColumns('2020-01')).toBe(getStripeColumns('2020-01'));
    });
  });
});
