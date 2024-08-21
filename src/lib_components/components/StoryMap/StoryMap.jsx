import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@mui/styles';
import Link from '@mui/material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import Theme from '../Theme/Theme';
import FullWidthVisualization from '../FullWidthVisualization/FullWidthVisualization';
import { resolveProps } from '../../util/defaultProps';

const MIN_IFRAME_WIDTH = 240;

const useStyles = makeStyles((theme) => ({
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

const defaultProps = {
  title: null,
};

const StoryMap = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const { url, title } = props;

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
        title={title || 'Neon Story Map'}
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

const WrappedStoryMap = Theme.getWrappedComponent(StoryMap);

export default WrappedStoryMap;
