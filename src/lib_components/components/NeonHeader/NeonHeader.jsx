import React, { forwardRef, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser, { domToReact } from 'html-react-parser';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Skeleton from '@material-ui/lab/Skeleton';

import camelCase from 'lodash/camelCase';

import REMOTE_ASSETS from '../../remoteAssetsMap/remoteAssetsMap';
import DRUPAL_HEADER_HTML_FALLBACK from '../../remoteAssets/drupal-header.html';
import Theme from '../Theme/Theme';
import NeonAuth, { NeonAuthType, NeonAuthDisplayType } from '../NeonAuth/NeonAuth';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';
import ApplicationMenu from './ApplicationMenu';

const DRUPAL_HEADER_HTML = REMOTE_ASSETS.DRUPAL_HEADER_HTML.KEY;

const AUTH_ELEMENT_ID = 'header__authentication-ui';

const useStyles = makeStyles((theme) => ({
  skeletonHeader: {
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
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
        borderBottomRightRadius: '0px',
      },
      '& :first-child': {
        borderRight: 'none',
        borderTopLeftRadius: '0px',
      },
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1, 2),
      top: theme.spacing(1),
      right: theme.spacing(9),
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
      [theme.breakpoints.down('sm')]: {
        '& .header__site-navigation': {
          display: 'none',
        },
        '& .nav-trigger:checked ~ .header__site-navigation': {
          display: 'block',
        },
      },
    },
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
      fontSize: '1.1rem', // Added, font sizes look bigger on Drupal site.
    },
    '& .header__search.visually-hidden': {
      visibility: 'hidden',
      opacity: 0,
      transition: 'all 0.2s ease-in-out',
    },
    '& .header__search > .header__search--inner': {
      display: 'flex',
      maxWidth: '1620px',
      margin: '0 auto',
    },
    '& .header__inner.l--offset-wide': {
      paddingLeft: 'calc(2/27*100%)',
      paddingRight: 'calc(2/27*100%)',
    },
    // Purely a quick-fix workaround for Drupal header auth container...
    '& .header__inner.l--offset-wide > .authContainer': {
      display: 'none !important',
    },
    '& .header__search--inner': {
      display: 'flex',
      '-ms-flex-pack': 'start',
      justifyContent: 'flex-start',
      '-ms-flex-align': 'center',
      alignItems: 'center',
    },
    '& .header__search--inner > .header__search--title': {
      fontWeight: '600 !important', // Changed from 600 to match Drupal site.
      fontSize: '0.9rem !important', // Changed from 0.9 to match Drupal site.
      margin: '0 2.6rem 0 0 !important',
    },
    [theme.breakpoints.up('lg')]: {
      '& .header__search--inner > .header__search--title': {
        fontSize: '1.2rem !important', // Changed from 1.0 to match Drupal site.
      },
    },
    '& .header__search--inner > .form-item': {
      width: '100%',
      display: 'flex',
      '-ms-flex-pack': 'start',
      justifyContent: 'flex-start',
      '-ms-flex-align': 'center',
      alignItems: 'center',
    },
    '& .header__search--inner > form.search-form': {
      display: 'flex',
      '-ms-flex-pack': 'start',
      justifyContent: 'flex-start',
      '-ms-flex-align': 'center',
      alignItems: 'center',
      width: '100%',
    },
    '& .header__search--inner > form.search-form > .form-item': {
      width: '100%',
    },
    '& .header__search--inner > form.search-form > .form-item > .search-form__input': {
      width: '100%',
      background: '#fff',
      border: '1px solid #d7d9d9',
      boxSizing: 'border-box',
      borderRadius: '3px 0 0 3px',
      padding: '14px',
    },
    '& .header__search--inner > form.search-form > .search-form__actions > .search-form__button': {
      borderRadius: '0px 3px 3px 0px',
      width: '60px',
      background: '#0073cf',
      border: '#0073cf 1px solid',
      color: 'transparent !important',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M8%202a6%206%200%20100%2012A6%206%200%20008%202zM0%208a8%208%200%201114.32%204.906l5.387%205.387-1.414%201.414-5.387-5.387A8%208%200%20010%208z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E")',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      padding: '0.86rem 0',
      transition: 'all 0.2s ease-in-out',
    },
    '& .header__search--inner > form.search-form > .search-form__actions > .search-form__button:hover': {
      transition: 'all 0.2s ease-in-out',
      backgroundColor: '#002c77',
      border: '#002c77 1px solid',
    },
    '& .header__search--inner > form.search-form > label': {
      fontWeight: 600,
      fontSize: '20px',
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
    [theme.breakpoints.down('md')]: {
      '& nav#block-neon-main-menu > ul > li.siteSearch': {
        padding: '0 1.5rem 0.5rem 1.5rem',
      },
      '& .search-form-mobile': {
        width: '100%',
      },
      '& form.search-form': {
        display: 'flex',
        '-ms-flex-pack': 'start',
        justifyContent: 'flex-start',
        '-ms-flex-align': 'center',
        alignItems: 'center',
        width: '100%',
      },
      '& form.search-form > .form-item': {
        width: '100%',
      },
      '& form.search-form > .form-item > .search-form__input': {
        width: '100%',
        background: '#fff',
        border: '1px solid #d7d9d9',
        boxSizing: 'border-box',
        borderRadius: '3px 0 0 3px',
        padding: '0.88rem',
      },
      '& form.search-form > .search-form__actions > .search-form__button': {
        borderRadius: '0px 3px 3px 0px',
        width: '60px',
        background: '#0073cf',
        border: '#0073cf 1px solid',
        color: 'transparent !important',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M8%202a6%206%200%20100%2012A6%206%200%20008%202zM0%208a8%208%200%201114.32%204.906l5.387%205.387-1.414%201.414-5.387-5.387A8%208%200%20010%208z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E")',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        padding: '14px 0',
        transition: 'all 0.2s ease-in-out',
      },
      '& form.search-form > .search-form__actions > .search-form__button:hover': {
        transition: 'all 0.2s ease-in-out',
        backgroundColor: '#002c77',
        border: '#002c77 1px solid',
      },
      '& form.search-form > .form-item > label': {
        display: 'none !important',
      },
    },
  },
}));

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

const NeonHeader = forwardRef((props, headerRef) => {
  const {
    drupalCssLoaded,
    unstickyDrupalHeader,
  } = props;
  const classes = useStyles(Theme);
  const belowLg = useMediaQuery(Theme.breakpoints.down('md'));

  const [{
    isActive: neonContextIsActive,
    fetches: { [DRUPAL_HEADER_HTML]: headerFetch },
    html: { [DRUPAL_HEADER_HTML]: headerHTML },
    auth,
  }] = NeonContext.useNeonContextState();

  // Only do the delay effect if not in test
  const initialRenderDelay = process.env.NODE_ENV === 'test';

  const [headerJsStatus, setHeaderJsStatus] = useState(FETCH_STATUS.AWAITING_CALL);
  const [headerRenderDelayed, setHeaderRenderDelayed] = useState(initialRenderDelay);

  let renderMode = 'loading';
  if (neonContextIsActive) {
    switch (headerFetch.status) {
      case FETCH_STATUS.SUCCESS:
        renderMode = (headerHTML && drupalCssLoaded && headerRenderDelayed)
          ? 'drupal' : 'loading';
        break;
      case FETCH_STATUS.ERROR:
        renderMode = drupalCssLoaded ? 'drupal-fallback' : 'loading';
        break;
      default:
        renderMode = 'loading';
        break;
    }
  }

  // Load header.js only after initial delayed render of the drupal header is complete
  useLayoutEffect(() => {
    if (
      !renderMode.includes('drupal') || headerJsStatus !== FETCH_STATUS.AWAITING_CALL
      || !headerRenderDelayed || !drupalCssLoaded
    ) { return; }
    setHeaderJsStatus(FETCH_STATUS.FETCHING);
    const script = document.createElement('script');
    script.src = REMOTE_ASSETS.DRUPAL_HEADER_JS.url;
    script.onload = (() => {
      setHeaderJsStatus(FETCH_STATUS.SUCCESS);
    });
    script.onerror = (() => {
      setHeaderJsStatus(FETCH_STATUS.ERROR);
      // eslint-disable-next-line no-unused-expressions
      import('../../remoteAssets/drupal-header.js');
    });
    document.body.appendChild(script);
    // TODO: verify header.js loaded and if not load the fallback
  }, [headerJsStatus, drupalCssLoaded, headerRenderDelayed, setHeaderJsStatus, renderMode]);

  // Delay the rendering of the drupal header one render cycle to allow the CSS to propogate into
  // the environment. This prevents a "flash" of the unstyled menu in the drupal header on page load
  useLayoutEffect(() => {
    if (neonContextIsActive && headerHTML && drupalCssLoaded && !headerRenderDelayed) {
      const timeout = window.setTimeout(() => setHeaderRenderDelayed(true), 0);
      return () => window.clearTimeout(timeout);
    }
    return () => { };
  }, [
    neonContextIsActive,
    headerHTML,
    drupalCssLoaded,
    headerRenderDelayed,
  ]);

  // Render Loading
  if (renderMode === 'loading') {
    return (
      <header ref={headerRef} id="header" className={classes.skeletonHeader}>
        <Skeleton variant="rect" height={`${belowLg ? 60 : 125}px`} width="100%" />
      </header>
    );
  }

  // Render Drupal header
  const injectAuth = !auth.useCore ? null : {
    replace: (domNode) => {
      const { attribs = {}, name } = domNode;
      if ((name === 'form') && (attribs.class === 'search-form')) {
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
      return (
        <div id={AUTH_ELEMENT_ID} className={classes.coreAuthContainer}>
          <NeonAuth
            loginPath={NeonEnvironment.getFullAuthPath('login')}
            logoutPath={NeonEnvironment.getFullAuthPath('logout')}
            accountPath={NeonEnvironment.route.buildAccountRoute()}
            loginType={NeonAuthType.REDIRECT}
            logoutType={NeonAuthType.SILENT}
            displayType={NeonAuthDisplayType.MENU}
          />
        </div>
      );
    },
  };
  const html = renderMode === 'drupal' ? headerHTML : DRUPAL_HEADER_HTML_FALLBACK;
  return (
    <>
      <header
        ref={headerRef}
        id="header"
        className={unstickyDrupalHeader
          ? `${classes.unstickyHeader} ${classes.headerContainer}`
          : classes.headerContainer}
      >
        {HTMLReactParser(html, injectAuth)}
      </header>
      <ApplicationMenu />
    </>
  );
});

NeonHeader.propTypes = {
  drupalCssLoaded: PropTypes.bool,
  unstickyDrupalHeader: PropTypes.bool,
};

NeonHeader.defaultProps = {
  drupalCssLoaded: false,
  unstickyDrupalHeader: true,
};

export default NeonHeader;
