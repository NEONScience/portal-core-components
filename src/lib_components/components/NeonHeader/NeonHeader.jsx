import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';

import Skeleton from '@material-ui/lab/Skeleton';

import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';

import NeonLegacyHeader from './NeonLegacyHeader';

const HEADER_JS_URL = 'https://master-7rqtwti-di4alr4iwbwyg.us-2.platformsh.site/themes/custom/neon/build/components/header/header.js';

const NeonHeader = (props) => {
  const [{
    isActive,
    fetches: { header: headerFetch },
    html: { header: headerHTML },
  }] = NeonContext.useNeonContextState();

  const [headerJsLoaded, setHeaderJsLoaded] = useState(false);

  let renderMode = 'legacy';
  if (isActive) {
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

  switch (renderMode) {
    case 'loading':
      return (
        <header id="header">
          <Skeleton variant="rect" height="125px" width="100%" />
        </header>
      );

    case 'drupal':
      return (
        <header id="header">
          {HTMLReactParser(headerHTML.replace(' value=""', ' initialValue=""'))}
        </header>
      );

    default:
      return <NeonLegacyHeader {...props} />;
  }
};

NeonHeader.propTypes = {
  ...NeonLegacyHeader.propTypes,
  useCoreHeader: PropTypes.bool,
};

NeonHeader.defaultProps = {
  ...NeonLegacyHeader.defaultProps,
  useCoreHeader: false,
};

export default NeonHeader;
