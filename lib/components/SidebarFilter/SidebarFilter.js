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
const _excluded = ["title", "skeleton", "selected", "values", "maxWidth", "horizontal", "onChange", "tooltipText", "helperText"];
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/require-default-props */
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
const useStyles = (0, _styles.makeStyles)(muiTheme =>
// eslint-disable-next-line implicit-arrow-linebreak
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
}));
const SidebarFilter = props => {
  const classes = useStyles(_Theme.default);
  const {
      title,
      skeleton,
      selected,
      values,
      maxWidth,
      horizontal,
      onChange,
      tooltipText,
      helperText
    } = props,
    otherProps = _objectWithoutPropertiesLoose(props, _excluded);
  const [instanceId] = (0, _reactIdGenerator.useId)();
  const selectSeleniumId = "sidebar-filter-select-selenium-".concat(instanceId);
  const inputId = "sidebar-filter-input-".concat(instanceId);
  const labelId = "sidebar-filter-label-".concat(instanceId);

  // SANITY CHECK: Render nothing if there are no releases and null release is excluded
  const optionCount = values.length + (values ? 0 : 1);
  if (!optionCount) {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
  }
  const handleChange = nextValue => onChange(nextValue);
  const maxWidthStyle = maxWidth ? {
    maxWidth: "".concat(maxWidth, "px")
  } : {};
  const input = /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
    id: inputId,
    name: inputId,
    margin: "dense",
    className: classes.selectInput,
    style: maxWidthStyle
  });

  /* eslint-disable react/jsx-one-expression-per-line */
  const tooltip = !(0, _typeUtil.isStringNonEmpty)(tooltipText) ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null) : /*#__PURE__*/_react.default.createElement("div", null, tooltipText);
  /* eslint-enable react/jsx-one-expression-per-line */
  const titleNode = !title ? null : /*#__PURE__*/_react.default.createElement("div", {
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
  }))));

  // Render skeleton
  if (skeleton) {
    const skeletonStyle = {
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
  const selectNode = /*#__PURE__*/_react.default.createElement(_Select.default, {
    "data-selenium": selectSeleniumId,
    value: selected,
    onChange: event => handleChange(event.target.value),
    input: input,
    "aria-labelledby": labelId,
    disabled: optionCount < 2
  }, values.map(option => /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    key: option.value,
    value: option.value
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    display: "block"
  }, option.title)))));
  const renderHelperText = () => {
    if (!(0, _typeUtil.isStringNonEmpty)(helperText)) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.descriptionContainer
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      className: classes.description
    }, helperText));
  };

  // Final Render
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
var _default = exports.default = SidebarFilter;