'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SvgPatternsString = undefined;
exports.default = SvgPatterns;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
   SVG Patterns
   Pattern shapes borrowed from https://github.com/iros/patternfills
   And edited here to be theme-colored.
*/

var svgPatternsSrc = {
  horizontalStripeSecondaryBlue2: {
    dim: 8,
    node: _react2.default.createElement(
      'svg',
      { xmlns: 'http://www.w3.org/2000/svg', width: '8', height: '8' },
      _react2.default.createElement('rect', { x: '0', y: '0', width: '8', height: '8', fill: _Theme.COLORS.SECONDARY_BLUE[100] }),
      _react2.default.createElement('rect', { x: '0', y: '0', width: '8', height: '2', fill: _Theme.COLORS.SECONDARY_BLUE[300] }),
      _react2.default.createElement('rect', { x: '0', y: '4', width: '8', height: '2', fill: _Theme.COLORS.SECONDARY_BLUE[300] })
    )
  },
  diagonalStripeSecondaryBlue3: {
    dim: 10,
    node: _react2.default.createElement(
      'svg',
      { xmlns: 'http://www.w3.org/2000/svg', width: '10', height: '10' },
      _react2.default.createElement('rect', { x: '0', y: '0', width: '10', height: '10', fill: _Theme.COLORS.SECONDARY_BLUE[100] }),
      _react2.default.createElement('path', {
        d: 'M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2',
        stroke: _Theme2.default.palette.secondary.main,
        strokeWidth: '2'
      })
    )
  }
};

function SvgPatterns() {
  return _react2.default.createElement(
    _react2.default.Fragment,
    null,
    Object.keys(svgPatternsSrc).map(function (pattern) {
      var _svgPatternsSrc$patte = svgPatternsSrc[pattern],
          dim = _svgPatternsSrc$patte.dim,
          node = _svgPatternsSrc$patte.node;

      var base64 = btoa(_server2.default.renderToStaticMarkup(node));
      return _react2.default.createElement(
        'pattern',
        { id: pattern, key: pattern, patternUnits: 'userSpaceOnUse', width: dim, height: dim },
        _react2.default.createElement('image', {
          xlinkHref: 'data:image/svg+xml;base64,' + base64,
          x: '0',
          y: '0',
          width: dim,
          height: dim
        })
      );
    })
  );
}

var SvgPatternsString = exports.SvgPatternsString = function SvgPatternsString() {
  return _server2.default.renderToStaticMarkup(SvgPatterns());
};