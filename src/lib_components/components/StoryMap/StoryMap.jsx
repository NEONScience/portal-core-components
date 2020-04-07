import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import FullWidthVisualization from '../FullWidthVisualization/FullWidthVisualization';

const MIN_IFRAME_WIDTH = 240;

/**
   Function: Generate an appropriate height for the iframe given its width.
   Maintain a more square aspect ratio for smaller widths and prefer a 16:9
   ratio for larger widths.
   Known breakpoints for Visus viewer: 675, 900, 1200, 1425
*/
const getIframeHeight = (width) => {
  const breakpoints = [0, 675, 900, 1200];
  const ratios = ['3:2', '16:9', '2:1', '2.5:1'];
  const breakIdx = breakpoints.reduce(
    (acc, breakpoint, idx) => (width >= breakpoint ? idx : acc), 0,
  );
  const ratio = /^([\d.]+):([\d.]+)$/.exec(ratios[breakIdx]);
  const mult = (parseFloat(ratio[2], 10) || 1) / (parseFloat(ratio[1], 10) || 1);
  return Math.floor(width * mult);
};

const StoryMap = (props) => {
  const { url, title = 'NEON Story Map' } = props;

  const iframeRef = useRef(null);

  return (
    <FullWidthVisualization
      vizRef={iframeRef}
      minWidth={MIN_IFRAME_WIDTH}
      deriveHeightFromWidth={getIframeHeight}
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
