import React from 'react';
import { Nullable, Undef } from '../../types/core';
import { NeonDocument } from '../../types/neonApi';
export interface DocumentListItemModel extends NeonDocument {
    variants: NeonDocument[];
}
export interface DocumentListItemProps {
    id: number;
    document: DocumentListItemModel;
    makeDownloadableLink: boolean;
    enableDownloadButton: Nullable<boolean>;
    fetchVariants: Nullable<boolean>;
    enableVariantChips: Nullable<boolean>;
    containerComponent: Undef<React.ElementType<React.HTMLAttributes<HTMLDivElement>>>;
}
declare const WrappedDocumentListItem: any;
export default WrappedDocumentListItem;
