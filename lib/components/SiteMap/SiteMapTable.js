"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ucWord = function ucWord() {
  var word = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return "".concat(word.slice(0, 1).toUpperCase()).concat(word.slice(1).toLowerCase());
};
/**
 * Parse an input search string into discrete terms.
 * Supports quoting words together as a single term.
 * Example: '"foo bar" baz' => ['foo bar', 'baz']
 * @param {string} input - string to parse into discrete terms
 */


var parseSearchTerms = function parseSearchTerms(input) {
  var terms = input.replace(/[^\w\s."]/g, '').match(/(".*?"|[^" \s]+)(?=\s* |\s*$)/g);
  return (terms || []).map(function (term) {
    return term.replace(/"/g, '').toLowerCase();
  });
};
/**
 * Apply a searchString to a list of string attributes; return boolean for a match
 */


var searchOnAttribs = function searchOnAttribs(searchString) {
  var searchableAttribs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var searchTerms = parseSearchTerms(searchString);

  if (!searchTerms.length) {
    return true;
  }

  return searchTerms.some(function (term) {
    return searchableAttribs.some(function (attrib) {
      return (attrib || '').toLowerCase().includes(term);
    });
  });
};

var getFeatureName = function getFeatureName(featureKey) {
  if (_SiteMapUtils.FEATURES[featureKey]) {
    return _SiteMapUtils.FEATURES[featureKey].nameSingular || _SiteMapUtils.FEATURES[featureKey].name || featureKey;
  }

  return featureKey;
};

var calculateMaxBodyHeight = function calculateMaxBodyHeight(tableRef) {
  if (!tableRef || !tableRef.current) {
    return _SiteMapUtils.MIN_TABLE_MAX_BODY_HEIGHT;
  }

  var containerHeight = tableRef.current.clientHeight || 0;
  var toolbarHeight = tableRef.current.children[0].children[0].clientHeight || 0;
  var pagerHeight = tableRef.current.children[0].children[2].clientHeight || 0;
  return Math.max(containerHeight - toolbarHeight - pagerHeight, _SiteMapUtils.MIN_TABLE_MAX_BODY_HEIGHT);
};

var EXPORT_FILENAME = 'NEON-SiteMap-Table';

var exportCsv = function exportCsv() {
  var columns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var rows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (!columns.length || !rows.length) {
    return;
  }

  var columnHeaders = columns.reduce(function (acc, cur) {
    if (Array.isArray(cur.csvFields)) {
      cur.csvFields.forEach(function (field) {
        acc.push(field);
      });
    } else {
      acc.push(cur.field);
    }

    return acc;
  }, []);
  var payloadRows = [columnHeaders.join(',')];
  rows.forEach(function (row) {
    var payloadRow = [];
    columns.forEach(function (column) {
      var render = typeof column.csvRender === 'function' ? column.csvRender : function (r) {
        return r[column.field] || null;
      };
      payloadRow.push([render(row)].flat().map(function (value) {
        if (value === null || typeof value === 'undefined' || Number.isNaN(value)) {
          return '';
        }

        if (/["',\s]/.test(value.toString())) {
          return "\"".concat(value.toString().replace('"', '\\"'), "\"");
        }

        return value;
      }).join(','));
    });
    payloadRows.push(payloadRow.join(','));
  });
  var payload = payloadRows.join('\n');
  var mimeType = 'text/csv;charset=utf-8';
  var fileName = "".concat(EXPORT_FILENAME, ".csv");

  if (navigator.msSaveBlob) {
    // IE10+
    navigator.msSaveBlob(new Blob([payload], {
      type: mimeType
    }), fileName);
  } else {
    var link = document.createElement('a');

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

var useStyles = (0, _styles.makeStyles)(function (theme) {
  var _toolbarContainer;

  return {
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
    tableContainerStandalone: {// ...
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
    toolbarContainer: (_toolbarContainer = {
      backgroundColor: theme.palette.grey[50]
    }, _defineProperty(_toolbarContainer, theme.breakpoints.down('xs'), {
      paddingTop: theme.spacing(4.5)
    }), _defineProperty(_toolbarContainer, '& div.MuiToolbar-root', {
      width: '100%',
      padding: theme.spacing(0, 0, 0, 2),
      backgroundColor: theme.palette.grey[50]
    }), _defineProperty(_toolbarContainer, '& button', {
      color: theme.palette.primary.main,
      '&:hover, &:active': {
        color: _Theme.COLORS.LIGHT_BLUE[400],
        border: "1px solid ".concat(_Theme.COLORS.LIGHT_BLUE[400]),
        backgroundColor: "".concat(_Theme.COLORS.LIGHT_BLUE[400], "20"),
        padding: '11px'
      }
    }), _toolbarContainer),
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
      minWidth: '200px',
      textAlign: 'left'
    },
    siteLinksDivider: {
      margin: theme.spacing(0, 1, 0, 1)
    },
    siteDetailsLink: {
      fontSize: '80%',
      fontStyle: 'italic'
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
  };
});

var SiteMapTable = function SiteMapTable() {
  var classes = useStyles(_Theme.default);
  var tableRef = (0, _react.useRef)(null); // Neon Context State

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      _NeonContext$useNeonC3 = _NeonContext$useNeonC2[0],
      isFinal = _NeonContext$useNeonC3.isFinal,
      hasError = _NeonContext$useNeonC3.hasError;

  var canRender = isFinal && !hasError; // Site Map State

  var _SiteMapContext$useSi = _SiteMapContext.default.useSiteMapContext(),
      _SiteMapContext$useSi2 = _slicedToArray(_SiteMapContext$useSi, 2),
      state = _SiteMapContext$useSi2[0],
      dispatch = _SiteMapContext$useSi2[1];

  var manualLocationData = state.manualLocationData,
      _state$view = state.view,
      view = _state$view.current,
      viewsInitialized = _state$view.initialized;
  var _state$table = state.table,
      focus = _state$table.focus,
      fullHeight = _state$table.fullHeight,
      maxBodyHeight = _state$table.maxBodyHeight,
      maxBodyHeightUpdateFromAspectRatio = _state$table.maxBodyHeightUpdateFromAspectRatio;
  var _state$selection = state.selection,
      selection = _state$selection.set,
      selectableItems = _state$selection.validSet,
      hideUnselectable = _state$selection.hideUnselectable;
  var selectionActive = state.selection.active === focus;
  /**
    Effect - Initialize table if this is the first time we're seeing it
  */

  (0, _react.useEffect)(function () {
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

  (0, _react.useEffect)(function () {
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

  (0, _react.useLayoutEffect)(function () {
    var noop = function noop() {}; // This all only applies to full height table and/or split view (which behaves as full height)


    if (!fullHeight && view !== _SiteMapUtils.VIEWS.SPLIT) {
      return noop;
    } // Collect the nodes we pay attention to. Each one has a distinct purpose.


    var tableNode = tableRef.current.querySelector('table');

    if (!tableNode) {
      return noop;
    }

    var tbodyNode = tableRef.current.querySelector('tbody');

    if (!tbodyNode) {
      return noop;
    }

    var scrollingNode = (tableNode.parentElement || {}).parentElement;

    if (!scrollingNode) {
      return noop;
    }

    var containerNode = scrollingNode.parentElement;

    if (!containerNode) {
      return noop;
    } // Initialize the new scrollbar in this scope


    var scrollbar = null; // Function to do the initial injection fo the scrollbar node

    var injectScrollbar = function injectScrollbar() {
      scrollbar = document.createElement('div');
      scrollbar.appendChild(document.createElement('div'));
      scrollbar.style.overflow = 'auto';
      scrollbar.style.overflowY = 'hidden'; // eslint-disable-next-line prefer-destructuring

      scrollbar.style.backgroundColor = _Theme.default.palette.grey[50];
      scrollbar.firstChild.style.width = "".concat(tableNode.scrollWidth || 0, "px");
      scrollbar.firstChild.style.paddingTop = '1px';

      scrollbar.onscroll = function () {
        scrollingNode.scrollLeft = scrollbar.scrollLeft;
      };

      scrollingNode.onscroll = function () {
        scrollbar.scrollLeft = scrollingNode.scrollLeft;
      };

      containerNode.parentNode.insertBefore(scrollbar, containerNode);
    }; // Function to resize the scrollbar. We can't rely on the scrollWidth being accurate when we
    // inject as not-yet-fully-rendered table rows may expand the scrollWidth.


    var resizeScrollbar = function resizeScrollbar() {
      if (!scrollbar) {
        return;
      }

      scrollbar.firstChild.style.width = "".concat(tableNode.scrollWidth || 0, "px");
      scrollbar.scrollLeft = scrollingNode.scrollLeft;
    }; // Inject the scrollbar one step removed from the initial render cycle (with a 0-sec timeout)


    var timeout = window.setTimeout(injectScrollbar, 0); // Observe the childList of the tbody - i.e. rows being added or removed - to trigger a resize
    // of the injected scrollbar

    var observer = new MutationObserver(resizeScrollbar);
    observer.observe(tbodyNode, {
      childList: true
    }); // Clear any pending timeouts and disconnect our observer on unload to avoid memory leaks

    return function () {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [tableRef, fullHeight, view]);

  if (!canRender) {
    return null;
  } // Selection functions


  var rowIsSelected = function rowIsSelected() {
    return false;
  };

  var rowIsSelectable = function rowIsSelectable() {
    return false;
  };

  switch (focus) {
    case _SiteMapUtils.FEATURE_TYPES.SITES.KEY:
      rowIsSelected = function rowIsSelected(row) {
        return selection.has(row.siteCode);
      };

      rowIsSelectable = function rowIsSelectable(row) {
        return !selectableItems || selectableItems.has(row.siteCode);
      };

      break;

    default:
      break;
  } // Jump-To function to turn location names in the table to map navigation


  var jumpTo = function jumpTo() {
    var locationCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    dispatch({
      type: 'setNewFocusLocation',
      location: locationCode
    });
  }; // While sites keep a state and domain code locations only keep a site code.
  // These helper functions will connect the dots to to get site/state/domain/etc. for a location.


  var getParent = function getParent(type, location) {
    var source = null;

    if (type === 'SITE') {
      var data = state.sites;

      if (Array.isArray(manualLocationData) && manualLocationData.length) {
        data = {};
        manualLocationData.forEach(function (ml) {
          var siteCode = ml.siteCode;
          data[siteCode] = Object.keys(state.sites).includes(siteCode) ? state.sites[siteCode] : ml;
        });
      }

      source = {
        code: 'siteCode',
        data: data
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

    var code = null;

    if (location[source.code]) {
      code = location[source.code];
    } else if (location.siteCode) {
      code = state.sites[location.siteCode] ? state.sites[location.siteCode][source.code] : null;
    }

    return source.data[code] ? _extends(_defineProperty({}, source.code, code), source.data[code]) : null;
  };

  var getSite = function getSite(location) {
    return getParent('SITE', location);
  };

  var getState = function getState(location) {
    return getParent('STATE', location);
  };

  var getDomain = function getDomain(location) {
    return getParent('DOMAIN', location);
  };

  var renderFeatureIcon = function renderFeatureIcon(featureKey) {
    var unselectable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!_SiteMapUtils.FEATURES[featureKey] || !_SiteMapUtils.FEATURES[featureKey].iconSvg) {
      return null;
    }

    var iconSvg = _SiteMapUtils.FEATURES[featureKey].iconSvg;
    var style = unselectable ? {
      filter: _SiteMapUtils.UNSELECTABLE_MARKER_FILTER
    } : {};
    return /*#__PURE__*/_react.default.createElement("img", {
      src: iconSvg,
      alt: getFeatureName(featureKey),
      className: classes.featureIcon,
      style: style
    });
  };

  var renderCaptionString = function renderCaptionString() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '--';
    var ariaLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      "aria-label": ariaLabel,
      className: classes.caption
    }, str);
  };
  /**
     Calculate rows
  */


  var visibleFeatureKeys = Object.keys(state.featureData[focus]).filter(function (featureKey) {
    return state.filters.features.available[featureKey] && state.filters.features.visible[featureKey];
  });
  var locations = {};
  visibleFeatureKeys.forEach(function (featureKey) {
    Object.keys(state.featureData[focus][featureKey]).forEach(function (siteCode) {
      if (focus === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
        locations[siteCode] = state.featureData[focus][featureKey][siteCode];
      }

      if (focus === _SiteMapUtils.FEATURE_TYPES.LOCATIONS.KEY) {
        Object.keys(state.featureData[focus][featureKey][siteCode]).forEach(function (locationCode) {
          locations[locationCode] = state.featureData[focus][featureKey][siteCode][locationCode];
        });
      }
    });
  });
  var initialRows = (0, _SiteMapUtils.calculateLocationsInBounds)(locations, state.map.bounds);

  if (selectionActive && selectableItems && hideUnselectable) {
    initialRows = initialRows.filter(function (item) {
      return selectableItems.has(item);
    });
  }

  var hasPrototypeSites = (manualLocationData || []).some(function (ml) {
    return ml.manualLocationType === _SiteMapUtils.MANUAL_LOCATION_TYPES.PROTOTYPE_SITE;
  });

  if (hasPrototypeSites) {
    var visibleSites = manualLocationData.map(function (ml) {
      return ml.siteCode;
    });
    initialRows = initialRows.filter(function (item) {
      return visibleSites.includes(item);
    });
  }

  var rows = initialRows.map(function (key) {
    return locations[key];
  });

  if (selectionActive) {
    rows.forEach(function (row, idx) {
      var selected = false;

      if (focus === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
        selected = selection.has(row.siteCode);
      } // Implement locations preselection here


      if (!rows[idx].tableData) {
        rows[idx].tableData = {};
      }

      rows[idx].tableData.checked = selected;
    });
  }
  /**
     Unique sites, domains, and states off of rows
  */


  var sitesInMap = Array.from(rows.reduce(function (acc, cur) {
    if (cur.siteCode) {
      acc.add(cur.siteCode);
    }

    return acc;
  }, new Set()));
  var domainsInMap = new Set();
  var statesInMap = new Set();
  sitesInMap.filter(function (siteCode) {
    return state.sites[siteCode];
  }).forEach(function (siteCode) {
    domainsInMap.add(state.sites[siteCode].domainCode);
    statesInMap.add(state.sites[siteCode].stateCode);
  }); // Columns that are visible for more than one feature type

  var commonColumns = {
    site: {
      field: 'siteCode',
      csvFields: ['siteCode', 'siteName'],
      // Some single table columns are split in the CSV like so
      title: 'Site',
      sorting: true,
      defaultSort: 'desc',
      searchable: true,
      lookup: Object.fromEntries(Array.from(sitesInMap).sort().map(function (siteCode) {
        return [siteCode, siteCode];
      })),
      customFilterAndSearch: function customFilterAndSearch(input, row) {
        if (typeof input === 'string' && input.length) {
          return searchOnAttribs(input, [row.siteCode, row.description]);
        }

        if (Array.isArray(input) && input.length) {
          return input.includes(row.siteCode);
        }

        return true;
      },
      customSort: function customSort(rowA, rowB) {
        var siteA = getSite(rowA);
        var siteB = getSite(rowB);
        var aName = siteA.description;
        var bName = siteB.description;
        return aName > bName ? -1 : 1;
      },
      // eslint-disable-next-line arrow-body-style
      render: function render(row) {
        var site = getSite(row);

        if (!site) {
          return null;
        }

        var siteCode = site.siteCode,
            description = site.description;
        var isDecommissioned = site.manualLocationType === _SiteMapUtils.MANUAL_LOCATION_TYPES.PROTOTYPE_SITE;
        var featureKey = isDecommissioned ? _SiteMapUtils.FEATURES.DECOMMISSIONED_SITES.KEY : "".concat(site.terrain.toUpperCase(), "_").concat(site.type.toUpperCase(), "_SITES");
        var unselectable = selectionActive && !rowIsSelectable(row);
        return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Link.default, {
          component: "button",
          className: classes.siteName,
          onClick: function onClick() {
            return jumpTo(siteCode);
          },
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
        }, "Explore Data")));
      },
      csvRender: function csvRender(row) {
        var siteName = null;

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
      lookup: Object.fromEntries(Array.from(domainsInMap).sort().map(function (domainCode) {
        return [domainCode, domainCode];
      })),
      customSort: function customSort(rowA, rowB) {
        var domainA = getDomain(rowA);
        var domainB = getDomain(rowB);
        return domainA.domainCode > domainB.domainCode ? -1 : 1;
      },
      render: function render(row) {
        var domain = getDomain(row);
        return !domain ? null : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Link.default, {
          component: "button",
          className: classes.linkButton,
          onClick: function onClick() {
            return jumpTo(domain.domainCode);
          },
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
      lookup: Object.fromEntries(Array.from(statesInMap).sort().map(function (stateCode) {
        return [stateCode, state.featureData.STATES.STATES[stateCode].name];
      })),
      customSort: function customSort(rowA, rowB) {
        var stateA = getState(rowA);
        var stateB = getState(rowB);
        return stateA.name > stateB.name ? -1 : 1;
      },
      customFilterAndSearch: function customFilterAndSearch(input, row) {
        if (typeof input === 'string' && input.length) {
          var rowState = getState(row);
          return searchOnAttribs(input, [row.stateCode, rowState.name]);
        }

        if (Array.isArray(input) && input.length) {
          return input.includes(row.stateCode);
        }

        return true;
      },
      render: function render(row) {
        var usstate = getState(row);
        var stateCode = row.stateCode;
        return !usstate ? null : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Link.default, {
          component: "button",
          className: classes.linkButton,
          onClick: function onClick() {
            return jumpTo(stateCode);
          },
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
      render: function render(row) {
        var rowLatitude = row.latitude,
            rowLongitude = row.longitude;
        var latitude = Number.isFinite(rowLatitude) ? rowLatitude.toFixed(5) : null;
        var longitude = Number.isFinite(rowLongitude) ? rowLongitude.toFixed(5) : null;
        return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderCaptionString(latitude, 'Latitude'), /*#__PURE__*/_react.default.createElement("br", null), renderCaptionString(longitude, 'Longitude'));
      },
      csvRender: function csvRender(row) {
        return [Number.isFinite(row.latitude) ? row.latitude.toFixed(5) : null, Number.isFinite(row.longitude) ? row.longitude.toFixed(5) : null];
      }
    },
    latitude: {
      field: 'latitude',
      title: 'Latitude',
      sorting: true,
      filtering: false,
      render: function render(row) {
        return renderCaptionString(Number.isFinite(row.latitude) ? row.latitude.toFixed(5) : null, 'Latitude');
      },
      csvRender: function csvRender(row) {
        return Number.isFinite(row.latitude) ? row.latitude.toFixed(5) : null;
      }
    },
    longitude: {
      field: 'longitude',
      title: 'Longitude',
      sorting: true,
      filtering: false,
      render: function render(row) {
        return renderCaptionString(Number.isFinite(row.longitude) ? row.longitude.toFixed(5) : null, 'Longitude');
      },
      csvRender: function csvRender(row) {
        return Number.isFinite(row.longitude) ? row.longitude.toFixed(5) : null;
      }
    }
  };
  /**
     Define columns from current focus feature type
  */

  var columns = [];

  if (focus === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
    columns = [commonColumns.site, {
      // Site Type
      field: 'type',
      title: 'Type',
      sorting: true,
      defaultSort: 'desc',
      searchable: true,
      lookup: Object.fromEntries(Array.from(new Set(rows.map(function (row) {
        return row.type;
      }))).sort().map(function (k) {
        return [k, ucWord(k)];
      })),
      render: function render(row) {
        return ucWord(row.type);
      }
    }, {
      // Site Terrain
      field: 'terrain',
      title: 'Terrain',
      sorting: true,
      defaultSort: 'desc',
      lookup: Object.fromEntries(Array.from(new Set(rows.map(function (row) {
        return row.terrain;
      }))).sort().map(function (k) {
        return [k, ucWord(k)];
      })),
      render: function render(row) {
        return ucWord(row.terrain);
      }
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
      render: function render(row) {
        var name = row.name;
        return /*#__PURE__*/_react.default.createElement(_Link.default, {
          component: "button",
          className: classes.linkButton,
          onClick: function onClick() {
            return jumpTo(name);
          },
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
      lookup: Object.fromEntries(Array.from(new Set(rows.map(function (row) {
        return row.featureKey;
      }))).sort(function (a, b) {
        return getFeatureName(a) > getFeatureName(b) ? 1 : -1;
      }).map(function (featureKey) {
        return [featureKey, getFeatureName(featureKey)];
      })),
      customSort: function customSort(rowA, rowB) {
        var typeA = getFeatureName(rowA.featureKey);
        var typeB = getFeatureName(rowB.featureKey);

        if (typeA.name === typeB.name) {
          return 0;
        }

        return typeA.name > typeB.name ? -1 : 1;
      },
      render: function render(row) {
        var featureKey = row.featureKey;
        var featureName = getFeatureName(featureKey);
        return /*#__PURE__*/_react.default.createElement("div", {
          className: classes.startFlex
        }, renderFeatureIcon(featureKey), /*#__PURE__*/_react.default.createElement("span", null, featureName));
      },
      csvRender: function csvRender(row) {
        return getFeatureName(row.featureKey);
      }
    }, {
      // Elevation
      field: 'elevation',
      csvFields: ['elevation (m)'],
      title: 'Elevation',
      sorting: true,
      defaultSort: 'desc',
      filtering: false,
      render: function render(row) {
        return renderCaptionString(Number.isFinite(row.elevation) ? "".concat(row.elevation.toFixed(2), "m") : '--', 'Elevation');
      },
      csvRender: function csvRender(row) {
        return Number.isFinite(row.elevation) ? row.elevation.toFixed(2) : null;
      }
    }, {
      // NLCD Class
      field: 'nlcdClass',
      title: 'NLCD Class',
      sorting: true,
      deafultSort: 'asc',
      searchable: true,
      lookup: Object.fromEntries(Object.keys(_SiteMapUtils.NLCD_CLASSES).filter(function (classKey) {
        return rows.some(function (row) {
          return row.nlcdClass === classKey;
        });
      }).sort().map(function (classKey) {
        return [classKey, _SiteMapUtils.NLCD_CLASSES[classKey].name];
      })),
      render: function render(row) {
        var nlcdClass = row.nlcdClass;

        if (!nlcdClass) {
          return renderCaptionString();
        }

        if (!_SiteMapUtils.NLCD_CLASSES[nlcdClass]) {
          return renderCaptionString(nlcdClass, 'NLCD Class');
        }

        var _NLCD_CLASSES$nlcdCla = _SiteMapUtils.NLCD_CLASSES[nlcdClass],
            title = _NLCD_CLASSES$nlcdCla.name,
            backgroundColor = _NLCD_CLASSES$nlcdCla.color;
        return /*#__PURE__*/_react.default.createElement("div", {
          className: classes.nlcdClassContainer
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: classes.nlcdClass,
          title: title,
          style: {
            backgroundColor: backgroundColor
          }
        }), renderCaptionString(title, 'NLCD Class'));
      },
      csvRender: function csvRender(row) {
        var nlcdClass = row.nlcdClass;

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
      render: function render(row) {
        var plotDimensions = row.plotDimensions,
            plotSize = row.plotSize;

        if (!plotDimensions) {
          return renderCaptionString();
        }

        return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderCaptionString("".concat(plotDimensions), 'Plot Size (Dimensions)'), Number.isFinite(plotSize) ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("br", null), renderCaptionString("(".concat(plotSize.toFixed(0), "m\xB2)"), 'Plot Size (Area)')) : null);
      },
      csvRender: function csvRender(row) {
        var plotDimensions = row.plotDimensions,
            plotSize = row.plotSize;
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
      render: function render(row) {
        return renderCaptionString(Number.isFinite(row.slopeAspect) ? "".concat(row.slopeAspect.toFixed(2), "\xB0") : '--', 'Slope Aspect');
      },
      csvRender: function csvRender(row) {
        return Number.isFinite(row.slopeAspect) ? row.slopeAspect.toFixed(2) : null;
      }
    }, {
      // Plot Slope Gradient
      field: 'slopeGradient',
      csvFields: ['slopeGradient (%)'],
      title: 'Slope Gradient',
      sorting: true,
      deafultSort: 'asc',
      filtering: false,
      render: function render(row) {
        return renderCaptionString(Number.isFinite(row.slopeGradient) ? "".concat(row.slopeGradient.toFixed(2), "%") : '--', 'Slope Gradient');
      },
      csvRender: function csvRender(row) {
        return Number.isFinite(row.slopeGradient) ? row.slopeGradient.toFixed(2) : null;
      }
    }, {
      // Sampling Module Count
      field: 'samplingModules',
      csvFields: 'samplingModulesCount',
      title: 'Potential Sampling Modules',
      filtering: false,
      sorting: true,
      deafultSort: 'asc',
      searchable: true,
      customSort: function customSort(rowA, rowB) {
        var a = Array.isArray(rowA.samplingModules) ? rowA.samplingModules.length : null;
        var b = Array.isArray(rowB.samplingModules) ? rowB.samplingModules.length : null;

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
      render: function render(row) {
        var samplingModules = row.samplingModules;

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
          }, samplingModules.map(function (m) {
            return /*#__PURE__*/_react.default.createElement("li", {
              key: m
            }, _SiteMapUtils.PLOT_SAMPLING_MODULES[m]);
          })) : /*#__PURE__*/_react.default.createElement("i", null, "none")
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
      csvRender: function csvRender(row) {
        return Array.isArray(row.samplingModules) ? row.samplingModules.length : null;
      }
    }, commonColumns.site, commonColumns.domain, commonColumns.state, commonColumns.coordinates];
  }

  var toolbarClassName = view === _SiteMapUtils.VIEWS.SPLIT ? classes.toolbarContainer : "".concat(classes.toolbarContainer, " ").concat(classes.toolbarContainerNoSplit);
  var components = {
    Container: _Box.default,
    Toolbar: function Toolbar(toolbarProps) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: toolbarClassName,
        "data-selenium": "sitemap-table-toolbar"
      }, /*#__PURE__*/_react.default.createElement(_materialTable.MTableToolbar, _extends({}, toolbarProps, {
        classes: {
          title: classes.tableTitle
        }
      })));
    },
    FilterRow: function FilterRow(filterRowProps) {
      return /*#__PURE__*/_react.default.createElement(_materialTable.MTableFilterRow, _extends({}, filterRowProps, {
        filterCellStyle: {
          padding: '8px',
          backgroundColor: _Theme.default.palette.grey[50]
        }
      }));
    }
  };
  var localization = {
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

  var tableOptions = {
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
    exportCsv: exportCsv,
    exportFileName: EXPORT_FILENAME,
    emptyRowsWhenPaging: false,
    thirdSortClick: false,
    rowStyle: function rowStyle(row) {
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
    selectionProps: !selectionActive ? null : function (row) {
      return {
        style: {
          margin: _Theme.default.spacing(0, 0.5)
        },
        disabled: !rowIsSelectable(row)
      };
    }
  };

  if (!fullHeight && view !== _SiteMapUtils.VIEWS.SPLIT) {
    tableOptions.maxBodyHeight = "".concat(maxBodyHeight || _SiteMapUtils.MIN_TABLE_MAX_BODY_HEIGHT, "px");
  }

  var containerClassName = "".concat(classes.tableContainer, " ").concat(classes.tableContainerIntegrated);
  var containerStyle = {};

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
    onSelectionChange: !selectionActive ? null : function (newRows) {
      var action = {
        type: 'updateSelectionSet',
        selection: new Set()
      };
      newRows.filter(function (row) {
        return row.tableData.checked;
      }).forEach(function (row) {
        if (focus === _SiteMapUtils.FEATURE_TYPES.SITES.KEY) {
          action.selection.add(row.siteCode);
        }
      });
      dispatch(action);
    }
  }));
};

var _default = SiteMapTable; // Additional items exported for unit testing

exports.default = _default;

var getTestableItems = function getTestableItems() {
  return process.env.NODE_ENV !== 'test' ? {} : {
    ucWord: ucWord,
    parseSearchTerms: parseSearchTerms,
    searchOnAttribs: searchOnAttribs,
    calculateMaxBodyHeight: calculateMaxBodyHeight,
    getFeatureName: getFeatureName,
    exportCsv: exportCsv
  };
};

exports.getTestableItems = getTestableItems;