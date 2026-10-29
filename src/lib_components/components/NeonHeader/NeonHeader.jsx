import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import PropTypes from 'prop-types';
import HTMLReactParser, { domToReact } from 'html-react-parser';

import useMediaQuery from '@mui/material/useMediaQuery';
import Skeleton from '@mui/material/Skeleton';

import camelCase from 'lodash/camelCase';

import REMOTE_ASSETS from '../../remoteAssetsMap/remoteAssetsMap';
import DRUPAL_HEADER_HTML_FALLBACK from '../../remoteAssets/drupal-header.html';
import NeonAuth, { NeonAuthType, NeonAuthDisplayType } from '../NeonAuth/NeonAuth';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonAuthContext from '../NeonContext/NeonAuthContext';
import NeonPageAssetsContext, { FETCH_STATUS } from '../NeonContext/NeonPageAssetsContext';
import ApplicationMenu from './ApplicationMenu';
import HeaderSearch, { SEARCH_BOX_MEDIA_QUERY, SEARCH_TOGGLE_MEDIA_QUERY } from './HeaderSearch';
import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';
import { exists } from '../../util/typeUtil';

import HeaderSearchSvg from '../../images/svg/header-search.svg';
import HeaderSearchHoverSvg from '../../images/svg/header-search-hover.svg';

const DRUPAL_HEADER_HTML = REMOTE_ASSETS.DRUPAL_HEADER_HTML.KEY;

const AUTH_ELEMENT_ID = 'header__authentication-ui';
const SEARCH_PANEL_ID = 'header-search-panel';

// Only do the delay effect if not in test
const initialRenderDelay = process.env.NODE_ENV === 'test';

/* eslint-disable max-len, @stylistic/max-len */
const useStyles = (customize) => {
  const viewportStyles = customize
    ? {}
    : {
      '& button:first-of-type': {
        borderRight: 'none',
        borderTopLeftRadius: '0px',
        borderBottomRightRadius: '0px',
      },
    };
  const headerContainer = customize
    ? {
      // Viewport-specific styles
      [`@media (min-width:${1100}px)`]: {
        '& .header__inner.l--offset-wide': {
          marginRight: '110px !important',
          paddingRight: '0px !important',
          maxWidth: 'unset !important',
        },
      },
      [`@media (max-width:${1099}px)`]: {
        '& .header__inner.l--offset-wide': {
          paddingRight: '36px !important',
        },
        '& #header.header .header__site-navigation': {
          top: '61px',
        },
        '& #header.header .nav__hamburger': {
          width: '32px',
          height: '32px',
          backgroundColor: '#fff',
          padding: '7px',
          color: '#0073CF',
          border: '1px solid #0073CF',
          borderRadius: '3px',
        },
      },
      '& .header__inner.l--offset-wide > .authContainer': {
        display: 'none !important',
      },
    } : {
      '& .header__inner.l--offset-wide': {
        paddingLeft: 'calc(2/27*100%)',
        paddingRight: 'calc(2/27*100%)',
      },
      // Purely a quick-fix workaround for Drupal header auth container...
      '& .header__inner.l--offset-wide > .authContainer': {
        display: 'none !important',
      },
    };
  return makeStyles()((theme) => ({
    skeletonHeader: {
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
    },
    // Positioning of sign-in and sign-out buttons
    coreAuthContainer: {
      // Common styles
      textAlign: 'right',
      position: 'absolute',
      zIndex: 15,
      // Viewport-specific styles
      [`@media (min-width:${1100}px)`]: {
        padding: '0px',
        top: customize ? '42px' : '-1px',
        right: customize ? '32px' : '0px',
        height: customize ? '32px' : undefined,
        ...viewportStyles,
      },
      [`@media (max-width:${1099}px)`]: {
        padding: customize ? theme.spacing(1, 0) : theme.spacing(1, 2),
        top: customize ? '6px' : theme.spacing(1),
        right: customize ? '86px' : theme.spacing(11),
        height: customize ? '48px' : undefined,
      },
    },
    // Positions the custom header search relative to the injected auth element
    customAuthAnchor: {
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'top',
    },
    // Replaces the Drupal header search entry points with the custom header search
    customSearch: {
      [SEARCH_BOX_MEDIA_QUERY]: {
        [`& .nav__item--search, & .header__search-mobile, & #${SEARCH_PANEL_ID}`]: {
          display: 'none !important',
        },
      },
      [SEARCH_TOGGLE_MEDIA_QUERY]: {
        [`& #${SEARCH_PANEL_ID} .header__search--title`]: {
          margin: '0px 12px 0px 0px !important',
        },
        [`& #${SEARCH_PANEL_ID} .header__search-close`]: {
          margin: '0px 0px 0px 8px',
        },
      },
    },
    // Mirrors the opened Drupal search panel styles for the custom search toggle
    customSearchPanelOpen: {
      [SEARCH_TOGGLE_MEDIA_QUERY]: {
        [`& #${SEARCH_PANEL_ID}.header__search-panel`]: {
          background: '#f5f6f7',
          position: 'relative',
          zIndex: 1,
          opacity: 1,
          visibility: 'visible',
          transitionDelay: '0s',
          fontSize: '1.1rem',
        },
        [`& #${SEARCH_PANEL_ID} form#search-api-form > .form-item`]: {
          margin: '0px',
        },
      },
    },
    // These styles are gross. We need to rework the header coming from the Drupal site to make this
    // less necessary.
    unstickyHeader: {
      paddingTop: 'unset !important',
      '& > header': {
        position: 'unset !important',
        '& label[for="nav-trigger"]': {
          zIndex: '9 !important',
        },
        '& div.header__site-navigation': {
          zIndex: '8 !important',
        },
        [theme.breakpoints.down('md')]: {
          '& .header__site-navigation': {
            display: 'none',
          },
          '& .nav-trigger:checked ~ .header__site-navigation': {
            display: 'block',
          },
        },
      },
    },
    headerContainerFallback: {
      fontFeatureSettings: '"ss01", "ss03", "ss04" !important',
      '& .nav__dropdown': {
        lineHeight: 'normal',
      },
      '& li.siteSearch > a': {
        background: `url('${HeaderSearchSvg.src}') center center no-repeat !important`,
      },
      '& li.siteSearch > a:hover': {
        background: `url('${HeaderSearchHoverSvg.src}') center center no-repeat !important`,
      },
    },
    // Injecting these styles as a means of fixing up the search display
    // Ideally, this CSS comes from Drupal and is removed from here...
    headerContainer: {
      fontFeatureSettings: '"ss01", "ss03", "ss04" !important',
      position: 'relative',
      zIndex: 10,
      // // Added menu__link to more closely mimic Drupal site links.
      // '& .menu__link': {
      //   fontSize: '1.1rem !important',
      //   fontWeight: '700 !important',
      // },
      '& .nav__dropdown': {
        lineHeight: 'normal',
      },
      ...headerContainer,
      '& #header.header .header__search, & #header.header .header__search-panel.is-open': {
        background: '#f5f6f7',
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.2s ease-in-out',
        opacity: 1,
        visibility: 'visible',
        fontSize: '1.1rem', // Added, font sizes look bigger on Drupal site.
      },
      '& #header.header .header__search.visually-hidden, #header.header .header__search-panel.visually-hidden': {
        visibility: 'hidden',
        opacity: 0,
        transition: 'all 0.2s ease-in-out',
      },
      '& #header.header .header__search > .header__search--inner, #header.header .header__search-panel > .header__search--inner': {
        display: 'flex',
        maxWidth: '1620px',
        margin: '0 auto',
      },
      '& .header__search--inner': {
        display: 'flex',
        msFlexPack: 'start',
        justifyContent: 'flex-start',
        msFlexAlign: 'center',
        alignItems: 'center',
      },
      '& .header__search--inner > .header__search--title': {
        fontWeight: '600 !important', // Changed from 600 to match Drupal site.
        fontSize: '0.875rem !important', // Changed from 0.9 to match Drupal site.
        margin: '0 2.6rem 0 0 !important',
      },
      [theme.breakpoints.up('lg')]: {
        '& .header__search--inner > .header__search--title': {
          fontSize: '1.125rem !important', // Changed from 1.0 to match Drupal site.
        },
      },
      '& .header__search--inner > div.search-api-form > form#search-api-form': {
        display: 'flex',
        msFlexPack: 'start',
        justifyContent: 'flex-start',
        msFlexAlign: 'center',
        alignItems: 'center',
        width: '100%',
      },
      // Previous version header styles
      '& .header__search--inner > div.search-api-form > form#search-api-form > .form-item': {
        width: '100%',
        display: 'flex',
        msFlexPack: 'start',
        justifyContent: 'flex-start',
        msFlexAlign: 'center',
        alignItems: 'center',
        margin: '20px 0',
      },
      // New header version styles
      '& #header.header .header__search-panel.is-open .header__search--inner > div.search-api-form > form#search-api-form > .form-item': {
        width: '100%',
        display: 'flex',
        msFlexPack: 'start',
        justifyContent: 'flex-start',
        msFlexAlign: 'center',
        alignItems: 'center',
        margin: '0 0',
      },
      '& .header__search--inner > div.search-api-form': {
        width: '100%',
      },
      '& .header__search--inner > div.search-api-form > form#search-api-form > .form-actions.form-wrapper': {
        display: 'flex',
      },
      '& .header__search--inner > div.search-api-form > form#search-api-form > .form-item > .form-search': {
        width: '100%',
        height: '48px',
        background: '#fff',
        border: '1px solid #d7d9d9',
        boxSizing: 'border-box',
        borderRadius: '3px 0 0 3px',
        padding: '12px 18px',
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
        transition: 'all 0.2s ease-in-out',
      },
      '& .header__search--inner > div.search-api-form > form#search-api-form > .form-actions > .form-submit.button--search:hover': {
        transition: 'all 0.2s ease-in-out',
        backgroundColor: '#002c77',
        border: '#002c77 1px solid',
      },
      '& .header__search--inner > div.search-api-form > form#search-api-form > .form-item > label': {
        fontWeight: 600,
        fontSize: '1.25rem',
        margin: 'auto 2.6rem',
      },
      '& .header__search--inner > .header__search-close': {
        margin: 'auto 2.5rem',
      },
      '& .header__search--inner > .header__search-close > button': {
        background: 'none',
        border: 'none',
        width: '50px',
      },
      '& .header__search--inner > .header__search-close > button > svg': {
        verticalAlign: 'middle',
      },
      '& .header__search--inner > .header__search-close > button > svg > path': {
        transition: 'all 0.2s ease-in-out',
      },
      '& .header__search--inner > .header__search-close > button:hover > svg > path': {
        fill: '#002c77',
        transition: 'all 0.2s ease-in-out',
      },
      [theme.breakpoints.down('lg')]: {
        '& nav#block-neon-main-menu > ul.menu.menu--main > li.siteSearch': {
          padding: '0 1.875rem 0.625rem 1.875rem !important',
        },
        '& .search-form-mobile.isMobile': {
          display: 'flex',
          msFlexPack: 'start',
          justifyContent: 'flex-start',
          msFlexAlign: 'center',
          alignItems: 'center',
        },
        '& .search-form-mobile': {
          width: '100%',
        },
        '& .search-form-mobile > div.search-api-form > form#search-api-form': {
          display: 'flex',
          msFlexPack: 'start',
          justifyContent: 'flex-start',
          msFlexAlign: 'center',
          alignItems: 'center',
          width: '100%',
        },
        '& .search-form-mobile > div.search-api-form': {
          width: '100%',
        },
        '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-item': {
          width: '100%',
          margin: '20px 0',
        },
        '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-item > .form-search': {
          width: '100%',
          height: '48px',
          background: '#fff',
          border: '1px solid #d7d9d9',
          boxSizing: 'border-box',
          borderRadius: '3px 0 0 3px',
          padding: '0.75rem 1.125rem',
        },
        '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-actions.form-wrapper': {
          display: 'flex',
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
          transition: 'all 0.2s ease-in-out',
        },
        '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-actions > .form-submit.button--search:hover': {
          transition: 'all 0.2s ease-in-out',
          backgroundColor: '#002c77',
          border: '#002c77 1px solid',
        },
        '& .search-form-mobile > div.search-api-form > form#search-api-form > .form-item > label': {
          display: 'none !important',
        },
      },
    },
  }));
};
/* eslint-enable max-len, @stylistic/max-len */

const buildSearchAction = (action) => {
  const root = NeonEnvironment.getWebHost();
  if (!action) return `${root}/search/site`;
  if (action.startsWith('/')) {
    return `${root}${action}`;
  }
  return `${root}/${action}`;
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
        nextAttribs[camelCase(attr)] = attribs[attr];
      } else {
        // eslint-disable-next-line no-param-reassign
        nextAttribs[attr] = attribs[attr];
      }
      break;
  }
};

const defaultProps = {
  drupalCssLoaded: false,
  unstickyDrupalHeader: true,
  showSkeleton: false,
  customizeAuthContainer: false,
  minWidth: undefined,
};

const NeonHeader = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const {
    ref: headerRef,
    drupalCssLoaded,
    unstickyDrupalHeader,
    showSkeleton,
    customizeAuthContainer,
    minWidth,
  } = props;
  const { classes, theme } = useStyles(customizeAuthContainer)();
  const belowLg = useMediaQuery(theme.breakpoints.down('lg'));
  const isSearchToggleViewport = useMediaQuery(SEARCH_TOGGLE_MEDIA_QUERY);

  const [{
    isActive: neonPageAssetsContextIsActive,
    fetches: { [DRUPAL_HEADER_HTML]: headerFetch },
    html: { [DRUPAL_HEADER_HTML]: headerHTML },
  }] = NeonPageAssetsContext.useNeonPageAssetsContextState();
  const [{
    isActive: neonAuthContextIsActive,
    auth,
  }] = NeonAuthContext.useNeonAuthContextState();

  const [headerJsStatus, setHeaderJsStatus] = useState(FETCH_STATUS.AWAITING_CALL);
  const [headerRenderDelayed, setHeaderRenderDelayed] = useState(initialRenderDelay);

  // The custom header search is rendered alongside the injected auth element
  const shouldInjectAuth = auth.useCore && neonAuthContextIsActive;
  const customizeSearch = customizeAuthContainer && shouldInjectAuth;
  const searchToggleRef = useRef(null);
  const [searchPanelOpenState, setSearchPanelOpenState] = useState(false);
  // The custom search toggle only controls the search panel within its viewport range
  const searchPanelOpen = customizeSearch && isSearchToggleViewport && searchPanelOpenState;

  const handleToggleSearchPanel = useCallback(() => {
    if (searchPanelOpen) {
      setSearchPanelOpenState(false);
      return;
    }
    const drupalHeader = searchToggleRef.current?.closest('.header');
    // Close the navigation menu so that it does not obscure the search panel
    if (document.body.classList.contains('nav-open')) {
      drupalHeader?.querySelector('.nav__hamburger')?.click();
    }
    // Render the opened panel synchronously so the search input can be focused
    flushSync(() => setSearchPanelOpenState(true));
    drupalHeader?.querySelector(`#${SEARCH_PANEL_ID} input[type="search"]`)?.focus();
  }, [searchPanelOpen]);

  // Header JS search panel handlers do not apply to the custom search toggle state,
  // handle closing from the panel close button, navigation menu toggle and escape key.
  useEffect(() => {
    if (!searchPanelOpen) return () => {};
    const handleDocumentClick = (event) => {
      const { target } = event;
      if (!(target instanceof Element)) return;
      if (target.closest(`#${SEARCH_PANEL_ID} .button__search-close`)) {
        setSearchPanelOpenState(false);
        searchToggleRef.current?.focus();
      } else if (target.closest('.nav__hamburger')) {
        setSearchPanelOpenState(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setSearchPanelOpenState(false);
      searchToggleRef.current?.focus();
    };
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchPanelOpen]);

  let renderMode = 'loading';
  if (neonPageAssetsContextIsActive) {
    switch (headerFetch.status) {
      case FETCH_STATUS.SUCCESS:
        renderMode = (headerHTML && drupalCssLoaded && headerRenderDelayed)
          ? 'drupal' : 'loading';
        break;
      case FETCH_STATUS.ERROR:
        renderMode = drupalCssLoaded ? 'drupal-fallback' : 'loading';
        break;
      default:
        if (!NeonEnvironment.fetchDrupalAssets) {
          renderMode = 'drupal-fallback';
        } else {
          renderMode = 'loading';
        }
        break;
    }
  }

  // Load header.js only after initial delayed render of the drupal header is complete
  useLayoutEffect(() => {
    if (!NeonEnvironment.fetchDrupalAssets) {
      (async () => {
        // eslint-disable-next-line import/extensions
        await import('../../remoteAssets/drupal-header.js');
        setHeaderJsStatus(FETCH_STATUS.SUCCESS);
      })();
      return;
    }
    if (
      !renderMode.includes('drupal') || headerJsStatus !== FETCH_STATUS.AWAITING_CALL
      || !headerRenderDelayed || !drupalCssLoaded
    ) { return; }
    setHeaderJsStatus(FETCH_STATUS.FETCHING);
    const script = document.createElement('script');
    script.src = REMOTE_ASSETS.DRUPAL_HEADER_JS.url;
    script.onload = () => {
      setHeaderJsStatus(FETCH_STATUS.SUCCESS);
    };
    script.onerror = () => {
      (async () => {
        script.remove();
        // eslint-disable-next-line import/extensions
        await import('../../remoteAssets/drupal-header.js');
        setHeaderJsStatus(FETCH_STATUS.SUCCESS);
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
      appliedHtmlCheck = DRUPAL_HEADER_HTML_FALLBACK;
      break;
    case 'loading':
    default:
      break;
  }
  useLayoutEffect(() => {
    if (
      neonPageAssetsContextIsActive
      && appliedHtmlCheck
      && drupalCssLoaded
      && !headerRenderDelayed
    ) {
      const timeout = window.setTimeout(() => setHeaderRenderDelayed(true), 0);
      return () => window.clearTimeout(timeout);
    }
    return () => { };
  }, [
    neonPageAssetsContextIsActive,
    appliedHtmlCheck,
    drupalCssLoaded,
    headerRenderDelayed,
  ]);

  const outerHeaderContainerStyles = {};
  if (exists(minWidth)) {
    outerHeaderContainerStyles.minWidth = minWidth;
  }

  // Render Loading
  if ((renderMode === 'loading') && showSkeleton) {
    return (
      <header
        ref={headerRef}
        id="header"
        className={classes.skeletonHeader}
        style={outerHeaderContainerStyles}
      >
        <Skeleton variant="rectangular" height={`${belowLg ? 60 : 120}px`} width="100%" />
      </header>
    );
  }

  // Render Drupal header
  const injectAuth = !shouldInjectAuth ? undefined : {
    // eslint-disable-next-line react/no-unstable-nested-components
    replace: (domNode) => {
      const { attribs = {}, name } = domNode;
      if ((name === 'form') && (attribs.id === 'search-api-form')) {
        const nextAttribs = {};
        Object.keys(attribs).forEach((attr) => {
          applyAttribute(nextAttribs, attribs, attr);
        });
        return (
          <form {...nextAttribs} action={buildSearchAction(attribs.action)}>
            {domToReact(domNode.children, injectAuth)}
          </form>
        );
      }
      if (attribs.id !== AUTH_ELEMENT_ID) { return null; }
      const neonAuth = (
        <NeonAuth
          loginPath={NeonEnvironment.getFullAuthPath('login')}
          logoutPath={NeonEnvironment.getFullAuthPath('logout')}
          accountPath={NeonEnvironment.route.buildAccountRoute()}
          loginType={NeonAuthType.REDIRECT}
          logoutType={NeonAuthType.SILENT}
          displayType={
            customizeAuthContainer
              ? NeonAuthDisplayType.MENU_CUSTOM
              : NeonAuthDisplayType.MENU
          }
        />
      );
      return (
        <div id={AUTH_ELEMENT_ID} className={classes.coreAuthContainer}>
          {!customizeSearch ? neonAuth : (
            <div className={classes.customAuthAnchor}>
              <HeaderSearch
                searchAction={buildSearchAction()}
                searchPanelId={SEARCH_PANEL_ID}
                searchPanelOpen={searchPanelOpen}
                onToggleSearchPanel={handleToggleSearchPanel}
                toggleRef={searchToggleRef}
              />
              {neonAuth}
            </div>
          )}
        </div>
      );
    },
  };
  let appliedClassName = classes.headerContainer;
  if (unstickyDrupalHeader) {
    appliedClassName = `${classes.unstickyHeader} ${classes.headerContainer}`;
  }
  if ((renderMode === 'drupal-fallback') || ((renderMode === 'loading') && !showSkeleton)) {
    appliedClassName = `${appliedClassName} ${classes.headerContainerFallback}`;
  }
  if (customizeSearch) {
    appliedClassName = `${appliedClassName} ${classes.customSearch}`;
    if (searchPanelOpen) {
      appliedClassName = `${appliedClassName} ${classes.customSearchPanelOpen}`;
    }
  }
  const html = renderMode === 'drupal' ? headerHTML : DRUPAL_HEADER_HTML_FALLBACK;
  return (
    <>
      <header
        ref={headerRef}
        id="header"
        className={appliedClassName}
        style={outerHeaderContainerStyles}
      >
        {HTMLReactParser(html, injectAuth)}
      </header>
      <ApplicationMenu />
    </>
  );
};

NeonHeader.propTypes = {
  ref: PropTypes.element,
  drupalCssLoaded: PropTypes.bool,
  unstickyDrupalHeader: PropTypes.bool,
  showSkeleton: PropTypes.bool,
  customizeAuthContainer: PropTypes.bool,
  minWidth: PropTypes.string,
};

export default NeonHeader;
