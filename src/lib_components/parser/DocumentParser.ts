import { exists, resolveAny } from '../util/typeUtil';
import { QuickStartGuideDocument, QuickStartGuideVersion } from '../types/neonApi';
import { Nullable, UnknownRecord } from '../types/core';

export interface IDocumentParser {
  parseQuickStartGuideVersionResponse: (
    response: UnknownRecord,
  ) => Nullable<QuickStartGuideVersion>;
  parseQuickStartGuideDocuments: (documents: UnknownRecord[]) => QuickStartGuideDocument[];
  parseQuickStartGuideDocument: (document: UnknownRecord) => QuickStartGuideDocument;
}

const DocumentParser: IDocumentParser = {
  parseQuickStartGuideVersionResponse: (
    response: UnknownRecord,
  ): Nullable<QuickStartGuideVersion> => {
    if (!exists(response)) {
      return null;
    }
    const data: UnknownRecord = resolveAny(response as never, 'data');
    if (!exists(data)) {
      return null;
    }
    return {
      name: data.name as string,
      version: data.version as number,
      publishedDate: data.publishedDate as string,
      documents: DocumentParser.parseQuickStartGuideDocuments(data.documents as UnknownRecord[]),
    };
  },
  parseQuickStartGuideDocuments: (documents: UnknownRecord[]): QuickStartGuideDocument[] => {
    if (!Array.isArray(documents)) {
      return [];
    }
    return documents.map((document: UnknownRecord): QuickStartGuideDocument => (
      DocumentParser.parseQuickStartGuideDocument(document)
    ));
  },
  parseQuickStartGuideDocument: (document: UnknownRecord): QuickStartGuideDocument => ({
    name: document.name as string,
    description: document.description as string,
    type: document.type as string,
    size: document.size as number,
    md5: document.md5 as string,
    generationDate: document.generationDate as string,
    url: document.url as string,
  }),
};

Object.freeze(DocumentParser);

export default DocumentParser;
