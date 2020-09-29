import React from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';

import Skeleton from '@material-ui/lab/Skeleton';

import REMOTE_ASSETS from '../../remoteAssetsMap/remoteAssetsMap';
import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';

import NeonLegacyFooter from './NeonLegacyFooter';

const DRUPAL_FOOTER_HTML_FALLBACK = require('../../remoteAssets/drupal-footer.html');

const DRUPAL_FOOTER_HTML = REMOTE_ASSETS.DRUPAL_FOOTER_HTML.KEY;

const NeonFooter = (props) => {
  const { drupalCssLoaded, useCoreHeader } = props;
  const [{
    isActive: neonContextIsActive,
    fetches: { [DRUPAL_FOOTER_HTML]: footerFetch },
    html: { [DRUPAL_FOOTER_HTML]: footerHTML },
  }] = NeonContext.useNeonContextState();

  let renderMode = 'legacy';
  if (!useCoreHeader && neonContextIsActive) {
    switch (footerFetch.status) {
      case FETCH_STATUS.SUCCESS:
        renderMode = (footerHTML && drupalCssLoaded) ? 'drupal' : 'loading';
        break;
      case FETCH_STATUS.ERROR:
        renderMode = drupalCssLoaded ? 'drupal-fallback' : 'loading';
        break;
      default:
        renderMode = 'loading';
        break;
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

    case 'drupal-fallback':
      return (
        <footer id="footer">
          {HTMLReactParser(DRUPAL_FOOTER_HTML_FALLBACK)}
        </footer>
      );

    default:
      return <NeonLegacyFooter />;
  }
};

NeonFooter.propTypes = {
  drupalCssLoaded: PropTypes.bool,
  useCoreHeader: PropTypes.bool,
};

NeonFooter.defaultProps = {
  drupalCssLoaded: false,
  useCoreHeader: false,
};

export default NeonFooter;
