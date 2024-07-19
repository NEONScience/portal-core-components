"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.VIEWER_SUPPORTED_DOC_TYPES = exports.PDF_VIEWER_SUPPORTED_DOC_TYPES = void 0;
var _Archive = _interopRequireDefault(require("@material-ui/icons/Archive"));
var _Code = _interopRequireDefault(require("@material-ui/icons/Code"));
var _DescriptionOutlined = _interopRequireDefault(require("@material-ui/icons/DescriptionOutlined"));
var _InsertDriveFile = _interopRequireDefault(require("@material-ui/icons/InsertDriveFile"));
var _Photo = _interopRequireDefault(require("@material-ui/icons/Photo"));
var _Tv = _interopRequireDefault(require("@material-ui/icons/Tv"));
var _GridOn = _interopRequireDefault(require("@material-ui/icons/GridOn"));
var _uaParserJs = _interopRequireDefault(require("ua-parser-js"));
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));
var _typeUtil = require("../util/typeUtil");
var _requestUtil = require("../util/requestUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const PDF_VIEWER_SUPPORTED_DOC_TYPES = exports.PDF_VIEWER_SUPPORTED_DOC_TYPES = ['application/pdf'];
const VIEWER_SUPPORTED_DOC_TYPES = exports.VIEWER_SUPPORTED_DOC_TYPES = ['application/pdf', 'text/html', 'text/markdown', 'text/plain'];
// See full list of device types here:
// https://github.com/faisalman/ua-parser-js#methods
const VIEWER_NOT_SUPPORTED_DEVICE_TYPES = ['console', 'mobile', 'tablet', 'smarttv', 'wearable', 'embedded'];
const documentTypes = {
  pdf: {
    match: type => type === 'application/pdf' || type.includes('pdf'),
    title: type => 'PDF',
    Icon: _DescriptionOutlined.default
  },
  markdown: {
    match: type => type === 'text/markdown',
    title: type => 'Markdown',
    Icon: _DescriptionOutlined.default
  },
  image: {
    match: type => ['image/gif', 'image/png', 'image/jpeg'].includes(type) || type.startsWith('image'),
    title: type => (0, _typeUtil.isStringNonEmpty)(type) ? "Image (".concat((type.match(/\/(.*)$/) || [])[1] || 'unknown type', ")") : 'unknown type',
    Icon: _Photo.default
  },
  csv: {
    match: type => type === 'text/csv' || type.includes('csv'),
    title: type => 'CSV',
    Icon: _GridOn.default
  },
  text: {
    match: type => type === 'text/plain',
    title: type => 'Plain text file',
    Icon: _DescriptionOutlined.default
  },
  document: {
    match: type => ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(type),
    title: type => 'Document',
    Icon: _DescriptionOutlined.default
  },
  spreadsheet: {
    match: type => type.includes('spreadsheet') || type.includes('excel'),
    title: type => 'Spreadsheet',
    Icon: _GridOn.default
  },
  presentation: {
    match: type => type.includes('presentation') || type.includes('powerpoint'),
    title: type => 'Presentation',
    Icon: _Tv.default
  },
  archive: {
    match: type => type.includes('zip'),
    title: type => 'ZIP archive',
    Icon: _Archive.default
  },
  binary: {
    match: type => type === 'application/octet-stream',
    title: type => 'Raw binary data',
    Icon: _InsertDriveFile.default
  },
  xml: {
    match: type => type === 'application/xml',
    title: type => 'XML',
    Icon: _Code.default
  },
  html: {
    match: type => type === 'text/html',
    title: type => 'HTML',
    Icon: _Code.default
  }
};
const documentTypeKeys = Object.keys(documentTypes);
const defaultDocumentType = {
  match: type => true,
  title: type => 'File type unavailable',
  Icon: _InsertDriveFile.default
};
const getFilenameFromContentDisposition = response => {
  let filename = null;
  const contentDisposition = response.headers.get('content-disposition');
  if ((0, _typeUtil.isStringNonEmpty)(contentDisposition)) {
    const filenameSplit = contentDisposition === null || contentDisposition === void 0 ? void 0 : contentDisposition.split('filename=');
    const splitLength = filenameSplit ? filenameSplit.length : -1;
    if ((0, _typeUtil.existsNonEmpty)(filenameSplit) && splitLength >= 2) {
      const quotedFilename = filenameSplit[1];
      filename = quotedFilename.replaceAll('"', '');
    }
  }
  return filename;
};
const DocumentService = {
  formatBytes: bytes => {
    if (!Number.isInteger(bytes) || bytes < 0) {
      return '0.000 B';
    }
    const scales = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const log = Math.log(bytes) / Math.log(1024);
    const scale = Math.floor(log);
    const precision = Math.floor(3 - (log - scale) * 3);
    return "".concat((bytes / 1024 ** scale).toFixed(precision), " ").concat(scales[scale]);
  },
  resolveDocumentType: document => {
    let documentType = DocumentService.getDefaultDocumentTypeListItemDef();
    if (typeof document.type === 'string') {
      const matchKey = DocumentService.getDocumentTypeListItemDefKeys().find(key => DocumentService.getDocumentTypeListItemDefs()[key].match(document.type));
      if (matchKey) {
        documentType = DocumentService.getDocumentTypeListItemDefs()[matchKey];
      }
    }
    return documentType;
  },
  getDocumentTypeTitle: document => {
    const documentType = DocumentService.resolveDocumentType(document);
    const {
      title: typeTitle
    } = documentType;
    return typeTitle(document.type);
  },
  findFirstByDocumentTypeTitle: (documents, typeTitle) => {
    if (!(0, _typeUtil.existsNonEmpty)(documents) || !(0, _typeUtil.isStringNonEmpty)(typeTitle)) {
      return null;
    }
    return documents.find(document => {
      const typeTitleString = DocumentService.getDocumentTypeTitle(document);
      return typeTitle.localeCompare(typeTitleString) === 0;
    });
  },
  getDocumentTypeListItemDefs: () => documentTypes,
  getDocumentTypeListItemDefKeys: () => documentTypeKeys,
  getDefaultDocumentTypeListItemDef: () => defaultDocumentType,
  isQuickStartGuide: doc => (0, _typeUtil.exists)(doc) && DocumentService.isQuickStartGuideName(doc.name),
  isQuickStartGuideName: name => (0, _typeUtil.isStringNonEmpty)(name) && name.startsWith('NEON.QSG.'),
  getQuickStartGuideNameRegex: () =>
  // eslint-disable-next-line prefer-regex-literals
  new RegExp(/^(?<name>NEON[.]QSG[.]DP[0-9]{1}[.][0-9]{5}[.][0-9]{3})(?<version>v(?<versionNumber>[0-9]+))*(?<extension>[.](?<extensionName>[a-z]+))*$/),
  parseQuickStartGuideName: name => {
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
      parsedVersion: (0, _typeUtil.isStringNonEmpty)(matches[3]) ? parseInt(matches[3], 10) : -1
    };
  },
  isViewerSupported: doc => (0, _typeUtil.exists)(doc) && (0, _typeUtil.isStringNonEmpty)(doc.type) && VIEWER_SUPPORTED_DOC_TYPES.includes(doc.type),
  isPdfViewerSupported: doc => (0, _typeUtil.exists)(doc) && (0, _typeUtil.isStringNonEmpty)(doc.type) && PDF_VIEWER_SUPPORTED_DOC_TYPES.includes(doc.type),
  isViewerDeviceSupported: () => {
    const uaParser = new _uaParserJs.default();
    const device = uaParser.getDevice();
    let isSupported = true;
    if ((0, _typeUtil.isStringNonEmpty)(device.type) && VIEWER_NOT_SUPPORTED_DEVICE_TYPES.includes(device.type)) {
      isSupported = false;
    }
    return isSupported;
  },
  transformSpecs: specs => {
    if (!(0, _typeUtil.existsNonEmpty)(specs)) {
      return [];
    }
    return specs.map(spec => DocumentService.transformSpec(spec));
  },
  transformSpec: spec => ({
    name: spec.specNumber,
    type: spec.specType,
    size: spec.specSize,
    description: spec.specDescription
  }),
  transformQuickStartGuideDocuments: documents => {
    if (!(0, _typeUtil.existsNonEmpty)(documents)) {
      return [];
    }
    return documents.map(document => DocumentService.transformQuickStartGuideDocument(document));
  },
  transformQuickStartGuideDocument: document => ({
    name: document.name,
    type: document.type,
    size: document.size,
    description: document.description
  }),
  applyDisplaySort: (documents, reverse, qsgPrecedence) => {
    if (!(0, _typeUtil.existsNonEmpty)(documents)) {
      return [];
    }
    const appliedReverse = reverse === true;
    const appliedQsgPrecedence = qsgPrecedence === true;
    const sortedDocs = [...documents];
    sortedDocs.sort((a, b) => {
      if (!(0, _typeUtil.exists)(a) && !(0, _typeUtil.exists)(b)) {
        return 0;
      }
      if (!(0, _typeUtil.exists)(a)) {
        return appliedReverse ? -1 : 1;
      }
      if (!(0, _typeUtil.exists)(b)) {
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
      if (!(0, _typeUtil.isStringNonEmpty)(a.description) && !(0, _typeUtil.isStringNonEmpty)(b.description)) {
        return 0;
      }
      if (!(0, _typeUtil.isStringNonEmpty)(a.description)) {
        return appliedReverse ? -1 : 1;
      }
      if (!(0, _typeUtil.isStringNonEmpty)(b.description)) {
        return appliedReverse ? 1 : -1;
      }
      const descriptionCompare = a.description.localeCompare(b.description);
      if (descriptionCompare === 0) {
        if (!(0, _typeUtil.isStringNonEmpty)(a.name) && !(0, _typeUtil.isStringNonEmpty)(b.name)) {
          return 0;
        }
        if (!(0, _typeUtil.isStringNonEmpty)(a.name)) {
          return appliedReverse ? -1 : 1;
        }
        if (!(0, _typeUtil.isStringNonEmpty)(b.name)) {
          return appliedReverse ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
      }
      return descriptionCompare;
    });
    return sortedDocs;
  },
  downloadDocument: (document, onSuccessCb, onErrorCb) => {
    const apiPath = DocumentService.isQuickStartGuide(document) ? "".concat(_NeonEnvironment.default.getFullApiPath('quickStartGuides'), "/").concat(document.name) : "".concat(_NeonEnvironment.default.getFullApiPath('documents'), "/").concat(document.name);
    fetch(apiPath, {
      method: 'HEAD'
    }).then(response => {
      if (!response.ok) {
        throw new Error('Invalid HEAD response');
      }
      let filename = getFilenameFromContentDisposition(response);
      if (!(0, _typeUtil.isStringNonEmpty)(filename)) {
        filename = document.name;
      }
      const fetchHeaders = {
        'User-Agent': (0, _requestUtil.getUserAgentHeader)('Documents')
      };
      fetch(apiPath, {
        method: 'GET',
        headers: fetchHeaders
      }).then(downloadResponse => {
        if (!downloadResponse.ok || !downloadResponse.body) {
          throw new Error('Invalid download response');
        }
        return downloadResponse.blob();
      }).then(blob => {
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
      }).catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
        if (onErrorCb) {
          onErrorCb(document);
        }
      });
    }).catch(err => {
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
  saveDocument: (document, onSuccessCb, onErrorCb) => {
    if (typeof window.showSaveFilePicker !== 'function') {
      // eslint-disable-next-line no-console
      console.error('Operation not supported');
      if (onErrorCb) {
        onErrorCb(document);
      }
    }
    const apiPath = DocumentService.isQuickStartGuide(document) ? "".concat(_NeonEnvironment.default.getFullApiPath('quickStartGuides'), "/").concat(document.name) : "".concat(_NeonEnvironment.default.getFullApiPath('documents'), "/").concat(document.name);
    fetch(apiPath, {
      method: 'HEAD'
    }).then(response => {
      if (!response.ok) {
        throw new Error('Invalid HEAD response');
      }
      let filename = getFilenameFromContentDisposition(response);
      if (!(0, _typeUtil.isStringNonEmpty)(filename)) {
        filename = document.name;
      }
      const saveOpts = {
        suggestedName: filename
      };
      window.showSaveFilePicker(saveOpts).then(fileHandle => fileHandle.createWritable()).then(writable => {
        fetch(apiPath).then(downloadResponse => {
          if (!downloadResponse.ok || !downloadResponse.body) {
            throw new Error('Invalid download response');
          }
          return downloadResponse.body.pipeTo(writable);
        }).then(value => {
          if (onSuccessCb) {
            onSuccessCb(document);
          }
        }).catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
          if (onErrorCb) {
            onErrorCb(document);
          }
        });
      }).catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
        if (onErrorCb) {
          onErrorCb(document);
        }
      });
    }).catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);
      if (onErrorCb) {
        onErrorCb(document);
      }
    });
  }
};
Object.freeze(DocumentService);
var _default = exports.default = DocumentService;