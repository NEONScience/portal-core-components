import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import Theme from '../Theme/Theme';
import FullWidthVisualization from '../FullWidthVisualization/FullWidthVisualization';

const MIN_IFRAME_WIDTH = 240;

const useStyles = makeStyles(theme => ({
  openInNewLink: {
    display: 'block',
    width: '100%',
    textAlign: 'right',
    marginTop: theme.spacing(0.5),
    fontSize: '0.8rem',
  },
  openInNewIcon: {
    fontSize: '0.95rem',
    margin: theme.spacing(0, 0.5, -0.25, 0),
  },
}));

const StoryMap = (props) => {
  const { url, title = 'NEON Story Map' } = props;

  const classes = useStyles(Theme);
  const iframeRef = useRef(null);

  return (
    <FullWidthVisualization
      vizRef={iframeRef}
      minWidth={MIN_IFRAME_WIDTH}
      deriveHeightFromWidth="auto"
      data-selenium="story-map-container"
    >
      <iframe
        src={url}
        title={title}
        ref={iframeRef}
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        style={{ minWidth: `${MIN_IFRAME_WIDTH}px`, minHeight: `${MIN_IFRAME_WIDTH}px` }}
      />
      <Link href={url} target="_blank" className={classes.openInNewLink}>
        <OpenInNewIcon className={classes.openInNewIcon} />
        Open in New Window
      </Link>
    </FullWidthVisualization>
  );
};

StoryMap.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
};

StoryMap.defaultProps = {
  title: null,
};

export default StoryMap;
