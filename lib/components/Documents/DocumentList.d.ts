import { DocumentListItemModel } from './documentTypes';
import { Nullable } from '../../types/core';
export interface DocumentListProps {
    documents: DocumentListItemModel[];
    makeDownloadableLink: Nullable<boolean>;
    enableDownloadButton: Nullable<boolean>;
    fetchVariants: Nullable<boolean>;
    enableVariantChips: Nullable<boolean>;
}
declare const WrappedDocumentList: any;
export default WrappedDocumentList;
