"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _htmlReactParser = _interopRequireWildcard(require("html-react-parser"));
var _styles = require("@material-ui/core/styles");
var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));
var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));
var _camelCase = _interopRequireDefault(require("lodash/camelCase"));
var _remoteAssetsMap = _interopRequireDefault(require("../../remoteAssetsMap/remoteAssetsMap"));
var _drupalHeader = _interopRequireDefault(require("../../remoteAssets/drupal-header.html"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _NeonAuth = _interopRequireWildcard(require("../NeonAuth/NeonAuth"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _NeonContext = _interopRequireWildcard(require("../NeonContext/NeonContext"));
var _ApplicationMenu = _interopRequireDefault(require("./ApplicationMenu"));
var _headerSearch = _interopRequireDefault(require("../../images/svg/header-search.svg"));
var _headerSearchHover = _interopRequireDefault(require("../../images/svg/header-search-hover.svg"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const DRUPAL_HEADER_HTML = _remoteAssetsMap.default.DRUPAL_HEADER_HTML.KEY;
const AUTH_ELEMENT_ID = 'header__authentication-ui';
const useStyles = (0, _styles.makeStyles)(theme => ({
  skeletonHeader: {
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)'
  },
  // positioning of sign-in and sign-out buttons
  coreAuthContainer: {
    // common styles
    textAlign: 'right',
    position: 'absolute',
    zIndex: 15,
    // viewport-specific styles
    [theme.breakpoints.up('lg')]: {
      padding: '0px',
      top: '-1px',
      right: '0px',
      '& :last-child': {
        borderRight: 'none',
        borderTopRightRadius: '0px',
        borderBottomRightRadius: '0px'
      },
      '& :first-child': {
        borderRight: 'none',
        borderTopLeftRadius: '0px'
      }
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1, 2),
      top: theme.spacing(1),
      right: theme.spacing(9)
    }
  },
  // These styles are gross. We need to rework the header coming from the Drupal site to make this
  // less necessary.
  unstickyHeader: {
    paddingTop: 'unset !important',
    '& > header': {
      position: 'unset !important',
      '& label[for="nav-trigger"]': {
        zIndex: '9 !important'
      },
      '& div.header__site-navigation': {
        zIndex: '8 !important'
      },
      [theme.breakpoints.down('sm')]: {
        '& .header__site-navigation': {
          display: 'none'
        },
        '& .nav-trigger:checked ~ .header__site-navigation': {
          display: 'block'
        }
      }
    }
  },
  headerContainerFallback: {
    '& li.siteSearch > a': {
      background: "url('".concat(_headerSearch.default, "') center center no-repeat !important")
    },
    '& li.siteSearch > a:hover': {
      background: "url('".concat(_headerSearchHover.default, "') center center no-repeat !important")
    }
  },
  // Injecting these styles as a means of fixing up the search display
  // Ideally, this CSS comes from Drupal and is removed from here...
  headerContainer: {
    // // Added menu__link to more closely mimic Drupal site links.
    // '& .menu__link': {
    //   fontSize: '1.1rem !important',
    //   fontWeight: '700 !important',
    // },
    '& .header__search': {
      background: '#f5f6f7',
      position: 'relative',
      zIndex: 1,
      transition: 'all 0.2s ease-in-out',
      opacity: 1,
      visibility: 'visible',
      fontSize: '1.1rem' // Added, font sizes look bigger on Drupal site.
    },
    '& .header__search.visually-hidden': {
      visibility: 'hidden',
      opacity: 0,
      transition: 'all 0.2s ease-in-out'
    },
    '& .header__search > .header__search--inner': {
      display: 'flex',
      maxWidth: '1620px',
      margin: '0 auto'
    },
    '& .header__inner.l--offset-wide': {
      paddingLeft: 'calc(2/27*100%)',
      paddingRight: 'calc(2/27*100%)'
    },
    // Purely a quick-fix workaround for Drupal header auth container...
    '& .header__inner.l--offset-wide > .authContainer': {
      display: 'none !important'
    },
    '& .header__search--inner': {
      display: 'flex',
      '-ms-flex-pack': 'start',
      justifyContent: 'flex-start',
      '-ms-flex-align': 'center',
      alignItems: 'center'
    },
    '& .header__search--inner > .header__search--title': {
      fontWeight: '600 !important',
      // Changed from 600 to match Drupal site.
      fontSize: '0.9rem !important',
      // Changed from 0.9 to match Drupal site.
      margin: '0 2.6rem 0 0 !important'
    },
    [theme.breakpoints.up('lg')]: {
      '& .header__search--inner > .header__search--title': {
        fontSize: '1.25rem !important' // Changed from 1.0 to match Drupal site.
      }
    },
    '& .header__search--inner > div.search-api-form > form#search-api-form': {
      display: 'flex',
      '-ms-flex-pack': 'start',
      justifyContent: 'flex-start',
      '-ms-flex-align': 'center',
      alignItems: 'center',
      width: '100%'
    },
    '& .header__search--inner > div.search-api-form > form#search-api-form > .form-item': {
      width: '100%',
      display: 'flex',
      '-ms-flex-pack': 'start',
      justifyContent: 'flex-start',
      '-ms-flex-align': 'center',
      alignItems: 'center',
      margin: '20px 0'
    },
    '& .header__search--inner > div.search-api-form': {
      width: '100%'
    },
    '& .header__search--inner > div.search-api-form > form#search-api-form > .form-actions.form-wrapper': {
      display: 'flex'
    },
    '& .header__search--inner > div.search-api-form > form#search-api-form > .form-item > .form-search': {
      width: '100%',
      height: '48px',
      background: '#fff',
      border: '1px solid #d7d9d9',
      boxSizing: 'border-box',
      borderRadius: '3px 0 0 3px',
      padding: '12px 18px'
    },
    '& .header__search--inner > div.search-api-form > form#search-api-form > .form-actions > .form-submit.button--search': {
      borderRadius: '0px 3px 3px 0px',
      width: '48px',
      height: '48px',
      background: '#0073cf',
      border: '#0073cf 1px solid',
      color: 'transparent !important',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M8%202a6%206%200%20100%2012A6%206%200%20008%202zM0%208a8%208%200%201114.32%204.906l5.387%205.387-1.414%201.414-5.387-5.387A8%208%200%20010%208z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E")',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      padding: '0.86rem 0',
      transition: 'all 0.2s ease-in-out'
    },
    '& .header__search--inner > div.search-api-form > form#search-api-form > .form-actions > .form-submit.button--search:hover': {
      transition: 'all 0.2s ease-in-out',
      backgroundColor: '#002c77',
      border: '#002c77 1px solid'
    },
    '& .header__search--inner > div.search-api-form > form#search-api-form > .form-item > label': {
      fontWeight: 600,
      fontSize: '20px',
      margin: 'auto 2.6rem'
    },
    '& .header__search--inner > .header__search-close': {
      margin: 'auto 2.5rem'
    },
    '& .header__search--inner > .header__search-close > button': {
      background: 'none',
      border: 'none',
      width: '50px'
    },
    '& .header__search--inner > .header__search-close > button > svg': {
      verticalAlign: 'middle'
    },
    '& .header__search--inner > .header__search-close > button > svg > path': {
      transition: 'all 0.2s ease-in-out'
    },
    '& .header__search--inner > .header__search-close > button:hover > svg > path': {
      fill: '#002c77',
      transition: 'all 0.2s ease-in-out'
    },
    [theme.breakpoints.down('md')]: {
      '& nav#block-neon-main-menu > ul.menu.menu--main > li.siteSearch': {
        padding: '0 1.875rem 0.625rem 1.875rem !important'
      },
      '& .search-form-mobile.isMobile': {
        display: 'flex',
        '-ms-flex-pack': 'start',
        justifyContent: 'flex-start',
        '-ms-flex-align': 'center',
        alignItems: 'center'
      },
      '& .search-form-mobile': {
        width: '100%'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form': {
        display: 'flex',
        '-ms-flex-pack': 'start',
        justifyContent: 'flex-start',
        '-ms-flex-align': 'center',
        alignItems: 'center',
        width: '100%'
      },
      '& .search-form-mobile > div.search-api-form': {
        width: '100%'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-item': {
        width: '100%',
        margin: '20px 0'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-item > .form-search': {
        width: '100%',
        height: '48px',
        background: '#fff',
        border: '1px solid #d7d9d9',
        boxSizing: 'border-box',
        borderRadius: '3px 0 0 3px',
        padding: '0.75rem 1.125rem'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-actions.form-wrapper': {
        display: 'flex'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-actions > .form-submit.button--search': {
        borderRadius: '0px 3px 3px 0px',
        width: '48px',
        height: '48px',
        background: '#0073cf',
        border: '#0073cf 1px solid',
        color: 'transparent !important',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M8%202a6%206%200%20100%2012A6%206%200%20008%202zM0%208a8%208%200%201114.32%204.906l5.387%205.387-1.414%201.414-5.387-5.387A8%208%200%20010%208z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E")',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        padding: '14px 0',
        transition: 'all 0.2s ease-in-out'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-actions > .form-submit.button--search:hover': {
        transition: 'all 0.2s ease-in-out',
        backgroundColor: '#002c77',
        border: '#002c77 1px solid'
      },
      '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-item > label': {
        display: 'none !important'
      }
    }
  }
}));
const buildSearchAction = action => {
  const root = _NeonEnvironment.default.getWebHost();
  if (!action) return "".concat(root, "/search/site");
  if (action.startsWith('/')) {
    return "".concat(root).concat(action);
  }
  return "".concat(root, "/").concat(action);
};
const applyAttribute = (nextAttribs, attribs, attr) => {
  switch (attr) {
    case 'class':
      // eslint-disable-next-line no-param-reassign
      nextAttribs.className = attribs[attr];
      break;
    default:
      if (attr.includes('-')) {
        // eslint-disable-next-line no-param-reassign
        nextAttribs[(0, _camelCase.default)(attr)] = attribs[attr];
      } else {
        // eslint-disable-next-line no-param-reassign
        nextAttribs[attr] = attribs[attr];
      }
      break;
  }
};
const NeonHeader = /*#__PURE__*/(0, _react.forwardRef)((props, headerRef) => {
  const {
    drupalCssLoaded,
    unstickyDrupalHeader,
    showSkeleton
  } = props;
  const classes = useStyles(_Theme.default);
  const belowLg = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('md'));
  const [{
    isActive: neonContextIsActive,
    fetches: {
      [DRUPAL_HEADER_HTML]: headerFetch
    },
    html: {
      [DRUPAL_HEADER_HTML]: headerHTML
    },
    auth
  }] = _NeonContext.default.useNeonContextState();

  // Only do the delay effect if not in test
  const initialRenderDelay = process.env.NODE_ENV === 'test';
  const [headerJsStatus, setHeaderJsStatus] = (0, _react.useState)(_NeonContext.FETCH_STATUS.AWAITING_CALL);
  const [headerRenderDelayed, setHeaderRenderDelayed] = (0, _react.useState)(initialRenderDelay);
  let renderMode = 'loading';
  if (neonContextIsActive) {
    switch (headerFetch.status) {
      case _NeonContext.FETCH_STATUS.SUCCESS:
        renderMode = headerHTML && drupalCssLoaded && headerRenderDelayed ? 'drupal' : 'loading';
        break;
      case _NeonContext.FETCH_STATUS.ERROR:
        renderMode = drupalCssLoaded ? 'drupal-fallback' : 'loading';
        break;
      default:
        if (!_NeonEnvironment.default.fetchDrupalAssets) {
          renderMode = 'drupal-fallback';
        } else {
          renderMode = 'loading';
        }
        break;
    }
  }

  // Load header.js only after initial delayed render of the drupal header is complete
  (0, _react.useLayoutEffect)(() => {
    if (!_NeonEnvironment.default.fetchDrupalAssets) {
      (async () => {
        // eslint-disable-next-line no-unused-expressions, import/extensions
        await Promise.resolve().then(() => _interopRequireWildcard(require('../../remoteAssets/drupal-header.js')));
        setHeaderJsStatus(_NeonContext.FETCH_STATUS.SUCCESS);
      })();
      return;
    }
    if (!renderMode.includes('drupal') || headerJsStatus !== _NeonContext.FETCH_STATUS.AWAITING_CALL || !headerRenderDelayed || !drupalCssLoaded) {
      return;
    }
    setHeaderJsStatus(_NeonContext.FETCH_STATUS.FETCHING);
    const script = document.createElement('script');
    script.src = _remoteAssetsMap.default.DRUPAL_HEADER_JS.url;
    script.onload = () => {
      setHeaderJsStatus(_NeonContext.FETCH_STATUS.SUCCESS);
    };
    script.onerror = () => {
      (async () => {
        script.remove();
        // eslint-disable-next-line no-unused-expressions, import/extensions
        await Promise.resolve().then(() => _interopRequireWildcard(require('../../remoteAssets/drupal-header.js')));
        setHeaderJsStatus(_NeonContext.FETCH_STATUS.SUCCESS);
      })();
    };
    document.body.appendChild(script);
  }, [headerJsStatus, drupalCssLoaded, headerRenderDelayed, setHeaderJsStatus, renderMode]);

  // Delay the rendering of the drupal header one render cycle to allow the CSS to propogate into
  // the environment. This prevents a "flash" of the unstyled menu in the drupal header on page load
  let appliedHtmlCheck = headerHTML;
  switch (renderMode) {
    case 'drupal':
      appliedHtmlCheck = headerHTML;
      break;
    case 'drupal-fallback':
      appliedHtmlCheck = _drupalHeader.default;
      break;
    case 'loading':
    default:
      break;
  }
  (0, _react.useLayoutEffect)(() => {
    if (neonContextIsActive && appliedHtmlCheck && drupalCssLoaded && !headerRenderDelayed) {
      const timeout = window.setTimeout(() => setHeaderRenderDelayed(true), 0);
      return () => window.clearTimeout(timeout);
    }
    return () => {};
  }, [neonContextIsActive, appliedHtmlCheck, drupalCssLoaded, headerRenderDelayed]);

  // Render Loading
  if (renderMode === 'loading' && showSkeleton) {
    return /*#__PURE__*/_react.default.createElement("header", {
      ref: headerRef,
      id: "header",
      className: classes.skeletonHeader
    }, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      height: "".concat(belowLg ? 60 : 120, "px"),
      width: "100%"
    }));
  }

  // Render Drupal header
  const injectAuth = !auth.useCore ? undefined : {
    // eslint-disable-next-line react/no-unstable-nested-components
    replace: domNode => {
      const {
        attribs = {},
        name
      } = domNode;
      if (name === 'form' && attribs.id === 'search-api-form') {
        const nextAttribs = {};
        Object.keys(attribs).forEach(attr => {
          applyAttribute(nextAttribs, attribs, attr);
        });
        return /*#__PURE__*/_react.default.createElement("form", _extends({}, nextAttribs, {
          action: buildSearchAction(attribs.action)
        }), (0, _htmlReactParser.domToReact)(domNode.children, injectAuth));
      }
      if (attribs.id !== AUTH_ELEMENT_ID) {
        return null;
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        id: AUTH_ELEMENT_ID,
        className: classes.coreAuthContainer
      }, /*#__PURE__*/_react.default.createElement(_NeonAuth.default, {
        loginPath: _NeonEnvironment.default.getFullAuthPath('login'),
        logoutPath: _NeonEnvironment.default.getFullAuthPath('logout'),
        accountPath: _NeonEnvironment.default.route.buildAccountRoute(),
        loginType: _NeonAuth.NeonAuthType.REDIRECT,
        logoutType: _NeonAuth.NeonAuthType.SILENT,
        displayType: _NeonAuth.NeonAuthDisplayType.MENU
      }));
    }
  };
  let appliedClassName = classes.headerContainer;
  if (unstickyDrupalHeader) {
    appliedClassName = "".concat(classes.unstickyHeader, " ").concat(classes.headerContainer);
  }
  if (renderMode === 'drupal-fallback' || renderMode === 'loading' && !showSkeleton) {
    appliedClassName = "".concat(appliedClassName, " ").concat(classes.headerContainerFallback);
  }
  const html = renderMode === 'drupal' ? headerHTML : _drupalHeader.default;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("header", {
    ref: headerRef,
    id: "header",
    className: appliedClassName
  }, (0, _htmlReactParser.default)(html, injectAuth)), /*#__PURE__*/_react.default.createElement(_ApplicationMenu.default, null));
});
NeonHeader.propTypes = {
  drupalCssLoaded: _propTypes.default.bool,
  unstickyDrupalHeader: _propTypes.default.bool,
  showSkeleton: _propTypes.default.bool
};
NeonHeader.defaultProps = {
  drupalCssLoaded: false,
  unstickyDrupalHeader: true,
  showSkeleton: false
};
var _default = exports.default = NeonHeader;