import ArchiveIcon from '@mui/icons-material/Archive';
import CodeIcon from '@mui/icons-material/Code';
import DocumentIcon from '@mui/icons-material/DescriptionOutlined';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Photo';
import PresentationIcon from '@mui/icons-material/Tv';
import SpreadsheetIcon from '@mui/icons-material/GridOn';
import UAParser from 'ua-parser-js';
import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
import { exists, existsNonEmpty, isStringNonEmpty } from '../util/typeUtil';
import { getUserAgentHeader } from '../util/requestUtil';
export const PDF_VIEWER_SUPPORTED_DOC_TYPES = [
    'application/pdf'
];
export const VIEWER_SUPPORTED_DOC_TYPES = [
    'application/pdf',
    'text/html',
    'text/markdown',
    'text/plain'
];
// See full list of device types here:
// https://github.com/faisalman/ua-parser-js#methods
const VIEWER_NOT_SUPPORTED_DEVICE_TYPES = [
    'console',
    'mobile',
    'tablet',
    'smarttv',
    'wearable',
    'embedded'
];
const documentTypes = {
    pdf: {
        match: (type)=>type === 'application/pdf' || type.includes('pdf'),
        title: (type)=>'PDF',
        Icon: DocumentIcon
    },
    markdown: {
        match: (type)=>type === 'text/markdown',
        title: (type)=>'Markdown',
        Icon: DocumentIcon
    },
    image: {
        match: (type)=>[
                'image/gif',
                'image/png',
                'image/jpeg'
            ].includes(type) || type.startsWith('image'),
        title: (type)=>isStringNonEmpty(type) ? `Image (${(type.match(/\/(.*)$/) || [])[1] || 'unknown type'})` : 'unknown type',
        Icon: ImageIcon
    },
    csv: {
        match: (type)=>type === 'text/csv' || type.includes('csv'),
        title: (type)=>'CSV',
        Icon: SpreadsheetIcon
    },
    text: {
        match: (type)=>type === 'text/plain',
        title: (type)=>'Plain text file',
        Icon: DocumentIcon
    },
    document: {
        match: (type)=>[
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ].includes(type),
        title: (type)=>'Document',
        Icon: DocumentIcon
    },
    spreadsheet: {
        match: (type)=>type.includes('spreadsheet') || type.includes('excel'),
        title: (type)=>'Spreadsheet',
        Icon: SpreadsheetIcon
    },
    presentation: {
        match: (type)=>type.includes('presentation') || type.includes('powerpoint'),
        title: (type)=>'Presentation',
        Icon: PresentationIcon
    },
    archive: {
        match: (type)=>type.includes('zip'),
        title: (type)=>'ZIP archive',
        Icon: ArchiveIcon
    },
    binary: {
        match: (type)=>type === 'application/octet-stream',
        title: (type)=>'Raw binary data',
        Icon: FileIcon
    },
    xml: {
        match: (type)=>type === 'application/xml',
        title: (type)=>'XML',
        Icon: CodeIcon
    },
    html: {
        match: (type)=>type === 'text/html',
        title: (type)=>'HTML',
        Icon: CodeIcon
    }
};
const documentTypeKeys = Object.keys(documentTypes);
const defaultDocumentType = {
    match: (type)=>true,
    title: (type)=>'File type unavailable',
    Icon: FileIcon
};
const getFilenameFromContentDisposition = (response)=>{
    let filename = null;
    const contentDisposition = response.headers.get('content-disposition');
    if (isStringNonEmpty(contentDisposition)) {
        const filenameSplit = contentDisposition?.split('filename=');
        const splitLength = filenameSplit ? filenameSplit.length : -1;
        if (existsNonEmpty(filenameSplit) && splitLength >= 2) {
            const quotedFilename = filenameSplit[1];
            filename = quotedFilename.replaceAll('"', '');
        }
    }
    return filename;
};
const DocumentService = {
    formatBytes: (bytes)=>{
        if (!Number.isInteger(bytes) || bytes < 0) {
            return '0.000 B';
        }
        const scales = [
            'B',
            'KB',
            'MB',
            'GB',
            'TB',
            'PB'
        ];
        const log = Math.log(bytes) / Math.log(1024);
        const scale = Math.floor(log);
        const precision = Math.floor(3 - (log - scale) * 3);
        return `${(bytes / 1024 ** scale).toFixed(precision)} ${scales[scale]}`;
    },
    resolveDocumentType: (document)=>{
        let documentType = DocumentService.getDefaultDocumentTypeListItemDef();
        if (typeof document.type === 'string') {
            const matchKey = DocumentService.getDocumentTypeListItemDefKeys().find((key)=>DocumentService.getDocumentTypeListItemDefs()[key].match(document.type));
            if (matchKey) {
                documentType = DocumentService.getDocumentTypeListItemDefs()[matchKey];
            }
        }
        return documentType;
    },
    getDocumentTypeTitle: (document)=>{
        const documentType = DocumentService.resolveDocumentType(document);
        const { title: typeTitle } = documentType;
        return typeTitle(document.type);
    },
    findFirstByDocumentTypeTitle: (documents, typeTitle)=>{
        if (!existsNonEmpty(documents) || !isStringNonEmpty(typeTitle)) {
            return null;
        }
        return documents.find((document)=>{
            const typeTitleString = DocumentService.getDocumentTypeTitle(document);
            return typeTitle.localeCompare(typeTitleString) === 0;
        });
    },
    getDocumentTypeListItemDefs: ()=>documentTypes,
    getDocumentTypeListItemDefKeys: ()=>documentTypeKeys,
    getDefaultDocumentTypeListItemDef: ()=>defaultDocumentType,
    isQuickStartGuide: (doc)=>exists(doc) && DocumentService.isQuickStartGuideName(doc.name),
    isQuickStartGuideName: (name)=>isStringNonEmpty(name) && name.startsWith('NEON.QSG.'),
    getQuickStartGuideNameRegex: ()=>// eslint-disable-next-line prefer-regex-literals
        new RegExp(/^(?<name>NEON[.]QSG[.]DP[0-9]{1}[.][0-9]{5}[.][0-9]{3})(?<version>v(?<versionNumber>[0-9]+))*(?<extension>[.](?<extensionName>[a-z]+))*$/),
    parseQuickStartGuideName: (name)=>{
        const regex = DocumentService.getQuickStartGuideNameRegex();
        if (!regex) return null;
        const matches = regex.exec(name);
        if (!matches) return null;
        if (matches.length <= 0) return null;
        return {
            name,
            matchedName: matches[1],
            matchedVersion: matches[2],
            matchedExtension: matches[4],
            parsedVersion: isStringNonEmpty(matches[3]) ? parseInt(matches[3], 10) : -1
        };
    },
    isViewerSupported: (doc)=>exists(doc) && isStringNonEmpty(doc.type) && VIEWER_SUPPORTED_DOC_TYPES.includes(doc.type),
    isPdfViewerSupported: (doc)=>exists(doc) && isStringNonEmpty(doc.type) && PDF_VIEWER_SUPPORTED_DOC_TYPES.includes(doc.type),
    isViewerDeviceSupported: ()=>{
        const uaParser = new UAParser();
        const device = uaParser.getDevice();
        let isSupported = true;
        if (isStringNonEmpty(device.type) && VIEWER_NOT_SUPPORTED_DEVICE_TYPES.includes(device.type)) {
            isSupported = false;
        }
        return isSupported;
    },
    transformSpecs: (specs)=>{
        if (!existsNonEmpty(specs)) {
            return [];
        }
        return specs.map((spec)=>DocumentService.transformSpec(spec));
    },
    transformSpec: (spec)=>({
            name: spec.specNumber,
            type: spec.specType,
            size: spec.specSize,
            description: spec.specDescription
        }),
    transformQuickStartGuideDocuments: (documents)=>{
        if (!existsNonEmpty(documents)) {
            return [];
        }
        return documents.map((document)=>DocumentService.transformQuickStartGuideDocument(document));
    },
    transformQuickStartGuideDocument: (document)=>({
            name: document.name,
            type: document.type,
            size: document.size,
            description: document.description
        }),
    applyDisplaySort: (documents, reverse, qsgPrecedence)=>{
        if (!existsNonEmpty(documents)) {
            return [];
        }
        const appliedReverse = reverse === true;
        const appliedQsgPrecedence = qsgPrecedence === true;
        const sortedDocs = [
            ...documents
        ];
        sortedDocs.sort((a, b)=>{
            if (!exists(a) && !exists(b)) {
                return 0;
            }
            if (!exists(a)) {
                return appliedReverse ? -1 : 1;
            }
            if (!exists(b)) {
                return appliedReverse ? 1 : -1;
            }
            if (appliedQsgPrecedence) {
                const aQsg = DocumentService.isQuickStartGuide(a);
                const bQsg = DocumentService.isQuickStartGuide(b);
                if (!aQsg || !bQsg) {
                    if (aQsg) {
                        return appliedReverse ? 1 : -1;
                    }
                    if (bQsg) {
                        return appliedReverse ? -1 : 1;
                    }
                }
            }
            if (!isStringNonEmpty(a.description) && !isStringNonEmpty(b.description)) {
                return 0;
            }
            if (!isStringNonEmpty(a.description)) {
                return appliedReverse ? -1 : 1;
            }
            if (!isStringNonEmpty(b.description)) {
                return appliedReverse ? 1 : -1;
            }
            const descriptionCompare = a.description.localeCompare(b.description);
            if (descriptionCompare === 0) {
                if (!isStringNonEmpty(a.name) && !isStringNonEmpty(b.name)) {
                    return 0;
                }
                if (!isStringNonEmpty(a.name)) {
                    return appliedReverse ? -1 : 1;
                }
                if (!isStringNonEmpty(b.name)) {
                    return appliedReverse ? 1 : -1;
                }
                return a.name.localeCompare(b.name);
            }
            return descriptionCompare;
        });
        return sortedDocs;
    },
    downloadDocument: (document, onSuccessCb, onErrorCb)=>{
        const apiPath = DocumentService.isQuickStartGuide(document) ? `${NeonEnvironment.getFullApiPath('quickStartGuides')}/${document.name}` : `${NeonEnvironment.getFullApiPath('documents')}/${document.name}`;
        fetch(apiPath, {
            method: 'HEAD'
        }).then((response)=>{
            if (!response.ok) {
                throw new Error('Invalid HEAD response');
            }
            let filename = getFilenameFromContentDisposition(response);
            if (!isStringNonEmpty(filename)) {
                filename = document.name;
            }
            const fetchHeaders = {
                'User-Agent': getUserAgentHeader('Documents')
            };
            fetch(apiPath, {
                method: 'GET',
                headers: fetchHeaders
            }).then((downloadResponse)=>{
                if (!downloadResponse.ok || !downloadResponse.body) {
                    throw new Error('Invalid download response');
                }
                return downloadResponse.blob();
            }).then((blob)=>{
                try {
                    const link = window.document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.setAttribute('download', filename);
                    window.document.body.appendChild(link);
                    link.click();
                    window.document.body.removeChild(link);
                    if (onSuccessCb) {
                        onSuccessCb(document);
                    }
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                    if (onErrorCb) {
                        onErrorCb(document);
                    }
                }
            }).catch((err)=>{
                // eslint-disable-next-line no-console
                console.error(err);
                if (onErrorCb) {
                    onErrorCb(document);
                }
            });
        }).catch((err)=>{
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
   */ saveDocument: (document, onSuccessCb, onErrorCb)=>{
        if (typeof window.showSaveFilePicker !== 'function') {
            // eslint-disable-next-line no-console
            console.error('Operation not supported');
            if (onErrorCb) {
                onErrorCb(document);
            }
        }
        const apiPath = DocumentService.isQuickStartGuide(document) ? `${NeonEnvironment.getFullApiPath('quickStartGuides')}/${document.name}` : `${NeonEnvironment.getFullApiPath('documents')}/${document.name}`;
        fetch(apiPath, {
            method: 'HEAD'
        }).then((response)=>{
            if (!response.ok) {
                throw new Error('Invalid HEAD response');
            }
            let filename = getFilenameFromContentDisposition(response);
            if (!isStringNonEmpty(filename)) {
                filename = document.name;
            }
            // eslint-disable-next-line no-undef
            const saveOpts = {
                suggestedName: filename
            };
            window.showSaveFilePicker(saveOpts).then((fileHandle)=>fileHandle.createWritable()).then((writable)=>{
                fetch(apiPath).then((downloadResponse)=>{
                    if (!downloadResponse.ok || !downloadResponse.body) {
                        throw new Error('Invalid download response');
                    }
                    return downloadResponse.body.pipeTo(writable);
                }).then((value)=>{
                    if (onSuccessCb) {
                        onSuccessCb(document);
                    }
                }).catch((err)=>{
                    // eslint-disable-next-line no-console
                    console.error(err);
                    if (onErrorCb) {
                        onErrorCb(document);
                    }
                });
            }).catch((err)=>{
                // eslint-disable-next-line no-console
                console.error(err);
                if (onErrorCb) {
                    onErrorCb(document);
                }
            });
        }).catch((err)=>{
            // eslint-disable-next-line no-console
            console.error(err);
            if (onErrorCb) {
                onErrorCb(document);
            }
        });
    }
};
Object.freeze(DocumentService);
export default DocumentService;
