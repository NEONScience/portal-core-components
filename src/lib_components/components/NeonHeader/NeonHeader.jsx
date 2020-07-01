import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';

import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';

import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';

import NeonLegacyHeader from './NeonLegacyHeader';

const HEADER_JS_URL = 'https://master-7rqtwti-di4alr4iwbwyg.us-2.platformsh.site/themes/custom/neon/build/components/header/header.js';

const useStyles = makeStyles(() => ({
  unstickyHeader: {
    paddingTop: 'unset !important',
    '& > header': {
      position: 'unset !important',
    },
  },
}));

const NeonHeader = (props) => {
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
      <header id="header">
        <Skeleton variant="rect" height="125px" width="100%" />
      </header>
    );
  }

  // Render Drupal
  if (renderMode === 'drupal') {
    return (
      <header id="header" className={unstickyDrupalHeader ? classes.unstickyHeader : null}>
        {HTMLReactParser(headerHTML.replace(' value=""', ' initialValue=""'))}
      </header>
    );
  }

  // Render Legacy
  return <NeonLegacyHeader {...props} />;
};

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
