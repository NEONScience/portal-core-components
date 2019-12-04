'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = AvailabilityLegend;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styles = require('@material-ui/core/styles');

var _AvailabilityGrid = require('./AvailabilityGrid');

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
   Setup: CSS classes
*/
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    legendContainer: {
      marginLeft: _AvailabilityGrid.SVG.LABEL_WIDTH,
      marginTop: theme.spacing(1)
    },
    legendSvg: {
      display: 'inline-block',
      marginRight: theme.spacing(1.5)
    },
    legendText: {
      textAnchor: 'start',
      whiteSpace: 'pre',
      fontFamily: '"Cutive Mono","Lucida Console",Monaco,monospace',
      fontWeight: 400,
      fontSize: _AvailabilityGrid.SVG.LABEL_FONT_SIZE + 'px',
      fill: _Theme2.default.palette.grey[700]
    }
  };
});

/**
   Main Function
*/
function AvailabilityLegend(props) {
  var classes = useStyles(_Theme2.default);
  var selectionEnabled = props.selectionEnabled;

  /**
     Render: Cells (Vertical Orientation)
  */

  var renderVerticalCellLegend = function renderVerticalCellLegend() {
    var totalRows = 2;
    var rowHeight = _AvailabilityGrid.SVG.CELL_HEIGHT + 2 * _AvailabilityGrid.SVG.CELL_PADDING;
    var totalHeight = rowHeight * totalRows - _AvailabilityGrid.SVG.CELL_PADDING;
    var rowY = function rowY(row) {
      return row * rowHeight;
    };
    var rowLabelY = function rowLabelY(row) {
      return rowY(row) + (_AvailabilityGrid.SVG.LABEL_FONT_SIZE - _AvailabilityGrid.SVG.CELL_PADDING + 1);
    };
    var cellOffset = _AvailabilityGrid.SVG.CELL_WIDTH + 2 * _AvailabilityGrid.SVG.CELL_PADDING;
    /* eslint-disable max-len */
    return _react2.default.createElement(
      'svg',
      { width: '90', height: totalHeight, className: classes.legendSvg },
      _react2.default.createElement('rect', { x: 0, y: rowY(0), width: _AvailabilityGrid.SVG.CELL_WIDTH, height: _AvailabilityGrid.SVG.CELL_HEIGHT, rx: _AvailabilityGrid.SVG.CELL_RX, fill: _Theme2.default.palette.primary.main }),
      _react2.default.createElement(
        'text',
        { className: classes.legendText, x: cellOffset, y: rowLabelY(0) },
        'Available'
      ),
      _react2.default.createElement('rect', { x: 0, y: rowY(1), width: _AvailabilityGrid.SVG.CELL_WIDTH, height: _AvailabilityGrid.SVG.CELL_HEIGHT, rx: _AvailabilityGrid.SVG.CELL_RX, fill: _Theme2.default.palette.grey[100] }),
      _react2.default.createElement(
        'text',
        { className: classes.legendText, x: cellOffset, y: rowLabelY(1) },
        'No data'
      )
    );
    /* eslint-enable max-len */
  };

  /**
     Render: Cells (Horizontal Orientation)
  */
  var renderHorizontalCellLegend = function renderHorizontalCellLegend() {
    var totalColumns = 2;
    var columnWidth = _AvailabilityGrid.SVG.CELL_WIDTH + 2 * _AvailabilityGrid.SVG.CELL_PADDING + 100;
    var totalWidth = columnWidth * totalColumns;
    var totalHeight = _AvailabilityGrid.SVG.CELL_HEIGHT + _AvailabilityGrid.SVG.CELL_PADDING;
    var columnX = function columnX(col) {
      return col * columnWidth;
    };
    var rowLabelY = _AvailabilityGrid.SVG.LABEL_FONT_SIZE - _AvailabilityGrid.SVG.CELL_PADDING + 1;
    var cellOffset = _AvailabilityGrid.SVG.CELL_WIDTH + 2 * _AvailabilityGrid.SVG.CELL_PADDING;
    /* eslint-disable max-len */
    return _react2.default.createElement(
      'svg',
      { width: totalWidth, height: totalHeight, className: classes.legendSvg },
      _react2.default.createElement('rect', { x: columnX(0), y: 0, width: _AvailabilityGrid.SVG.CELL_WIDTH, height: _AvailabilityGrid.SVG.CELL_HEIGHT, rx: _AvailabilityGrid.SVG.CELL_RX, fill: _Theme2.default.palette.primary.main }),
      _react2.default.createElement(
        'text',
        { className: classes.legendText, x: columnX(0) + cellOffset, y: rowLabelY },
        'Available'
      ),
      _react2.default.createElement('rect', { x: columnX(1), y: 0, width: _AvailabilityGrid.SVG.CELL_WIDTH, height: _AvailabilityGrid.SVG.CELL_HEIGHT, rx: _AvailabilityGrid.SVG.CELL_RX, fill: _Theme2.default.palette.grey[100] }),
      _react2.default.createElement(
        'text',
        { className: classes.legendText, x: columnX(1) + cellOffset, y: rowLabelY },
        'No data'
      )
    );
    /* eslint-enable max-len */
  };

  /**
     Render: Selection
  */
  var renderSelectionLegend = function renderSelectionLegend() {
    if (!selectionEnabled) {
      return null;
    }
    var totalRows = 2;
    var rowHeight = _AvailabilityGrid.SVG.CELL_HEIGHT + 2 * _AvailabilityGrid.SVG.CELL_PADDING;
    var totalHeight = rowHeight * totalRows - _AvailabilityGrid.SVG.CELL_PADDING;
    var rowY = function rowY(row) {
      return row * rowHeight;
    };
    var rowLabelY = function rowLabelY(row) {
      return rowY(row) + (_AvailabilityGrid.SVG.LABEL_FONT_SIZE - _AvailabilityGrid.SVG.CELL_PADDING + 1);
    };
    var selectionWidth = 45;
    var selectionLabelOffset = selectionWidth + 2 * _AvailabilityGrid.SVG.CELL_PADDING;
    var handleAttribs = {
      width: _AvailabilityGrid.SVG.DATE_RANGE_HANDLE_WIDTH,
      height: _AvailabilityGrid.SVG.CELL_HEIGHT,
      fill: _Theme.COLORS.SECONDARY_BLUE[300],
      stroke: _Theme2.default.palette.secondary.main,
      strokeWidth: 1.5
    };
    /* eslint-disable max-len */
    return _react2.default.createElement(
      'svg',
      { width: '210', height: totalHeight, className: classes.legendSvg },
      _react2.default.createElement('rect', { x: 0.5, y: rowY(0) + 1.5, width: selectionWidth, height: _AvailabilityGrid.SVG.CELL_HEIGHT - 2, fill: _Theme2.default.palette.secondary.main }),
      _react2.default.createElement('rect', _extends({ x: 0.5, y: rowY(0) + 0.5 }, handleAttribs)),
      _react2.default.createElement('rect', _extends({ x: selectionWidth - _AvailabilityGrid.SVG.DATE_RANGE_HANDLE_WIDTH, y: rowY(0) + 0.5 }, handleAttribs)),
      _react2.default.createElement(
        'text',
        { className: classes.legendText, x: selectionLabelOffset, y: rowLabelY(0) },
        'All sites selected'
      ),
      _react2.default.createElement('rect', { x: 0.5, y: rowY(1) + 1.5, width: selectionWidth, height: _AvailabilityGrid.SVG.CELL_HEIGHT - 2, fill: _Theme.COLORS.SECONDARY_BLUE[200] }),
      _react2.default.createElement('rect', _extends({ x: 0.5, y: rowY(1) + 0.5 }, handleAttribs)),
      _react2.default.createElement('rect', _extends({ x: selectionWidth - _AvailabilityGrid.SVG.DATE_RANGE_HANDLE_WIDTH, y: rowY(1) + 0.5 }, handleAttribs)),
      _react2.default.createElement(
        'text',
        { className: classes.legendText, x: selectionLabelOffset, y: rowLabelY(1) },
        'Some sites selected'
      )
    );
    /* eslint-enable max-len */
  };

  return selectionEnabled ? _react2.default.createElement(
    'div',
    { className: classes.legendContainer },
    renderVerticalCellLegend(),
    renderSelectionLegend()
  ) : _react2.default.createElement(
    'div',
    { className: classes.legendContainer },
    renderHorizontalCellLegend()
  );
}

AvailabilityLegend.propTypes = {
  selectionEnabled: _propTypes2.default.bool
};

AvailabilityLegend.defaultProps = {
  selectionEnabled: false
};