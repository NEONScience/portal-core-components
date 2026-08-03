import React from 'react';
import { DocumentListItemModel } from './DocumentListItem';
import { Nullable } from '../../types/core';
export interface DocumentListProps {
    documents: DocumentListItemModel[];
    makeDownloadableLink: Nullable<boolean>;
    enableDownloadButton: Nullable<boolean>;
    fetchVariants: Nullable<boolean>;
    enableVariantChips: Nullable<boolean>;
}
declare const DocumentList: React.FC<DocumentListProps>;
export default DocumentList;
