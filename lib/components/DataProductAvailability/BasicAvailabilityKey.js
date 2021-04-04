"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = BasicAvailabilityKey;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@material-ui/core/styles");

var _AvailabilityUtils = require("./AvailabilityUtils");

var _AvailabilitySvgComponents = require("./AvailabilitySvgComponents");

var _Theme = _interopRequireWildcard(require("../Theme/Theme"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
   Setup: CSS classes
*/
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    legendContainer: {
      marginLeft: _AvailabilityUtils.SVG.LABEL_WIDTH,
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
      fontSize: "".concat(_AvailabilityUtils.SVG.LABEL_FONT_SIZE, "px"),
      fill: _Theme.default.palette.grey[700]
    }
  };
});
/**
   Main Function
*/

function BasicAvailabilityKey(props) {
  var classes = useStyles(_Theme.default);
  var selectionEnabled = props.selectionEnabled,
      delineateRelease = props.delineateRelease;
  /**
     Render: Cells (Vertical Orientation)
  */

  var renderVerticalCellLegend = function renderVerticalCellLegend() {
    var totalRows = delineateRelease ? 3 : 2;
    var totalWidth = delineateRelease ? 180 : 90;
    var rowHeight = _AvailabilityUtils.SVG.CELL_HEIGHT + 2 * _AvailabilityUtils.SVG.CELL_PADDING;
    var totalHeight = rowHeight * totalRows - _AvailabilityUtils.SVG.CELL_PADDING;

    var rowY = function rowY(row) {
      return row * rowHeight;
    };

    var rowLabelY = function rowLabelY(row) {
      return rowY(row) + (_AvailabilityUtils.SVG.LABEL_FONT_SIZE - _AvailabilityUtils.SVG.CELL_PADDING + 1);
    };

    var cellOffset = _AvailabilityUtils.SVG.CELL_WIDTH + 2 * _AvailabilityUtils.SVG.CELL_PADDING;

    var renderProvisionalCell = function renderProvisionalCell() {
      if (!delineateRelease) {
        return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
      }

      var provCell = _AvailabilitySvgComponents.CELL_ATTRS['available-provisional'];
      /* eslint-disable max-len */

      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("rect", {
        x: 0.75,
        y: rowY(1),
        width: _AvailabilityUtils.SVG.CELL_WIDTH,
        height: _AvailabilityUtils.SVG.CELL_HEIGHT,
        rx: _AvailabilityUtils.SVG.CELL_RX,
        fill: provCell.fill,
        stroke: provCell.stroke,
        strokeWidth: provCell.strokeWidth
      }), /*#__PURE__*/_react.default.createElement("text", {
        className: classes.legendText,
        x: cellOffset,
        y: rowLabelY(1)
      }, "Provisional Available"));
    };
    /* eslint-disable max-len */


    return /*#__PURE__*/_react.default.createElement("svg", {
      width: totalWidth,
      height: totalHeight,
      className: classes.legendSvg
    }, /*#__PURE__*/_react.default.createElement("rect", {
      x: 0,
      y: rowY(0),
      width: _AvailabilityUtils.SVG.CELL_WIDTH,
      height: _AvailabilityUtils.SVG.CELL_HEIGHT,
      rx: _AvailabilityUtils.SVG.CELL_RX,
      fill: _Theme.default.palette.secondary.main
    }), /*#__PURE__*/_react.default.createElement("text", {
      className: classes.legendText,
      x: cellOffset,
      y: rowLabelY(0)
    }, "Available"), renderProvisionalCell(), /*#__PURE__*/_react.default.createElement("rect", {
      x: 0,
      y: rowY(delineateRelease ? 2 : 1),
      width: _AvailabilityUtils.SVG.CELL_WIDTH,
      height: _AvailabilityUtils.SVG.CELL_HEIGHT,
      rx: _AvailabilityUtils.SVG.CELL_RX,
      fill: _Theme.default.palette.grey[200]
    }), /*#__PURE__*/_react.default.createElement("text", {
      className: classes.legendText,
      x: cellOffset,
      y: rowLabelY(delineateRelease ? 2 : 1)
    }, "No data"));
    /* eslint-enable max-len */
  };
  /**
     Render: Cells (Horizontal Orientation)
  */


  var renderHorizontalCellLegend = function renderHorizontalCellLegend() {
    var totalColumns = delineateRelease ? 3 : 2;
    var columnWidth = _AvailabilityUtils.SVG.CELL_WIDTH + 2 * _AvailabilityUtils.SVG.CELL_PADDING + 100;
    var totalWidth = columnWidth * totalColumns;
    var totalHeight = _AvailabilityUtils.SVG.CELL_HEIGHT + _AvailabilityUtils.SVG.CELL_PADDING;

    var columnX = function columnX(col) {
      return col * columnWidth;
    };

    var rowLabelY = _AvailabilityUtils.SVG.LABEL_FONT_SIZE - _AvailabilityUtils.SVG.CELL_PADDING + 1;
    var cellOffset = _AvailabilityUtils.SVG.CELL_WIDTH + 2 * _AvailabilityUtils.SVG.CELL_PADDING;

    var renderProvisionalCell = function renderProvisionalCell() {
      if (!delineateRelease) {
        return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
      }

      var provCell = _AvailabilitySvgComponents.CELL_ATTRS['available-provisional'];
      /* eslint-disable max-len */

      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("rect", {
        x: columnX(1),
        y: 0.75,
        width: _AvailabilityUtils.SVG.CELL_WIDTH,
        height: _AvailabilityUtils.SVG.CELL_HEIGHT,
        rx: _AvailabilityUtils.SVG.CELL_RX,
        fill: provCell.fill,
        stroke: provCell.stroke,
        strokeWidth: provCell.strokeWidth
      }), /*#__PURE__*/_react.default.createElement("text", {
        className: classes.legendText,
        x: columnX(1) + cellOffset,
        y: rowLabelY
      }, "Provisional"));
    };
    /* eslint-disable max-len */


    return /*#__PURE__*/_react.default.createElement("svg", {
      width: totalWidth,
      height: totalHeight,
      className: classes.legendSvg
    }, /*#__PURE__*/_react.default.createElement("rect", {
      x: columnX(0),
      y: 0,
      width: _AvailabilityUtils.SVG.CELL_WIDTH,
      height: _AvailabilityUtils.SVG.CELL_HEIGHT,
      rx: _AvailabilityUtils.SVG.CELL_RX,
      fill: _Theme.default.palette.secondary.main
    }), /*#__PURE__*/_react.default.createElement("text", {
      className: classes.legendText,
      x: columnX(0) + cellOffset,
      y: rowLabelY
    }, "Available"), renderProvisionalCell(), /*#__PURE__*/_react.default.createElement("rect", {
      x: columnX(delineateRelease ? 2 : 1),
      y: 0,
      width: _AvailabilityUtils.SVG.CELL_WIDTH,
      height: _AvailabilityUtils.SVG.CELL_HEIGHT,
      rx: _AvailabilityUtils.SVG.CELL_RX,
      fill: _Theme.default.palette.grey[200]
    }), /*#__PURE__*/_react.default.createElement("text", {
      className: classes.legendText,
      x: columnX(delineateRelease ? 2 : 1) + cellOffset,
      y: rowLabelY
    }, "No data"));
    /* eslint-enable max-len */
  };
  /**
     Render: Selection
  */


  var renderSelectionLegend = function renderSelectionLegend() {
    var totalRows = 2;
    var rowHeight = _AvailabilityUtils.SVG.CELL_HEIGHT + 2 * _AvailabilityUtils.SVG.CELL_PADDING;
    var totalHeight = rowHeight * totalRows - _AvailabilityUtils.SVG.CELL_PADDING;

    var rowY = function rowY(row) {
      return row * rowHeight;
    };

    var rowLabelY = function rowLabelY(row) {
      return rowY(row) + (_AvailabilityUtils.SVG.LABEL_FONT_SIZE - _AvailabilityUtils.SVG.CELL_PADDING + 1);
    };

    var selectionWidth = 45;
    var selectionLabelOffset = selectionWidth + 2 * _AvailabilityUtils.SVG.CELL_PADDING;
    var handleAttribs = {
      width: _AvailabilityUtils.SVG.DATE_RANGE_HANDLE_WIDTH,
      height: _AvailabilityUtils.SVG.CELL_HEIGHT,
      fill: _Theme.COLORS.LIGHT_BLUE[300],
      stroke: _Theme.default.palette.primary.main,
      strokeWidth: 1.5
    };
    /* eslint-disable max-len */

    return /*#__PURE__*/_react.default.createElement("svg", {
      width: "210",
      height: totalHeight,
      className: classes.legendSvg
    }, /*#__PURE__*/_react.default.createElement("rect", {
      x: 0.5,
      y: rowY(0) + 1.5,
      width: selectionWidth,
      height: _AvailabilityUtils.SVG.CELL_HEIGHT - 2,
      fill: _Theme.default.palette.primary.main
    }), /*#__PURE__*/_react.default.createElement("rect", _extends({
      x: 0.5,
      y: rowY(0) + 0.5
    }, handleAttribs)), /*#__PURE__*/_react.default.createElement("rect", _extends({
      x: selectionWidth - _AvailabilityUtils.SVG.DATE_RANGE_HANDLE_WIDTH,
      y: rowY(0) + 0.5
    }, handleAttribs)), /*#__PURE__*/_react.default.createElement("text", {
      className: classes.legendText,
      x: selectionLabelOffset,
      y: rowLabelY(0)
    }, "All sites selected"), /*#__PURE__*/_react.default.createElement("rect", {
      x: 0.5,
      y: rowY(1) + 1.5,
      width: selectionWidth,
      height: _AvailabilityUtils.SVG.CELL_HEIGHT - 2,
      fill: _Theme.COLORS.LIGHT_BLUE[200]
    }), /*#__PURE__*/_react.default.createElement("rect", _extends({
      x: 0.5,
      y: rowY(1) + 0.5
    }, handleAttribs)), /*#__PURE__*/_react.default.createElement("rect", _extends({
      x: selectionWidth - _AvailabilityUtils.SVG.DATE_RANGE_HANDLE_WIDTH,
      y: rowY(1) + 0.5
    }, handleAttribs)), /*#__PURE__*/_react.default.createElement("text", {
      className: classes.legendText,
      x: selectionLabelOffset,
      y: rowLabelY(1)
    }, "Some sites selected"));
    /* eslint-enable max-len */
  };

  return selectionEnabled || delineateRelease ? /*#__PURE__*/_react.default.createElement("div", {
    className: classes.legendContainer
  }, renderVerticalCellLegend(), selectionEnabled ? renderSelectionLegend() : null) : /*#__PURE__*/_react.default.createElement("div", {
    className: classes.legendContainer
  }, renderHorizontalCellLegend());
}

BasicAvailabilityKey.propTypes = {
  selectionEnabled: _propTypes.default.bool,
  delineateRelease: _propTypes.default.bool
};
BasicAvailabilityKey.defaultProps = {
  selectionEnabled: false,
  delineateRelease: false
};