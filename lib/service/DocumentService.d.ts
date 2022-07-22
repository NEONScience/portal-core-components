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
    transformSpecs: (specs: DataProductSpec[]) => NeonDocument[];
    transformSpec: (spec: DataProductSpec) => NeonDocument;
    transformQuickStartGuideDocuments: (documents: QuickStartGuideDocument[]) => NeonDocument[];
    transformQuickStartGuideDocument: (document: QuickStartGuideDocument) => NeonDocument;
}
declare const DocumentService: IDocumentService;
export default DocumentService;
