import EnhancedAvailabilityGrid, { getRowLabelLayout } from '../EnhancedAvailabilityGrid';
import {
  NEON_GREEN_PALETTE,
  COLOR_VISION_ACCESSIBLE_PALETTE,
  CELL_STRIPES,
  getCellAttrs,
  getCellStripes,
} from '../AvailabilitySvgComponents';
import { SVG, AVAILABILITY_COLOR_SCHEMES } from '../AvailabilityUtils';
import { COLORS } from '../../Theme/Theme';

const { NEON_GREEN, COLOR_VISION_ACCESSIBLE } = AVAILABILITY_COLOR_SCHEMES;

const theme = {
  palette: {
    primary: { main: COLORS.LIGHT_BLUE[500], contrastText: '#ffffff' },
    grey: { 700: COLORS.GREY[700] },
  },
};

const createSvg = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '800');
  svg.setAttribute('height', '100');
  return svg;
};

// Drawn cells with a striped status in a color scheme, with the position of each cell
const getStripedCells = (svg, colorScheme) => {
  const cellAttrs = getCellAttrs(colorScheme);
  const cellStripes = getCellStripes(colorScheme);
  const cells = [];
  svg.querySelectorAll('.dataG > g').forEach((rowG) => {
    const [, rowY] = /translate\(0,([-\d.]+)\)/.exec(rowG.getAttribute('transform'));
    rowG.querySelectorAll('rect').forEach((rect) => {
      const status = Object.keys(cellStripes).find((stripedStatus) => (
        (rect.getAttribute('fill') === cellAttrs[stripedStatus].fill)
        && (rect.getAttribute('stroke') === cellAttrs[stripedStatus].stroke)
      ));
      if (status) {
        const x = parseFloat(rect.getAttribute('x')) - cellAttrs[status].nudge;
        cells.push({ status, x, y: parseFloat(rowY) });
      }
    });
  });
  return cells;
};

describe('DataProductAvailability - EnhancedAvailabilityGrid', () => {
  describe('EnhancedAvailabilityGrid()', () => {
    test('draws stripes over striped cells with a path for each month and stripe fill', () => {
      const svg = createSvg();
      EnhancedAvailabilityGrid({
        theme,
        svgRef: { current: svg },
        rows: {
          ABBY: {
            '2020-01': ['available-provisional'],
            '2020-02': ['partial'],
            '2020-03': ['available'],
          },
          BART: {
            '2020-01': ['available-provisional'],
            '2020-02': ['available-provisional'],
          },
        },
        rowLabels: ['ABBY', 'BART'],
        selectionEnabled: false,
      });
      const stripedCells = getStripedCells(svg);
      expect(stripedCells.map(({ status }) => status).sort()).toStrictEqual([
        'available-provisional',
        'available-provisional',
        'available-provisional',
        'partial',
      ]);
      const stripePaths = Array.from(svg.querySelectorAll('.stripesG path'));
      expect(stripePaths.map((path) => path.getAttribute('fill'))).toStrictEqual([
        COLORS.NEON_BLUE[700],
        COLORS.GOLD[400],
        COLORS.NEON_BLUE[700],
      ]);
      const stripes = stripePaths.map((path) => path.getAttribute('d')).join('');
      expect(stripes.match(/M/g)).toHaveLength(stripedCells.length);
      stripedCells.forEach(({ status, x, y }) => {
        expect(stripes).toContain(CELL_STRIPES[status].getPath(x, y));
      });
    });
    test('draws cells in the given color scheme', () => {
      const svg = createSvg();
      EnhancedAvailabilityGrid({
        theme,
        svgRef: { current: svg },
        rows: {
          ABBY: {
            '2020-01': ['available-provisional'],
            '2020-02': ['partial'],
            '2020-03': ['available'],
          },
          BART: {
            '2020-01': ['expected'],
            '2020-02': ['available', 'not collected'],
          },
        },
        rowLabels: ['ABBY', 'BART'],
        selectionEnabled: false,
        colorScheme: NEON_GREEN,
      });
      const neonGreenAttrs = getCellAttrs(NEON_GREEN);
      const fills = Array.from(svg.querySelectorAll('.dataG rect'))
        .map((rect) => rect.getAttribute('fill'));
      expect(fills).toEqual(expect.arrayContaining([
        neonGreenAttrs['available-provisional'].fill,
        NEON_GREEN_PALETTE.PARTIAL,
        NEON_GREEN_PALETTE.AVAILABLE,
        NEON_GREEN_PALETTE.EXPECTED,
        neonGreenAttrs['mixed some availability'].fill,
      ]));
      expect(fills).not.toContain(COLORS.NEON_BLUE[700]);
      expect(fills).not.toContain(COLORS.GOLD[400]);
      // Only provisional data are striped
      const stripedCells = getStripedCells(svg, NEON_GREEN);
      expect(stripedCells.map(({ status }) => status)).toStrictEqual(['available-provisional']);
      const stripePaths = Array.from(svg.querySelectorAll('.stripesG path'));
      expect(stripePaths.map((path) => path.getAttribute('fill')))
        .toStrictEqual([NEON_GREEN_PALETTE.AVAILABLE]);
      const [{ x, y }] = stripedCells;
      expect(stripePaths[0].getAttribute('d'))
        .toBe(getCellStripes(NEON_GREEN)['available-provisional'].getPath(x, y));
    });
    test('draws cells in the color vision accessible color scheme', () => {
      const svg = createSvg();
      EnhancedAvailabilityGrid({
        theme,
        svgRef: { current: svg },
        rows: {
          ABBY: {
            '2020-01': ['available-provisional'],
            '2020-02': ['partial'],
          },
          BART: {
            '2020-01': ['available', 'available-provisional'],
            '2020-02': ['available', 'not collected'],
          },
        },
        rowLabels: ['ABBY', 'BART'],
        selectionEnabled: false,
        colorScheme: COLOR_VISION_ACCESSIBLE,
      });
      // Partial data are striped in the not collected color, and mixed available and provisional
      // cells are striped over their provisional half
      const stripedCells = getStripedCells(svg, COLOR_VISION_ACCESSIBLE);
      expect(stripedCells.map(({ status }) => status).sort()).toStrictEqual([
        'available-provisional',
        'mixed-available-provisional',
        'partial',
      ]);
      const stripePaths = Array.from(svg.querySelectorAll('.stripesG path'));
      expect(stripePaths.map((path) => path.getAttribute('fill'))).toStrictEqual([
        COLOR_VISION_ACCESSIBLE_PALETTE.AVAILABLE,
        COLOR_VISION_ACCESSIBLE_PALETTE.NOT_COLLECTED,
      ]);
      const cellStripes = getCellStripes(COLOR_VISION_ACCESSIBLE);
      const stripes = stripePaths.map((path) => path.getAttribute('d')).join('');
      expect(stripes.match(/M/g)).toHaveLength(stripedCells.length);
      stripedCells.forEach(({ status, x, y }) => {
        expect(stripes).toContain(cellStripes[status].getPath(x, y));
      });
      // Mixed cells split between solid statuses are not bordered
      const mixedSomeAvailability = Array.from(svg.querySelectorAll('.dataG rect')).find((rect) => (
        rect.getAttribute('fill')
          === getCellAttrs(COLOR_VISION_ACCESSIBLE)['mixed some availability'].fill
      ));
      expect(mixedSomeAvailability.getAttribute('stroke')).toBeNull();
    });
  });
  describe('getRowLabelLayout()', () => {
    // Label text is padded on either side
    const fitWidth = 100 + (2 * SVG.CELL_PADDING);
    test('fits the longest label by default', () => {
      expect(getRowLabelLayout(800, 100)).toStrictEqual({ labelWidth: fitWidth, maxLabelOffset: 0 });
      expect(getRowLabelLayout(800, 99.2))
        .toStrictEqual({ labelWidth: fitWidth, maxLabelOffset: 0 });
    });
    test('uses a given width, allowing labels that do not fit to scroll', () => {
      expect(getRowLabelLayout(800, 100, 60))
        .toStrictEqual({ labelWidth: 60, maxLabelOffset: fitWidth - 60 });
      expect(getRowLabelLayout(800, 100, 200))
        .toStrictEqual({ labelWidth: 200, maxLabelOffset: 0 });
    });
    test('ignores invalid widths', () => {
      [null, 0, -20, NaN, '60'].forEach((rowLabelWidth) => {
        expect(getRowLabelLayout(800, 100, rowLabelWidth))
          .toStrictEqual({ labelWidth: fitWidth, maxLabelOffset: 0 });
      });
    });
    test('leaves the data area its minimum width', () => {
      const svgWidth = SVG.MIN_WIDTH + 50;
      expect(getRowLabelLayout(svgWidth, 100))
        .toStrictEqual({ labelWidth: 50, maxLabelOffset: fitWidth - 50 });
      expect(getRowLabelLayout(svgWidth, 100, 80))
        .toStrictEqual({ labelWidth: 50, maxLabelOffset: fitWidth - 50 });
    });
  });
});
