import React from 'react';
import { NeonDocument } from '../../types/neonApi';
export interface DocumentViewerProps {
    document: NeonDocument;
    width: number;
    fullUrlPath?: string;
}
declare const PdfDocumentViewer: React.FC<DocumentViewerProps>;
export default PdfDocumentViewer;
