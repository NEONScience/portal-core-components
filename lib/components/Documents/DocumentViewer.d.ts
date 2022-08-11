import React from 'react';
import { NeonDocument } from '../../types/neonApi';
export interface DocumentViewerProps {
    document: NeonDocument;
    width: number;
    fullUrlPath?: string;
}
declare const DocumentViewer: React.FC<DocumentViewerProps>;
export default DocumentViewer;
