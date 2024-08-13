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
var _typeUtil = require("../../util/typeUtil");
require("./leaflet-grouped-layer-control.css");
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
const ListItem = props => {
  const {
    groupName,
    item,
    type,
    checked,
    onClick
  } = props;
  const handleOnClick = event => {
    if (type === 'radio' && !checked) {
      onClick(event, item);
    } else {
      onClick(event, item);
    }
  };
  return /*#__PURE__*/_react.default.createElement("label", {
    htmlFor: item.name,
    className: "rlglc-option"
  }, /*#__PURE__*/_react.default.createElement("input", {
    id: item.name,
    value: item.name,
    name: groupName,
    className: "rlglc-input",
    type: type,
    checked: checked,
    readOnly: true,
    onClick: handleOnClick || (() => {})
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "rlglc-title"
  }, item.title));
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
  const handleBaseLayerChange = (event, layer) => {
    if (onBaseLayerChange) {
      onBaseLayerChange(layer.name);
    }
  };
  const handleOverlayChanged = (event, selectedOverlay, exclusive) => {
    const targetElement = event.target;
    const isExclusive = exclusive === 'exclusive';
    const newOverlays = (overlays || []).map(overlay => {
      const groupMatches = overlay.groupTitle === targetElement.name;
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
  const renderBaseLayerGroup = () => /*#__PURE__*/_react.default.createElement("div", {
    key: "baselayer",
    className: "rlglc-group"
  }, /*#__PURE__*/_react.default.createElement("span", {
    key: "title-baselayer",
    className: "rlglc-grouptitle"
  }, "Base Layers"), baseLayers.map((baseLayer, index) => /*#__PURE__*/_react.default.createElement(ListItem
  // eslint-disable-next-line react/no-array-index-key
  , {
    key: `${baseLayer.name}-${index}`,
    type: "radio",
    groupName: "baselayer",
    item: baseLayer,
    checked: baseLayer.name === checkedBaseLayer,
    onClick: handleBaseLayerChange
  })));
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
      const listItemType = isExclusiveGroup ? 'radio' : 'checkbox';
      const groupElements = groupItems.map((overlay, index) => /*#__PURE__*/_react.default.createElement(ListItem
      // eslint-disable-next-line react/no-array-index-key
      , {
        key: `${groupTitle}=${overlay.name}-${index}`,
        type: listItemType,
        groupName: groupTitle,
        item: overlay,
        checked: overlay.checked,
        onClick: (event, item) => handleOverlayChanged(event, item, exclusiveParam)
      }));
      const groupContainer = /*#__PURE__*/_react.default.createElement("div", {
        key: groupTitle,
        className: "rlglc-group"
      }, /*#__PURE__*/_react.default.createElement("span", {
        key: `title-${groupTitle}`,
        className: "rlglc-grouptitle"
      }, groupTitle), groupElements);
      return [...groupNodes, groupContainer];
    }, []);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "rlglc-seperator"
    }), renderedGroups);
  };
  const controlPositionClass = getControlClassFromPosition(position);
  const containerNode = map.getContainer();
  const portalNodes = containerNode.getElementsByClassName(controlPositionClass);
  const hasPortalNode = (0, _typeUtil.exists)(portalNodes) && portalNodes.length > 0 && (0, _typeUtil.exists)(portalNodes[0]);
  const renderContent = () => /*#__PURE__*/_react.default.createElement("div", {
    className: "rlglc-wrap leaflet-control"
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: divRef,
    className: `rlglc${open ? ' rlglc-active' : ''}`,
    onMouseEnter: handleMainDivMouseEnter,
    onMouseLeave: handleMainDivMouseLeave
  }, /*#__PURE__*/_react.default.createElement("a", {
    className: "rlglc-a"
  }, open ? null : /*#__PURE__*/_react.default.createElement(_reactFontawesome.FontAwesomeIcon, {
    style: {
      marginTop: '6px'
    },
    size: "2x",
    icon: _freeSolidSvgIcons.faLayerGroup
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: open ? 'rlglc-open' : 'rlglc-close'
  }, renderBaseLayerGroup(), renderOverlayGroups()))));
  const render = () => {
    if (isPortalMode && hasPortalNode) {
      return /*#__PURE__*/(0, _reactDom.createPortal)(renderContent(), portalNodes[0]);
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: controlPositionClass
    }, renderContent());
  };
  return render();
};
var _default = exports.default = LeafletGroupedLayerControl;