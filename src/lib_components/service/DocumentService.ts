import ArchiveIcon from '@material-ui/icons/Archive';
import CodeIcon from '@material-ui/icons/Code';
import DocumentIcon from '@material-ui/icons/DescriptionOutlined';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import ImageIcon from '@material-ui/icons/Photo';
import PresentationIcon from '@material-ui/icons/Tv';
import SpreadsheetIcon from '@material-ui/icons/GridOn';

import { exists, existsNonEmpty, isStringNonEmpty } from '../util/typeUtil';
import { DataProductSpec, NeonDocument } from '../types/neonApi';
import { Nullable } from '../types/core';

export interface DocumentTypeListItemDef {
  match: (type: string) => boolean;
  title: (type?: string) => string;
  Icon: React.ReactNode;
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

export interface IDocumentService {
  formatBytes: (bytes: number) => string;
  getDocumentTypeListItemDefs: () => Record<string, DocumentTypeListItemDef>;
  getDocumentTypeListItemDefKeys: () => string[];
  getDefaultDocumentTypeListItemDef: () => DocumentTypeListItemDef;
  isQuickStartGuide: (doc: NeonDocument) => boolean;
  isQuickStartGuideName: (name: Nullable<string>) => boolean;
  isViewerSupported: (doc: NeonDocument) => boolean;
  transformSpecs: (specs: DataProductSpec[]) => NeonDocument[];
  transformSpec: (spec: DataProductSpec) => NeonDocument;
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
  getDocumentTypeListItemDefs: (): Record<string, DocumentTypeListItemDef> => documentTypes,
  getDocumentTypeListItemDefKeys: (): string[] => documentTypeKeys,
  getDefaultDocumentTypeListItemDef: (): DocumentTypeListItemDef => defaultDocumentType,
  isQuickStartGuide: (doc: NeonDocument): boolean => (
    exists(doc) && DocumentService.isQuickStartGuideName(doc.name)
  ),
  isQuickStartGuideName: (name: Nullable<string>): boolean => (
    isStringNonEmpty(name) && (name as string).startsWith('NEON.QSG.')
  ),
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
};

Object.freeze(DocumentService);

export default DocumentService;
