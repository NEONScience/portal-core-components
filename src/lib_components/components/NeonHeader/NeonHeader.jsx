import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';

import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';

import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';

import NeonLegacyHeader from './NeonLegacyHeader';

const HEADER_JS_URL = 'https://preview.neonscience.org/themes/custom/neon/build/components/header/header.js';

const useStyles = makeStyles(() => ({
  skeletonHeader: {
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(0, 0, 0, 0.25)',
  },
  unstickyHeader: {
    paddingTop: 'unset !important',
    '& > header': {
      position: 'unset !important',
    },
  },
}));

const NeonHeader = forwardRef((props, ref) => {
  const {
    useCoreHeader,
    unstickyDrupalHeader,
  } = props;
  const classes = useStyles();

  const [{
    isActive,
    fetches: { header: headerFetch },
    html: { header: headerHTML },
  }] = NeonContext.useNeonContextState();

  const [headerJsLoaded, setHeaderJsLoaded] = useState(false);

  let renderMode = 'legacy';
  if (!useCoreHeader && isActive) {
    if (headerFetch.status === FETCH_STATUS.SUCCESS && headerHTML) {
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
        <Skeleton variant="rect" height="125px" width="100%" />
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
  useCoreHeader: PropTypes.bool,
  unstickyDrupalHeader: PropTypes.bool,
};

NeonHeader.defaultProps = {
  ...NeonLegacyHeader.defaultProps,
  useCoreHeader: false,
  unstickyDrupalHeader: true,
};

export default NeonHeader;
