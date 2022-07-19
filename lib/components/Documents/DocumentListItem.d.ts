import React from 'react';
import { NeonDocument } from '../../types/neonApi';
export interface DocumentListItemProps {
    id: number;
    document: NeonDocument;
    makeDownloadableLink: boolean;
}
declare const DocumentListItem: React.FC<DocumentListItemProps>;
export default DocumentListItem;
