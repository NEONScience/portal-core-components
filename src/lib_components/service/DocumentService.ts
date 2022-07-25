import ArchiveIcon from '@material-ui/icons/Archive';
import CodeIcon from '@material-ui/icons/Code';
import DocumentIcon from '@material-ui/icons/DescriptionOutlined';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import ImageIcon from '@material-ui/icons/Photo';
import PresentationIcon from '@material-ui/icons/Tv';
import SpreadsheetIcon from '@material-ui/icons/GridOn';

import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
import { exists, existsNonEmpty, isStringNonEmpty } from '../util/typeUtil';
import { DataProductSpec, NeonDocument, QuickStartGuideDocument } from '../types/neonApi';
import { Nullable } from '../types/core';

export interface DocumentTypeListItemDef {
  match: (type: string) => boolean;
  title: (type?: string) => string;
  Icon: React.ReactNode;
}

export interface ParsedQsgNameResult {
  name: string;
  matchedName: string;
  matchedVersion: string;
  matchedExtension: string;
  parsedVersion: number;
}

const documentTypes: Record<string, DocumentTypeListItemDef> = {
  pdf: {
    match: (type: string): boolean => (type === 'application/pdf' || type.includes('pdf')),
    title: (type?: string): string => 'PDF',
    Icon: DocumentIcon,
  },
  markdown: {
    match: (type: string): boolean => (type === 'text/markdown'),
    title: (type?: string): string => 'Markdown',
    Icon: DocumentIcon,
  },
  image: {
    match: (type: string): boolean => (
      ['image/gif', 'image/png', 'image/jpeg'].includes(type) || type.startsWith('image')
    ),
    title: (type?: string): string => (
      isStringNonEmpty(type)
        ? `Image (${((type as string).match(/\/(.*)$/) || [])[1] || 'unknown type'})`
        : 'unknown type'
    ),
    Icon: ImageIcon,
  },
  csv: {
    match: (type: string): boolean => (type === 'text/csv' || type.includes('csv')),
    title: (type?: string): string => 'CSV',
    Icon: SpreadsheetIcon,
  },
  text: {
    match: (type: string): boolean => (type === 'text/plain'),
    title: (type?: string): string => 'Plain text file',
    Icon: DocumentIcon,
  },
  document: {
    match: (type: string): boolean => ([
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ].includes(type)),
    title: (type?: string): string => 'Document',
    Icon: DocumentIcon,
  },
  spreadsheet: {
    match: (type: string): boolean => (type.includes('spreadsheet') || type.includes('excel')),
    title: (type?: string): string => 'Spreadsheet',
    Icon: SpreadsheetIcon,
  },
  presentation: {
    match: (type: string): boolean => (type.includes('presentation') || type.includes('powerpoint')),
    title: (type?: string): string => 'Presentation',
    Icon: PresentationIcon,
  },
  archive: {
    match: (type: string): boolean => (type.includes('zip')),
    title: (type?: string): string => 'ZIP archive',
    Icon: ArchiveIcon,
  },
  binary: {
    match: (type: string): boolean => (type === 'application/octet-stream'),
    title: (type?: string): string => 'Raw binary data',
    Icon: FileIcon,
  },
  xml: {
    match: (type: string): boolean => (type === 'application/xml'),
    title: (type?: string): string => 'XML',
    Icon: CodeIcon,
  },
  html: {
    match: (type: string): boolean => (type === 'text/html'),
    title: (type?: string): string => 'HTML',
    Icon: CodeIcon,
  },
};

const documentTypeKeys: string[] = Object.keys(documentTypes);

const defaultDocumentType: DocumentTypeListItemDef = {
  match: (type: string): boolean => true,
  title: (type?: string): string => 'File type unavailable',
  Icon: FileIcon,
};

const getFilenameFromContentDisposition = (response: Response): Nullable<string> => {
  let filename: Nullable<string> = null;
  const contentDisposition: string|null = response.headers.get('content-disposition');
  if (isStringNonEmpty(contentDisposition)) {
    const filenameSplit: string[]|undefined = contentDisposition?.split('filename=');
    const splitLength = (filenameSplit ? filenameSplit.length : -1);
    if (existsNonEmpty(filenameSplit) && (splitLength >= 2)) {
      const quotedFilename: string = (filenameSplit as string[])[1];
      filename = quotedFilename.replaceAll('"', '');
    }
  }
  return filename;
};

export type DocumentCallback = (document: NeonDocument) => void;

export interface IDocumentService {
  formatBytes: (bytes: number) => string;
  resolveDocumentType: (document: NeonDocument) => DocumentTypeListItemDef;
  getDocumentTypeTitle: (document: NeonDocument) => string;
  findFirstByDocumentTypeTitle: (
    documents: NeonDocument[],
    typeTitle: string,
  ) => Nullable<NeonDocument>;
  getDocumentTypeListItemDefs: () => Record<string, DocumentTypeListItemDef>;
  getDocumentTypeListItemDefKeys: () => string[];
  getDefaultDocumentTypeListItemDef: () => DocumentTypeListItemDef;
  isQuickStartGuide: (doc: NeonDocument) => boolean;
  isQuickStartGuideName: (name: Nullable<string>) => boolean;
  getQuickStartGuideNameRegex: () => RegExp;
  parseQuickStartGuideName: (name: string) => Nullable<ParsedQsgNameResult>;
  isViewerSupported: (doc: NeonDocument) => boolean;
  transformSpecs: (specs: DataProductSpec[]) => NeonDocument[];
  transformSpec: (spec: DataProductSpec) => NeonDocument;
  transformQuickStartGuideDocuments: (documents: QuickStartGuideDocument[]) => NeonDocument[];
  transformQuickStartGuideDocument: (document: QuickStartGuideDocument) => NeonDocument;
  downloadDocument: (
    document: NeonDocument,
    onSuccessCb?: DocumentCallback,
    onErrorCb?: DocumentCallback,
  ) => void;
  /**
   * Utilize save as APIs to trigger a document download.
   * EXPERIMENTAL! Note that this utilizes not-yet-standard web APIs
   * that will not work across all browsers.
   * @param document
   * @param onSuccessCb
   * @param onErrorCb
   * @return
   */
  saveDocument: (
    document: NeonDocument,
    onSuccessCb?: DocumentCallback,
    onErrorCb?: DocumentCallback,
  ) => void;
}

const DocumentService: IDocumentService = {
  formatBytes: (bytes: number): string => {
    if (!Number.isInteger(bytes) || bytes < 0) {
      return '0.000 B';
    }
    const scales: string[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const log: number = Math.log(bytes) / Math.log(1024);
    const scale: number = Math.floor(log);
    const precision: number = Math.floor(3 - ((log - scale) * 3));
    return `${(bytes / (1024 ** scale)).toFixed(precision)} ${scales[scale]}`;
  },
  resolveDocumentType: (document: NeonDocument): DocumentTypeListItemDef => {
    let documentType: DocumentTypeListItemDef = DocumentService.getDefaultDocumentTypeListItemDef();
    if (typeof document.type === 'string') {
      const matchKey = DocumentService.getDocumentTypeListItemDefKeys()
        .find((key) => DocumentService.getDocumentTypeListItemDefs()[key].match(document.type));
      if (matchKey) {
        documentType = DocumentService.getDocumentTypeListItemDefs()[matchKey];
      }
    }
    return documentType;
  },
  getDocumentTypeTitle: (document: NeonDocument): string => {
    const documentType: DocumentTypeListItemDef = DocumentService.resolveDocumentType(document);
    const { title: typeTitle }: DocumentTypeListItemDef = documentType;
    return typeTitle(document.type);
  },
  findFirstByDocumentTypeTitle: (
    documents: NeonDocument[],
    typeTitle: string,
  ): Nullable<NeonDocument> => {
    if (!existsNonEmpty(documents) || !isStringNonEmpty(typeTitle)) {
      return null;
    }
    return documents.find((document: NeonDocument): boolean => {
      const typeTitleString = DocumentService.getDocumentTypeTitle(document);
      return typeTitle.localeCompare(typeTitleString) === 0;
    });
  },
  getDocumentTypeListItemDefs: (): Record<string, DocumentTypeListItemDef> => documentTypes,
  getDocumentTypeListItemDefKeys: (): string[] => documentTypeKeys,
  getDefaultDocumentTypeListItemDef: (): DocumentTypeListItemDef => defaultDocumentType,
  isQuickStartGuide: (doc: NeonDocument): boolean => (
    exists(doc) && DocumentService.isQuickStartGuideName(doc.name)
  ),
  isQuickStartGuideName: (name: Nullable<string>): boolean => (
    isStringNonEmpty(name) && (name as string).startsWith('NEON.QSG.')
  ),
  getQuickStartGuideNameRegex: (): RegExp => (
    new RegExp(/^(?<name>NEON[.]QSG[.]DP[0-9]{1}[.][0-9]{5}[.][0-9]{3})(?<version>v(?<versionNumber>[0-9]+))*(?<extension>[.](?<extensionName>[a-z]+))*$/)
  ),
  parseQuickStartGuideName: (name: string): Nullable<ParsedQsgNameResult> => {
    const regex = DocumentService.getQuickStartGuideNameRegex();
    if (!regex) return null;
    const matches: RegExpExecArray|null = regex.exec(name);
    if (!matches) return null;
    if (matches.length <= 0) return null;
    return {
      name,
      matchedName: matches[1],
      matchedVersion: matches[2],
      matchedExtension: matches[4],
      parsedVersion: isStringNonEmpty(matches[3])
        ? parseInt(matches[3], 10)
        : -1,
    };
  },
  isViewerSupported: (doc: NeonDocument): boolean => (
    exists(doc)
    && isStringNonEmpty(doc.type)
    && ['application/pdf'].includes(doc.type)
  ),
  transformSpecs: (specs: DataProductSpec[]): NeonDocument[] => {
    if (!existsNonEmpty(specs)) {
      return [];
    }
    return specs.map((spec: DataProductSpec): NeonDocument => (
      DocumentService.transformSpec(spec)
    ));
  },
  transformSpec: (spec: DataProductSpec): NeonDocument => ({
    name: spec.specNumber,
    type: spec.specType,
    size: spec.specSize,
    description: spec.specDescription,
  }),
  transformQuickStartGuideDocuments: (documents: QuickStartGuideDocument[]): NeonDocument[] => {
    if (!existsNonEmpty(documents)) {
      return [];
    }
    return documents.map((document: QuickStartGuideDocument): NeonDocument => (
      DocumentService.transformQuickStartGuideDocument(document)
    ));
  },
  transformQuickStartGuideDocument: (document: QuickStartGuideDocument): NeonDocument => ({
    name: document.name,
    type: document.type,
    size: document.size,
    description: document.description,
  }),
  downloadDocument: (
    document: NeonDocument,
    onSuccessCb?: DocumentCallback,
    onErrorCb?: DocumentCallback,
  ): void => {
    const apiPath = DocumentService.isQuickStartGuide(document)
      ? `${NeonEnvironment.getFullApiPath('quickStartGuides')}/${document.name}`
      : `${NeonEnvironment.getFullApiPath('documents')}/${document.name}`;
    fetch(apiPath, { method: 'HEAD' })
      .then((response: Response): void => {
        if (!response.ok) {
          throw new Error('Invalid HEAD response');
        }
        let filename: Nullable<string> = getFilenameFromContentDisposition(response);
        if (!isStringNonEmpty(filename)) {
          filename = document.name;
        }
        fetch(apiPath)
          .then((downloadResponse: Response): Promise<Blob> => {
            if (!downloadResponse.ok || !downloadResponse.body) {
              throw new Error('Invalid download response');
            }
            return downloadResponse.blob();
          })
          .then((blob: Blob): void => {
            try {
              const link = window.document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.setAttribute('download', filename as string);
              window.document.body.appendChild(link);
              link.click();
              window.document.body.removeChild(link);
              if (onSuccessCb) {
                onSuccessCb(document);
              }
            } catch (e: unknown) {
              // eslint-disable-next-line no-console
              console.error(e);
              if (onErrorCb) {
                onErrorCb(document);
              }
            }
          })
          .catch((err: unknown): void => {
            // eslint-disable-next-line no-console
            console.error(err);
            if (onErrorCb) {
              onErrorCb(document);
            }
          });
      })
      .catch((err: unknown): void => {
        // eslint-disable-next-line no-console
        console.error(err);
        if (onErrorCb) {
          onErrorCb(document);
        }
      });
  },
  /**
   * Utilize save as APIs to trigger a document download.
   * EXPERIMENTAL! Note that this utilizes not-yet-standard web APIs
   * that will not work across all browsers.
   * @param document
   * @param onSuccessCb
   * @param onErrorCb
   * @return
   */
  saveDocument: (
    document: NeonDocument,
    onSuccessCb?: DocumentCallback,
    onErrorCb?: DocumentCallback,
  ): void => {
    if (typeof window.showSaveFilePicker !== 'function') {
      // eslint-disable-next-line no-console
      console.error('Operation not supported');
      if (onErrorCb) {
        onErrorCb(document);
      }
    }
    const apiPath = DocumentService.isQuickStartGuide(document)
      ? `${NeonEnvironment.getFullApiPath('quickStartGuides')}/${document.name}`
      : `${NeonEnvironment.getFullApiPath('documents')}/${document.name}`;
    fetch(apiPath, { method: 'HEAD' })
      .then((response: Response): void => {
        if (!response.ok) {
          throw new Error('Invalid HEAD response');
        }
        let filename: Nullable<string> = getFilenameFromContentDisposition(response);
        if (!isStringNonEmpty(filename)) {
          filename = document.name;
        }
        const saveOpts: SaveFilePickerOptions = {
          suggestedName: filename as string,
        };
        window.showSaveFilePicker(saveOpts)
          .then((fileHandle: FileSystemFileHandle): Promise<FileSystemWritableFileStream> => (
            fileHandle.createWritable()
          ))
          .then((writable: FileSystemWritableFileStream): void => {
            fetch(apiPath)
              .then((downloadResponse: Response): Promise<void> => {
                if (!downloadResponse.ok || !downloadResponse.body) {
                  throw new Error('Invalid download response');
                }
                return downloadResponse.body.pipeTo(writable);
              })
              .then((value: void|never): void => {
                if (onSuccessCb) {
                  onSuccessCb(document);
                }
              })
              .catch((err: unknown): void => {
                // eslint-disable-next-line no-console
                console.error(err);
                if (onErrorCb) {
                  onErrorCb(document);
                }
              });
          })
          .catch((err: unknown): void => {
            // eslint-disable-next-line no-console
            console.error(err);
            if (onErrorCb) {
              onErrorCb(document);
            }
          });
      })
      .catch((err: unknown): void => {
        // eslint-disable-next-line no-console
        console.error(err);
        if (onErrorCb) {
          onErrorCb(document);
        }
      });
  },
};

Object.freeze(DocumentService);

export default DocumentService;
