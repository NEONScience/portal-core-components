import { QuickStartGuideDocument, QuickStartGuideVersion } from '../types/neonApi';
import { Nullable, UnknownRecord } from '../types/core';
export interface IDocumentParser {
    parseQuickStartGuideVersionResponse: (response: UnknownRecord) => Nullable<QuickStartGuideVersion>;
    parseQuickStartGuideDocuments: (documents: UnknownRecord[]) => QuickStartGuideDocument[];
    parseQuickStartGuideDocument: (document: UnknownRecord) => QuickStartGuideDocument;
}
declare const DocumentParser: IDocumentParser;
export default DocumentParser;
