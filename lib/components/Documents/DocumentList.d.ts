import React from 'react';
import { NeonDocument } from '../../types/neonApi';
export interface DocumentListProps {
    documents: NeonDocument[];
}
declare const DocumentList: React.FC<DocumentListProps>;
export default DocumentList;
