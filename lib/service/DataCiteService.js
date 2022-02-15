"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CitationDownloadType = void 0;

var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));

var _ReleaseService = require("./ReleaseService");

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
  downloadCitation: function downloadCitation(formatShortName, type, target, doi, release, onSuccessCb, onErrorCb) {
    var useProvisional = release === _ReleaseService.PROVISIONAL_RELEASE;
    var citationFormat = DataCiteService.getCitationFormats().find(function (value) {
      return value.shortName.localeCompare(formatShortName) === 0;
    });

    if (!citationFormat) {
      if (onErrorCb) {
        onErrorCb("Unable to download citation for doi: ".concat(doi));
      }

      return;
    }

    var fileName = '';
    var appliedRelease = (0, _typeUtil.isStringNonEmpty)(release) ? release : _ReleaseService.PROVISIONAL_RELEASE;

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
        if (onErrorCb) {
          onErrorCb("Unable to download citation for doi: ".concat(doi));
        }

        return;
      }

      DataCiteService.executeDownload(fileName, citationFormat.mime, provCitation, onSuccessCb, onErrorCb);
      return;
    }

    var citationUrl = DataCiteService.getDoiUrl(doi, citationFormat);
    var init = {
      method: 'GET'
    };
    fetch(citationUrl, init).then(function (response) {
      if (!response.ok) {
        var errMsg = 'Unable to download citation for ' + "doi: ".concat(doi, " and format: ").concat(citationFormat);
        throw new Error(errMsg);
      }

      return response.text();
    }).then(function (data) {
      if (!(0, _typeUtil.isStringNonEmpty)(data)) {
        if (onErrorCb) {
          var errMsg = 'Unable to download citation for ' + "doi: ".concat(doi, " and format: ").concat(citationFormat);
          onErrorCb(errMsg);
        }

        return;
      }

      DataCiteService.executeDownload(fileName, citationFormat.mime, data, onSuccessCb, onErrorCb);
    }).catch(function (reason) {
      // eslint-disable-next-line no-console
      console.error("Unable to download citation ".concat(fileName), reason);

      if (onErrorCb) {
        onErrorCb(reason);
      }
    });
  },
  executeDownload: function executeDownload(fileName, mimeType, payload, onSuccessCb, onErrorCb) {
    try {
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

      if (onSuccessCb) {
        onSuccessCb(payload);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);

      if (onErrorCb) {
        onErrorCb(e);
      }
    }
  }
};
Object.freeze(DataCiteService);
var _default = DataCiteService;
exports.default = _default;