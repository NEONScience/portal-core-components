import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback, useRef, useEffect, useLayoutEffect, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer.mjs';
import { makeStyles, createStyles } from '@mui/styles';
import DocumentService from '../../service/DocumentService';
import ErrorCard from '../Card/ErrorCard';
import NeonEnvironment from '../NeonEnvironment';
import Theme from '../Theme/Theme';
import WarningCard from '../Card/WarningCard';
import { isStringNonEmpty } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';
// Pull in PDF JS and set up a reference to the worker source
pdfjs.GlobalWorkerOptions.workerPort = new Worker(new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url), {
    type: 'module'
});
const useStyles = makeStyles((muiTheme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        parentContainer: {
            width: '100%'
        },
        container: {
            width: '100%',
            position: 'relative'
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
          0px 1px 3px 0px rgb(0 0 0 / 12%)`
            }
        }
    }));
const noop = ()=>{};
const MIN_PDF_VIEWER_WIDTH = 800;
const breakpoints = [
    0,
    675,
    900,
    1200
];
const ratios = [
    '8:11',
    '3:4',
    '4:4',
    '4:3'
];
const calcAutoHeight = (width)=>{
    const breakIdx = breakpoints.reduce((acc, breakpoint, idx)=>width >= breakpoint ? idx : acc, 0);
    const ratio = /^([\d.]+):([\d.]+)$/.exec(ratios[breakIdx]);
    let mult = 4 / 3;
    if (ratio) {
        mult = (parseFloat(ratio[2]) || 1) / (parseFloat(ratio[1]) || 1);
    }
    return Math.floor(width * mult);
};
const defaultProps = {
    fullUrlPath: undefined
};
const PdfDocumentViewer = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const classes = useStyles(Theme);
    const { document, width, fullUrlPath } = props;
    const appliedUrlPath = isStringNonEmpty(fullUrlPath) ? fullUrlPath : NeonEnvironment.getFullApiPath('documents');
    const dataUrl = `${appliedUrlPath}/${document.name}?inline=true&fallback=html`;
    const containerRef = useRef(undefined);
    const pdfContainerRef = useRef(undefined);
    const pdfViewerRef = useRef(undefined);
    const [viewerWidth, setViewerWidth] = useState(width);
    const [isErrorState, setIsErrorState] = useState(false);
    const handleResizeCb = useCallback(()=>{
        const container = containerRef.current;
        const pdfContainerElement = pdfContainerRef.current;
        if (!container || !pdfContainerElement) {
            return;
        }
        const parent = container.parentElement;
        if (!parent) {
            return;
        }
        if (parent.clientWidth === viewerWidth) {
            return;
        }
        const newWidth = parent.clientWidth;
        setViewerWidth(newWidth);
        container.style.width = `${newWidth}px`;
        container.style.height = `${calcAutoHeight(newWidth)}px`;
        pdfContainerElement.style.width = `${newWidth}px`;
        pdfContainerElement.style.height = `${calcAutoHeight(newWidth)}px`;
        if (pdfViewerRef.current && newWidth >= MIN_PDF_VIEWER_WIDTH) {
            pdfViewerRef.current.currentScaleValue = 'page-width';
        }
    }, [
        containerRef,
        pdfContainerRef,
        viewerWidth,
        setViewerWidth
    ]);
    const handleSetErrorStateCb = useCallback((isErrorStateCb)=>{
        setIsErrorState(isErrorStateCb);
    }, [
        setIsErrorState
    ]);
    useLayoutEffect(()=>{
        const element = containerRef.current;
        if (!element) {
            return noop;
        }
        const parent = element.parentElement;
        if (!parent) {
            return noop;
        }
        handleResizeCb();
        if (typeof ResizeObserver !== 'function') {
            window.addEventListener('resize', handleResizeCb);
            return ()=>{
                window.removeEventListener('resize', handleResizeCb);
            };
        }
        let resizeObserver = new ResizeObserver(handleResizeCb);
        resizeObserver.observe(parent);
        return ()=>{
            if (!resizeObserver) {
                return;
            }
            resizeObserver.disconnect();
            resizeObserver = null;
        };
    }, [
        containerRef,
        handleResizeCb
    ]);
    useEffect(()=>{
        if (isErrorState) {
            return;
        }
        const pdfContainerElement = pdfContainerRef.current;
        if (!pdfContainerElement) {
            return;
        }
        const config = {
            url: dataUrl
        };
        const eventBus = new PDFJSViewer.EventBus();
        const pdfLinkServiceOptions = {
            eventBus
        };
        const pdfLinkService = new PDFJSViewer.PDFLinkService(pdfLinkServiceOptions);
        const pdfViewerOptions = {
            container: pdfContainerElement,
            linkService: pdfLinkService,
            textLayerMode: 0,
            eventBus
        };
        pdfViewerRef.current = new PDFJSViewer.PDFViewer(pdfViewerOptions);
        pdfLinkService.setViewer(pdfViewerRef.current);
        eventBus.on('pagesinit', ()=>{
            if (pdfViewerRef.current) {
                pdfViewerRef.current.currentScaleValue = 'page-width';
            }
        });
        const loadingTask = pdfjs.getDocument(config);
        loadingTask.promise.then((doc)=>{
            if (pdfViewerRef.current) {
                pdfViewerRef.current.setDocument(doc);
            }
            pdfLinkService.setDocument(doc, null);
            handleSetErrorStateCb(false);
        }, (reason)=>{
            // eslint-disable-next-line no-console
            console.error(`Error during ${dataUrl} loading: ${reason}`);
            handleSetErrorStateCb(true);
        });
    }, [
        dataUrl,
        pdfContainerRef,
        isErrorState,
        handleSetErrorStateCb
    ]);
    if (isErrorState) {
        return /*#__PURE__*/ _jsx("div", {
            className: classes.parentContainer,
            children: /*#__PURE__*/ _jsx(ErrorCard, {
                title: "Document Error",
                message: "This document type is not supported or could not be displayed"
            })
        });
    }
    if (!DocumentService.isPdfViewerSupported(document)) {
        return /*#__PURE__*/ _jsx("div", {
            className: classes.parentContainer,
            children: /*#__PURE__*/ _jsx(WarningCard, {
                title: "This document type is not supported"
            })
        });
    }
    return /*#__PURE__*/ _jsx("div", {
        className: classes.parentContainer,
        children: /*#__PURE__*/ _jsx("div", {
            ref: containerRef,
            className: classes.container,
            children: /*#__PURE__*/ _jsx("div", {
                ref: pdfContainerRef,
                className: `${classes.pdfViewerContainer}`,
                children: /*#__PURE__*/ _jsx("div", {
                    className: "pdfViewer"
                })
            })
        })
    });
};
export default PdfDocumentViewer;
