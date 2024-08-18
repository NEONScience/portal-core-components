import React from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';

import { makeStyles } from '@mui/styles';
import Skeleton from '@mui/material/Skeleton';

import REMOTE_ASSETS from '../../remoteAssetsMap/remoteAssetsMap';
import DRUPAL_FOOTER_HTML_FALLBACK from '../../remoteAssets/drupal-footer.html';
import NeonContext, { FETCH_STATUS } from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import Theme from '../Theme/Theme';

const DRUPAL_FOOTER_HTML = REMOTE_ASSETS.DRUPAL_FOOTER_HTML.KEY;

const useStyles = makeStyles((theme) => ({
  footerContainer: {
    '& .footer-bottom__wrapper': {
      background: '#4B372E',
    },
  },
}));

const NeonFooter = (props) => {
  const { drupalCssLoaded, showSkeleton } = props;
  const classes = useStyles(Theme);
  const [{
    isActive: neonContextIsActive,
    fetches: { [DRUPAL_FOOTER_HTML]: footerFetch },
    html: { [DRUPAL_FOOTER_HTML]: footerHTML },
  }] = NeonContext.useNeonContextState();

  let renderMode = 'legacy';
  if (neonContextIsActive) {
    switch (footerFetch.status) {
      case FETCH_STATUS.SUCCESS:
        renderMode = (footerHTML && drupalCssLoaded) ? 'drupal' : 'loading';
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

  const renderFallback = () => ((
    <footer id="footer" className={classes.footerContainer}>
      {HTMLReactParser(DRUPAL_FOOTER_HTML_FALLBACK)}
    </footer>
  ));

  switch (renderMode) {
    case 'loading':
      if (!showSkeleton) {
        return renderFallback();
      }
      return (
        <footer id="footer">
          <Skeleton variant="rectangular" height="300px" width="100%" />
        </footer>
      );

    case 'drupal':
      return (
        <footer id="footer">
          {HTMLReactParser(footerHTML)}
        </footer>
      );

    case 'drupal-fallback':
    default:
      return renderFallback();
  }
};

NeonFooter.propTypes = {
  drupalCssLoaded: PropTypes.bool,
  showSkeleton: PropTypes.bool,
};

NeonFooter.defaultProps = {
  drupalCssLoaded: false,
  showSkeleton: false,
};

export default NeonFooter;
