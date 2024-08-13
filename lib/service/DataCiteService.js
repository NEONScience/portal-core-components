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
    const doiId = doi?.split('/').slice(-2).join('/') || '';
    return `${_NeonEnvironment.default.getFullApiPath('doiCitations')}/${mime}/${doiId}`;
  },
  getCitationFormats: () => [{
    shortName: 'BibTex',
    longName: 'BibTex',
    mime: 'application/x-bibtex',
    extension: 'bib',
    applicableDownloadtypes: [CitationDownloadType.DATA_PRODUCT, CitationDownloadType.PROTOTYPE_DATASET],
    generateProvisionalCitation: product => `@misc{${product.productCode}/provisional,
  doi = {},
  url = {${window.location.href}},
  author = {{National Ecological Observatory Network (NEON)}},
  language = {en},
  title = {${product.productName} (${product.productCode})},
  publisher = {National Ecological Observatory Network (NEON)},
  year = {${new Date().getFullYear()}}
}`,
    generateProtoDatasetProvisionalCitation: dataset => {
      let id = `${dataset.uuid}/prototype`;
      let doiId = '';
      let version = '';
      if (dataset.doi && dataset.doi.url) {
        id = dataset.doi.url;
        doiId = id.split('/').slice(-2).join('/');
      }
      if (dataset.version) {
        version = `, ${dataset.version}`;
      }
      return `@misc{${id},
  doi = {${doiId}},
  url = {${window.location.href}},
  author = {National Ecological Observatory Network (NEON)},
  language = {en},
  title = {${dataset.projectTitle}${version} (${dataset.uuid})},
  publisher = {National Ecological Observatory Network (NEON)},
  year = {${new Date().getFullYear()}}
}`;
    }
  }, {
    shortName: 'RIS',
    longName: 'Research Information Systems (RIS)',
    mime: 'application/x-research-info-systems',
    extension: 'ris',
    applicableDownloadtypes: [CitationDownloadType.DATA_PRODUCT, CitationDownloadType.PROTOTYPE_DATASET],
    generateProvisionalCitation: product => `TY  - DATA
T1  - ${product.productName} (${product.productCode})
AU  - National Ecological Observatory Network (NEON)
DO  -
UR  - ${window.location.href}
PY  - ${new Date().getFullYear()}
PB  - National Ecological Observatory Network (NEON)
LA  - en
ER  - `,
    generateProtoDatasetProvisionalCitation: dataset => {
      let doiId = '';
      let version = '';
      if (dataset.doi && dataset.doi.url) {
        doiId = dataset.doi.url.split('/').slice(-2).join('/');
      }
      if (dataset.version) {
        version = `, ${dataset.version}`;
      }
      return `TY  - DATA
T1  - ${dataset.projectTitle}${version} (${dataset.uuid})
AU  - National Ecological Observatory Network (NEON)
DO  - ${doiId}
UR  - ${window.location.href}
AB  - ${dataset.datasetAbstract}
PY  - ${new Date().getFullYear()}
PB  - National Ecological Observatory Network (NEON)
LA  - en
ER  - `;
    }
  }],
  getDataProductFormats: () => DataCiteService.getCitationFormats().filter(value => value.applicableDownloadtypes.includes(CitationDownloadType.DATA_PRODUCT)),
  getPrototypeDatasetFormats: () => DataCiteService.getCitationFormats().filter(value => value.applicableDownloadtypes.includes(CitationDownloadType.PROTOTYPE_DATASET)),
  downloadCitation: (formatShortName, type, target, doi, release, onSuccessCb, onErrorCb) => {
    const useProvisional = release === _ReleaseService.PROVISIONAL_RELEASE;
    const citationFormat = DataCiteService.getCitationFormats().find(value => value.shortName.localeCompare(formatShortName) === 0);
    if (!citationFormat) {
      if (onErrorCb) {
        onErrorCb(`Unable to download citation for doi: ${doi}`);
      }
      return;
    }
    let fileName = '';
    const appliedRelease = (0, _typeUtil.isStringNonEmpty)(release) ? release : _ReleaseService.PROVISIONAL_RELEASE;
    switch (type) {
      case CitationDownloadType.PROTOTYPE_DATASET:
        fileName = `NEON-Prototype-Dataset-${target.uuid}.${citationFormat.extension}`;
        break;
      case CitationDownloadType.DATA_PRODUCT:
      default:
        fileName = `NEON-${target.productCode}-${appliedRelease}.${citationFormat.extension}`;
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
          onErrorCb(`Unable to download citation for doi: ${doi}`);
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
        const errMsg = 'Unable to download citation for ' + `doi: ${doi} and format: ${citationFormat}`;
        throw new Error(errMsg);
      }
      return response.text();
    }).then(data => {
      if (!(0, _typeUtil.isStringNonEmpty)(data)) {
        if (onErrorCb) {
          const errMsg = 'Unable to download citation for ' + `doi: ${doi} and format: ${citationFormat}`;
          onErrorCb(errMsg);
        }
        return;
      }
      DataCiteService.executeDownload(fileName, citationFormat.mime, data, onSuccessCb, onErrorCb);
    }).catch(reason => {
      // eslint-disable-next-line no-console
      console.error(`Unable to download citation ${fileName}`, reason);
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
        link.setAttribute('href', `data:${mimeType},${encodeURI(payload)}`);
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