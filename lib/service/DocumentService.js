"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));

var _typeUtil = require("../util/typeUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _wrapRegExp() { _wrapRegExp = function _wrapRegExp(re, groups) { return new BabelRegExp(re, undefined, groups); }; var _super = RegExp.prototype; var _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = new RegExp(re, flags); _groups.set(_this, groups || _groups.get(re)); return _setPrototypeOf(_this, BabelRegExp.prototype); } _inherits(BabelRegExp, RegExp); BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) result.groups = buildGroups(result, this); return result; }; BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if (typeof substitution === "string") { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { return "$" + groups[name]; })); } else if (typeof substitution === "function") { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = arguments; if (_typeof(args[args.length - 1]) !== "object") { args = [].slice.call(args); args.push(buildGroups(args, _this)); } return substitution.apply(this, args); }); } else { return _super[Symbol.replace].call(this, str, substitution); } }; function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { groups[name] = result[g[name]]; return groups; }, Object.create(null)); } return _wrapRegExp.apply(this, arguments); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var PDF_VIEWER_SUPPORTED_DOC_TYPES = ['application/pdf'];
exports.PDF_VIEWER_SUPPORTED_DOC_TYPES = PDF_VIEWER_SUPPORTED_DOC_TYPES;
var VIEWER_SUPPORTED_DOC_TYPES = ['application/pdf', 'text/html', 'text/markdown', 'text/plain'];
exports.VIEWER_SUPPORTED_DOC_TYPES = VIEWER_SUPPORTED_DOC_TYPES;
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

var getFilenameFromContentDisposition = function getFilenameFromContentDisposition(response) {
  var filename = null;
  var contentDisposition = response.headers.get('content-disposition');

  if ((0, _typeUtil.isStringNonEmpty)(contentDisposition)) {
    var filenameSplit = contentDisposition === null || contentDisposition === void 0 ? void 0 : contentDisposition.split('filename=');
    var splitLength = filenameSplit ? filenameSplit.length : -1;

    if ((0, _typeUtil.existsNonEmpty)(filenameSplit) && splitLength >= 2) {
      var quotedFilename = filenameSplit[1];
      filename = quotedFilename.replaceAll('"', '');
    }
  }

  return filename;
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
  resolveDocumentType: function resolveDocumentType(document) {
    var documentType = DocumentService.getDefaultDocumentTypeListItemDef();

    if (typeof document.type === 'string') {
      var matchKey = DocumentService.getDocumentTypeListItemDefKeys().find(function (key) {
        return DocumentService.getDocumentTypeListItemDefs()[key].match(document.type);
      });

      if (matchKey) {
        documentType = DocumentService.getDocumentTypeListItemDefs()[matchKey];
      }
    }

    return documentType;
  },
  getDocumentTypeTitle: function getDocumentTypeTitle(document) {
    var documentType = DocumentService.resolveDocumentType(document);
    var typeTitle = documentType.title;
    return typeTitle(document.type);
  },
  findFirstByDocumentTypeTitle: function findFirstByDocumentTypeTitle(documents, typeTitle) {
    if (!(0, _typeUtil.existsNonEmpty)(documents) || !(0, _typeUtil.isStringNonEmpty)(typeTitle)) {
      return null;
    }

    return documents.find(function (document) {
      var typeTitleString = DocumentService.getDocumentTypeTitle(document);
      return typeTitle.localeCompare(typeTitleString) === 0;
    });
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
  getQuickStartGuideNameRegex: function getQuickStartGuideNameRegex() {
    return new RegExp( /*#__PURE__*/_wrapRegExp(/^(NEON\.QSG\.DP[0-9]{1}\.[0-9]{5}\.[0-9]{3})(v([0-9]+))*(\.([a-z]+))*$/, {
      name: 1,
      version: 2,
      versionNumber: 3,
      extension: 4,
      extensionName: 5
    }));
  },
  parseQuickStartGuideName: function parseQuickStartGuideName(name) {
    var regex = DocumentService.getQuickStartGuideNameRegex();
    if (!regex) return null;
    var matches = regex.exec(name);
    if (!matches) return null;
    if (matches.length <= 0) return null;
    return {
      name: name,
      matchedName: matches[1],
      matchedVersion: matches[2],
      matchedExtension: matches[4],
      parsedVersion: (0, _typeUtil.isStringNonEmpty)(matches[3]) ? parseInt(matches[3], 10) : -1
    };
  },
  isViewerSupported: function isViewerSupported(doc) {
    return (0, _typeUtil.exists)(doc) && (0, _typeUtil.isStringNonEmpty)(doc.type) && VIEWER_SUPPORTED_DOC_TYPES.includes(doc.type);
  },
  isPdfViewerSupported: function isPdfViewerSupported(doc) {
    return (0, _typeUtil.exists)(doc) && (0, _typeUtil.isStringNonEmpty)(doc.type) && PDF_VIEWER_SUPPORTED_DOC_TYPES.includes(doc.type);
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
  },
  transformQuickStartGuideDocuments: function transformQuickStartGuideDocuments(documents) {
    if (!(0, _typeUtil.existsNonEmpty)(documents)) {
      return [];
    }

    return documents.map(function (document) {
      return DocumentService.transformQuickStartGuideDocument(document);
    });
  },
  transformQuickStartGuideDocument: function transformQuickStartGuideDocument(document) {
    return {
      name: document.name,
      type: document.type,
      size: document.size,
      description: document.description
    };
  },
  applyDisplaySort: function applyDisplaySort(documents, reverse, qsgPrecedence) {
    if (!(0, _typeUtil.existsNonEmpty)(documents)) {
      return [];
    }

    var appliedReverse = reverse === true;
    var appliedQsgPrecedence = qsgPrecedence === true;

    var sortedDocs = _toConsumableArray(documents);

    sortedDocs.sort(function (a, b) {
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
        var aQsg = DocumentService.isQuickStartGuide(a);
        var bQsg = DocumentService.isQuickStartGuide(b);

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

      var descriptionCompare = a.description.localeCompare(b.description);

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
  downloadDocument: function downloadDocument(document, onSuccessCb, onErrorCb) {
    var apiPath = DocumentService.isQuickStartGuide(document) ? "".concat(_NeonEnvironment.default.getFullApiPath('quickStartGuides'), "/").concat(document.name) : "".concat(_NeonEnvironment.default.getFullApiPath('documents'), "/").concat(document.name);
    fetch(apiPath, {
      method: 'HEAD'
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Invalid HEAD response');
      }

      var filename = getFilenameFromContentDisposition(response);

      if (!(0, _typeUtil.isStringNonEmpty)(filename)) {
        filename = document.name;
      }

      fetch(apiPath).then(function (downloadResponse) {
        if (!downloadResponse.ok || !downloadResponse.body) {
          throw new Error('Invalid download response');
        }

        return downloadResponse.blob();
      }).then(function (blob) {
        try {
          var link = window.document.createElement('a');
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
      }).catch(function (err) {
        // eslint-disable-next-line no-console
        console.error(err);

        if (onErrorCb) {
          onErrorCb(document);
        }
      });
    }).catch(function (err) {
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
  saveDocument: function saveDocument(document, onSuccessCb, onErrorCb) {
    if (typeof window.showSaveFilePicker !== 'function') {
      // eslint-disable-next-line no-console
      console.error('Operation not supported');

      if (onErrorCb) {
        onErrorCb(document);
      }
    }

    var apiPath = DocumentService.isQuickStartGuide(document) ? "".concat(_NeonEnvironment.default.getFullApiPath('quickStartGuides'), "/").concat(document.name) : "".concat(_NeonEnvironment.default.getFullApiPath('documents'), "/").concat(document.name);
    fetch(apiPath, {
      method: 'HEAD'
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Invalid HEAD response');
      }

      var filename = getFilenameFromContentDisposition(response);

      if (!(0, _typeUtil.isStringNonEmpty)(filename)) {
        filename = document.name;
      }

      var saveOpts = {
        suggestedName: filename
      };
      window.showSaveFilePicker(saveOpts).then(function (fileHandle) {
        return fileHandle.createWritable();
      }).then(function (writable) {
        fetch(apiPath).then(function (downloadResponse) {
          if (!downloadResponse.ok || !downloadResponse.body) {
            throw new Error('Invalid download response');
          }

          return downloadResponse.body.pipeTo(writable);
        }).then(function (value) {
          if (onSuccessCb) {
            onSuccessCb(document);
          }
        }).catch(function (err) {
          // eslint-disable-next-line no-console
          console.error(err);

          if (onErrorCb) {
            onErrorCb(document);
          }
        });
      }).catch(function (err) {
        // eslint-disable-next-line no-console
        console.error(err);

        if (onErrorCb) {
          onErrorCb(document);
        }
      });
    }).catch(function (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      if (onErrorCb) {
        onErrorCb(document);
      }
    });
  }
};
Object.freeze(DocumentService);
var _default = DocumentService;
exports.default = _default;