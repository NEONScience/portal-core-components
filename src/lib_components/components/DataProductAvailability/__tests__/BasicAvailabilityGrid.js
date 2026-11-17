import BasicAvailabilityGrid from '../BasicAvailabilityGrid';
import {
  NEON_GREEN_PALETTE,
  CELL_STRIPES,
  getCellAttrs,
  getCellStripes,
} from '../AvailabilitySvgComponents';
import { AVAILABILITY_COLOR_SCHEMES } from '../AvailabilityUtils';
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

const drawGrid = (rows, colorScheme) => {
  const svg = createSvg();
  BasicAvailabilityGrid({
    theme,
    svgRef: { current: svg },
    view: { view: 'sites', getLabel: { text: (key) => key, title: (key) => key } },
    // The time offset that brings data into view is only applied once sites are loaded
    allSites: {
      ABBY: { domainCode: 'D16', stateCode: 'WA' },
      BART: { domainCode: 'D01', stateCode: 'NH' },
    },
    data: { rows },
    selectionEnabled: false,
    colorScheme,
  });
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

describe('DataProductAvailability - BasicAvailabilityGrid', () => {
  test('draws stripes over striped cells with a path for each month and stripe fill', () => {
    const svg = drawGrid({
      ABBY: {
        '2020-01': new Set(['available-provisional']),
        '2020-02': new Set(['available']),
      },
      BART: {
        '2020-01': new Set(['available-provisional']),
        '2020-02': new Set(['available-provisional']),
      },
    });
    const stripedCells = getStripedCells(svg);
    expect(stripedCells.map(({ status }) => status)).toStrictEqual([
      'available-provisional',
      'available-provisional',
      'available-provisional',
    ]);
    const stripePaths = Array.from(svg.querySelectorAll('.stripesG path'));
    expect(stripePaths.map((path) => path.getAttribute('fill'))).toStrictEqual([
      COLORS.NEON_BLUE[700],
      COLORS.NEON_BLUE[700],
    ]);
    const stripes = stripePaths.map((path) => path.getAttribute('d')).join('');
    expect(stripes.match(/M/g)).toHaveLength(stripedCells.length);
    stripedCells.forEach(({ status, x, y }) => {
      expect(stripes).toContain(CELL_STRIPES[status].getPath(x, y));
    });
  });
  test('draws cells in the given color scheme', () => {
    const svg = drawGrid({
      ABBY: {
        '2020-01': new Set(['available-provisional']),
        '2020-02': new Set(['available']),
        '2020-03': new Set(['available', 'available-provisional']),
      },
    }, NEON_GREEN);
    const neonGreenAttrs = getCellAttrs(NEON_GREEN);
    const fills = Array.from(svg.querySelectorAll('.dataG rect'))
      .map((rect) => rect.getAttribute('fill'));
    expect(fills).toEqual(expect.arrayContaining([
      neonGreenAttrs['available-provisional'].fill,
      NEON_GREEN_PALETTE.AVAILABLE,
      neonGreenAttrs['mixed-available-provisional'].fill,
    ]));
    expect(fills).not.toContain(COLORS.NEON_BLUE[700]);
    const stripedCells = getStripedCells(svg, NEON_GREEN);
    expect(stripedCells.map(({ status }) => status)).toStrictEqual(['available-provisional']);
    const stripePaths = Array.from(svg.querySelectorAll('.stripesG path'));
    expect(stripePaths.map((path) => path.getAttribute('fill')))
      .toStrictEqual([NEON_GREEN_PALETTE.AVAILABLE]);
    const [{ x, y }] = stripedCells;
    expect(stripePaths[0].getAttribute('d'))
      .toBe(getCellStripes(NEON_GREEN)['available-provisional'].getPath(x, y));
  });
  test('stripes the provisional half of mixed cells in the color vision accessible scheme', () => {
    const svg = drawGrid({
      ABBY: {
        '2020-01': new Set(['available-provisional']),
        '2020-02': new Set(['available', 'available-provisional']),
      },
    }, COLOR_VISION_ACCESSIBLE);
    const stripedCells = getStripedCells(svg, COLOR_VISION_ACCESSIBLE);
    expect(stripedCells.map(({ status }) => status)).toStrictEqual([
      'available-provisional',
      'mixed-available-provisional',
    ]);
    const cellStripes = getCellStripes(COLOR_VISION_ACCESSIBLE);
    const stripes = Array.from(svg.querySelectorAll('.stripesG path'))
      .map((path) => path.getAttribute('d'))
      .join('');
    stripedCells.forEach(({ status, x, y }) => {
      expect(stripes).toContain(cellStripes[status].getPath(x, y));
    });
  });
});
