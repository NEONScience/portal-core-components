import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

/**
   Function: Generate an appropriate height for the visualization given its width.
   Maintain a more square aspect ratio for smaller widths and prefer a 16:9
   ratio for larger widths.
*/
const autoVizHeight = (width) => {
  const breakpoints = [0, 675, 900, 1200];
  const ratios = ['3:2', '16:9', '2:1', '2.5:1'];
  const breakIdx = breakpoints.reduce((acc, breakpoint, idx) => (
    width >= breakpoint ? idx : acc
  ), 0);
  const ratio = /^([\d.]+):([\d.]+)$/.exec(ratios[breakIdx]);
  const mult = (parseFloat(ratio[2], 10) || 1) / (parseFloat(ratio[1], 10) || 1);
  return Math.floor(width * mult);
};

export default function FullWidthVisualization(props) {
  const {
    vizRef,
    minWidth,
    handleRedraw,
    allowHeightResize,
    deriveHeightFromWidth,
    containerStyle,
    children,
    ...other
  } = props;

  const containerRef = useRef(null);

  const [vizWidth, setVizWidth] = useState(minWidth);

  const handleResize = useCallback(() => {
    const container = containerRef.current;
    const viz = vizRef.current;
    // Do nothing if either container or viz references fail ot point to a DOM node
    if (!container || !viz) { return; }
    // Do nothing if either refs have no offset parent
    // (meaning they're hidden from rendering anyway)
    if (container.offsetParent === null || viz.offsetParent === null) { return; }
    // Do nothing if container and viz have the same width
    // (resize event fired but no actual resize necessary)
    if ((container.clientWidth === vizWidth) && !allowHeightResize) { return; }
    const newWidth = container.clientWidth;
    setVizWidth(newWidth);
    viz.setAttribute('width', `${newWidth}px`);
    if (deriveHeightFromWidth !== null) {
      const newHeight = deriveHeightFromWidth === 'auto'
        ? autoVizHeight(newWidth)
        : deriveHeightFromWidth(newWidth, container, viz);
      viz.setAttribute('height', `${newHeight}px`);
      viz.style.height = `${newHeight}px`;
    }
    if (handleRedraw) {
      handleRedraw();
    }
  }, [
    vizRef,
    containerRef,
    vizWidth,
    setVizWidth,
    allowHeightResize,
    handleRedraw,
    deriveHeightFromWidth,
  ]);

  useLayoutEffect(() => {
    const element = vizRef.current;
    if (!element) { return () => {}; }
    const parent = element.parentElement;
    handleResize();
    // Ensure resize observer is in place
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
    let resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(parent);
    return () => {
      if (!resizeObserver) { return; }
      resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [vizRef, handleResize]);

  const divProps = {
    ref: containerRef,
    style: { width: '100%', minWidth: `${minWidth}px` },
  };
  if (containerStyle) {
    divProps.style = containerStyle;
  }
  if (other['data-selenium']) { divProps['data-selenium'] = other['data-selenium']; }

  return (
    <div {...divProps}>
      {children}
    </div>
  );
}

FullWidthVisualization.propTypes = {
  vizRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  minWidth: PropTypes.number,
  handleRedraw: PropTypes.func,
  allowHeightResize: PropTypes.bool,
  deriveHeightFromWidth: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.oneOf(['auto']),
  ]),
  containerStyle: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ])),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ])),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};

FullWidthVisualization.defaultProps = {
  minWidth: 1,
  handleRedraw: null,
  deriveHeightFromWidth: null,
  allowHeightResize: false,
  containerStyle: null,
};
