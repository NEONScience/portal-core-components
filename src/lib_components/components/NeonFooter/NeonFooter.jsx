import React from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';

import Skeleton from '@material-ui/lab/Skeleton';

import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';

import NeonLegacyFooter from './NeonLegacyFooter';

const NeonFooter = (props) => {
  const { drupalCssLoaded } = props;
  const [{
    isActive,
    fetches: { footer: footerFetch },
    html: { footer: footerHTML },
  }] = NeonContext.useNeonContextState();

  let renderMode = 'legacy';
  if (isActive) {
    if (footerFetch.status === FETCH_STATUS.SUCCESS && footerHTML && drupalCssLoaded) {
      renderMode = 'drupal';
    }
    if ([FETCH_STATUS.AWAITING_CALL, FETCH_STATUS.FETCHING].includes(footerFetch.status)) {
      renderMode = 'loading';
    }
  }

  switch (renderMode) {
    case 'loading':
      return (
        <footer id="footer">
          <Skeleton variant="rect" height="300px" width="100%" />
        </footer>
      );

    case 'drupal':
      return (
        <footer id="footer">
          {HTMLReactParser(footerHTML)}
        </footer>
      );

    default:
      return <NeonLegacyFooter />;
  }
};

NeonFooter.propTypes = {
  drupalCssLoaded: PropTypes.bool,
};

NeonFooter.defaultProps = {
  drupalCssLoaded: false,
};

export default NeonFooter;
