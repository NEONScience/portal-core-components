import React from 'react';
import { NeonDocument } from '../../types/neonApi';
export interface PdfDocumentViewerProps {
    document: NeonDocument;
    width: number;
    fullUrlPath?: string;
}
declare const PdfDocumentViewer: React.FC<PdfDocumentViewerProps>;
export default PdfDocumentViewer;
