import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Skeleton from '@material-ui/lab/Skeleton';

import Theme from '../Theme/Theme';
import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';

import NeonLegacyHeader from './NeonLegacyHeader';

const HEADER_JS_URL = 'https://preview.neonscience.org/themes/custom/neon/build/components/header/header.js';

const useStyles = makeStyles(theme => ({
  skeletonHeader: {
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
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

const NeonHeader = forwardRef((props, ref) => {
  const {
    drupalCssLoaded,
    useCoreHeader,
    unstickyDrupalHeader,
  } = props;
  const classes = useStyles(Theme);
  const belowLg = useMediaQuery(Theme.breakpoints.down('md'));

  const [{
    isActive,
    fetches: { header: headerFetch },
    html: { header: headerHTML },
  }] = NeonContext.useNeonContextState();

  const [headerJsLoaded, setHeaderJsLoaded] = useState(false);

  let renderMode = 'legacy';
  if (!useCoreHeader && isActive) {
    if (headerFetch.status === FETCH_STATUS.SUCCESS && headerHTML && drupalCssLoaded) {
      renderMode = 'drupal';
    }
    if ([FETCH_STATUS.AWAITING_CALL, FETCH_STATUS.FETCHING].includes(headerFetch.status)) {
      renderMode = 'loading';
    }
  }

  // Load header.js
  useEffect(() => {
    if (headerJsLoaded || renderMode !== 'drupal') { return; }
    setHeaderJsLoaded(true);
    const script = document.createElement('script');
    script.src = HEADER_JS_URL;
    document.body.appendChild(script);
  }, [headerJsLoaded, setHeaderJsLoaded, renderMode]);

  // Render Loading
  if (renderMode === 'loading') {
    return (
      <header ref={ref} id="header" className={classes.skeletonHeader}>
        <Skeleton variant="rect" height={`${belowLg ? 60 : 125}px`} width="100%" />
      </header>
    );
  }

  // Render Drupal
  if (renderMode === 'drupal') {
    return (
      <header
        ref={ref}
        id="header"
        className={unstickyDrupalHeader ? classes.unstickyHeader : null}
      >
        {HTMLReactParser(headerHTML.replace(/ value=""/g, ' initialValue=""'))}
      </header>
    );
  }

  // Render Legacy
  return <NeonLegacyHeader {...props} ref={ref} />;
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
