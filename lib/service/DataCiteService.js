"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CitationDownloadType = void 0;
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));
var _ReleaseService = require("./ReleaseService");
var _typeUtil = require("../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
let CitationDownloadType = exports.CitationDownloadType = /*#__PURE__*/function (CitationDownloadType) {
  CitationDownloadType["DATA_PRODUCT"] = "DATA_PRODUCT";
  CitationDownloadType["PROTOTYPE_DATASET"] = "PROTOTYPE_DATASET";
  return CitationDownloadType;
}({});
/**
 * Service for working with DataCite
 */
const DataCiteService = {
  getDoiUrl: (doi, format) => {
    const {
      mime
    } = format;
    const doiId = (doi === null || doi === void 0 ? void 0 : doi.split('/').slice(-2).join('/')) || '';
    return "".concat(_NeonEnvironment.default.getFullApiPath('doiCitations'), "/").concat(mime, "/").concat(doiId);
  },
  getCitationFormats: () => [{
    shortName: 'BibTex',
    longName: 'BibTex',
    mime: 'application/x-bibtex',
    extension: 'bib',
    applicableDownloadtypes: [CitationDownloadType.DATA_PRODUCT, CitationDownloadType.PROTOTYPE_DATASET],
    generateProvisionalCitation: product => "@misc{".concat(product.productCode, "/provisional,\n  doi = {},\n  url = {").concat(window.location.href, "},\n  author = {{National Ecological Observatory Network (NEON)}},\n  language = {en},\n  title = {").concat(product.productName, " (").concat(product.productCode, ")},\n  publisher = {National Ecological Observatory Network (NEON)},\n  year = {").concat(new Date().getFullYear(), "}\n}"),
    generateProtoDatasetProvisionalCitation: dataset => {
      let id = "".concat(dataset.uuid, "/prototype");
      let doiId = '';
      let version = '';
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
    generateProvisionalCitation: product => "TY  - DATA\nT1  - ".concat(product.productName, " (").concat(product.productCode, ")\nAU  - National Ecological Observatory Network (NEON)\nDO  -\nUR  - ").concat(window.location.href, "\nPY  - ").concat(new Date().getFullYear(), "\nPB  - National Ecological Observatory Network (NEON)\nLA  - en\nER  - "),
    generateProtoDatasetProvisionalCitation: dataset => {
      let doiId = '';
      let version = '';
      if (dataset.doi && dataset.doi.url) {
        doiId = dataset.doi.url.split('/').slice(-2).join('/');
      }
      if (dataset.version) {
        version = ", ".concat(dataset.version);
      }
      return "TY  - DATA\nT1  - ".concat(dataset.projectTitle).concat(version, " (").concat(dataset.uuid, ")\nAU  - National Ecological Observatory Network (NEON)\nDO  - ").concat(doiId, "\nUR  - ").concat(window.location.href, "\nAB  - ").concat(dataset.datasetAbstract, "\nPY  - ").concat(new Date().getFullYear(), "\nPB  - National Ecological Observatory Network (NEON)\nLA  - en\nER  - ");
    }
  }],
  getDataProductFormats: () => DataCiteService.getCitationFormats().filter(value => value.applicableDownloadtypes.includes(CitationDownloadType.DATA_PRODUCT)),
  getPrototypeDatasetFormats: () => DataCiteService.getCitationFormats().filter(value => value.applicableDownloadtypes.includes(CitationDownloadType.PROTOTYPE_DATASET)),
  downloadCitation: (formatShortName, type, target, doi, release, onSuccessCb, onErrorCb) => {
    const useProvisional = release === _ReleaseService.PROVISIONAL_RELEASE;
    const citationFormat = DataCiteService.getCitationFormats().find(value => value.shortName.localeCompare(formatShortName) === 0);
    if (!citationFormat) {
      if (onErrorCb) {
        onErrorCb("Unable to download citation for doi: ".concat(doi));
      }
      return;
    }
    let fileName = '';
    const appliedRelease = (0, _typeUtil.isStringNonEmpty)(release) ? release : _ReleaseService.PROVISIONAL_RELEASE;
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
      let provCitation = '';
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
    const citationUrl = DataCiteService.getDoiUrl(doi, citationFormat);
    const init = {
      method: 'GET'
    };
    fetch(citationUrl, init).then(response => {
      if (!response.ok) {
        const errMsg = 'Unable to download citation for ' + "doi: ".concat(doi, " and format: ").concat(citationFormat);
        throw new Error(errMsg);
      }
      return response.text();
    }).then(data => {
      if (!(0, _typeUtil.isStringNonEmpty)(data)) {
        if (onErrorCb) {
          const errMsg = 'Unable to download citation for ' + "doi: ".concat(doi, " and format: ").concat(citationFormat);
          onErrorCb(errMsg);
        }
        return;
      }
      DataCiteService.executeDownload(fileName, citationFormat.mime, data, onSuccessCb, onErrorCb);
    }).catch(reason => {
      // eslint-disable-next-line no-console
      console.error("Unable to download citation ".concat(fileName), reason);
      if (onErrorCb) {
        onErrorCb(reason);
      }
    });
  },
  executeDownload: (fileName, mimeType, payload, onSuccessCb, onErrorCb) => {
    try {
      const link = document.createElement('a');
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
var _default = exports.default = DataCiteService;