'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styles = require('@material-ui/core/styles');

var _AppBar = require('@material-ui/core/AppBar');

var _AppBar2 = _interopRequireDefault(_AppBar);

var _Tabs = require('@material-ui/core/Tabs');

var _Tabs2 = _interopRequireDefault(_Tabs);

var _Tab = require('@material-ui/core/Tab');

var _Tab2 = _interopRequireDefault(_Tab);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 NOTE: The excessive styling here is intended to make the NeonUtilityBar
 component have visual parity with the legacy Utility Bar still being used
 on the Neon Science and Biorepository sites.

 When those sites are serving their utility bars from this shared component
 (i.e. this component is the ONLY implementation of the utility bar) then
 visual changes can be made here and appear consistently across all sites.
*/

var useTabsStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    root: {
      width: '100%',
      minHeight: theme.spacing(3)
      /* borderBottom: '3px solid #fff', */
    },
    indicator: {
      display: 'none'
    },
    flexContainer: _defineProperty({
      justifyContent: 'flex-end'
    }, theme.breakpoints.down('sm'), {
      justifyContent: 'flex-start'
    })
  };
});

var useTabStyles = (0, _styles.makeStyles)(function (theme) {
  var _root;

  return {
    root: (_root = {
      color: '#fff',
      minHeight: theme.spacing(3),
      '&:hover': {
        textDecoration: 'underline'
      },
      '&$selected': {
        color: theme.palette.primary.main,
        backgroundColor: '#fff'
      },
      fontWeight: 700,
      letterSpacing: '1px',
      lineHeight: 1.65,
      fontSize: '1.1rem',
      padding: theme.spacing(0.25) + 'px ' + theme.spacing(3.5) + 'px'
    }, _defineProperty(_root, theme.breakpoints.down('sm'), {
      lineHeight: 1.8,
      fontSize: '0.8rem',
      padding: theme.spacing(0.25) + 'px ' + theme.spacing(2) + 'px'
    }), _defineProperty(_root, theme.breakpoints.down('xs'), {
      fontSize: '0.75rem',
      padding: theme.spacing(0.25) + 'px ' + theme.spacing(1.5) + 'px'
    }), _root),
    selected: {},
    textColorInherit: {
      opacity: 1
    }
  };
});

var NeonUtilityBar = function NeonUtilityBar(props) {
  var tabsClasses = useTabsStyles(_Theme2.default);
  var tabClasses = useTabStyles(_Theme2.default);

  var selectedTab = props.selectedTab;


  var scienceUrl = 'https://neonscience.org';
  var dataUrl = 'https://data.neonscience.org/home';
  var bioUrl = 'https://biorepo.neonscience.org/portal/index.php';

  return _react2.default.createElement(
    _AppBar2.default,
    { position: 'static', 'data-selenium': 'neon-utility-bar' },
    _react2.default.createElement(
      _Tabs2.default,
      { value: selectedTab, classes: tabsClasses },
      _react2.default.createElement(_Tab2.default, { classes: tabClasses, value: 'science', label: 'Neon Science', href: scienceUrl }),
      _react2.default.createElement(_Tab2.default, { classes: tabClasses, value: 'data', label: 'Data Portal', href: dataUrl }),
      _react2.default.createElement(_Tab2.default, { classes: tabClasses, value: 'bio', label: 'Biorepository', href: bioUrl })
    )
  );
};

NeonUtilityBar.propTypes = {
  selectedTab: _propTypes2.default.string
};

NeonUtilityBar.defaultProps = {
  selectedTab: 'data'
};

exports.default = NeonUtilityBar;