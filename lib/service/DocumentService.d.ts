/// <reference types="react" />
import { DataProductSpec, NeonDocument } from '../types/neonApi';
import { Nullable } from '../types/core';
export interface DocumentTypeListItemDef {
    match: (type: string) => boolean;
    title: (type?: string) => string;
    Icon: React.ReactNode;
}
export interface IDocumentService {
    formatBytes: (bytes: number) => string;
    getDocumentTypeListItemDefs: () => Record<string, DocumentTypeListItemDef>;
    getDocumentTypeListItemDefKeys: () => string[];
    getDefaultDocumentTypeListItemDef: () => DocumentTypeListItemDef;
    isQuickStartGuide: (doc: NeonDocument) => boolean;
    isQuickStartGuideName: (name: Nullable<string>) => boolean;
    isViewerSupported: (doc: NeonDocument) => boolean;
    transformSpecs: (specs: DataProductSpec[]) => NeonDocument[];
    transformSpec: (spec: DataProductSpec) => NeonDocument;
}
declare const DocumentService: IDocumentService;
export default DocumentService;
