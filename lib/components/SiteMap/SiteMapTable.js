"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styles = require("@material-ui/core/styles");

var _Box = _interopRequireDefault(require("@material-ui/core/Box"));

var _Checkbox = _interopRequireDefault(require("@material-ui/core/Checkbox"));

var _Link = _interopRequireDefault(require("@material-ui/core/Link"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _InfoOutlined = _interopRequireDefault(require("@material-ui/icons/InfoOutlined"));

var _LocationOn = _interopRequireDefault(require("@material-ui/icons/LocationOn"));

var _InsertChartOutlined = _interopRequireDefault(require("@material-ui/icons/InsertChartOutlined"));

var _materialTable = _interopRequireWildcard(require("material-table"));

var _MaterialTableIcons = _interopRequireDefault(require("../MaterialTableIcons/MaterialTableIcons"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _SiteMapContext = _interopRequireDefault(require("./SiteMapContext"));

var _SiteMapUtils = require("./SiteMapUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ucWord = function ucWord(word) {
  return "".concat(word.slice(0, 1).toUpperCase()).concat(word.slice(1).toLowerCase());
};

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    tableContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      '& table': {
        margin: '0px !important'
      },
      '& tfoot': {
        paddingRight: '36px'
      }
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
    row: {},
    rowSelected: {
      backgroundColor: "".concat(theme.palette.secondary.main, "20")
    },
    startFlex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    toolbarContainer: {
      backgroundColor: theme.palette.grey[50],
      borderBottom: "1px dotted ".concat(theme.palette.grey[300]),
      paddingRight: theme.spacing(1) // padding: theme.spacing(0, 1, 0, 2),
      // display: 'flex',
      // alignItems: 'center',
      // justifyContent: 'space-between',

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
    number: {
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
      marginBottom: _Theme.default.spacing(1),
      minWidth: '200px'
    }
  };
});

var calculateMaxBodyHeight = function calculateMaxBodyHeight(tableRef) {
  if (!tableRef || !tableRef.current) {
    return _SiteMapUtils.MIN_TABLE_MAX_BODY_HEIGHT;
  }

  var containerHeight = tableRef.current.clientHeight || 0;
  var toolbarHeight = tableRef.current.children[0].children[0].clientHeight || 0;
  var pagerHeight = tableRef.current.children[0].children[2].clientHeight || 0;
  return Math.max(containerHeight - toolbarHeight - pagerHeight, _SiteMapUtils.MIN_TABLE_MAX_BODY_HEIGHT);
};

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

  var _state$table = state.table,
      focus = _state$table.focus,
      maxBodyHeight = _state$table.maxBodyHeight,
      maxBodyHeightUpdateFromAspectRatio = _state$table.maxBodyHeightUpdateFromAspectRatio;
  var selectionActive = state.selection.active === focus;
  var selection = selectionActive ? state.selection[state.selection.active] : new Set();
  /**
    Effect - Initialize table if this is the first time we're seeing it
  */

  (0, _react.useEffect)(function () {
    if (!tableRef || !tableRef.current || state.view.current !== _SiteMapUtils.VIEWS.TABLE || state.view.initialized[_SiteMapUtils.VIEWS.TABLE]) {
      return;
    }

    dispatch({
      type: 'setViewInitialized'
    });
    dispatch({
      type: 'setTableMaxBodyHeight',
      height: calculateMaxBodyHeight(tableRef)
    });
  }, [tableRef, state.view, dispatch]);
  /**
    Effect - Recalculate the max body height from an aspect ratio change (e.g. page resize)
  */

  (0, _react.useEffect)(function () {
    if (state.view.current === _SiteMapUtils.VIEWS.TABLE && state.view.initialized[_SiteMapUtils.VIEWS.TABLE] && maxBodyHeightUpdateFromAspectRatio) {
      dispatch({
        type: 'setTableMaxBodyHeight',
        height: calculateMaxBodyHeight(tableRef)
      });
    }
  }, [tableRef, state.view, dispatch, maxBodyHeightUpdateFromAspectRatio]);

  if (!canRender) {
    return null;
  } // Selection functions


  var rowIsSelected = function rowIsSelected() {
    return false;
  };

  var selectRow = function selectRow() {};

  switch (focus) {
    case _SiteMapUtils.FEATURE_TYPES.SITES:
      rowIsSelected = function rowIsSelected(row) {
        return selection.has(row.siteCode);
      };

      selectRow = function selectRow(row) {
        return dispatch({
          type: 'toggleSiteSelected',
          site: row.siteCode
        });
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
      source = {
        code: 'siteCode',
        data: state.sites
      };
    } else if (type === 'STATE') {
      source = {
        code: 'stateCode',
        data: state.featureData.BOUNDARIES.STATES
      };
    } else if (type === 'DOMAIN') {
      source = {
        code: 'domainCode',
        data: state.featureData.BOUNDARIES.DOMAINS
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

  var getFeatureName = function getFeatureName(featureKey) {
    if (_SiteMapUtils.FEATURES[featureKey]) {
      return _SiteMapUtils.FEATURES[featureKey].nameSingular || _SiteMapUtils.FEATURES[featureKey].name || featureKey;
    }

    return featureKey;
  };

  var renderFeatureIcon = function renderFeatureIcon(featureKey) {
    if (!_SiteMapUtils.FEATURES[featureKey] || !_SiteMapUtils.FEATURES[featureKey].iconSvg) {
      return null;
    }

    var iconSvg = _SiteMapUtils.FEATURES[featureKey].iconSvg;
    return /*#__PURE__*/_react.default.createElement("img", {
      alt: getFeatureName(featureKey),
      src: iconSvg,
      className: classes.featureIcon
    });
  };

  var renderNumberString = function renderNumberString() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '--';
    var ariaLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      "aria-label": ariaLabel,
      className: classes.number
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
      if (focus === _SiteMapUtils.FEATURE_TYPES.SITES) {
        locations[siteCode] = state.featureData[focus][featureKey][siteCode];
      }

      if (focus === _SiteMapUtils.FEATURE_TYPES.LOCATIONS) {
        Object.keys(state.featureData[focus][featureKey][siteCode]).forEach(function (locationCode) {
          locations[locationCode] = state.featureData[focus][featureKey][siteCode][locationCode];
        });
      }
    });
  });
  var rows = (0, _SiteMapUtils.calculateLocationsInMap)(locations, state.map.bounds).map(function (key) {
    return locations[key];
  });
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
      title: 'Site',
      sorting: true,
      defaultSort: 'desc',
      lookup: Object.fromEntries(Array.from(sitesInMap).map(function (siteCode) {
        return [siteCode, siteCode];
      })),
      customSort: function customSort(rowA, rowB) {
        var siteA = getSite(rowA);
        var siteB = getSite(rowB);
        return siteA.description > siteB.description ? -1 : 1;
      },
      render: function render(row) {
        var site = getSite(row);

        if (!site) {
          return null;
        }

        var featureKey = "".concat(site.terrain.toUpperCase(), "_").concat(site.type.toUpperCase(), "_SITES");
        return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
          className: classes.siteName
        }, renderFeatureIcon(featureKey), /*#__PURE__*/_react.default.createElement("span", null, "".concat(site.description, " (").concat(site.siteCode, ")"))), /*#__PURE__*/_react.default.createElement("div", {
          className: classes.startFlex,
          style: {
            marginLeft: _Theme.default.spacing(-0.75)
          }
        }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          title: "Jump to ".concat(site.siteCode, " on the map")
        }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
          size: "small",
          color: "primary",
          className: classes.iconButton,
          onClick: function onClick() {
            return jumpTo(site.siteCode);
          },
          "data-selenium": "sitemap-table-site-button-jumpTo",
          "aria-label": "Jump to site on map"
        }, /*#__PURE__*/_react.default.createElement(_LocationOn.default, {
          fontSize: "inherit"
        }))), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          title: "Visit the ".concat(site.siteCode, " site details page")
        }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
          size: "small",
          color: "primary",
          className: classes.iconButton,
          href: "".concat((0, _SiteMapUtils.getHref)('SITE_DETAILS', site.siteCode)),
          "data-selenium": "sitemap-table-site-button-siteDetails",
          "aria-label": "Visit site details page"
        }, /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, {
          fontSize: "inherit"
        }))), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          title: "Explore data products for ".concat(site.siteCode)
        }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
          size: "small",
          color: "primary",
          className: classes.iconButton,
          href: "".concat((0, _SiteMapUtils.getHref)('EXPLORE_DATA_PRODUCTS_BY_SITE', site.siteCode)),
          "data-selenium": "sitemap-table-site-button-exploreDataProducts",
          "aria-label": "Explore data products for this site"
        }, /*#__PURE__*/_react.default.createElement(_InsertChartOutlined.default, {
          fontSize: "inherit"
        })))));
      }
    },
    domain: {
      field: 'domainCode',
      title: 'Domain',
      sorting: true,
      defaultSort: 'desc',
      lookup: Object.fromEntries(Array.from(domainsInMap).map(function (domainCode) {
        return [domainCode, domainCode];
      })),
      customSort: function customSort(rowA, rowB) {
        var domainA = getDomain(rowA);
        var domainB = getDomain(rowB);
        return domainA.domainCode > domainB.domainCode ? -1 : 1;
      },
      render: function render(row) {
        var domain = getDomain(row);
        return !domain ? null : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
          style: {
            marginBottom: _Theme.default.spacing(1)
          }
        }, domain.domainCode), /*#__PURE__*/_react.default.createElement("div", {
          className: classes.startFlex,
          style: {
            marginLeft: _Theme.default.spacing(-0.75)
          }
        }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          title: "Jump to ".concat(domain.domainCode, " on the map")
        }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
          size: "small",
          color: "primary",
          className: classes.iconButton,
          onClick: function onClick() {
            return jumpTo(domain.domainCode);
          },
          "data-selenium": "sitemap-table-domain-button-jumpTo",
          "aria-label": "Jump to domain on map"
        }, /*#__PURE__*/_react.default.createElement(_LocationOn.default, {
          fontSize: "inherit"
        }))), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          title: "Visit the ".concat(domain.domainCode, " domain details page")
        }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
          size: "small",
          color: "primary",
          className: classes.iconButton,
          href: "".concat((0, _SiteMapUtils.getHref)('DOMAIN_DETAILS', domain.domainCode)),
          "data-selenium": "sitemap-table-domain-button-domainDetails",
          "aria-label": "Visit domain details page"
        }, /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, {
          fontSize: "inherit"
        }))), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          title: "Explore data products for ".concat(domain.domainCode)
        }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
          size: "small",
          color: "primary",
          className: classes.iconButton,
          href: "".concat((0, _SiteMapUtils.getHref)('EXPLORE_DATA_PRODUCTS_BY_DOMAIN', domain.domainCode)),
          "data-selenium": "sitemap-table-domain-button-exploreDataProducts",
          "aria-label": "Explore data products for this domain"
        }, /*#__PURE__*/_react.default.createElement(_InsertChartOutlined.default, {
          fontSize: "inherit"
        })))));
      }
    },
    state: {
      field: 'stateCode',
      title: 'State',
      sorting: true,
      defaultSort: 'desc',
      lookup: Object.fromEntries(Array.from(statesInMap).map(function (stateCode) {
        return [stateCode, state.featureData.BOUNDARIES.STATES[stateCode].name];
      })),
      customSort: function customSort(rowA, rowB) {
        var stateA = getState(rowA);
        var stateB = getState(rowB);
        return stateA.name > stateB.name ? -1 : 1;
      },
      render: function render(row) {
        var usstate = getState(row);
        return !usstate ? null : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
          style: {
            marginBottom: _Theme.default.spacing(1)
          }
        }, usstate.name), /*#__PURE__*/_react.default.createElement("div", {
          className: classes.startFlex,
          style: {
            marginLeft: _Theme.default.spacing(-0.75)
          }
        }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          title: "Jump to ".concat(usstate.name, " on the map")
        }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
          size: "small",
          color: "primary",
          className: classes.iconButton,
          onClick: function onClick() {
            return jumpTo(usstate.stateCode);
          },
          "data-selenium": "sitemap-table-state-button-jumpTo",
          "aria-label": "Jump to state on map"
        }, /*#__PURE__*/_react.default.createElement(_LocationOn.default, {
          fontSize: "inherit"
        }))), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          title: "Explore data products for ".concat(usstate.stateCode)
        }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
          size: "small",
          color: "primary",
          className: classes.iconButton,
          href: "".concat((0, _SiteMapUtils.getHref)('EXPLORE_DATA_PRODUCTS_BY_STATE', usstate.stateCode)),
          "data-selenium": "sitemap-table-state-button-exploreDataProducts",
          "aria-label": "Explore data products for this state"
        }, /*#__PURE__*/_react.default.createElement(_InsertChartOutlined.default, {
          fontSize: "inherit"
        })))));
      }
    },
    selected: {
      field: 'selected',
      title: '',
      render: function render(row) {
        return /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
          checked: rowIsSelected(row),
          onChange: selectRow,
          color: "secondary"
        });
      }
    },
    latitude: {
      field: 'latitude',
      title: 'Latitude',
      sorting: true,
      filtering: false,
      render: function render(row) {
        return renderNumberString(row.latitude.toFixed(5), 'Latitude');
      }
    },
    longitude: {
      field: 'longitude',
      title: 'Longitude',
      sorting: true,
      filtering: false,
      render: function render(row) {
        return renderNumberString(row.longitude.toFixed(5), 'Longitude');
      }
    }
  };
  /**
     Define columns from current focus feature type
  */

  var columns = [];

  if (focus === _SiteMapUtils.FEATURE_TYPES.SITES) {
    columns = [commonColumns.site, commonColumns.latitude, commonColumns.longitude, {
      // Site Type
      field: 'type',
      title: 'Type',
      sorting: true,
      defaultSort: 'desc',
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
    }, commonColumns.domain, commonColumns.state];
  }

  if (focus === _SiteMapUtils.FEATURE_TYPES.LOCATIONS) {
    columns = [{
      // Location Name
      field: 'name',
      title: 'Name',
      sorting: true,
      defaultSort: 'desc',
      render: function render(row) {
        return /*#__PURE__*/_react.default.createElement(_Link.default, {
          component: "button",
          className: classes.linkButton,
          onClick: function onClick() {
            return jumpTo(row.name);
          }
        }, row.name);
      }
    }, {
      // Location Type
      field: 'featureKey',
      title: 'Type',
      sorting: true,
      defaultSort: 'desc',
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
      }
    }, commonColumns.latitude, commonColumns.longitude, {
      // Elevation
      field: 'elevation',
      title: 'Elevation',
      sorting: true,
      defaultSort: 'desc',
      filtering: false,
      render: function render(row) {
        return renderNumberString(Number.isFinite(row.elevation) ? "".concat(row.elevation.toFixed(2), "m") : '--', 'Elevation');
      }
    }, {
      // Plot Size
      field: 'plotSize',
      title: 'Plot Size',
      sorting: true,
      deafultSort: 'asc',
      filtering: false,
      render: function render(row) {
        return row.plotDimensions ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderNumberString("".concat(row.plotDimensions), 'Plot Size (Dimensions)'), Number.isFinite(row.plotSize) ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("br", null), renderNumberString("(".concat(row.plotSize.toFixed(0), "m\xB2)"), 'Plot Size (Area)')) : null) : renderNumberString();
      }
    }, {
      // Plot Slope Aspect
      field: 'slopeAspect',
      title: 'Slope Aspect',
      sorting: true,
      deafultSort: 'asc',
      filtering: false,
      render: function render(row) {
        return renderNumberString(Number.isFinite(row.slopeAspect) ? "".concat(row.slopeAspect.toFixed(2), "\xB0") : '--', 'Slope Aspect');
      }
    }, {
      // Plot Slope Gradient
      field: 'slopeGradient',
      title: 'Slope Gradient',
      sorting: true,
      deafultSort: 'asc',
      filtering: false,
      render: function render(row) {
        return renderNumberString(Number.isFinite(row.slopeGradient) ? "".concat(row.slopeGradient.toFixed(2), "%") : '--', 'Slope Gradient');
      }
    }, {
      // Sampling Module Count
      field: 'samplingModules',
      title: 'Potential Sampling Modules',
      filtering: false,
      sorting: true,
      deafultSort: 'asc',
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
        return Array.isArray(row.samplingModules) ? /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
          interactive: true,
          placement: "left",
          title: row.samplingModules.length ? /*#__PURE__*/_react.default.createElement("ul", {
            style: {
              marginLeft: _Theme.default.spacing(-1)
            }
          }, row.samplingModules.map(function (m) {
            return /*#__PURE__*/_react.default.createElement("li", {
              key: m
            }, _SiteMapUtils.PLOT_SAMPLING_MODULES[m]);
          })) : /*#__PURE__*/_react.default.createElement("i", null, "none")
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: classes.startFlex
        }, renderNumberString(row.samplingModules.length, 'Potential Sampling Modules'), /*#__PURE__*/_react.default.createElement(_IconButton.default, {
          size: "small",
          className: classes.iconButton,
          "aria-label": "Potential Sampling Modules"
        }, /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, {
          fontSize: "inherit"
        })))) : renderNumberString();
      }
    }, commonColumns.site, commonColumns.domain, commonColumns.state];
  }

  if (selectionActive) {
    columns.unshift(commonColumns.selected);
  }

  var components = {
    Container: _Box.default,
    Toolbar: function Toolbar(toolbarProps) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: classes.toolbarContainer,
        "data-selenium": "sitemap-table-toolbar"
      }, /*#__PURE__*/_react.default.createElement(_materialTable.MTableToolbar, toolbarProps));
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

  return /*#__PURE__*/_react.default.createElement("div", {
    ref: tableRef,
    className: classes.tableContainer,
    "data-selenium": "sitemap-content-table"
  }, /*#__PURE__*/_react.default.createElement(_materialTable.default, {
    icons: _MaterialTableIcons.default,
    components: components,
    columns: columns,
    data: rows,
    localization: localization,
    title: "".concat(ucWord(focus), " in current view"),
    options: {
      padding: 'dense',
      filtering: true,
      columnsButton: true,
      headerStyle: {
        position: 'sticky',
        top: 0,
        backgroundColor: _Theme.default.palette.grey[50]
      },
      maxBodyHeight: "".concat(maxBodyHeight || _SiteMapUtils.MIN_TABLE_MAX_BODY_HEIGHT, "px")
    }
  }));
};

var _default = SiteMapTable;
exports.default = _default;