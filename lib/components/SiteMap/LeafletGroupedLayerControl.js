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
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
require("./leaflet-grouped-layer-control.css");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
  const divRef = (0, _react.useRef)(null);
  const map = (0, _reactLeaflet.useMap)();
  const isPortalMode = renderToLeafletControlContainer === true;
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
  const handleOverlayChanged = (event, selectedOverlay, selectedGroup, exclusive) => {
    const targetElement = event.target;
    const isExclusive = exclusive === 'exclusive';
    const newOverlays = (overlays || []).map(overlay => {
      const groupMatches = overlay.groupTitle === selectedGroup;
      const nameMatchesSelected = overlay.name === selectedOverlay.name;
      const determineChecked = isExclusive ? groupMatches : groupMatches && nameMatchesSelected;
      if (determineChecked) {
        const applyChecked = isExclusive ? nameMatchesSelected : nameMatchesSelected && targetElement.checked;
        return {
          ...overlay,
          checked: applyChecked
        };
      }
      return overlay;
    });
    if (onOverlayChange) {
      onOverlayChange(newOverlays);
    }
  };
  (0, _react.useEffect)(() => {
    if (!divRef.current) return;
    _leaflet.default.DomEvent.disableClickPropagation(divRef.current);
    _leaflet.default.DomEvent.disableScrollPropagation(divRef.current);
    const containerRect = map.getContainer().getBoundingClientRect();
    const divRect = divRef.current.getBoundingClientRect();
    const maxHeight = `${Math.floor((containerRect.bottom - divRect.y) * 0.95)}px`;
    divRef.current.style.maxHeight = maxHeight;
  }, [map, divRef]);
  const renderBaseLayerGroup = () => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "rlglc-group",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      className: "rlglc-groupTitle",
      variant: "h6",
      children: "Base Layers"
    }, "title-baselayer"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControl.default, {
      fullWidth: true,
      size: "small",
      margin: "dense",
      style: {
        marginTop: '4px',
        marginBottom: '0px'
      },
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
          exclusive: undefined,
          groupItems: []
        };
      }
      if (!groupAcc[groupKey].exclusive) {
        // eslint-disable-next-line no-param-reassign
        groupAcc[groupKey].exclusive = exclusiveGroups && exclusiveGroups.includes(groupKey);
      }
      groupAcc[groupKey].groupItems.push(overlay);
      return groupAcc;
    }, {});
    const groupTitles = Array.from(new Set(overlays.map(o => o.groupTitle)));
    const renderedGroups = groupTitles.reduce((groupNodes, groupTitle) => {
      const {
        groupItems
      } = groups[groupTitle];
      const isExclusiveGroup = exclusiveGroups && exclusiveGroups.includes(groupTitle);
      const exclusiveParam = isExclusiveGroup ? 'exclusive' : 'nonExclusive';
      let selectedOverlay;
      const groupElements = groupItems.map(overlay => {
        if (isExclusiveGroup) {
          if (overlay.checked) {
            selectedOverlay = overlay;
          }
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControlLabel.default, {
            value: overlay.name,
            control: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Radio.default, {
              size: "small"
            }),
            label: overlay.title
          }, `${groupTitle}-${overlay.name}`);
        }
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControlLabel.default, {
          label: overlay.title,
          control: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Checkbox.default, {
            size: "small",
            checked: overlay.checked,
            onChange: event => {
              handleOverlayChanged(event, overlay, groupTitle, exclusiveParam);
            }
          })
        }, `${groupTitle}-${overlay.name}`);
      });
      const renderControlGroup = () => {
        if (isExclusiveGroup) {
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControl.default, {
            fullWidth: true,
            size: "small",
            margin: "dense",
            style: {
              marginTop: '4px',
              marginBottom: '0px'
            },
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_RadioGroup.default, {
              name: groupTitle,
              value: selectedOverlay?.name || null,
              onChange: event => {
                const nextSelected = groupItems.find(overlay => overlay.name === event.target.value);
                if (nextSelected) {
                  handleOverlayChanged(event, nextSelected, groupTitle, exclusiveParam);
                }
              },
              children: groupElements
            })
          });
        }
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormGroup.default, {
          style: {
            marginTop: '4px',
            marginBottom: '0px'
          },
          children: groupElements
        });
      };
      const groupContainer = /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "rlglc-group",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          className: "rlglc-groupTitle",
          variant: "h6",
          children: groupTitle
        }, `title-${groupTitle}`), renderControlGroup()]
      }, groupTitle);
      return [...groupNodes, groupContainer];
    }, []);
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Divider.default, {
        style: {
          margin: '10px 0px'
        }
      }), renderedGroups]
    });
  };
  const controlPositionClass = getControlClassFromPosition(position);
  const containerNode = map.getContainer();
  const portalNodes = containerNode.getElementsByClassName(controlPositionClass);
  const hasPortalNode = (0, _typeUtil.exists)(portalNodes) && portalNodes.length > 0 && (0, _typeUtil.exists)(portalNodes[0]);
  const borderStyle = open ? `1px solid ${_Theme.default.palette.grey[300]}` : `1px solid ${_Theme.default.colors.LIGHT_BLUE[500]}`;
  const renderContent = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "rlglc-wrap leaflet-control",
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      ref: divRef,
      className: `rlglc${open ? ' rlglc-active' : ''}`,
      style: {
        border: borderStyle
      },
      onMouseEnter: handleMainDivMouseEnter,
      onMouseLeave: handleMainDivMouseLeave,
      children: [open ? null :
      /*#__PURE__*/
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      (0, _jsxRuntime.jsx)(_Link.default, {
        className: "rlglc-a",
        component: "button",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactFontawesome.FontAwesomeIcon, {
          style: {
            verticalAlign: 'middle'
          },
          size: "2x",
          icon: _freeSolidSvgIcons.faLayerGroup
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: open ? 'rlglc-controls rlglc-open' : 'rlglc-controls rlglc-close',
        style: {
          padding: _Theme.default.spacing(2)
        },
        children: [renderBaseLayerGroup(), renderOverlayGroups()]
      })]
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