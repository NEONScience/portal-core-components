import React, {
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import * as pdfjs from 'pdfjs-dist';
import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer.mjs';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { EventBus, PDFLinkService, PDFViewer } from 'pdfjs-dist/web/pdf_viewer.mjs';
import { DocumentInitParameters } from 'pdfjs-dist/types/src/display/api';
import { PDFViewerOptions } from 'pdfjs-dist/types/web/pdf_viewer';
import { PDFLinkServiceOptions } from 'pdfjs-dist/types/web/pdf_link_service';

import {
  makeStyles,
  createStyles,
  Theme as MuiTheme,
} from '@material-ui/core/styles';

import DocumentService from '../../service/DocumentService';
import ErrorCard from '../Card/ErrorCard';
import NeonEnvironment from '../NeonEnvironment';
import Theme from '../Theme/Theme';
import WarningCard from '../Card/WarningCard';
import { StylesHook } from '../../types/muiTypes';
import { NeonDocument } from '../../types/neonApi';
import { isStringNonEmpty } from '../../util/typeUtil';

// Pull in PDF JS and set up a reference to the worker source
pdfjs.GlobalWorkerOptions.workerPort = new Worker(
  new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url),
  { type: 'module' },
);

const useStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    parentContainer: {
      width: '100%',
    },
    container: {
      width: '100%',
      position: 'relative',
    },
    pdfViewerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'auto',
      backgroundColor: 'rgb(82, 86, 89, 0.9)',
      '& .pdfViewer > .page': {
        margin: '20px',
        boxShadow: `0px 2px 1px -1px rgb(0 0 0 / 20%),
          0px 1px 1px 0px rgb(0 0 0 / 14%),
          0px 1px 3px 0px rgb(0 0 0 / 12%)`,
      },
    },
  })) as StylesHook;

export interface PdfDocumentViewerProps {
  document: NeonDocument;
  width: number;
  fullUrlPath?: string;
}

const noop = () => { /* NOOP */ };

const MIN_PDF_VIEWER_WIDTH = 800;

const breakpoints: number[] = [0, 675, 900, 1200];
const ratios: string[] = ['8:11', '3:4', '4:4', '4:3'];

const calcAutoHeight = (width: number): number => {
  const breakIdx: number = breakpoints.reduce((acc, breakpoint, idx) => (
    width >= breakpoint ? idx : acc
  ), 0);
  const ratio: RegExpExecArray|null = /^([\d.]+):([\d.]+)$/.exec(ratios[breakIdx]);
  let mult: number = 4 / 3;
  if (ratio) {
    mult = (parseFloat(ratio[2]) || 1) / (parseFloat(ratio[1]) || 1);
  }
  return Math.floor(width * mult);
};

const PdfDocumentViewer: React.FC<PdfDocumentViewerProps> = (
  props: PdfDocumentViewerProps,
): JSX.Element => {
  const classes = useStyles(Theme);
  const {
    document,
    width,
    fullUrlPath,
  }: PdfDocumentViewerProps = props;
  const appliedUrlPath = isStringNonEmpty(fullUrlPath)
    ? fullUrlPath
    : NeonEnvironment.getFullApiPath('documents');
  const dataUrl: string = `${appliedUrlPath}/${document.name}?inline=true&fallback=html`;

  const containerRef: React.MutableRefObject<HTMLDivElement|undefined> = useRef();
  const pdfContainerRef: React.MutableRefObject<HTMLDivElement|undefined> = useRef();
  const pdfViewerRef: React.MutableRefObject<PDFViewer|undefined> = useRef();
  const [
    viewerWidth,
    setViewerWidth,
  ]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(width);
  const [
    isErrorState,
    setIsErrorState,
  ]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  const handleResizeCb = useCallback((): void => {
    const container: HTMLDivElement|undefined = containerRef.current;
    const pdfContainerElement: HTMLDivElement|undefined = pdfContainerRef.current;
    if (!container || !pdfContainerElement) { return; }
    const parent: HTMLElement|null = container.parentElement;
    if (!parent) { return; }
    if (parent.clientWidth === viewerWidth) { return; }
    const newWidth: number = parent.clientWidth;
    setViewerWidth(newWidth);
    container.style.width = `${newWidth}px`;
    container.style.height = `${calcAutoHeight(newWidth)}px`;
    pdfContainerElement.style.width = `${newWidth}px`;
    pdfContainerElement.style.height = `${calcAutoHeight(newWidth)}px`;
    if (pdfViewerRef.current && (newWidth >= MIN_PDF_VIEWER_WIDTH)) {
      pdfViewerRef.current.currentScaleValue = 'page-width';
    }
  }, [containerRef, pdfContainerRef, viewerWidth, setViewerWidth]);

  const handleSetErrorStateCb = useCallback((isErrorStateCb: boolean): void => {
    setIsErrorState(isErrorStateCb);
  }, [setIsErrorState]);

  useLayoutEffect(() => {
    const element = containerRef.current;
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
  }, [containerRef, handleResizeCb]);

  useEffect(() => {
    if (isErrorState) { return; }
    const pdfContainerElement: HTMLDivElement|undefined = pdfContainerRef.current;
    if (!pdfContainerElement) { return; }
    const config: DocumentInitParameters = { url: dataUrl };
    const eventBus: EventBus = new PDFJSViewer.EventBus();
    const pdfLinkServiceOptions: PDFLinkServiceOptions = {
      eventBus,
    };
    const pdfLinkService: PDFLinkService = new PDFJSViewer.PDFLinkService(pdfLinkServiceOptions);
    const pdfViewerOptions: PDFViewerOptions = {
      container: pdfContainerElement,
      linkService: pdfLinkService,
      textLayerMode: 0,
      eventBus,
    };
    pdfViewerRef.current = new PDFJSViewer.PDFViewer(pdfViewerOptions);
    pdfLinkService.setViewer(pdfViewerRef.current);
    eventBus.on('pagesinit', () => {
      if (pdfViewerRef.current) {
        pdfViewerRef.current.currentScaleValue = 'page-width';
      }
    });
    const loadingTask = pdfjs.getDocument(config);
    loadingTask.promise.then((doc: PDFDocumentProxy) => {
      if (pdfViewerRef.current) {
        pdfViewerRef.current.setDocument(doc);
      }
      pdfLinkService.setDocument(doc, null);
      handleSetErrorStateCb(false);
    }, (reason: unknown) => {
      // eslint-disable-next-line no-console
      console.error(`Error during ${dataUrl} loading: ${reason}`);
      handleSetErrorStateCb(true);
    });
  }, [dataUrl, pdfContainerRef, isErrorState, handleSetErrorStateCb]);

  if (isErrorState) {
    return (
      <div className={classes.parentContainer}>
        <ErrorCard
          title="Document Error"
          message="This document type is not supported or could not be displayed"
        />
      </div>
    );
  }
  if (!DocumentService.isPdfViewerSupported(document)) {
    return (
      <div className={classes.parentContainer}>
        <WarningCard title="This document type is not supported" />
      </div>
    );
  }

  return (
    <div className={classes.parentContainer}>
      <div
        ref={containerRef as React.MutableRefObject<HTMLDivElement>}
        className={classes.container}
      >
        <div
          ref={pdfContainerRef as React.MutableRefObject<HTMLDivElement>}
          className={`${classes.pdfViewerContainer}`}
        >
          <div className="pdfViewer" />
        </div>
      </div>
    </div>
  );
};

PdfDocumentViewer.defaultProps = {
  fullUrlPath: undefined,
};

export default PdfDocumentViewer;
