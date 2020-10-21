import React, {
  forwardRef,
  useState,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Skeleton from '@material-ui/lab/Skeleton';

import REMOTE_ASSETS from '../../remoteAssetsMap/remoteAssetsMap';
import Theme from '../Theme/Theme';
import NeonAuth, { NeonAuthType, NeonAuthDisplayType } from '../NeonAuth/NeonAuth';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';

import NeonLegacyHeader from './NeonLegacyHeader';

const DRUPAL_HEADER_HTML_FALLBACK = require('../../remoteAssets/drupal-header.html');

const DRUPAL_HEADER_HTML = REMOTE_ASSETS.DRUPAL_HEADER_HTML.KEY;

const AUTH_ELEMENT_ID = 'header__authentication-ui';

const useStyles = makeStyles(theme => ({
  skeletonHeader: {
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
  },
  coreAuthContainer: {
    // common styles
    textAlign: 'right',
    position: 'absolute',
    zIndex: 10,
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
        zIndex: '3 !important',
      },
      '& div.header__site-navigation': {
        zIndex: '2 !important',
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
}));

const NeonHeader = forwardRef((props, headerRef) => {
  const {
    drupalCssLoaded,
    useCoreHeader,
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

  const [headerJsStatus, setHeaderJsStatus] = useState(FETCH_STATUS.AWAITING_CALL);
  const [headerRenderDelayed, setHeaderRenderDelayed] = useState(false);

  let renderMode = 'legacy';
  if (!useCoreHeader && neonContextIsActive) {
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
    if (
      !useCoreHeader && neonContextIsActive
        && headerHTML && drupalCssLoaded && !headerRenderDelayed
    ) {
      const timeout = window.setTimeout(() => setHeaderRenderDelayed(true), 0);
      return () => window.clearTimeout(timeout);
    }
    return () => {};
  }, [
    neonContextIsActive,
    useCoreHeader,
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

  // Render Drupal
  if (renderMode === 'drupal' || renderMode === 'drupal-fallback') {
    const injectAuth = !auth.useCore ? null : {
      replace: domNode => ((domNode.attribs || {}).id !== AUTH_ELEMENT_ID ? null : (
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
      )),
    };
    const html = renderMode === 'drupal' ? headerHTML : DRUPAL_HEADER_HTML_FALLBACK;
    return (
      <header
        ref={headerRef}
        id="header"
        className={unstickyDrupalHeader ? classes.unstickyHeader : null}
      >
        {HTMLReactParser(html, injectAuth)}
      </header>
    );
  }

  // Render Legacy
  return <NeonLegacyHeader {...props} ref={headerRef} />;
});

NeonHeader.propTypes = {
  ...NeonLegacyHeader.propTypes,
  drupalCssLoaded: PropTypes.bool,
  useCoreHeader: PropTypes.bool,
  unstickyDrupalHeader: PropTypes.bool,
};

NeonHeader.defaultProps = {
  ...NeonLegacyHeader.defaultProps,
  drupalCssLoaded: false,
  useCoreHeader: false,
  unstickyDrupalHeader: true,
};

export default NeonHeader;
