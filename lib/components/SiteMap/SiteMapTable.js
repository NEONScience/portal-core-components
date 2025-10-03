"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTestableItems = exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _styles = require("@material-ui/core/styles");
var _Box = _interopRequireDefault(require("@material-ui/core/Box"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _InfoOutlined = _interopRequireDefault(require("@material-ui/icons/InfoOutlined"));
var _materialTable = _interopRequireWildcard(require("material-table"));
var _MaterialTableIcons = _interopRequireDefault(require("../MaterialTableIcons/MaterialTableIcons"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
var _SiteMapContext = _interopRequireDefault(require("./SiteMapContext"));
var _SiteMapUtils = require("./SiteMapUtils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable jsx-a11y/anchor-is-valid */
const ucWord = function () {
  let word = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return "".concat(word.slice(0, 1).toUpperCase()).concat(word.slice(1).toLowerCase());
};

/**
 * Parse an input search string into discrete terms.
 * Supports quoting words together as a single term.
 * Example: '"foo bar" baz' => ['foo bar', 'baz']
 * @param {string} input - string to parse into discrete terms
 */
const parseSearchTerms = input => {
  const terms = input.replace(/[^\w\s."]/g, '').match(/(".*?"|[^" \s]+)(?=\s* |\s*$)/g);
  return (terms || []).map(term => term.replace(/"/g, '').toLowerCase());
};

/**
 * Apply a searchString to a list of string attributes; return boolean for a match
 */
const searchOnAttribs = function (searchString) {
  let searchableAttribs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  const searchTerms = parseSearchTerms(searchString);
  if (!searchTerms.length) {
    return true;
  }
  return searchTerms.some(term => searchableAttribs.some(attrib => (attrib || '').toLowerCase().includes(term)));
};
const getFeatureName = featureKey => {
  if (_SiteMapUtils.FEATURES[featureKey]) {
    return _SiteMapUtils.FEATURES[featureKey].nameSingular || _SiteMapUtils.FEATURES[featureKey].name || featureKey;
  }
  return featureKey;
};
const calculateMaxBodyHeight = tableRef => {
  if (!tableRef || !tableRef.current) {
    return _SiteMapUtils.MIN_TABLE_MAX_BODY_HEIGHT;
  }
  const containerHeight = tableRef.current.clientHeight || 0;
  const toolbarHeight = tableRef.current.children[0].children[0].clientHeight || 0;
  const pagerHeight = tableRef.current.children[0].children[2].clientHeight || 0;
  return Math.max(containerHeight - toolbarHeight - pagerHeight, _SiteMapUtils.MIN_TABLE_MAX_BODY_HEIGHT);
};
const EXPORT_FILENAME = 'NEON-SiteMap-Table';
const exportCsv = function () {
  let columns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let rows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (!columns.length || !rows.length) {
    return;
  }
  const columnHeaders = columns.reduce((acc, cur) => {
    if (Array.isArray(cur.csvFields)) {
      cur.csvFields.forEach(field => {
        acc.push(field);
      });
    } else {
      acc.push(cur.field);
    }
    return acc;
  }, []);
  const payloadRows = [columnHeaders.join(',')];
  rows.forEach(row => {
    const payloadRow = [];
    columns.forEach(column => {
      const render = typeof column.csvRender === 'function' ? column.csvRender : r => r[column.field] || null;
      payloadRow.push([render(row)].flat().map(value => {
        if (value === null || typeof value === 'undefined' || Number.isNaN(value)) {
          return '';
        }
        if (/["',\s]/.test(value.toString())) {
          return "\"".concat(value.toString().replace(/"/g, '""'), "\"");
        }
        return value;
      }).join(','));
    });
    payloadRows.push(payloadRow.join(','));
  });
  const payload = payloadRows.join('\n');
  const mimeType = 'text/csv;charset=utf-8';
  const fileName = "".concat(EXPORT_FILENAME, ".csv");
  if (navigator.msSaveBlob) {
    // IE10+
    navigator.msSaveBlob(new Blob([payload], {
      type: mimeType
    }), fileName);
  } else {
    const link = document.createElement('a');
    if (URL && typeof URL.createObjectURL === 'function') {
      link.href = URL.createObjectURL(new Blob([payload], {
        type: mimeType
      }));
    } else {
      link.setAttribute('href', "data:".concat(mimeType, ",").concat(encodeURI(payload)));
    }
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
const useStyles = (0, _styles.makeStyles)(theme => ({
  tableContainer: {
    backgroundColor: 'white',
    overflowWrap: 'normal',
    '& table': {
      margin: '0px !important',
      borderCollapse: 'separate',
      '& tr.MuiTableRow-root:empty': {
        height: '0px !important'
      },
      '& tr.MuiTableRow-head': {
        backgroundColor: theme.palette.primary.main,
        '& th:first-child span.MuiCheckbox-root': {
          margin: theme.spacing(0, 0.5),
          backgroundColor: '#ffffff88',
          '&:hover': {
            backgroundColor: '#ffffffaa'
          }
        }
      },
      '& tbody tr:first-child': {
        backgroundColor: theme.palette.grey[50]
      },
      '& tfoot': {
        paddingRight: '36px'
      }
    },
    '& td.MuiTablePagination-root': {
      borderBottom: 'none'
    }
  },
  tableContainerIntegrated: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  tableContainerStandalone: {
    // ...
  },
  featureIcon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
    filter: 'drop-shadow(0px 0px 1.5px #000000bb)'
  },
  linkButton: {
    textAlign: 'left'
  },
  downloadCsvButton: {
    marginRight: theme.spacing(2)
  },
  startFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  endFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  toolbarContainer: {
    backgroundColor: theme.palette.grey[50],
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(4.5)
    },
    '& div.MuiToolbar-root': {
      width: '100%',
      padding: theme.spacing(0, 0, 0, 2),
      backgroundColor: theme.palette.grey[50]
    },
    // Make the columns button more prominent (really hard to do with component overriding)
    '& button': {
      color: theme.palette.primary.main,
      '&:hover, &:active': {
        color: _Theme.COLORS.LIGHT_BLUE[400],
        border: "1px solid ".concat(_Theme.COLORS.LIGHT_BLUE[400]),
        backgroundColor: "".concat(_Theme.COLORS.LIGHT_BLUE[400], "20"),
        padding: '11px'
      }
    }
  },
  toolbarContainerNoSplit: {
    '& div.MuiToolbar-root': {
      width: 'calc(100% - 244px)'
    },
    // This hides all but the search input, show columns, and export buttons.
    // No other way to have material table NOT show a selection title in the toolbar.
    '& div.MuiToolbar-root > div:not(:nth-last-child(-n+2))': {
      display: 'none'
    }
  },
  toggleButtonGroup: {
    height: theme.spacing(4)
  },
  toggleButton: {
    height: theme.spacing(4),
    fontWeight: 600,
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    padding: theme.spacing(0, 1.5),
    whiteSpace: 'nowrap'
  },
  // Use !important here to override the Mui-selected class with higher priority
  toggleButtonSelected: {
    color: '#fff !important',
    backgroundColor: "".concat(theme.palette.primary.main, " !important")
  },
  caption: {
    fontFamily: 'monospace',
    fontSize: '1.05em',
    whiteSpace: 'nowrap'
  },
  iconButton: {
    marginTop: theme.spacing(-0.25)
  },
  siteName: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: theme.spacing(1, 0, 0.5, 0),
    minWidth: '240px',
    textAlign: 'left'
  },
  siteLinksDivider: {
    margin: theme.spacing(0, 1, 0, 1)
  },
  siteDetailsLink: {
    fontSize: '80%',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  nlcdClassContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  nlcdClass: {
    width: '14px',
    height: '14px',
    border: '1px solid black',
    marginRight: theme.spacing(1.5)
  },
  tableTitle: {
    '& h6': {
      fontSize: '1.2rem',
      fontWeight: 500
    }
  },
  paginationRoot: {
    width: 'auto'
  }
}));
const SiteMapTable = () => {
  const classes = useStyles(_Theme.default);
  const tableRef = (0, _react.useRef)(null);

  // Neon Context State
  const [{
    isFinal,
    hasError
  }] = _NeonContext.default.useNeonContextState();
  const canRender = isFinal && !hasError;

  // Site Map State
  const [state, dispatch] = _SiteMapContext.default.useSiteMapContext();
  const {
    manualLocationData,
    view: {
      current: view,
      initialized: viewsInitialized
    }
  } = state;
  const {
    focus,
    fullHeight,
    maxBodyHeight,
    maxBodyHeightUpdateFromAspectRatio
  } = state.table;
  const {
    set: selection,
    validSet: selectableItems,
    hideUnselectable
  } = state.selection;
  const selectionActive = state.selection.active === focus;

  /**
    Effect - Initialize table if this is the first time we're seeing it
  */
  (0, _react.useEffect)(() => {
    if (!tableRef || !tableRef.current || view !== _SiteMapUtils.VIEWS.TABLE || viewsInitialized[_SiteMapUtils.VIEWS.TABLE]) {
      return;
    }
    dispatch({
      type: 'setViewInitialized'
    });
    dispatch({
      type: 'setTableMaxBodyHeight',
      height: calculateMaxBodyHeight(tableRef)
    });
  }, [tableRef, view, viewsInitialized, dispatch]);

  /**
    Effect - Recalculate the max body height from an aspect ratio change (e.g. page resize)
  */
  (0, _react.useEffect)(() => {
    if (view === _SiteMapUtils.VIEWS.TABLE && viewsInitialized[_SiteMapUtils.VIEWS.TABLE] && maxBodyHeightUpdateFromAspectRatio) {
      dispatch({
        type: 'setTableMaxBodyHeight',
        height: calculateMaxBodyHeight(tableRef)
      });
    }
  }, [tableRef, view, viewsInitialized, dispatch, maxBodyHeightUpdateFromAspectRatio]);

  /**
    Layout Effect - Inject a second horizontal scrollbar above the table linked to the main
  */
  (0, _react.useLayoutEffect)(() => {
    const noop = () => {};
    // This all only applies to full height table and/or split view (which behaves as full height)
    if (!fullHeight && view !== _SiteMapUtils.VIEWS.SPLIT) {
      return noop;
    }
    // Collect the nodes we pay attention to. Each one has a distinct purpose.
    const tableNode = tableRef.current.querySelector('table');
    if (!tableNode) {
      return noop;
    }
    const tbodyNode = tableRef.current.querySelector('tbody');
    if (!tbodyNode) {
      return noop;
    }
    const scrollingNode = (tableNode.parentElement || {}).parentElement;
    if (!scrollingNode) {
      return noop;
    }
    const containerNode = scrollingNode.parentElement;
    if (!containerNode) {
      return noop;
    }
    // Initialize the new scrollbar in this scope
    let scrollbar = null;
    // Function to do the initial injection fo the scrollbar node
    const injectScrollbar = () => {
      scrollbar = document.createElement('div');
      scrollbar.appendChild(document.createElement('div'));
      scrollbar.style.overflow = 'auto';
      scrollbar.style.overflowY = 'hidden';
      // eslint-disable-next-line prefer-destructuring
      scrollbar.style.backgroundColor = _Theme.default.palette.grey[50];
      scrollbar.firstChild.style.width = "".concat(tableNode.scrollWidth || 0, "px");
      scrollbar.firstChild.style.paddingTop = '1px';
      scrollbar.onscroll = () => {
        scrollingNode.scrollLeft = scrollbar.scrollLeft;
      };
      scrollingNode.onscroll = () => {
        scrollbar.scrollLeft = scrollingNode.scrollLeft;
      };
      containerNode.parentNode.insertBefore(scrollbar, containerNode);
    };
    // Function to resize the scrollbar. We can't rely on the scrollWidth being accurate when we
    // inject as not-yet-fully-rendered table rows may expand the scrollWidth.
    const resizeScrollbar = () => {
      if (!scrollbar) {
        return;
      }
      scrollbar.firstChild.style.width = "".concat(tableNode.scrollWidth || 0, "px");
      scrollbar.scrollLeft = scrollingNode.scrollLeft;
    };
    // Inject the scrollbar one step removed from the initial render cycle (with a 0-sec timeout)
    const timeout = window.setTimeout(injectScrollbar, 0);
    // Observe the childList of the tbody - i.e. rows being added or removed - to trigger a resize
    // of the injected scrollbar
    const observer = new MutationObserver(resizeScrollbar);
    observer.observe(tbodyNode, {
      childList: true
    });
    // Clear any pending timeouts and disconnect our observer on unload to avoid memory leaks
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [tableRef, fullHeight, view]);
  if (!canRender) {
    return null;
  }

  // Selection functions
  let rowIsSelected = () => false;
  let rowIsSelectable = () => false;
  switch (focus) {
    case _SiteMapUtils.FEATURE_TYPES.SITES.KEY:
      rowIsSelected = row => selection.has(row.siteCode);
      rowIsSelectable = row => !selectableItems || selectableItems.has(row.siteCode);
      break;
    default:
      break;
  }

  // Jump-To function to turn location names in the table to map navigation
  const jumpTo = function () {
    let locationCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    dispatch({
      type: 'setNewFocusLocation',
      location: locationCode
    });
  };

  // While sites keep a state and domain code locations only keep a site code.
  // These helper functions will connect the dots to to get site/state/domain/etc. for a location.
  const getParent = (type, location) => {
    let source = null;
    if (type === 'SITE') {
      let data = state.sites;
      if (Array.isArray(manualLocationData) && manualLocationData.length) {
        data = {};
        manualLocationData.forEach(ml => {
          const {
            siteCode
          } = ml;
          data[siteCode] = Object.keys(state.sites).includes(siteCode) ? state.sites[siteCode] : ml;
        });
      }
      source = {
        code: 'siteCode',
        data
      };
    } else if (type === 'STATE') {
      source = {
        code: 'stateCode',
        data: state.featureData.STATES.STATES
      };
    } else if (type === 'DOMAIN') {
      source = {
        code: 'domainCode',
        data: state.featureData.DOMAINS.DOMAINS
      };
    }
    if (!source) {
      return null;
    }
    let code = null;
    if (location[source.code]) {
      code = location[source.code];
    } else if (location.siteCode) {
      code = state.sites[location.siteCode] ? state.sites[location.siteCode][source.code] : null;
    }
    return source.data[code] ? _extends({
      [source.code]: code
    }, source.data[code]) : null;
  };
  const getSite = location => getParent('SITE', location);
  const getState = location => getParent('STATE', location);
  const getDomain = location => getParent('DOMAIN', location);
  const renderFeatureIcon = function (featureKey) {
    let unselectable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!_SiteMapUtils.FEATURES[featureKey] || !_SiteMapUtils.FEATURES[featureKey].iconSvg) {
      return null;
    }
    const {
      iconSvg
    } = _SiteMapUtils.FEATURES[featureKey];
    const style = unselectable ? {
      filter: _SiteMapUtils.UNSELECTABLE_MARKER_FILTER
    } : {};
    return /*#__PURE__*/_react.default.createElement("img", {
      src: iconSvg,
      alt: getFeatureName(featureKey),
      className: classes.featureIcon,
      style: style
    });
  };
  const renderCaptionString = function () {
    let str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '--';
    let ariaLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      "aria-label": ariaLabel,
      className: classes.caption
    }, str);
  };

  /**
     Calculate rows
  */
  const visibleFeatureKeys = Object.keys(state.featureData[focus]).filter(featureKey => state.filters.features.available[featureKey] && state.filters.features.visible[featureKey]);
  const locations = {};
  visibleFeatureKeys.forEach(featureKey => {
    Object.keys(state.featureData[focus][featureKey]).forEach(siteCode => {
      if (focus === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
        locations[siteCode] = state.featureData[focus][featureKey][siteCode];
      }
      if (focus === _SiteMapUtils.FEATURE_TYPES.LOCATIONS.KEY) {
        Object.keys(state.featureData[focus][featureKey][siteCode]).forEach(locationCode => {
          locations[locationCode] = state.featureData[focus][featureKey][siteCode][locationCode];
        });
      }
    });
  });
  let initialRows = (0, _SiteMapUtils.calculateLocationsInBounds)(locations, state.map.bounds);
  if (selectionActive && selectableItems && hideUnselectable) {
    initialRows = initialRows.filter(item => selectableItems.has(item));
  }
  const hasPrototypeSites = (manualLocationData || []).some(ml => ml.manualLocationType === _SiteMapUtils.MANUAL_LOCATION_TYPES.PROTOTYPE_SITE);
  if (hasPrototypeSites) {
    const visibleSites = manualLocationData.map(ml => ml.siteCode);
    initialRows = initialRows.filter(item => visibleSites.includes(item));
  }
  const rows = initialRows.map(key => locations[key]);
  if (selectionActive) {
    rows.forEach((row, idx) => {
      let selected = false;
      if (focus === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
        selected = selection.has(row.siteCode);
      }
      // Implement locations preselection here
      if (!rows[idx].tableData) {
        rows[idx].tableData = {};
      }
      rows[idx].tableData.checked = selected;
    });
  }

  /**
     Unique sites, domains, and states off of rows
  */
  const sitesInMap = Array.from(rows.reduce((acc, cur) => {
    if (cur.siteCode) {
      acc.add(cur.siteCode);
    }
    return acc;
  }, new Set()));
  const domainsInMap = new Set();
  const statesInMap = new Set();
  sitesInMap.filter(siteCode => state.sites[siteCode]).forEach(siteCode => {
    domainsInMap.add(state.sites[siteCode].domainCode);
    statesInMap.add(state.sites[siteCode].stateCode);
  });

  // Columns that are visible for more than one feature type
  const commonColumns = {
    site: {
      field: 'siteCode',
      csvFields: ['siteCode', 'siteName'],
      // Some single table columns are split in the CSV like so
      title: 'Site',
      sorting: true,
      defaultSort: 'desc',
      searchable: true,
      lookup: Object.fromEntries(Array.from(sitesInMap).sort().map(siteCode => [siteCode, siteCode])),
      customFilterAndSearch: (input, row) => {
        if (typeof input === 'string' && input.length) {
          return searchOnAttribs(input, [row.siteCode, row.description]);
        }
        if (Array.isArray(input) && input.length) {
          return input.includes(row.siteCode);
        }
        return true;
      },
      customSort: (rowA, rowB) => {
        const siteA = getSite(rowA);
        const siteB = getSite(rowB);
        const aName = siteA.description;
        const bName = siteB.description;
        return aName > bName ? -1 : 1;
      },
      // eslint-disable-next-line arrow-body-style
      render: row => {
        const site = getSite(row);
        if (!site) {
          return null;
        }
        const {
          siteCode,
          description
        } = site;
        const isDecommissioned = site.manualLocationType === _SiteMapUtils.MANUAL_LOCATION_TYPES.PROTOTYPE_SITE;
        const featureKey = isDecommissioned ? _SiteMapUtils.FEATURES.DECOMMISSIONED_SITES.KEY : "".concat(site.terrain.toUpperCase(), "_").concat(site.type.toUpperCase(), "_SITES");
        const unselectable = selectionActive && !rowIsSelectable(row);
        return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Link.default, {
          component: "button",
          className: classes.siteName,
          onClick: () => jumpTo(siteCode),
          title: "Click to view ".concat(siteCode, " on the map")
        }, renderFeatureIcon(featureKey, unselectable), /*#__PURE__*/_react.default.createElement("span", null, "".concat(description || 'Unnamed Site', " (").concat(siteCode, ")"))), /*#__PURE__*/_react.default.createElement("div", {
          className: classes.startFlex
        }, /*#__PURE__*/_react.default.createElement(_Link.default, {
          className: classes.siteDetailsLink,
          href: "".concat((0, _SiteMapUtils.getHref)('SITE_DETAILS', siteCode))
        }, "Site Details"), /*#__PURE__*/_react.default.createElement("span", {
          className: classes.siteLinksDivider
        }, "|"), /*#__PURE__*/_react.default.createElement(_Link.default, {
          className: classes.siteDetailsLink,
          href: "".concat((0, _SiteMapUtils.getHref)('EXPLORE_DATA_PRODUCTS_BY_SITE', siteCode))
        }, "Explore Data"), /*#__PURE__*/_react.default.createElement("span", {
          className: classes.siteLinksDivider
        }, "|"), /*#__PURE__*/_react.default.createElement(_Link.default, {
          className: classes.siteDetailsLink,
          href: "".concat((0, _SiteMapUtils.getHref)('EXPLORE_SAMPLE_PRODUCTS_BY_SITE', siteCode))
        }, "Explore Samples")));
      },
      csvRender: row => {
        let siteName = null;
        if (state.sites[row.siteCode]) {
          siteName = state.sites[row.siteCode].description;
        }
        return [row.siteCode, siteName];
      }
    },
    domain: {
      field: 'domainCode',
      title: 'Domain',
      sorting: true,
      defaultSort: 'desc',
      searchable: true,
      lookup: Object.fromEntries(Array.from(domainsInMap).sort().map(domainCode => [domainCode, domainCode])),
      customSort: (rowA, rowB) => {
        const domainA = getDomain(rowA);
        const domainB = getDomain(rowB);
        return domainA.domainCode > domainB.domainCode ? -1 : 1;
      },
      render: row => {
        const domain = getDomain(row);
        return !domain ? null : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Link.default, {
          component: "button",
          className: classes.linkButton,
          onClick: () => jumpTo(domain.domainCode),
          title: "Click to view ".concat(domain.domainCode, " on the map")
        }, domain.domainCode || ''));
      }
    },
    state: {
      field: 'stateCode',
      title: 'State',
      sorting: true,
      defaultSort: 'desc',
      searchable: true,
      lookup: Object.fromEntries(Array.from(statesInMap).sort().map(stateCode => [stateCode, state.featureData.STATES.STATES[stateCode].name])),
      customSort: (rowA, rowB) => {
        const stateA = getState(rowA);
        const stateB = getState(rowB);
        return stateA.name > stateB.name ? -1 : 1;
      },
      customFilterAndSearch: (input, row) => {
        if (typeof input === 'string' && input.length) {
          const rowState = getState(row);
          return searchOnAttribs(input, [row.stateCode, rowState.name]);
        }
        if (Array.isArray(input) && input.length) {
          return input.includes(row.stateCode);
        }
        return true;
      },
      render: row => {
        const usstate = getState(row);
        const {
          stateCode
        } = row;
        return !usstate ? null : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Link.default, {
          component: "button",
          className: classes.linkButton,
          onClick: () => jumpTo(stateCode),
          title: "Click to view ".concat(stateCode, " on the map")
        }, usstate.name || ''));
      }
    },
    coordinates: {
      field: 'latitude',
      csvFields: ['latitude', 'longitude'],
      title: 'Coordinates',
      sorting: false,
      filtering: false,
      searchable: false,
      render: row => {
        const {
          latitude: rowLatitude,
          longitude: rowLongitude
        } = row;
        const latitude = Number.isFinite(rowLatitude) ? rowLatitude.toFixed(5) : null;
        const longitude = Number.isFinite(rowLongitude) ? rowLongitude.toFixed(5) : null;
        return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderCaptionString(latitude, 'Latitude'), /*#__PURE__*/_react.default.createElement("br", null), renderCaptionString(longitude, 'Longitude'));
      },
      csvRender: row => [Number.isFinite(row.latitude) ? row.latitude.toFixed(5) : null, Number.isFinite(row.longitude) ? row.longitude.toFixed(5) : null]
    },
    latitude: {
      field: 'latitude',
      title: 'Latitude',
      sorting: true,
      filtering: false,
      render: row => renderCaptionString(Number.isFinite(row.latitude) ? row.latitude.toFixed(5) : null, 'Latitude'),
      csvRender: row => Number.isFinite(row.latitude) ? row.latitude.toFixed(5) : null
    },
    longitude: {
      field: 'longitude',
      title: 'Longitude',
      sorting: true,
      filtering: false,
      render: row => renderCaptionString(Number.isFinite(row.longitude) ? row.longitude.toFixed(5) : null, 'Longitude'),
      csvRender: row => Number.isFinite(row.longitude) ? row.longitude.toFixed(5) : null
    }
  };

  /**
     Define columns from current focus feature type
  */
  let columns = [];
  if (focus === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
    columns = [commonColumns.site, {
      // Site Type
      field: 'type',
      title: 'Type',
      sorting: true,
      defaultSort: 'desc',
      searchable: true,
      lookup: Object.fromEntries(Array.from(new Set(rows.map(row => row.type))).sort().map(k => [k, ucWord(k)])),
      render: row => ucWord(row.type)
    }, {
      // Site Terrain
      field: 'terrain',
      title: 'Terrain',
      sorting: true,
      defaultSort: 'desc',
      lookup: Object.fromEntries(Array.from(new Set(rows.map(row => row.terrain))).sort().map(k => [k, ucWord(k)])),
      render: row => ucWord(row.terrain)
    }, commonColumns.domain, commonColumns.state, commonColumns.coordinates];
  }
  if (focus === _SiteMapUtils.FEATURE_TYPES.LOCATIONS.KEY) {
    columns = [{
      // Location Name
      field: 'name',
      title: 'Name',
      sorting: true,
      defaultSort: 'desc',
      searchable: true,
      render: row => {
        const {
          name
        } = row;
        return /*#__PURE__*/_react.default.createElement(_Link.default, {
          component: "button",
          className: classes.linkButton,
          onClick: () => jumpTo(name),
          title: "View ".concat(name, " on map")
        }, name || '');
      }
    }, {
      // Location Type
      field: 'featureKey',
      title: 'Type',
      sorting: true,
      defaultSort: 'desc',
      searchable: true,
      lookup: Object.fromEntries(Array.from(new Set(rows.map(row => row.featureKey))).sort((a, b) => getFeatureName(a) > getFeatureName(b) ? 1 : -1).map(featureKey => [featureKey, getFeatureName(featureKey)])),
      customSort: (rowA, rowB) => {
        const typeA = getFeatureName(rowA.featureKey);
        const typeB = getFeatureName(rowB.featureKey);
        if (typeA.name === typeB.name) {
          return 0;
        }
        return typeA.name > typeB.name ? -1 : 1;
      },
      render: row => {
        const {
          featureKey
        } = row;
        const featureName = getFeatureName(featureKey);
        return /*#__PURE__*/_react.default.createElement("div", {
          className: classes.startFlex
        }, renderFeatureIcon(featureKey), /*#__PURE__*/_react.default.createElement("span", null, featureName));
      },
      csvRender: row => getFeatureName(row.featureKey)
    }, {
      // Elevation
      field: 'elevation',
      csvFields: ['elevation (m)'],
      title: 'Elevation',
      sorting: true,
      defaultSort: 'desc',
      filtering: false,
      render: row => renderCaptionString(Number.isFinite(row.elevation) ? "".concat(row.elevation.toFixed(2), "m") : '--', 'Elevation'),
      csvRender: row => Number.isFinite(row.elevation) ? row.elevation.toFixed(2) : null
    }, {
      // NLCD Class
      field: 'nlcdClass',
      title: 'NLCD Class',
      sorting: true,
      deafultSort: 'asc',
      searchable: true,
      lookup: Object.fromEntries(Object.keys(_SiteMapUtils.NLCD_CLASSES).filter(classKey => rows.some(row => row.nlcdClass === classKey)).sort().map(classKey => [classKey, _SiteMapUtils.NLCD_CLASSES[classKey].name])),
      render: row => {
        const {
          nlcdClass
        } = row;
        if (!nlcdClass) {
          return renderCaptionString();
        }
        if (!_SiteMapUtils.NLCD_CLASSES[nlcdClass]) {
          return renderCaptionString(nlcdClass, 'NLCD Class');
        }
        const {
          name: title,
          color: backgroundColor
        } = _SiteMapUtils.NLCD_CLASSES[nlcdClass];
        return /*#__PURE__*/_react.default.createElement("div", {
          className: classes.nlcdClassContainer
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: classes.nlcdClass,
          title: title,
          style: {
            backgroundColor
          }
        }), renderCaptionString(title, 'NLCD Class'));
      },
      csvRender: row => {
        const {
          nlcdClass
        } = row;
        if (!nlcdClass) {
          return null;
        }
        if (!_SiteMapUtils.NLCD_CLASSES[nlcdClass]) {
          return nlcdClass;
        }
        return _SiteMapUtils.NLCD_CLASSES[nlcdClass].name;
      }
    }, {
      // Plot Size
      field: 'plotSize',
      csvFields: ['plotDimensions', 'plotArea (m^2)'],
      title: 'Plot Size',
      sorting: true,
      deafultSort: 'asc',
      filtering: false,
      render: row => {
        const {
          plotDimensions,
          plotSize
        } = row;
        if (!plotDimensions) {
          return renderCaptionString();
        }
        return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderCaptionString("".concat(plotDimensions), 'Plot Size (Dimensions)'), Number.isFinite(plotSize) ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("br", null), renderCaptionString("(".concat(plotSize.toFixed(0), "m\xB2)"), 'Plot Size (Area)')) : null);
      },
      csvRender: row => {
        const {
          plotDimensions,
          plotSize
        } = row;
        return [plotDimensions || null, Number.isFinite(plotSize) ? plotSize.toFixed(0) : null];
      }
    }, {
      // Plot Slope Aspect
      field: 'slopeAspect',
      csvFields: ['slopeAspect (deg)'],
      title: 'Slope Aspect',
      sorting: true,
      deafultSort: 'asc',
      filtering: false,
      render: row => renderCaptionString(Number.isFinite(row.slopeAspect) ? "".concat(row.slopeAspect.toFixed(2), "\xB0") : '--', 'Slope Aspect'),
      csvRender: row => Number.isFinite(row.slopeAspect) ? row.slopeAspect.toFixed(2) : null
    }, {
      // Plot Slope Gradient
      field: 'slopeGradient',
      csvFields: ['slopeGradient (%)'],
      title: 'Slope Gradient',
      sorting: true,
      deafultSort: 'asc',
      filtering: false,
      render: row => renderCaptionString(Number.isFinite(row.slopeGradient) ? "".concat(row.slopeGradient.toFixed(2), "%") : '--', 'Slope Gradient'),
      csvRender: row => Number.isFinite(row.slopeGradient) ? row.slopeGradient.toFixed(2) : null
    }, {
      // Sampling Module Count
      field: 'samplingModules',
      csvFields: 'samplingModulesCount',
      title: 'Potential Sampling Modules',
      filtering: false,
      sorting: true,
      deafultSort: 'asc',
      searchable: true,
      customSort: (rowA, rowB) => {
        const a = Array.isArray(rowA.samplingModules) ? rowA.samplingModules.length : null;
        const b = Array.isArray(rowB.samplingModules) ? rowB.samplingModules.length : null;
        if (a === b) {
          return 0;
        }
        if (a === null && b !== null) {
          return 1;
        }
        if (a !== null && b === null) {
          return -1;
        }
        return a > b ? 1 : -1;
      },
      render: row => {
        const {
          samplingModules
        } = row;
        if (!Array.isArray(samplingModules)) {
          return renderCaptionString();
        }
        return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          interactive: true,
          placement: "left",
          title: samplingModules.length ? /*#__PURE__*/_react.default.createElement("ul", {
            style: {
              marginLeft: _Theme.default.spacing(-1)
            }
          }, samplingModules.map(m => /*#__PURE__*/_react.default.createElement("li", {
            key: m
          }, _SiteMapUtils.PLOT_SAMPLING_MODULES[m]))) : /*#__PURE__*/_react.default.createElement("i", null, "none")
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: classes.startFlex
        }, renderCaptionString(samplingModules.length, 'Potential Sampling Modules'), /*#__PURE__*/_react.default.createElement(_IconButton.default, {
          size: "small",
          className: classes.iconButton,
          "aria-label": "Potential Sampling Modules"
        }, /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, {
          fontSize: "inherit"
        }))));
      },
      csvRender: row => Array.isArray(row.samplingModules) ? row.samplingModules.length : null
    }, commonColumns.site, commonColumns.domain, commonColumns.state, commonColumns.coordinates];
  }
  const toolbarClassName = view === _SiteMapUtils.VIEWS.SPLIT ? classes.toolbarContainer : "".concat(classes.toolbarContainer, " ").concat(classes.toolbarContainerNoSplit);
  const components = {
    Container: _Box.default,
    // eslint-disable-next-line react/no-unstable-nested-components
    Toolbar: toolbarProps => /*#__PURE__*/_react.default.createElement("div", {
      className: toolbarClassName,
      "data-selenium": "sitemap-table-toolbar"
    }, /*#__PURE__*/_react.default.createElement(_materialTable.MTableToolbar, _extends({}, toolbarProps, {
      classes: {
        title: classes.tableTitle
      }
    }))),
    // eslint-disable-next-line react/no-unstable-nested-components
    FilterRow: filterRowProps => /*#__PURE__*/_react.default.createElement(_materialTable.MTableFilterRow, _extends({}, filterRowProps, {
      filterCellStyle: {
        padding: '8px',
        backgroundColor: _Theme.default.palette.grey[50]
      }
    }))
  };
  const localization = {
    toolbar: {
      searchPlaceholder: "Search ".concat(focus.toLowerCase(), " in view")
    },
    body: {
      emptyDataSourceMessage: "No ".concat(focus.toLowerCase(), " in current map view match the current filters.")
    }
  };

  /**
     Render Table
  */
  const tableOptions = {
    padding: 'dense',
    filtering: true,
    columnsButton: true,
    headerStyle: {
      position: 'sticky',
      top: 0,
      backgroundColor: _Theme.default.palette.grey[50]
    },
    pageSize: 100,
    pageSizeOptions: [100, 200, 500],
    exportButton: {
      csv: true
    },
    exportCsv,
    exportFileName: EXPORT_FILENAME,
    emptyRowsWhenPaging: false,
    thirdSortClick: false,
    rowStyle: row => {
      if (selectionActive) {
        if (!rowIsSelectable(row)) {
          return {
            opacity: 0.65
          };
        }
        if (rowIsSelected(row)) {
          return {
            backgroundColor: _Theme.COLORS.LIGHT_BLUE[50]
          };
        }
      }
      return {};
    },
    selection: selectionActive,
    selectionProps: !selectionActive ? null : row => ({
      style: {
        margin: _Theme.default.spacing(0, 0.5)
      },
      disabled: !rowIsSelectable(row)
    })
  };
  if (!fullHeight && view !== _SiteMapUtils.VIEWS.SPLIT) {
    tableOptions.maxBodyHeight = "".concat(maxBodyHeight || _SiteMapUtils.MIN_TABLE_MAX_BODY_HEIGHT, "px");
  }
  let containerClassName = "".concat(classes.tableContainer, " ").concat(classes.tableContainerIntegrated);
  let containerStyle = {};
  if (view === _SiteMapUtils.VIEWS.TABLE && fullHeight) {
    containerStyle = {
      position: 'relative'
    };
  }
  if (view === _SiteMapUtils.VIEWS.SPLIT) {
    containerClassName = "".concat(classes.tableContainer, " ").concat(classes.tableContainerStandalone);
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: tableRef,
    className: containerClassName,
    style: containerStyle,
    "data-selenium": "sitemap-content-table"
  }, /*#__PURE__*/_react.default.createElement(_materialTable.default, {
    title: "".concat(ucWord(focus), " in view"),
    icons: _MaterialTableIcons.default,
    components: components,
    columns: columns,
    data: rows,
    localization: localization,
    options: tableOptions,
    onSelectionChange: !selectionActive ? null : newRows => {
      const action = {
        type: 'updateSelectionSet',
        selection: new Set()
      };
      newRows.filter(row => row.tableData.checked).forEach(row => {
        if (focus === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
          action.selection.add(row.siteCode);
        }
      });
      dispatch(action);
    }
  }));
};
var _default = exports.default = SiteMapTable; // Additional items exported for unit testing
const getTestableItems = () => process.env.NODE_ENV !== 'test' ? {} : {
  ucWord,
  parseSearchTerms,
  searchOnAttribs,
  calculateMaxBodyHeight,
  getFeatureName,
  exportCsv
};
exports.getTestableItems = getTestableItems;