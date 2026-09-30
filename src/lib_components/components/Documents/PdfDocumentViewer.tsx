import React, {
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { createPortal } from 'react-dom';

import * as pdfjs from 'pdfjs-dist';
import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer.mjs';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { EventBus, PDFLinkService, PDFViewer } from 'pdfjs-dist/web/pdf_viewer.mjs';
import { DocumentInitParameters } from 'pdfjs-dist/types/src/display/api';
import { PDFViewerOptions } from 'pdfjs-dist/types/web/pdf_viewer';
import { PDFLinkServiceOptions } from 'pdfjs-dist/types/web/pdf_link_service';

import DocumentService from '../../service/DocumentService';
import ErrorCard from '../Card/ErrorCard';
import NeonEnvironment from '../NeonEnvironment';
import WarningCard from '../Card/WarningCard';
import { NeonDocument } from '../../types/neonApi';
import { makeStyles } from '../Theme/makeStyles';
import { isStringNonEmpty } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';
import { Undef } from '../../types/core';

// Pull in PDF JS and set up a reference to the worker source
pdfjs.GlobalWorkerOptions.workerPort = new Worker(
  new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url),
  { type: 'module' },
);

const PDF_VIEWER_CSS_URL = new URL(
  'pdfjs-dist/web/pdf_viewer.css',
  import.meta.url,
).toString();

const PDF_MARGIN = 13;

const useStyles = makeStyles()(() => ({
  parentContainer: {
    width: '100%',
  },
  container: {
    width: '100%',
    position: 'relative',
    backgroundColor: 'rgb(82, 86, 89, 0.9)',
  },
  pdfViewerHost: {
    position: 'absolute',
    top: `${PDF_MARGIN}px`,
    left: `${PDF_MARGIN}px`,
    right: `${PDF_MARGIN}px`,
    bottom: `${PDF_MARGIN}px`,
  },
}));

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

const defaultProps = {
  fullUrlPath: undefined,
};

const PdfDocumentViewer: React.FC<PdfDocumentViewerProps> = (
  inProps: PdfDocumentViewerProps,
): React.JSX.Element => {
  const props = resolveProps(defaultProps, inProps) as PdfDocumentViewerProps;
  const { classes } = useStyles();
  const {
    document,
    width,
    fullUrlPath,
  }: PdfDocumentViewerProps = props;
  const appliedUrlPath = isStringNonEmpty(fullUrlPath)
    ? fullUrlPath
    : NeonEnvironment.getFullApiPath('documents');
  const dataUrl: string = `${appliedUrlPath}/${document.name}?inline=true&fallback=html`;

  const containerRef: React.RefObject<HTMLDivElement|undefined> = useRef(undefined);
  const pdfViewerHostRef: React.RefObject<HTMLDivElement|undefined> = useRef(undefined);
  const pdfContainerRef: React.RefObject<HTMLDivElement|undefined> = useRef(undefined);
  const pdfViewerRef: React.RefObject<PDFViewer|undefined> = useRef(undefined);
  const [
    shadowRoot,
    setShadowRoot,
  ]: [ShadowRoot|null, Dispatch<SetStateAction<ShadowRoot|null>>] = useState<ShadowRoot|null>(null);
  const [
    failedDataUrl,
    setFailedDataUrl,
  ]: [Undef<string>, Dispatch<SetStateAction<Undef<string>>>] = useState<Undef<string>>(undefined);

  const isErrorState: boolean = failedDataUrl === dataUrl;

  const handleResizeCb = useCallback((): void => {
    const container: HTMLDivElement|undefined = containerRef.current;
    if (!container) { return; }
    const parent: HTMLElement|null = container.parentElement;
    if (!parent) { return; }
    const newWidth: number = parent.clientWidth;
    if (newWidth <= 0) { return; }
    container.style.height = `${calcAutoHeight(newWidth)}px`;
    if (pdfViewerRef.current && (newWidth >= MIN_PDF_VIEWER_WIDTH)) {
      pdfViewerRef.current.currentScaleValue = 'page-width';
    }
  }, [
    containerRef,
  ]);

  const handleSetErrorStateCb = useCallback((isErrorStateCb: boolean): void => {
    setFailedDataUrl(isErrorStateCb ? dataUrl : undefined);
  }, [
    dataUrl,
    setFailedDataUrl,
  ]);

  useLayoutEffect(() => {
    const host: HTMLDivElement|undefined = pdfViewerHostRef.current;
    if (!host) {
      setShadowRoot(null);
      return noop;
    }
    const root: ShadowRoot = host.shadowRoot || host.attachShadow({ mode: 'open' });
    setShadowRoot(root);
    return noop;
  }, [
    pdfViewerHostRef,
    isErrorState,
  ]);

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
  }, [
    containerRef,
    handleResizeCb,
    width,
  ]);

  useEffect(() => {
    if (isErrorState || !shadowRoot) { return noop; }
    const pdfContainerElement: HTMLDivElement|undefined = pdfContainerRef.current;
    if (!pdfContainerElement) { return noop; }
    const config: DocumentInitParameters = {
      url: dataUrl,
      disableStream: true,
      disableAutoFetch: true,
    };
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
      removePageBorders: true,
    };
    const pdfViewer: PDFViewer = new PDFJSViewer.PDFViewer(pdfViewerOptions);
    pdfViewerRef.current = pdfViewer;
    pdfLinkService.setViewer(pdfViewer);
    const handlePagesInit = (): void => {
      const container: HTMLDivElement|undefined = containerRef.current;
      if (container && (container.clientWidth >= MIN_PDF_VIEWER_WIDTH)) {
        pdfViewer.currentScaleValue = 'page-width';
      }
    };
    eventBus.on('pagesinit', handlePagesInit);
    let isCancelled = false;
    const loadingTask = pdfjs.getDocument(config);
    loadingTask.promise.then((doc: PDFDocumentProxy) => {
      if (isCancelled || pdfViewerRef.current !== pdfViewer) { return; }
      pdfViewer.setDocument(doc);
      pdfLinkService.setDocument(doc, null);
      handleSetErrorStateCb(false);
    }, (reason: unknown) => {
      if (isCancelled) { return; }
      // eslint-disable-next-line no-console
      console.error(`Error during ${dataUrl} loading: ${reason}`);
      handleSetErrorStateCb(true);
    });
    return () => {
      isCancelled = true;
      eventBus.off('pagesinit', handlePagesInit);
      if (pdfViewerRef.current === pdfViewer) {
        pdfViewerRef.current = undefined;
      }
    };
  }, [
    dataUrl,
    pdfContainerRef,
    shadowRoot,
    isErrorState,
    handleSetErrorStateCb,
  ]);

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
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className={classes.container}
        style={{ height: calcAutoHeight(width) }}
      >
        <div
          ref={pdfViewerHostRef as React.RefObject<HTMLDivElement>}
          className={classes.pdfViewerHost}
        />
        {shadowRoot && createPortal(
          <>
            <link rel="stylesheet" href={PDF_VIEWER_CSS_URL} />
            <div
              ref={pdfContainerRef as React.RefObject<HTMLDivElement>}
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'auto',
              }}
            >
              <div className="pdfViewer" />
            </div>
          </>,
          shadowRoot,
        )}
      </div>
    </div>
  );
};

export default PdfDocumentViewer;
