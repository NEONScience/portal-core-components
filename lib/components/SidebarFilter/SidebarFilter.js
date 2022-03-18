"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactIdGenerator = require("react-id-generator");

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));

var _OutlinedInput = _interopRequireDefault(require("@material-ui/core/OutlinedInput"));

var _Select = _interopRequireDefault(require("@material-ui/core/Select"));

var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _styles = require("@material-ui/core/styles");

var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));

var _InfoOutlined = _interopRequireDefault(require("@material-ui/icons/InfoOutlined"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _typeUtil = require("../../util/typeUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var useStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (// eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      title: {
        fontWeight: 500
      },
      titleContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: muiTheme.spacing(1)
      },
      selectInput: {
        width: '100%',
        marginBottom: muiTheme.spacing(0.5),
        backgroundColor: '#fff'
      },
      descriptionContainer: {
        marginTop: muiTheme.spacing(0.5)
      },
      descriptionFlexInnerContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      },
      description: {
        display: 'block',
        color: muiTheme.palette.grey[400],
        overflowWrap: 'break-word'
      },
      descriptionLabel: {
        fontWeight: 700,
        color: muiTheme.palette.grey[400],
        marginRight: muiTheme.spacing(1)
      },
      menuItemSubtitle: {
        color: muiTheme.palette.grey[400]
      },
      horizontalFlex: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      },
      horizontalDescriptions: {
        marginLeft: _Theme.default.spacing(3),
        '& > div:first-child': {
          marginTop: '-2px !important'
        }
      }
    })
  );
});

var SidebarFilter = function SidebarFilter(props) {
  var classes = useStyles(_Theme.default);

  var title = props.title,
      skeleton = props.skeleton,
      selected = props.selected,
      values = props.values,
      maxWidth = props.maxWidth,
      horizontal = props.horizontal,
      onChange = props.onChange,
      tooltipText = props.tooltipText,
      helperText = props.helperText,
      otherProps = _objectWithoutProperties(props, ["title", "skeleton", "selected", "values", "maxWidth", "horizontal", "onChange", "tooltipText", "helperText"]);

  var _useId = (0, _reactIdGenerator.useId)(),
      _useId2 = _slicedToArray(_useId, 1),
      instanceId = _useId2[0];

  var selectSeleniumId = "sidebar-filter-select-selenium-".concat(instanceId);
  var inputId = "sidebar-filter-input-".concat(instanceId);
  var labelId = "sidebar-filter-label-".concat(instanceId); // SANITY CHECK: Render nothing if there are no releases and null release is excluded

  var optionCount = values.length + (values ? 0 : 1);

  if (!optionCount) {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
  }

  var handleChange = function handleChange(nextValue) {
    return onChange(nextValue);
  };

  var maxWidthStyle = maxWidth ? {
    maxWidth: "".concat(maxWidth, "px")
  } : {};

  var input = /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
    id: inputId,
    name: inputId,
    margin: "dense",
    className: classes.selectInput,
    style: maxWidthStyle
  });
  /* eslint-disable react/jsx-one-expression-per-line */


  var tooltip = !(0, _typeUtil.isStringNonEmpty)(tooltipText) ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null) : /*#__PURE__*/_react.default.createElement("div", null, tooltipText);
  /* eslint-enable react/jsx-one-expression-per-line */

  var titleNode = !title ? null : /*#__PURE__*/_react.default.createElement("div", {
    className: classes.titleContainer
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5",
    component: "h3",
    className: classes.title,
    id: labelId
  }, title), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    placement: "right",
    title: tooltip,
    interactive: true
  }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    size: "small",
    style: {
      marginLeft: _Theme.default.spacing(0.5)
    }
  }, /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, {
    fontSize: "small"
  })))); // Render skeleton

  if (skeleton) {
    var skeletonStyle = {
      marginBottom: _Theme.default.spacing(1)
    };
    return /*#__PURE__*/_react.default.createElement("div", _extends({}, otherProps, {
      style: {
        maxWidth: "".concat(maxWidth, "px"),
        overflow: 'hidden'
      }
    }), titleNode, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      width: maxWidth,
      height: 36,
      style: skeletonStyle
    }), /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      width: "70%",
      height: 16,
      style: skeletonStyle
    }));
  }

  var selectNode = /*#__PURE__*/_react.default.createElement(_Select.default, {
    "data-selenium": selectSeleniumId,
    value: selected,
    onChange: function onChange(event) {
      return handleChange(event.target.value);
    },
    input: input,
    "aria-labelledby": labelId,
    disabled: optionCount < 2
  }, values.map(function (option) {
    return /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
      key: option.value,
      value: option.value
    }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      display: "block"
    }, option.title)));
  }));

  var renderHelperText = function renderHelperText() {
    if (!(0, _typeUtil.isStringNonEmpty)(helperText)) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.descriptionContainer
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      className: classes.description
    }, helperText));
  }; // Final Render


  return horizontal ? /*#__PURE__*/_react.default.createElement("div", otherProps, /*#__PURE__*/_react.default.createElement("div", null, titleNode), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.horizontalFlex
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: maxWidth ? {
      width: "".concat(maxWidth, "px")
    } : {}
  }, selectNode), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.horizontalDescriptions
  }, renderHelperText()))) : /*#__PURE__*/_react.default.createElement("div", _extends({}, otherProps, {
    style: _extends({
      width: '100%'
    }, maxWidthStyle)
  }), titleNode, selectNode, renderHelperText());
};

var _default = SidebarFilter;
exports.default = _default;