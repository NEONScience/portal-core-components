import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import { SVG } from './AvailabilityGrid';

import Theme, { COLORS } from '../Theme/Theme';

/**
   Setup: CSS classes
*/
const useStyles = makeStyles(theme => ({
  legendContainer: {
    marginLeft: SVG.LABEL_WIDTH,
    marginTop: theme.spacing(1),
  },
  legendSvg: {
    display: 'inline-block',
    marginRight: theme.spacing(1.5),
  },
  legendText: {
    textAnchor: 'start',
    whiteSpace: 'pre',
    fontFamily: '"Cutive Mono","Lucida Console",Monaco,monospace',
    fontWeight: 400,
    fontSize: `${SVG.LABEL_FONT_SIZE}px`,
    fill: Theme.palette.grey[700],
  },
}));

/**
   Main Function
*/
export default function AvailabilityLegend(props) {
  const classes = useStyles(Theme);
  const { selectionEnabled } = props;

  /**
     Render: Cells (Vertical Orientation)
  */
  const renderVerticalCellLegend = () => {
    const totalRows = 2;
    const rowHeight = SVG.CELL_HEIGHT + (2 * SVG.CELL_PADDING);
    const totalHeight = (rowHeight * totalRows) - SVG.CELL_PADDING;
    const rowY = row => row * rowHeight;
    const rowLabelY = row => rowY(row) + (SVG.LABEL_FONT_SIZE - SVG.CELL_PADDING + 1);
    const cellOffset = SVG.CELL_WIDTH + (2 * SVG.CELL_PADDING);
    /* eslint-disable max-len */
    return (
      <svg width="90" height={totalHeight} className={classes.legendSvg}>
        <rect x={0} y={rowY(0)} width={SVG.CELL_WIDTH} height={SVG.CELL_HEIGHT} rx={SVG.CELL_RX} fill={COLORS.NEON_BLUE[700]} />
        <text className={classes.legendText} x={cellOffset} y={rowLabelY(0)}>
          Available
        </text>
        <rect x={0} y={rowY(1)} width={SVG.CELL_WIDTH} height={SVG.CELL_HEIGHT} rx={SVG.CELL_RX} fill={Theme.palette.grey[100]} />
        <text className={classes.legendText} x={cellOffset} y={rowLabelY(1)}>
          No data
        </text>
      </svg>
    );
    /* eslint-enable max-len */
  };

  /**
     Render: Cells (Horizontal Orientation)
  */
  const renderHorizontalCellLegend = () => {
    const totalColumns = 2;
    const columnWidth = SVG.CELL_WIDTH + (2 * SVG.CELL_PADDING) + 100;
    const totalWidth = columnWidth * totalColumns;
    const totalHeight = SVG.CELL_HEIGHT + SVG.CELL_PADDING;
    const columnX = col => col * columnWidth;
    const rowLabelY = (SVG.LABEL_FONT_SIZE - SVG.CELL_PADDING + 1);
    const cellOffset = SVG.CELL_WIDTH + (2 * SVG.CELL_PADDING);
    /* eslint-disable max-len */
    return (
      <svg width={totalWidth} height={totalHeight} className={classes.legendSvg}>
        <rect x={columnX(0)} y={0} width={SVG.CELL_WIDTH} height={SVG.CELL_HEIGHT} rx={SVG.CELL_RX} fill={COLORS.LIGHT_BLUE[200]} />
        <text className={classes.legendText} x={columnX(0) + cellOffset} y={rowLabelY}>
          Available
        </text>
        <rect x={columnX(1)} y={0} width={SVG.CELL_WIDTH} height={SVG.CELL_HEIGHT} rx={SVG.CELL_RX} fill={Theme.palette.grey[100]} />
        <text className={classes.legendText} x={columnX(1) + cellOffset} y={rowLabelY}>
          No data
        </text>
      </svg>
    );
    /* eslint-enable max-len */
  };

  /**
     Render: Selection
  */
  const renderSelectionLegend = () => {
    if (!selectionEnabled) { return null; }
    const totalRows = 2;
    const rowHeight = SVG.CELL_HEIGHT + (2 * SVG.CELL_PADDING);
    const totalHeight = (rowHeight * totalRows) - SVG.CELL_PADDING;
    const rowY = row => row * rowHeight;
    const rowLabelY = row => rowY(row) + (SVG.LABEL_FONT_SIZE - SVG.CELL_PADDING + 1);
    const selectionWidth = 45;
    const selectionLabelOffset = selectionWidth + (2 * SVG.CELL_PADDING);
    const handleAttribs = {
      width: SVG.DATE_RANGE_HANDLE_WIDTH,
      height: SVG.CELL_HEIGHT,
      fill: COLORS.LIGHT_BLUE[300],
      stroke: Theme.palette.primary.main,
      strokeWidth: 1.5,
    };
    /* eslint-disable max-len */
    return (
      <svg width="210" height={totalHeight} className={classes.legendSvg}>
        <rect x={0.5} y={rowY(0) + 1.5} width={selectionWidth} height={SVG.CELL_HEIGHT - 2} fill={COLORS.LIGHT_BLUE[500]} />
        <rect x={0.5} y={rowY(0) + 0.5} {...handleAttribs} />
        <rect x={selectionWidth - SVG.DATE_RANGE_HANDLE_WIDTH} y={rowY(0) + 0.5} {...handleAttribs} />
        <text className={classes.legendText} x={selectionLabelOffset} y={rowLabelY(0)}>
          All sites selected
        </text>
        <rect x={0.5} y={rowY(1) + 1.5} width={selectionWidth} height={SVG.CELL_HEIGHT - 2} fill={COLORS.LIGHT_BLUE[200]} />
        <rect x={0.5} y={rowY(1) + 0.5} {...handleAttribs} />
        <rect x={selectionWidth - SVG.DATE_RANGE_HANDLE_WIDTH} y={rowY(1) + 0.5} {...handleAttribs} />
        <text className={classes.legendText} x={selectionLabelOffset} y={rowLabelY(1)}>
          Some sites selected
        </text>
      </svg>
    );
    /* eslint-enable max-len */
  };

  return selectionEnabled ? (
    <div className={classes.legendContainer}>
      {renderVerticalCellLegend()}
      {renderSelectionLegend()}
    </div>
  ) : (
    <div className={classes.legendContainer}>
      {renderHorizontalCellLegend()}
    </div>
  );
}

AvailabilityLegend.propTypes = {
  selectionEnabled: PropTypes.bool,
};

AvailabilityLegend.defaultProps = {
  selectionEnabled: false,
};
