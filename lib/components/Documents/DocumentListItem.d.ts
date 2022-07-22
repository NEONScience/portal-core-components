import { Nullable } from '../../types/core';
import { DocumentListItemModel } from './documentTypes';
export interface DocumentListItemProps {
    id: number;
    document: DocumentListItemModel;
    makeDownloadableLink: boolean;
    enableDownloadButton: Nullable<boolean>;
    fetchVariants: Nullable<boolean>;
    enableVariantChips: Nullable<boolean>;
}
declare const WrappedDocumentListItem: any;
export default WrappedDocumentListItem;
