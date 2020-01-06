'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TILE_LAYERS = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _operators = require('rxjs/operators');

var _styles = require('@material-ui/core/styles');

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _CircularProgress = require('@material-ui/core/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _Grid = require('@material-ui/core/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Paper = require('@material-ui/core/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _InfoOutlined = require('@material-ui/icons/InfoOutlined');

var _InfoOutlined2 = _interopRequireDefault(_InfoOutlined);

var _Warning = require('@material-ui/icons/Warning');

var _Warning2 = _interopRequireDefault(_Warning);

var _InsertChartOutlined = require('@material-ui/icons/InsertChartOutlined');

var _InsertChartOutlined2 = _interopRequireDefault(_InsertChartOutlined);

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

require('leaflet/dist/leaflet.css');

var _reactLeaflet = require('react-leaflet');

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

var _NeonGraphQL = require('../NeonGraphQL/NeonGraphQL');

var _NeonGraphQL2 = _interopRequireDefault(_NeonGraphQL);

var _sites = require('../../static/sites/sites.json');

var _sites2 = _interopRequireDefault(_sites);

var _states = require('../../static/states/states.json');

var _states2 = _interopRequireDefault(_states);

var _domains = require('../../static/domains/domains.json');

var _domains2 = _interopRequireDefault(_domains);

var _iconShadow = require('./icon-shadow.svg');

var _iconShadow2 = _interopRequireDefault(_iconShadow);

var _iconAquatic = require('./icon-aquatic.svg');

var _iconAquatic2 = _interopRequireDefault(_iconAquatic);

var _iconTerrestrial = require('./icon-terrestrial.svg');

var _iconTerrestrial2 = _interopRequireDefault(_iconTerrestrial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ICON_SVGS = {
  AQUATIC: _iconAquatic2.default,
  TERRESTRIAL: _iconTerrestrial2.default,
  SHADOW: _iconShadow2.default
};

var SITE_DETAILS_URL_BASE = 'https://www.neonscience.org/field-sites/field-sites-map/';
var EXPLORE_DATA_PRODUCTS_URL_BASE = 'https://data.neonscience.org/data-products/explore?site=';

var TILE_LAYERS = exports.TILE_LAYERS = {
  NatGeo_World_Map: {
    name: 'National Geographic',
    shortAttribution: '© Natl. Geographic et al.',
    fullAttribution: '© National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
  },
  World_Imagery: {
    name: 'Satellite Imagery',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  },
  World_Street_Map: {
    name: 'Streets',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
  },
  World_Topo_Map: {
    name: 'Topographic',
    shortAttribution: '© Esri et al.',
    fullAttribution: '© Esri, HERE, Garmin, Intermap, iPC, GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), OSM contributors, GIS Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
  }
};

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    notFetchedContainer: {
      width: '100%',
      height: '0px', // Necessary to set a fixed aspect ratio from props (using paddingBottom)
      position: 'relative',
      backgroundColor: _Theme.COLORS.BLUE[200],
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center'
    },
    notFetchedPaper: {
      position: 'absolute',
      width: '70%',
      top: '50%',
      transform: 'translate(0%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(3)
    },
    map: {
      width: '100%',
      height: '0px', // Necessary to set a fixed aspect ratio from props (using paddingBottom)
      overflow: 'hidden',
      '& div.leaflet-control-attribution a': {
        color: theme.palette.secondary.main
      },
      '& input[type="radio"]': {
        cursor: 'pointer'
      }
    },
    attribution: {
      color: theme.palette.secondary.main,
      fontSize: '11.5px',
      cursor: 'help',
      display: 'inline'
    },
    popup: {
      minWidth: '320px',
      '& a': {
        color: theme.palette.secondary.main
      },
      '& p': {
        margin: 'unset'
      },
      '& a.leaflet-popup-close-button': {
        top: theme.spacing(0.5),
        right: theme.spacing(0.5)
      }
    },
    popupButton: {
      width: '100%',
      whiteSpace: 'nowrap',
      marginBottom: theme.spacing(1),
      color: _Theme2.default.palette.primary.main + ' !important',
      borderColor: _Theme2.default.palette.primary.main,
      '& span': {
        pointerEvents: 'none'
      }
    },
    startFlex: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }
  };
});

var SiteMap = function SiteMap(props) {
  var aspectRatio = props.aspectRatio,
      center = props.center,
      tileLayerProp = props.tileLayer,
      initialZoom = props.zoom,
      sitesProp = props.sites,
      popupHrefNew = props.popupHrefNew,
      popupExploreDataProductsButton = props.popupExploreDataProductsButton;

  var classes = useStyles(_Theme2.default);

  var sitesArrayToKeyedObject = function sitesArrayToKeyedObject() {
    var sitesArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    if (!Array.isArray(sitesArray)) {
      return {};
    }
    var sites = {};
    sitesArray.forEach(function (site) {
      sites[site.siteCode] = {
        siteCode: site.siteCode || site.code,
        description: site.siteDescription || site.description,
        type: site.siteType || site.type,
        stateCode: site.stateCode,
        domainCode: site.domainCode,
        latitude: site.siteLatitude || site.latitude,
        longitude: site.siteLongitude || site.longitude,
        terrain: site.terrain || _sites2.default[site.siteCode].terrain
      };
    });
    return sites;
  };

  /**
     Prepare sites object. Our preferred shape looks like this:
     {
       ABBY: {
         description: 'Abby Road',
         type: 'RELOCATABLE',
         stateCode: 'WA',
         domainCode: 'D16',
         terrain: 'TERRESTRIAL',
         latitude: 45.762439,
         longitude: -122.330317,
       },
       ...
     }
     We may be passed something from props that is either this or the API response
     shape, so massage whatever we have into something we can use.
  */
  var sites = {};
  var fetchSitesStatus = 'awaitingFetchCall';
  if (sitesProp) {
    if (Array.isArray(sitesProp)) {
      sites = sitesArrayToKeyedObject(sitesProp);
      fetchSitesStatus = 'fetched';
    } else if ((typeof sitesProp === 'undefined' ? 'undefined' : _typeof(sitesProp)) === 'object' && Object.keys(sitesProp).length > 0) {
      sites = _extends({}, sitesProp);
      Object.keys(sites).forEach(function (siteCode) {
        if (!sites[siteCode].terrain) {
          sites[siteCode].terrain = _sites2.default[siteCode].terrain;
        }
      });
      fetchSitesStatus = 'fetched';
    }
  }

  var reducer = function reducer(state, action) {
    switch (action.type) {
      case 'fetchSitesCalled':
        return _extends({}, state, { fetchSitesStatus: 'fetching' });
      case 'fetchSitesSucceeded':
        return _extends({}, state, { fetchSitesStatus: 'fetched', sites: action.sites });
      case 'fetchSitesFailed':
        return _extends({}, state, { fetchSitesStatus: 'error', fetchSitesError: action.error });
      case 'setTileLayer':
        if (!TILE_LAYERS[action.tileLayer]) {
          return state;
        }
        return _extends({}, state, { tileLayer: action.tileLayer });
      case 'setZoom':
        return _extends({}, state, { zoom: action.zoom });
      default:
        return state;
    }
  };

  var initialState = {
    zoom: initialZoom,
    tileLayer: tileLayerProp,
    sites: sites,
    fetchSitesStatus: fetchSitesStatus,
    fetchSitesError: null
  };

  var _useReducer = (0, _react.useReducer)(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var fetchAllSites$ = _NeonGraphQL2.default.getAllSites().pipe((0, _operators.map)(function (response) {
    if (response.response && response.response.data && response.response.data.sites) {
      var sitesResponse = sitesArrayToKeyedObject(response.response.data.sites);
      dispatch({ type: 'fetchSitesSucceeded', sites: sitesResponse });
    } else {
      dispatch({ type: 'fetchSitesFailed', error: 'malformed response' });
    }
  }), (0, _operators.catchError)(function (error) {
    dispatch({ type: 'fetchSitesFailed', error: error });
  }));

  (0, _react.useEffect)(function () {
    if (state.fetchSitesStatus === 'awaitingFetchCall') {
      dispatch({ type: 'fetchSitesCalled' });
      fetchAllSites$.subscribe();
    }
  });

  if (state.fetchSitesStatus !== 'fetched') {
    var notFetchedContents = _react2.default.createElement(
      _react2.default.Fragment,
      null,
      _react2.default.createElement(
        _Typography2.default,
        { variant: 'h6', component: 'h3', gutterBottom: true },
        'Loading Sites...'
      ),
      _react2.default.createElement(_CircularProgress2.default, null)
    );
    if (state.fetchSitesStatus === 'error') {
      notFetchedContents = _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(_Warning2.default, { fontSize: 'large', color: 'error' }),
        _react2.default.createElement(
          _Typography2.default,
          { variant: 'h6', component: 'h3', style: { marginTop: _Theme2.default.spacing(1) } },
          'Unable to load sites: ' + state.fetchSitesError
        )
      );
    }
    return _react2.default.createElement(
      'div',
      {
        className: classes.notFetchedContainer,
        style: { paddingBottom: aspectRatio * 100 + '%' }
      },
      _react2.default.createElement(
        _Paper2.default,
        { className: classes.notFetchedPaper },
        notFetchedContents
      )
    );
  }

  var renderLayersControl = function renderLayersControl() {
    var BaseLayer = _reactLeaflet.LayersControl.BaseLayer;

    return _react2.default.createElement(
      _reactLeaflet.LayersControl,
      { position: 'topright' },
      Object.keys(TILE_LAYERS).map(function (key) {
        var tileLayer = TILE_LAYERS[key];
        var attributionNode = _react2.default.createElement(
          'div',
          { title: tileLayer.fullAttribution, className: classes.attribution },
          tileLayer.shortAttribution
        );
        var attributionString = _server2.default.renderToStaticMarkup(attributionNode);
        return _react2.default.createElement(
          BaseLayer,
          { key: key, checked: key === state.tileLayer, name: tileLayer.name },
          _react2.default.createElement(_reactLeaflet.TileLayer, { url: tileLayer.url, attribution: attributionString })
        );
      })
    );
  };

  var getZoomedIcon = function getZoomedIcon() {
    var terrain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'TERRESTRIAL';

    if (!ICON_SVGS[terrain] || !ICON_SVGS.SHADOW) {
      return null;
    }
    var iconScale = 0.2 + Math.floor((state.zoom - 2) / 3) / 10;
    return new _leaflet2.default.Icon({
      iconUrl: ICON_SVGS[terrain],
      iconRetinaUrl: ICON_SVGS[terrain],
      iconSize: [100, 100].map(function (x) {
        return x * iconScale;
      }),
      iconAnchor: [50, 100].map(function (x) {
        return x * iconScale;
      }),
      shadowUrl: ICON_SVGS.SHADOW,
      shadowSize: [156, 93].map(function (x) {
        return x * iconScale;
      }),
      shadowAnchor: [50, 95].map(function (x) {
        return x * iconScale;
      }),
      popupAnchor: [0, -100].map(function (x) {
        return x * iconScale;
      })
    });
  };

  var renderSitePopup = function renderSitePopup(site) {
    var terrainTitle = 'Terrestrial';
    var terrainSubtitle = '(land-based)';
    if (site.terrain === 'AQUATIC') {
      terrainTitle = 'Aquatic';
      terrainSubtitle = '(water-based)';
    }
    var terrainIcon = _react2.default.createElement('img', {
      src: ICON_SVGS[site.terrain],
      alt: site.terrain,
      title: terrainTitle + ' ' + terrainSubtitle,
      width: _Theme2.default.spacing(5),
      height: _Theme2.default.spacing(5),
      style: { marginRight: _Theme2.default.spacing(1) }
    });
    var target = popupHrefNew ? { target: '_blank' } : {};
    var siteDetailsButton = _react2.default.createElement(
      _Button2.default,
      _extends({
        className: classes.popupButton,
        variant: 'outlined',
        color: 'primary',
        endIcon: _react2.default.createElement(_InfoOutlined2.default, null),
        href: '' + SITE_DETAILS_URL_BASE + site.siteCode
      }, target),
      'Site Details'
    );
    var exploreDataProductsButton = popupExploreDataProductsButton ? _react2.default.createElement(
      _Button2.default,
      _extends({
        className: classes.popupButton,
        variant: 'outlined',
        color: 'primary',
        endIcon: _react2.default.createElement(_InsertChartOutlined2.default, null),
        href: '' + EXPLORE_DATA_PRODUCTS_URL_BASE + site.siteCode
      }, target),
      'Explore Data Products'
    ) : null;
    var renderField = function renderField(title, value) {
      var marginBottom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
      return _react2.default.createElement(
        'div',
        { style: { marginBottom: _Theme2.default.spacing(marginBottom) } },
        _react2.default.createElement(
          _Typography2.default,
          { variant: 'subtitle2' },
          title
        ),
        _react2.default.createElement(
          _Typography2.default,
          { variant: 'body2' },
          value
        )
      );
    };
    var stateFieldTitle = site.stateCode === 'PR' ? 'Territory' : 'State';
    return _react2.default.createElement(
      _reactLeaflet.Popup,
      { className: classes.popup },
      _react2.default.createElement(
        _Typography2.default,
        { variant: 'h5', gutterBottom: true },
        site.description + ' (' + site.siteCode + ')'
      ),
      _react2.default.createElement(
        _Grid2.default,
        { container: true, spacing: 2 },
        _react2.default.createElement(
          _Grid2.default,
          { item: true, xs: 6 },
          _react2.default.createElement(
            'div',
            { className: classes.startFlex, style: { marginBottom: _Theme2.default.spacing(2) } },
            terrainIcon,
            renderField(terrainTitle, terrainSubtitle, 0)
          ),
          renderField('Latitude/Longitude', site.latitude + ', ' + site.longitude)
        ),
        _react2.default.createElement(
          _Grid2.default,
          { item: true, xs: 6 },
          renderField(stateFieldTitle, _states2.default[site.stateCode].name),
          renderField('Domain', site.domainCode + ' - ' + _domains2.default[site.domainCode].name)
        )
      ),
      siteDetailsButton,
      _react2.default.createElement('br', null),
      exploreDataProductsButton
    );
  };

  var renderSiteMarkers = function renderSiteMarkers() {
    var zoomedIcons = {
      AQUATIC: getZoomedIcon('AQUATIC'),
      TERRESTRIAL: getZoomedIcon('TERRESTRIAL')
    };
    return Object.keys(state.sites).map(function (siteCode) {
      var site = state.sites[siteCode];
      if (!site.latitude || !site.longitude || !zoomedIcons[site.terrain]) {
        return null;
      }
      return _react2.default.createElement(
        _reactLeaflet.Marker,
        {
          key: siteCode,
          position: [site.latitude, site.longitude],
          icon: zoomedIcons[site.terrain]
        },
        renderSitePopup(site)
      );
    });
  };

  return _react2.default.createElement(
    _reactLeaflet.Map,
    {
      className: classes.map,
      style: { paddingBottom: aspectRatio * 100 + '%' },
      center: center,
      zoom: state.zoom,
      maxZoom: 17,
      minZoom: 2,
      onZoomEnd: function onZoomEnd(event) {
        dispatch({ type: 'setZoom', zoom: event.target.getZoom() });
      }
    },
    renderLayersControl(),
    renderSiteMarkers(),
    _react2.default.createElement(_reactLeaflet.ScaleControl, { imperial: true, metric: true, updateWhenIdle: true })
  );
};

SiteMap.propTypes = {
  aspectRatio: _propTypes2.default.number,
  center: _propTypes2.default.arrayOf(_propTypes2.default.number),
  zoom: _propTypes2.default.number,
  tileLayer: _propTypes2.default.oneOf(Object.keys(TILE_LAYERS)),
  popupHrefNew: _propTypes2.default.bool,
  popupExploreDataProductsButton: _propTypes2.default.bool,
  sites: _propTypes2.default.oneOf([_propTypes2.default.arrayOf(_propTypes2.default.shape({
    siteCode: _propTypes2.default.string.isRequired,
    siteDescription: _propTypes2.default.string.isRequired,
    siteLatitude: _propTypes2.default.number.isRequired,
    siteLongitude: _propTypes2.default.number.isRequired,
    siteType: _propTypes2.default.string,
    domainCode: _propTypes2.default.string,
    stateCode: _propTypes2.default.string,
    terrain: _propTypes2.default.string
  })), _propTypes2.default.objectOf(_propTypes2.default.shape({
    description: _propTypes2.default.string.isRequired,
    latitude: _propTypes2.default.number.isRequired,
    longitude: _propTypes2.default.number.isRequired,
    type: _propTypes2.default.string.isRequired,
    terrain: _propTypes2.default.string.isRequired,
    domainCode: _propTypes2.default.string.isRequired,
    stateCode: _propTypes2.default.string.isRequired
  }))])
};

SiteMap.defaultProps = {
  aspectRatio: 0.75,
  center: [52.28, -110.75],
  tileLayer: 'NatGeo_World_Map',
  zoom: 3,
  popupHrefNew: true,
  popupExploreDataProductsButton: true,
  sites: null
};

exports.default = SiteMap;