"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@material-ui/core/styles");

var _AppBar = _interopRequireDefault(require("@material-ui/core/AppBar"));

var _Tabs = _interopRequireDefault(require("@material-ui/core/Tabs"));

var _Tab = _interopRequireDefault(require("@material-ui/core/Tab"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

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
      backgroundColor: theme.palette.secondary.main,
      border: 'none',
      minHeight: theme.spacing(3),
      '&:hover': {
        textDecoration: 'underline',
        color: '#fff',
        backgroundColor: theme.palette.secondary.main
      },
      '&$selected': {
        color: "".concat(theme.palette.secondary.main, " !important"),
        backgroundColor: '#fff !important'
      },
      fontWeight: 600,
      letterSpacing: '1px',
      lineHeight: 1.65,
      fontSize: '1rem',
      padding: "".concat(theme.spacing(0.25), "px ").concat(theme.spacing(3.5), "px")
    }, _defineProperty(_root, theme.breakpoints.down('sm'), {
      lineHeight: 1.8,
      fontSize: '0.8rem',
      padding: "".concat(theme.spacing(0.25), "px ").concat(theme.spacing(2), "px")
    }), _defineProperty(_root, theme.breakpoints.down('xs'), {
      fontSize: '0.75rem',
      padding: "".concat(theme.spacing(0.25), "px ").concat(theme.spacing(1.5), "px")
    }), _root),
    selected: {},
    textColorInherit: {
      opacity: 1
    }
  };
});

var NeonUtilityBar = function NeonUtilityBar(props) {
  var tabsClasses = useTabsStyles(_Theme.default);
  var tabClasses = useTabStyles(_Theme.default);
  var selectedTab = props.selectedTab;
  var scienceUrl = 'https://neonscience.org';
  var dataUrl = 'https://data.neonscience.org/home';
  var bioUrl = 'https://biorepo.neonscience.org/portal/index.php';
  return /*#__PURE__*/_react.default.createElement(_AppBar.default, {
    position: "static",
    "data-selenium": "neon-utility-bar",
    color: "secondary",
    elevation: 2
  }, /*#__PURE__*/_react.default.createElement(_Tabs.default, {
    value: selectedTab,
    classes: tabsClasses
  }, /*#__PURE__*/_react.default.createElement(_Tab.default, {
    classes: tabClasses,
    value: "science",
    label: "Neon Science",
    href: scienceUrl
  }), /*#__PURE__*/_react.default.createElement(_Tab.default, {
    classes: tabClasses,
    value: "data",
    label: "Data Portal",
    href: dataUrl
  }), /*#__PURE__*/_react.default.createElement(_Tab.default, {
    classes: tabClasses,
    value: "bio",
    label: "Biorepository",
    href: bioUrl
  })));
};

NeonUtilityBar.propTypes = {
  selectedTab: _propTypes.default.string
};
NeonUtilityBar.defaultProps = {
  selectedTab: 'data'
};
var _default = NeonUtilityBar;
exports.default = _default;