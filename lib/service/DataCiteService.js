"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CitationDownloadType = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _ajax = require("rxjs/ajax");

var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));

var _typeUtil = require("../util/typeUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CitationDownloadType;
exports.CitationDownloadType = CitationDownloadType;

(function (CitationDownloadType) {
  CitationDownloadType["DATA_PRODUCT"] = "DATA_PRODUCT";
  CitationDownloadType["PROTOTYPE_DATASET"] = "PROTOTYPE_DATASET";
})(CitationDownloadType || (exports.CitationDownloadType = CitationDownloadType = {}));

var DataCiteService = {
  getDoiUrl: function getDoiUrl(doi, format) {
    var mime = format.mime;
    var doiId = (doi === null || doi === void 0 ? void 0 : doi.split('/').slice(-2).join('/')) || '';
    return "".concat(_NeonEnvironment.default.getDataCiteApiHost(), "/dois/").concat(mime, "/").concat(doiId);
  },
  getCitationFormats: function getCitationFormats() {
    return [{
      shortName: 'BibTex',
      longName: 'BibTex',
      mime: 'application/x-bibtex',
      extension: 'bib',
      applicableDownloadtypes: [CitationDownloadType.DATA_PRODUCT, CitationDownloadType.PROTOTYPE_DATASET],
      generateProvisionalCitation: function generateProvisionalCitation(product) {
        return "@misc{".concat(product.productCode, "/provisional,\n  doi = {},\n  url = {").concat(window.location.href, "},\n  author = {{National Ecological Observatory Network (NEON)}},\n  language = {en},\n  title = {").concat(product.productName, " (").concat(product.productCode, ")},\n  publisher = {National Ecological Observatory Network (NEON)},\n  year = {").concat(new Date().getFullYear(), "}\n}");
      },
      generateProtoDatasetProvisionalCitation: function generateProtoDatasetProvisionalCitation(dataset) {
        var id = "".concat(dataset.uuid, "/prototype");
        var doiId = '';
        var version = '';

        if (dataset.doi && dataset.doi.url) {
          id = dataset.doi.url;
          doiId = id.split('/').slice(-2).join('/');
        }

        if (dataset.version) {
          version = ", ".concat(dataset.version);
        }

        return "@misc{".concat(id, ",\n  doi = {").concat(doiId, "},\n  url = {").concat(window.location.href, "},\n  author = {National Ecological Observatory Network (NEON)},\n  language = {en},\n  title = {").concat(dataset.projectTitle).concat(version, " (").concat(dataset.uuid, ")},\n  publisher = {National Ecological Observatory Network (NEON)},\n  year = {").concat(new Date().getFullYear(), "}\n}");
      }
    }, {
      shortName: 'RIS',
      longName: 'Research Information Systems (RIS)',
      mime: 'application/x-research-info-systems',
      extension: 'ris',
      applicableDownloadtypes: [CitationDownloadType.DATA_PRODUCT, CitationDownloadType.PROTOTYPE_DATASET],
      generateProvisionalCitation: function generateProvisionalCitation(product) {
        return "TY  - DATA\nT1  - ".concat(product.productName, " (").concat(product.productCode, ")\nAU  - National Ecological Observatory Network (NEON)\nDO  -\nUR  - ").concat(window.location.href, "\nPY  - ").concat(new Date().getFullYear(), "\nPB  - National Ecological Observatory Network (NEON)\nLA  - en\nER  - ");
      },
      generateProtoDatasetProvisionalCitation: function generateProtoDatasetProvisionalCitation(dataset) {
        var doiId = '';
        var version = '';

        if (dataset.doi && dataset.doi.url) {
          doiId = dataset.doi.url.split('/').slice(-2).join('/');
        }

        if (dataset.version) {
          version = ", ".concat(dataset.version);
        }

        return "TY  - DATA\nT1  - ".concat(dataset.projectTitle).concat(version, " (").concat(dataset.uuid, ")\nAU  - National Ecological Observatory Network (NEON)\nDO  - ").concat(doiId, "\nUR  - ").concat(window.location.href, "\nAB  - ").concat(dataset.datasetAbstract, "\nPY  - ").concat(new Date().getFullYear(), "\nPB  - National Ecological Observatory Network (NEON)\nLA  - en\nER  - ");
      }
    }];
  },
  getDataProductFormats: function getDataProductFormats() {
    return DataCiteService.getCitationFormats().filter(function (value) {
      return value.applicableDownloadtypes.includes(CitationDownloadType.DATA_PRODUCT);
    });
  },
  getPrototypeDatasetFormats: function getPrototypeDatasetFormats() {
    return DataCiteService.getCitationFormats().filter(function (value) {
      return value.applicableDownloadtypes.includes(CitationDownloadType.PROTOTYPE_DATASET);
    });
  },
  downloadCitation: function downloadCitation(formatShortName, type, target, doi, release) {
    var useProvisional = release === 'provisional';
    var citationFormat = DataCiteService.getCitationFormats().find(function (value) {
      return value.shortName.localeCompare(formatShortName) === 0;
    });

    if (!citationFormat) {
      return;
    }

    var fileName = '';
    var appliedRelease = (0, _typeUtil.isStringNonEmpty)(release) ? release : 'provisional';

    switch (type) {
      case CitationDownloadType.PROTOTYPE_DATASET:
        fileName = "NEON-Prototype-Dataset-".concat(target.uuid, ".").concat(citationFormat.extension);
        break;

      case CitationDownloadType.DATA_PRODUCT:
      default:
        fileName = "NEON-".concat(target.productCode, "-").concat(appliedRelease, ".").concat(citationFormat.extension);
        break;
    }

    if (useProvisional) {
      var provCitation = '';

      switch (type) {
        case CitationDownloadType.PROTOTYPE_DATASET:
          provCitation = citationFormat.generateProtoDatasetProvisionalCitation(target);
          break;

        case CitationDownloadType.DATA_PRODUCT:
        default:
          provCitation = citationFormat.generateProvisionalCitation(target);
          break;
      }

      if (!(0, _typeUtil.isStringNonEmpty)(provCitation)) {
        return;
      }

      DataCiteService.executeDownload(fileName, citationFormat.mime, provCitation);
      return;
    }

    var citationUrl = DataCiteService.getDoiUrl(doi, citationFormat);
    (0, _ajax.ajax)({
      url: citationUrl,
      method: 'GET',
      responseType: 'text'
    }).pipe((0, _operators.map)(function (citationContent) {
      DataCiteService.executeDownload(fileName, citationFormat.mime, citationContent.response);
    }), (0, _operators.catchError)(function (error) {
      // eslint-disable-next-line no-console
      console.error("Unable to download citation ".concat(fileName), error);
      return (0, _rxjs.of)(error);
    })).subscribe();
  },
  executeDownload: function executeDownload(fileName, mimeType, payload) {
    var link = document.createElement('a');

    if (URL) {
      link.href = URL.createObjectURL(new Blob([payload], {
        type: mimeType
      }));
    } else {
      link.setAttribute('href', "data:".concat(mimeType, ",").concat(encodeURI(payload)));
    }

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
Object.freeze(DataCiteService);
var _default = DataCiteService;
exports.default = _default;