import React, {
  useCallback,
  useRef,
  useLayoutEffect,
  useState,
} from 'react';

import {
  makeStyles,
  createStyles,
  Theme as MuiTheme,
} from '@material-ui/core/styles';

import NeonEnvironment from '../NeonEnvironment';
import Theme from '../Theme/Theme';
import { StylesHook } from '../../types/muiTypes';
import { NeonDocument } from '../../types/neonApi';

const useStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    container: {
      width: '100%',
      margin: muiTheme.spacing(3, 3, 3, 3),
    },
  })) as StylesHook;

export interface DocumentViewerProps {
  document: NeonDocument;
  width: number;
}

const noop = () => {};

const breakpoints: number[] = [0, 675, 900, 1200];
const ratios: string[] = ['8:11', '3:4', '3:4', '3:4'];

const calcAutoHeight = (width: number): number => {
  const breakIdx: number = breakpoints.reduce(
    (acc, breakpoint, idx) => (width >= breakpoint ? idx : acc), 0,
  );
  const ratio: RegExpExecArray|null = /^([\d.]+):([\d.]+)$/.exec(ratios[breakIdx]);
  let mult: number = 4 / 3;
  if (ratio) {
    mult = (parseFloat(ratio[2]) || 1) / (parseFloat(ratio[1]) || 1);
  }
  return Math.floor(width * mult);
};

const DocumentViewer: React.FC<DocumentViewerProps> = (props: DocumentViewerProps): JSX.Element => {
  const classes = useStyles(Theme);
  const {
    document,
    width,
  }: DocumentViewerProps = props;

  const containerRef: React.MutableRefObject<HTMLDivElement|undefined> = useRef();
  const embedRef: React.MutableRefObject<HTMLEmbedElement|undefined> = useRef();
  const [
    viewerWidth,
    setViewerWidth,
  ]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(width);

  const handleResizeCb = useCallback((): void => {
    const container: HTMLDivElement|undefined = containerRef.current;
    const embed: HTMLEmbedElement|undefined = embedRef.current;
    // Do nothing if either container or viz references fail ot point to a DOM node
    if (!container || !embed) { return; }
    // Do nothing if either refs have no offset parent
    // (meaning they're hidden from rendering anyway)
    if ((container.offsetParent === null) || (embed.offsetParent === null)) { return; }
    // Do nothing if container and viz have the same width
    // (resize event fired but no actual resize necessary)
    if (container.clientWidth === viewerWidth) { return; }
    const newWidth: number = container.clientWidth;
    setViewerWidth(newWidth);
    embed.setAttribute('width', `${newWidth}`);
    embed.setAttribute('height', `${calcAutoHeight(newWidth)}`);
  }, [containerRef, embedRef, viewerWidth, setViewerWidth]);

  useLayoutEffect(() => {
    const element = embedRef.current;
    if (!element) { return noop; }
    const parent: HTMLElement|null = element.parentElement;
    if (!parent) { return noop; }
    handleResizeCb();
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResizeCb);
      return () => {
        window.removeEventListener('resize', handleResizeCb);
      };
    }
    let resizeObserver: ResizeObserver|null = new ResizeObserver(handleResizeCb);
    resizeObserver.observe(parent);
    return () => {
      if (!resizeObserver) { return; }
      resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [embedRef, handleResizeCb]);

  return (
    <div
      ref={containerRef as React.MutableRefObject<HTMLDivElement>}
      className={classes.container}
    >
      <embed
        ref={embedRef as React.MutableRefObject<HTMLEmbedElement>}
        type={document.type}
        src={`${NeonEnvironment.getFullApiPath('documents')}/${document.name}?inline=true`}
        title={document.description}
        width={viewerWidth}
        height={calcAutoHeight(viewerWidth)}
      />
    </div>
  );
};

export default DocumentViewer;
