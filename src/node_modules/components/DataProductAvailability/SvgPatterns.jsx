import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Theme, { COLORS } from '../Theme/Theme';

/**
   SVG Patterns
   Pattern shapes borrowed from https://github.com/iros/patternfills
   And edited here to be theme-colored.
*/

const svgPatternsSrc = {
  horizontalStripeSecondaryBlue2: {
    dim: 8,
    node: (
      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8">
        <rect x="0" y="0" width="8" height="8" fill={COLORS.SECONDARY_BLUE[100]} />
        <rect x="0" y="0" width="8" height="2" fill={COLORS.SECONDARY_BLUE[300]} />
        <rect x="0" y="4" width="8" height="2" fill={COLORS.SECONDARY_BLUE[300]} />
      </svg>
    ),
  },
  diagonalStripeSecondaryBlue3: {
    dim: 10,
    node: (
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
        <rect x="0" y="0" width="10" height="10" fill={COLORS.SECONDARY_BLUE[100]} />
        <path
          d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2"
          stroke={Theme.palette.secondary.main}
          strokeWidth="2"
        />
      </svg>
    ),
  },
};

export default function SvgPatterns() {
  return (
    <React.Fragment>
      {Object.keys(svgPatternsSrc).map((pattern) => {
        const { dim, node } = svgPatternsSrc[pattern];
        const base64 = btoa(ReactDOMServer.renderToStaticMarkup(node));
        return (
          <pattern id={pattern} key={pattern} patternUnits="userSpaceOnUse" width={dim} height={dim}>
            <image
              xlinkHref={`data:image/svg+xml;base64,${base64}`}
              x="0"
              y="0"
              width={dim}
              height={dim}
            />
          </pattern>
        );
      })}
    </React.Fragment>
  );
}

export const SvgPatternsString = () => ReactDOMServer.renderToStaticMarkup(SvgPatterns());
