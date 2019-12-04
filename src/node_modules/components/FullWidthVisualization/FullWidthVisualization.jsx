import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

export default function FullWidthVisualization(props) {
  const {
    vizRef,
    minWidth,
    handleRedraw,
    deriveHeightFromWidth,
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
    if (container.clientWidth === vizWidth) { return; }
    const newWidth = container.clientWidth;
    setVizWidth(newWidth);
    viz.setAttribute('width', `${newWidth}px`);
    if (deriveHeightFromWidth) {
      const newHeight = deriveHeightFromWidth(newWidth);
      viz.setAttribute('height', `${newHeight}px`);
      viz.style.height = `${newHeight}px`;
    }
    if (handleRedraw) {
      handleRedraw();
    }
  }, [vizRef, containerRef, vizWidth, setVizWidth, handleRedraw, deriveHeightFromWidth]);

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
  }, [vizRef, handleResize, handleRedraw]);

  const divProps = {
    ref: containerRef,
    style: { width: '100%', minWidth: `${minWidth}px` },
  };
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
  deriveHeightFromWidth: PropTypes.func,
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
};
