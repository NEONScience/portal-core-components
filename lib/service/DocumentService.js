"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Archive = _interopRequireDefault(require("@material-ui/icons/Archive"));

var _Code = _interopRequireDefault(require("@material-ui/icons/Code"));

var _DescriptionOutlined = _interopRequireDefault(require("@material-ui/icons/DescriptionOutlined"));

var _InsertDriveFile = _interopRequireDefault(require("@material-ui/icons/InsertDriveFile"));

var _Photo = _interopRequireDefault(require("@material-ui/icons/Photo"));

var _Tv = _interopRequireDefault(require("@material-ui/icons/Tv"));

var _GridOn = _interopRequireDefault(require("@material-ui/icons/GridOn"));

var _typeUtil = require("../util/typeUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var documentTypes = {
  pdf: {
    match: function match(type) {
      return type === 'application/pdf' || type.includes('pdf');
    },
    title: function title(type) {
      return 'PDF';
    },
    Icon: _DescriptionOutlined.default
  },
  markdown: {
    match: function match(type) {
      return type === 'text/markdown';
    },
    title: function title(type) {
      return 'Markdown';
    },
    Icon: _DescriptionOutlined.default
  },
  image: {
    match: function match(type) {
      return ['image/gif', 'image/png', 'image/jpeg'].includes(type) || type.startsWith('image');
    },
    title: function title(type) {
      return (0, _typeUtil.isStringNonEmpty)(type) ? "Image (".concat((type.match(/\/(.*)$/) || [])[1] || 'unknown type', ")") : 'unknown type';
    },
    Icon: _Photo.default
  },
  csv: {
    match: function match(type) {
      return type === 'text/csv' || type.includes('csv');
    },
    title: function title(type) {
      return 'CSV';
    },
    Icon: _GridOn.default
  },
  text: {
    match: function match(type) {
      return type === 'text/plain';
    },
    title: function title(type) {
      return 'Plain text file';
    },
    Icon: _DescriptionOutlined.default
  },
  document: {
    match: function match(type) {
      return ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(type);
    },
    title: function title(type) {
      return 'Document';
    },
    Icon: _DescriptionOutlined.default
  },
  spreadsheet: {
    match: function match(type) {
      return type.includes('spreadsheet') || type.includes('excel');
    },
    title: function title(type) {
      return 'Spreadsheet';
    },
    Icon: _GridOn.default
  },
  presentation: {
    match: function match(type) {
      return type.includes('presentation') || type.includes('powerpoint');
    },
    title: function title(type) {
      return 'Presentation';
    },
    Icon: _Tv.default
  },
  archive: {
    match: function match(type) {
      return type.includes('zip');
    },
    title: function title(type) {
      return 'ZIP archive';
    },
    Icon: _Archive.default
  },
  binary: {
    match: function match(type) {
      return type === 'application/octet-stream';
    },
    title: function title(type) {
      return 'Raw binary data';
    },
    Icon: _InsertDriveFile.default
  },
  xml: {
    match: function match(type) {
      return type === 'application/xml';
    },
    title: function title(type) {
      return 'XML';
    },
    Icon: _Code.default
  },
  html: {
    match: function match(type) {
      return type === 'text/html';
    },
    title: function title(type) {
      return 'HTML';
    },
    Icon: _Code.default
  }
};
var documentTypeKeys = Object.keys(documentTypes);
var defaultDocumentType = {
  match: function match(type) {
    return true;
  },
  title: function title(type) {
    return 'File type unavailable';
  },
  Icon: _InsertDriveFile.default
};
var DocumentService = {
  formatBytes: function formatBytes(bytes) {
    if (!Number.isInteger(bytes) || bytes < 0) {
      return '0.000 B';
    }

    var scales = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    var log = Math.log(bytes) / Math.log(1024);
    var scale = Math.floor(log);
    var precision = Math.floor(3 - (log - scale) * 3);
    return "".concat((bytes / Math.pow(1024, scale)).toFixed(precision), " ").concat(scales[scale]);
  },
  getDocumentTypeListItemDefs: function getDocumentTypeListItemDefs() {
    return documentTypes;
  },
  getDocumentTypeListItemDefKeys: function getDocumentTypeListItemDefKeys() {
    return documentTypeKeys;
  },
  getDefaultDocumentTypeListItemDef: function getDefaultDocumentTypeListItemDef() {
    return defaultDocumentType;
  },
  isQuickStartGuide: function isQuickStartGuide(doc) {
    return (0, _typeUtil.exists)(doc) && DocumentService.isQuickStartGuideName(doc.name);
  },
  isQuickStartGuideName: function isQuickStartGuideName(name) {
    return (0, _typeUtil.isStringNonEmpty)(name) && name.startsWith('NEON.QSG.');
  },
  isViewerSupported: function isViewerSupported(doc) {
    return (0, _typeUtil.exists)(doc) && (0, _typeUtil.isStringNonEmpty)(doc.type) && ['application/pdf'].includes(doc.type);
  },
  transformSpecs: function transformSpecs(specs) {
    if (!(0, _typeUtil.existsNonEmpty)(specs)) {
      return [];
    }

    return specs.map(function (spec) {
      return DocumentService.transformSpec(spec);
    });
  },
  transformSpec: function transformSpec(spec) {
    return {
      name: spec.specNumber,
      type: spec.specType,
      size: spec.specSize,
      description: spec.specDescription
    };
  }
};
Object.freeze(DocumentService);
var _default = DocumentService;
exports.default = _default;