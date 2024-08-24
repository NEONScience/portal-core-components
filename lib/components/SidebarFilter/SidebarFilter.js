"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _OutlinedInput = _interopRequireDefault(require("@mui/material/OutlinedInput"));
var _Select = _interopRequireDefault(require("@mui/material/Select"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _styles = require("@mui/styles");
var _Skeleton = _interopRequireDefault(require("@mui/material/Skeleton"));
var _InfoOutlined = _interopRequireDefault(require("@mui/icons-material/InfoOutlined"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/require-default-props */

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
    helperText,
    ...otherProps
  } = props;
  const instanceId = (0, _react.useId)();
  const selectSeleniumId = `sidebar-filter-select-selenium-${instanceId}`;
  const inputId = `sidebar-filter-input-${instanceId}`;
  const labelId = `sidebar-filter-label-${instanceId}`;

  // SANITY CHECK: Render nothing if there are no releases and null release is excluded
  const optionCount = values.length + (values ? 0 : 1);
  if (!optionCount) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {});
  }
  const handleChange = nextValue => onChange(nextValue);
  const maxWidthStyle = maxWidth ? {
    maxWidth: `${maxWidth}px`
  } : {};
  const input = /*#__PURE__*/(0, _jsxRuntime.jsx)(_OutlinedInput.default, {
    id: inputId,
    name: inputId,
    size: "small",
    className: classes.selectInput,
    style: maxWidthStyle
  });

  /* eslint-disable react/jsx-one-expression-per-line */
  const tooltip = !(0, _typeUtil.isStringNonEmpty)(tooltipText) ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {}) : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    children: tooltipText
  });
  /* eslint-enable react/jsx-one-expression-per-line */
  const titleNode = !title ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: classes.titleContainer,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "h5",
      component: "h3",
      className: classes.title,
      id: labelId,
      children: title
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      placement: "right",
      title: tooltip,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
        size: "small",
        style: {
          marginLeft: _Theme.default.spacing(0.5)
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_InfoOutlined.default, {
          fontSize: "small"
        })
      })
    })]
  });

  // Render skeleton
  if (skeleton) {
    const skeletonStyle = {
      marginBottom: _Theme.default.spacing(1)
    };
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      ...otherProps,
      style: {
        maxWidth: `${maxWidth}px`,
        overflow: 'hidden'
      },
      children: [titleNode, /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
        variant: "rectangular",
        width: maxWidth,
        height: 36,
        style: skeletonStyle
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
        width: "70%",
        height: 16,
        style: skeletonStyle
      })]
    });
  }
  const selectNode = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Select.default, {
    "data-selenium": selectSeleniumId,
    value: selected,
    onChange: event => handleChange(event.target.value),
    input: input,
    "aria-labelledby": labelId,
    disabled: optionCount < 2,
    children: values.map(option => /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
      value: option.value,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          display: "block",
          children: option.title
        })
      })
    }, option.value))
  });
  const renderHelperText = () => {
    if (!(0, _typeUtil.isStringNonEmpty)(helperText)) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {});
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.descriptionContainer,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "caption",
        className: classes.description,
        children: helperText
      })
    });
  };

  // Final Render
  return horizontal ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    ...otherProps,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      children: titleNode
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.horizontalFlex,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        style: maxWidth ? {
          width: `${maxWidth}px`
        } : {},
        children: selectNode
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.horizontalDescriptions,
        children: renderHelperText()
      })]
    })]
  }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    ...otherProps,
    style: {
      width: '100%',
      ...maxWidthStyle
    },
    children: [titleNode, selectNode, renderHelperText()]
  });
};
var _default = exports.default = SidebarFilter;