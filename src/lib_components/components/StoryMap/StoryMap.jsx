import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import FullWidthVisualization from '../FullWidthVisualization/FullWidthVisualization';

const MIN_IFRAME_WIDTH = 240;

const StoryMap = (props) => {
  const { url, title = 'NEON Story Map' } = props;

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
