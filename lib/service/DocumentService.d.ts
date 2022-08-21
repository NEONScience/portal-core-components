/// <reference types="react" />
import { DataProductSpec, NeonDocument, QuickStartGuideDocument } from '../types/neonApi';
import { Nullable } from '../types/core';
export interface DocumentTypeListItemDef {
    match: (type: string) => boolean;
    title: (type?: string) => string;
    Icon: React.ReactNode;
}
export interface ParsedQsgNameResult {
    name: string;
    matchedName: string;
    matchedVersion: string;
    matchedExtension: string;
    parsedVersion: number;
}
export declare const PDF_VIEWER_SUPPORTED_DOC_TYPES: string[];
export declare const VIEWER_SUPPORTED_DOC_TYPES: string[];
export declare type DocumentCallback = (document: NeonDocument) => void;
export interface IDocumentService {
    formatBytes: (bytes: number) => string;
    resolveDocumentType: (document: NeonDocument) => DocumentTypeListItemDef;
    getDocumentTypeTitle: (document: NeonDocument) => string;
    findFirstByDocumentTypeTitle: (documents: NeonDocument[], typeTitle: string) => Nullable<NeonDocument>;
    getDocumentTypeListItemDefs: () => Record<string, DocumentTypeListItemDef>;
    getDocumentTypeListItemDefKeys: () => string[];
    getDefaultDocumentTypeListItemDef: () => DocumentTypeListItemDef;
    isQuickStartGuide: (doc: NeonDocument) => boolean;
    isQuickStartGuideName: (name: Nullable<string>) => boolean;
    getQuickStartGuideNameRegex: () => RegExp;
    parseQuickStartGuideName: (name: string) => Nullable<ParsedQsgNameResult>;
    isViewerSupported: (doc: NeonDocument) => boolean;
    isPdfViewerSupported: (doc: NeonDocument) => boolean;
    isViewerDeviceSupported: () => boolean;
    transformSpecs: (specs: DataProductSpec[]) => NeonDocument[];
    transformSpec: (spec: DataProductSpec) => NeonDocument;
    transformQuickStartGuideDocuments: (documents: QuickStartGuideDocument[]) => NeonDocument[];
    transformQuickStartGuideDocument: (document: QuickStartGuideDocument) => NeonDocument;
    applyDisplaySort: (documents: NeonDocument[], reverse?: boolean, qsgPrecedence?: boolean) => NeonDocument[];
    downloadDocument: (document: NeonDocument, onSuccessCb?: DocumentCallback, onErrorCb?: DocumentCallback) => void;
    /**
     * Utilize save as APIs to trigger a document download.
     * EXPERIMENTAL! Note that this utilizes not-yet-standard web APIs
     * that will not work across all browsers.
     * @param document
     * @param onSuccessCb
     * @param onErrorCb
     * @return
     */
    saveDocument: (document: NeonDocument, onSuccessCb?: DocumentCallback, onErrorCb?: DocumentCallback) => void;
}
declare const DocumentService: IDocumentService;
export default DocumentService;
