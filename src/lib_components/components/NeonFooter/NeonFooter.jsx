import React from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';

import Skeleton from '@mui/material/Skeleton';

import REMOTE_ASSETS from '../../remoteAssetsMap/remoteAssetsMap';
import DRUPAL_FOOTER_HTML_FALLBACK from '../../remoteAssets/drupal-footer.html';
import NeonPageAssetsContext, { FETCH_STATUS } from '../NeonContext/NeonPageAssetsContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';
import { exists } from '../../util/typeUtil';

const DRUPAL_FOOTER_HTML = REMOTE_ASSETS.DRUPAL_FOOTER_HTML.KEY;

const useStyles = makeStyles()((theme) => ({
  footerContainer: {
    '& .footer-bottom__wrapper': {
      background: '#4B372E',
    },
  },
}));

const defaultProps = {
  drupalCssLoaded: false,
  showSkeleton: false,
  minWidth: undefined,
};

const NeonFooter = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const { drupalCssLoaded, showSkeleton, minWidth } = props;
  const { classes } = useStyles();
  const [{
    isActive: neonPageAssetsContextIsActive,
    fetches: { [DRUPAL_FOOTER_HTML]: footerFetch },
    html: { [DRUPAL_FOOTER_HTML]: footerHTML },
  }] = NeonPageAssetsContext.useNeonPageAssetsContextState();

  let renderMode = 'legacy';
  if (neonPageAssetsContextIsActive) {
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

  const outerFooterContainerStyles = {};
  if (exists(minWidth)) {
    outerFooterContainerStyles.minWidth = minWidth;
  }

  const renderFallback = () => ((
    <footer id="footer" className={classes.footerContainer} style={outerFooterContainerStyles}>
      {HTMLReactParser(DRUPAL_FOOTER_HTML_FALLBACK)}
    </footer>
  ));

  switch (renderMode) {
    case 'loading':
      if (!showSkeleton) {
        return renderFallback();
      }
      return (
        <footer id="footer" style={outerFooterContainerStyles}>
          <Skeleton variant="rectangular" height="300px" width="100%" />
        </footer>
      );

    case 'drupal':
      return (
        <footer id="footer" style={outerFooterContainerStyles}>
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
  minWidth: PropTypes.string,
};

export default NeonFooter;
