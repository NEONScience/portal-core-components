"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactDom = require("react-dom");
var _leaflet = _interopRequireDefault(require("leaflet"));
var _reactLeaflet = require("react-leaflet");
var _reactFontawesome = require("@fortawesome/react-fontawesome");
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
var _Checkbox = _interopRequireDefault(require("@mui/material/Checkbox"));
var _Divider = _interopRequireDefault(require("@mui/material/Divider"));
var _FormControlLabel = _interopRequireDefault(require("@mui/material/FormControlLabel"));
var _FormControl = _interopRequireDefault(require("@mui/material/FormControl"));
var _FormGroup = _interopRequireDefault(require("@mui/material/FormGroup"));
var _Link = _interopRequireDefault(require("@mui/material/Link"));
var _Radio = _interopRequireDefault(require("@mui/material/Radio"));
var _RadioGroup = _interopRequireDefault(require("@mui/material/RadioGroup"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _styles = require("@mui/styles");
var _styles2 = require("@mui/material/styles");
var _typeUtil = require("../../util/typeUtil");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const useStyles = open => (0, _styles.makeStyles)(theme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  leafletControlContainer: {
    zIndex: 801,
    boxShadow: 'unset',
    margin: '0px !important',
    left: '8px',
    top: '8px',
    fontFamily: theme.typography.fontFamily
  },
  controlContainer: {
    backgroundColor: '#ffffff',
    cursor: 'default',
    borderRadius: '2px',
    display: 'flex',
    zIndex: 802,
    border: open ? `1px solid ${theme.palette.grey[300]}` : `1px solid ${theme.colors.LIGHT_BLUE[500]}`
  },
  controlIconContainer: {
    width: '36px !important',
    height: '36px !important'
  },
  controlIcon: {
    verticalAlign: 'center'
  },
  controls: {
    padding: theme.spacing(2),
    overflowY: 'auto'
  },
  formGroupControl: {
    marginTop: '4px',
    marginBottom: '0px'
  },
  controlGroupDivider: {
    margin: '10px 0px'
  },
  groupTitle: {
    fontWeight: 600
  }
}));
var OverlayGroupType = /*#__PURE__*/function (OverlayGroupType) {
  OverlayGroupType["EXCLUSIVE"] = "EXCLUSIVE";
  OverlayGroupType["NON_EXCLUSIVE"] = "NON_EXCLUSIVE";
  return OverlayGroupType;
}(OverlayGroupType || {});
const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right'
};
const getControlClassFromPosition = position => {
  if (!(0, _typeUtil.exists)(position)) {
    return POSITION_CLASSES.topright;
  }
  return POSITION_CLASSES[position];
};
const LeafletGroupedLayerControl = props => {
  const {
    position,
    baseLayers,
    checkedBaseLayer,
    exclusiveGroups,
    overlays,
    renderToLeafletControlContainer,
    onBaseLayerChange,
    onOverlayChange
  } = props;
  const [open, setOpen] = (0, _react.useState)(false);
  const theme = (0, _styles2.useTheme)();
  const classes = useStyles(open)(theme);
  const divRef = (0, _react.useRef)(null);
  const map = (0, _reactLeaflet.useMap)();
  const isPortalMode = renderToLeafletControlContainer === true;
  const controlPositionClass = getControlClassFromPosition(position);
  const containerNode = map.getContainer();
  const portalNodes = containerNode.getElementsByClassName(controlPositionClass);
  const hasPortalNode = (0, _typeUtil.exists)(portalNodes) && portalNodes.length > 0 && (0, _typeUtil.exists)(portalNodes[0]);
  const handleMainDivMouseEnter = () => {
    if (!open) {
      setOpen(true);
    }
  };
  const handleMainDivMouseLeave = () => {
    setOpen(false);
  };
  const handleBaseLayerChange = event => {
    if (onBaseLayerChange) {
      onBaseLayerChange(event.target.value);
    }
  };
  const handleOverlayChanged = (eventOverlay, isSelected, eventGroup, groupType) => {
    const isExclusive = groupType === OverlayGroupType.EXCLUSIVE;
    const newOverlays = (overlays || []).map(overlay => {
      const groupMatches = overlay.groupTitle === eventGroup;
      if (!groupMatches) {
        return overlay;
      }
      const nameMatchesSelected = overlay.name === eventOverlay.name;
      if (isExclusive) {
        // When radio selection, apply checked to matched name,
        // not checked to all others.
        return {
          ...overlay,
          checked: nameMatchesSelected
        };
      }
      if (nameMatchesSelected) {
        // When checkbox selection and on the selected
        // overlay, apply opposite of selected overlay checked state.
        return {
          ...overlay,
          checked: !isSelected
        };
      }
      // When checkbox selection and not on the selected
      // overlay, do not modify.
      return overlay;
    });
    if (onOverlayChange) {
      onOverlayChange(newOverlays);
    }
  };
  (0, _react.useEffect)(() => {
    if (!divRef.current) {
      return;
    }
    _leaflet.default.DomEvent.disableClickPropagation(divRef.current);
    _leaflet.default.DomEvent.disableScrollPropagation(divRef.current);
    const containerRect = map.getContainer().getBoundingClientRect();
    const divRect = divRef.current.getBoundingClientRect();
    const maxHeight = `${Math.floor((containerRect.bottom - divRect.y) * 0.95)}px`;
    divRef.current.style.maxHeight = maxHeight;
  }, [map, divRef]);
  const renderBaseLayerGroup = () => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      className: classes.groupTitle,
      variant: "h6",
      children: "Base Layers"
    }, "title-baselayer"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControl.default, {
      fullWidth: true,
      size: "small",
      margin: "dense",
      className: classes.formGroupControl,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_RadioGroup.default, {
        name: "baselayer",
        value: checkedBaseLayer,
        onChange: handleBaseLayerChange,
        children: baseLayers.map(baseLayer => /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControlLabel.default, {
          value: baseLayer.name,
          control: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Radio.default, {
            size: "small"
          }),
          label: baseLayer.title
        }, `baselayer-${baseLayer.name}`))
      })
    })]
  }, "baselayer");
  const renderOverlayGroups = () => {
    if (!overlays || overlays.length <= 0) {
      return null;
    }
    const groups = overlays.reduce((groupAcc, overlay) => {
      const groupKey = overlay.groupTitle;
      if (!groupAcc[groupKey]) {
        // eslint-disable-next-line no-param-reassign
        groupAcc[groupKey] = {
          exclusive: exclusiveGroups && exclusiveGroups.includes(groupKey),
          groupItems: []
        };
      }
      groupAcc[groupKey].groupItems.push(overlay);
      return groupAcc;
    }, {});
    const groupTitles = Array.from(new Set(overlays.map(o => o.groupTitle)));
    const renderedGroups = groupTitles.map(groupTitle => {
      const {
        groupItems,
        exclusive
      } = groups[groupTitle];
      const isExclusiveGroup = exclusive === true;
      const exclusiveParam = isExclusiveGroup ? OverlayGroupType.EXCLUSIVE : OverlayGroupType.NON_EXCLUSIVE;
      let selectedOverlay;
      const groupElements = groupItems.map(overlay => {
        if (isExclusiveGroup && overlay.checked) {
          selectedOverlay = overlay;
        }
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControlLabel.default, {
          value: isExclusiveGroup ? overlay.name : undefined,
          label: overlay.title,
          control: isExclusiveGroup ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Radio.default, {
            size: "small"
          }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Checkbox.default, {
            size: "small",
            checked: overlay.checked,
            onChange: () => {
              handleOverlayChanged(overlay, overlay.checked, groupTitle, exclusiveParam);
            }
          })
        }, `${groupTitle}-${overlay.name}`);
      });
      const renderControlGroup = () => {
        if (!isExclusiveGroup) {
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormGroup.default, {
            className: classes.formGroupControl,
            children: groupElements
          });
        }
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControl.default, {
          fullWidth: true,
          size: "small",
          margin: "dense",
          className: classes.formGroupControl,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_RadioGroup.default, {
            name: groupTitle,
            value: selectedOverlay?.name || null,
            onChange: event => {
              const nextSelected = groupItems.find(overlay => overlay.name === event.target.value);
              if (nextSelected) {
                let isSelected = false;
                const currentSelectedName = selectedOverlay?.name || null;
                if (currentSelectedName) {
                  isSelected = currentSelectedName === nextSelected.name;
                }
                handleOverlayChanged(nextSelected, isSelected, groupTitle, exclusiveParam);
              }
            },
            children: groupElements
          })
        });
      };
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          className: classes.groupTitle,
          variant: "h6",
          children: groupTitle
        }), renderControlGroup()]
      }, groupTitle);
    });
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Divider.default, {
        className: classes.controlGroupDivider
      }), renderedGroups]
    });
  };
  const renderContent = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: `leaflet-control ${classes.leafletControlContainer}`,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      ref: divRef,
      className: classes.controlContainer,
      onMouseEnter: handleMainDivMouseEnter,
      onMouseLeave: handleMainDivMouseLeave,
      children: !open ?
      /*#__PURE__*/
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      (0, _jsxRuntime.jsx)(_Link.default, {
        className: classes.controlIconContainer,
        component: "button",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactFontawesome.FontAwesomeIcon, {
          className: classes.controlIcon,
          size: "2x",
          icon: _freeSolidSvgIcons.faLayerGroup
        })
      }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.controls,
        children: [renderBaseLayerGroup(), renderOverlayGroups()]
      })
    })
  });
  const render = () => {
    if (isPortalMode && hasPortalNode) {
      return /*#__PURE__*/(0, _reactDom.createPortal)(renderContent(), portalNodes[0]);
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: controlPositionClass,
      children: renderContent()
    });
  };
  return render();
};
var _default = exports.default = LeafletGroupedLayerControl;