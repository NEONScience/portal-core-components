import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import { SVG } from './AvailabilityUtils';
import { CELL_ATTRS } from './AvailabilitySvgComponents';

import Theme, { COLORS } from '../Theme/Theme';

/**
   Setup: CSS classes
*/
const useStyles = makeStyles((theme) => ({
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
export default function BasicAvailabilityKey(props) {
  const classes = useStyles(Theme);
  const { orientation, selectionEnabled, delineateRelease } = props;

  /**
     Render: Cells (Vertical Orientation)
  */
  const renderVerticalCellLegend = () => {
    const totalRows = delineateRelease ? 3 : 2;
    const totalWidth = delineateRelease ? 180 : 90;
    const rowHeight = SVG.CELL_HEIGHT + (2 * SVG.CELL_PADDING);
    const totalHeight = (rowHeight * totalRows) - SVG.CELL_PADDING;
    const rowY = (row) => row * rowHeight;
    const rowLabelY = (row) => rowY(row) + (SVG.LABEL_FONT_SIZE - SVG.CELL_PADDING + 1);
    const cellOffset = SVG.CELL_WIDTH + (2 * SVG.CELL_PADDING);
    const renderProvisionalCell = () => {
      if (!delineateRelease) {
        return (<></>);
      }
      const provCell = CELL_ATTRS['available-provisional'];
      /* eslint-disable max-len */
      return (
        <>
          <rect
            x={0.75}
            y={rowY(1)}
            width={SVG.CELL_WIDTH}
            height={SVG.CELL_HEIGHT}
            rx={SVG.CELL_RX}
            fill={provCell.fill}
            stroke={provCell.stroke}
            strokeWidth={provCell.strokeWidth}
          />
          <text className={classes.legendText} x={cellOffset} y={rowLabelY(1)}>
            Provisional Available
          </text>
        </>
      );
    };
    /* eslint-disable max-len */
    return (
      <svg width={totalWidth} height={totalHeight} className={classes.legendSvg}>
        <rect x={0} y={rowY(0)} width={SVG.CELL_WIDTH} height={SVG.CELL_HEIGHT} rx={SVG.CELL_RX} fill={Theme.palette.secondary.main} />
        <text className={classes.legendText} x={cellOffset} y={rowLabelY(0)}>
          Available
        </text>
        {renderProvisionalCell()}
        <rect x={0} y={rowY(delineateRelease ? 2 : 1)} width={SVG.CELL_WIDTH} height={SVG.CELL_HEIGHT} rx={SVG.CELL_RX} fill={Theme.palette.grey[200]} />
        <text className={classes.legendText} x={cellOffset} y={rowLabelY(delineateRelease ? 2 : 1)}>
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
    const totalColumns = delineateRelease ? 3 : 2;
    const columnWidth = SVG.CELL_WIDTH + (2 * SVG.CELL_PADDING) + 100;
    const totalWidth = columnWidth * totalColumns;
    const totalHeight = SVG.CELL_HEIGHT + SVG.CELL_PADDING;
    const columnX = (col) => col * columnWidth;
    const rowLabelY = (SVG.LABEL_FONT_SIZE - SVG.CELL_PADDING + 1);
    const cellOffset = SVG.CELL_WIDTH + (2 * SVG.CELL_PADDING);
    const renderProvisionalCell = () => {
      if (!delineateRelease) {
        return (<></>);
      }
      const provCell = CELL_ATTRS['available-provisional'];
      /* eslint-disable max-len */
      return (
        <>
          <rect
            x={columnX(1)}
            y={0.75}
            width={SVG.CELL_WIDTH}
            height={SVG.CELL_HEIGHT}
            rx={SVG.CELL_RX}
            fill={provCell.fill}
            stroke={provCell.stroke}
            strokeWidth={provCell.strokeWidth}
          />
          <text className={classes.legendText} x={columnX(1) + cellOffset} y={rowLabelY}>
            Provisional
          </text>
        </>
      );
    };
    /* eslint-disable max-len */
    return (
      <svg width={totalWidth} height={totalHeight} className={classes.legendSvg}>
        <rect x={columnX(0)} y={0} width={SVG.CELL_WIDTH} height={SVG.CELL_HEIGHT} rx={SVG.CELL_RX} fill={Theme.palette.secondary.main} />
        <text className={classes.legendText} x={columnX(0) + cellOffset} y={rowLabelY}>
          Available
        </text>
        {renderProvisionalCell()}
        <rect x={columnX(delineateRelease ? 2 : 1)} y={0} width={SVG.CELL_WIDTH} height={SVG.CELL_HEIGHT} rx={SVG.CELL_RX} fill={Theme.palette.grey[200]} />
        <text className={classes.legendText} x={columnX(delineateRelease ? 2 : 1) + cellOffset} y={rowLabelY}>
          No data
        </text>
      </svg>
    );
    /* eslint-enable max-len */
  };

  /**
     Render: Cell Legend
  */
  const renderCellLegend = (appliedOrientation) => {
    const resultingOrientation = orientation === '' ? appliedOrientation : orientation;
    if (resultingOrientation === 'horizontal') return renderHorizontalCellLegend();
    return renderVerticalCellLegend();
  };

  /**
     Render: Selection
  */
  const renderSelectionLegend = () => {
    const totalRows = 2;
    const rowHeight = SVG.CELL_HEIGHT + (2 * SVG.CELL_PADDING);
    const totalHeight = (rowHeight * totalRows) - SVG.CELL_PADDING;
    const rowY = (row) => row * rowHeight;
    const rowLabelY = (row) => rowY(row) + (SVG.LABEL_FONT_SIZE - SVG.CELL_PADDING + 1);
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
        <rect x={0.5} y={rowY(0) + 1.5} width={selectionWidth} height={SVG.CELL_HEIGHT - 2} fill={Theme.palette.primary.main} />
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

  return selectionEnabled || delineateRelease ? (
    <div className={classes.legendContainer}>
      {renderCellLegend('vertical')}
      {selectionEnabled ? (
        renderSelectionLegend()
      ) : null}
    </div>
  ) : (
    <div className={classes.legendContainer}>
      {renderCellLegend('horizontal')}
    </div>
  );
}

BasicAvailabilityKey.propTypes = {
  orientation: PropTypes.string,
  selectionEnabled: PropTypes.bool,
  delineateRelease: PropTypes.bool,
};

BasicAvailabilityKey.defaultProps = {
  orientation: '',
  selectionEnabled: false,
  delineateRelease: false,
};
