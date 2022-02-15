import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
import { PROVISIONAL_RELEASE } from './ReleaseService';
import { isStringNonEmpty } from '../util/typeUtil';

export enum CitationDownloadType {
  DATA_PRODUCT = 'DATA_PRODUCT',
  PROTOTYPE_DATASET = 'PROTOTYPE_DATASET',
}

export interface CitationFormat {
  shortName: string;
  longName: string;
  mime: string;
  extension: string;
  applicableDownloadtypes: CitationDownloadType[];
  generateProvisionalCitation: (product: Record<string, unknown>) => string;
  generateProtoDatasetProvisionalCitation: (dataset: Record<string, unknown>) => string;
}

/**
 * Service for working with DataCite
 */
export interface IDataCiteService {
  getDoiUrl: (doi: string, format: CitationFormat) => string;
  getCitationFormats: () => CitationFormat[];
  getDataProductFormats: () => CitationFormat[];
  getPrototypeDatasetFormats: () => CitationFormat[];
  downloadCitation: (
    formatShortName: string,
    type: CitationDownloadType,
    target: Record<string, unknown>,
    doi: string,
    release?: string,
    onSuccessCb?: (data: string) => void,
    onErrorCb?: (error: unknown) => void,
  ) => void;
  executeDownload: (
    fileName: string,
    mimeType: string,
    payload: string,
    onSuccessCb?: (data: string) => void,
    onErrorCb?: (error: unknown) => void,
  ) => void;
}

const DataCiteService: IDataCiteService = {
  getDoiUrl: (doi: string, format: CitationFormat): string => {
    const { mime }: CitationFormat = format;
    const doiId: string = doi?.split('/').slice(-2).join('/') || '';
    return `${NeonEnvironment.getDataCiteApiHost()}/dois/${mime}/${doiId}`;
  },

  getCitationFormats: (): CitationFormat[] => ([
    {
      shortName: 'BibTex',
      longName: 'BibTex',
      mime: 'application/x-bibtex',
      extension: 'bib',
      applicableDownloadtypes: [
        CitationDownloadType.DATA_PRODUCT,
        CitationDownloadType.PROTOTYPE_DATASET,
      ],
      generateProvisionalCitation: (
        product: Record<string, unknown>,
      ): string => (`@misc{${product.productCode as string}/provisional,
  doi = {},
  url = {${window.location.href}},
  author = {{National Ecological Observatory Network (NEON)}},
  language = {en},
  title = {${product.productName as string} (${product.productCode as string})},
  publisher = {National Ecological Observatory Network (NEON)},
  year = {${(new Date()).getFullYear()}}
}`),
      generateProtoDatasetProvisionalCitation: (dataset: Record<string, unknown>): string => {
        let id = `${dataset.uuid}/prototype`;
        let doiId = '';
        let version = '';
        if (dataset.doi && (dataset.doi as Record<string, string>).url) {
          id = (dataset.doi as Record<string, string>).url;
          doiId = id.split('/').slice(-2).join('/');
        }
        if (dataset.version) {
          version = `, ${dataset.version as string}`;
        }
        return `@misc{${id},
  doi = {${doiId}},
  url = {${window.location.href}},
  author = {National Ecological Observatory Network (NEON)},
  language = {en},
  title = {${dataset.projectTitle as string}${version} (${dataset.uuid as string})},
  publisher = {National Ecological Observatory Network (NEON)},
  year = {${(new Date()).getFullYear()}}
}`;
      },
    },
    {
      shortName: 'RIS',
      longName: 'Research Information Systems (RIS)',
      mime: 'application/x-research-info-systems',
      extension: 'ris',
      applicableDownloadtypes: [
        CitationDownloadType.DATA_PRODUCT,
        CitationDownloadType.PROTOTYPE_DATASET,
      ],
      generateProvisionalCitation: (
        product: Record<string, unknown>,
      ): string => (`TY  - DATA
T1  - ${product.productName as string} (${product.productCode as string})
AU  - National Ecological Observatory Network (NEON)
DO  -
UR  - ${window.location.href}
PY  - ${(new Date()).getFullYear()}
PB  - National Ecological Observatory Network (NEON)
LA  - en
ER  - `),
      generateProtoDatasetProvisionalCitation: (dataset: Record<string, unknown>): string => {
        let doiId = '';
        let version = '';
        if (dataset.doi && (dataset.doi as Record<string, string>).url) {
          doiId = (dataset.doi as Record<string, string>).url.split('/').slice(-2).join('/');
        }
        if (dataset.version) {
          version = `, ${dataset.version as string}`;
        }
        return `TY  - DATA
T1  - ${dataset.projectTitle as string}${version} (${dataset.uuid as string})
AU  - National Ecological Observatory Network (NEON)
DO  - ${doiId}
UR  - ${window.location.href}
AB  - ${dataset.datasetAbstract as string}
PY  - ${(new Date()).getFullYear()}
PB  - National Ecological Observatory Network (NEON)
LA  - en
ER  - `;
      },
    },
  ]),

  getDataProductFormats: (): CitationFormat[] => (
    DataCiteService.getCitationFormats().filter((value: CitationFormat): boolean => (
      value.applicableDownloadtypes.includes(CitationDownloadType.DATA_PRODUCT)
    ))
  ),

  getPrototypeDatasetFormats: (): CitationFormat[] => (
    DataCiteService.getCitationFormats().filter((value: CitationFormat): boolean => (
      value.applicableDownloadtypes.includes(CitationDownloadType.PROTOTYPE_DATASET)
    ))
  ),

  downloadCitation: (
    formatShortName: string,
    type: CitationDownloadType,
    target: Record<string, unknown>,
    doi: string,
    release?: string,
    onSuccessCb?: (data: string) => void,
    onErrorCb?: (error: unknown) => void,
  ): void => {
    const useProvisional: boolean = (release === PROVISIONAL_RELEASE);
    const citationFormat: CitationFormat|undefined = DataCiteService.getCitationFormats()
      .find((value: CitationFormat): boolean => (
        value.shortName.localeCompare(formatShortName) === 0
      ));
    if (!citationFormat) {
      if (onErrorCb) {
        onErrorCb(`Unable to download citation for doi: ${doi}`);
      }
      return;
    }
    let fileName: string = '';
    const appliedRelease = isStringNonEmpty(release)
      ? release
      : PROVISIONAL_RELEASE;
    switch (type) {
      case CitationDownloadType.PROTOTYPE_DATASET:
        fileName = `NEON-Prototype-Dataset-${target.uuid as string}.${citationFormat.extension}`;
        break;
      case CitationDownloadType.DATA_PRODUCT:
      default:
        fileName = `NEON-${target.productCode as string}-${appliedRelease}.${citationFormat.extension}`;
        break;
    }
    if (useProvisional) {
      let provCitation: string = '';
      switch (type) {
        case CitationDownloadType.PROTOTYPE_DATASET:
          provCitation = citationFormat.generateProtoDatasetProvisionalCitation(target);
          break;
        case CitationDownloadType.DATA_PRODUCT:
        default:
          provCitation = citationFormat.generateProvisionalCitation(target);
          break;
      }
      if (!isStringNonEmpty(provCitation)) {
        if (onErrorCb) {
          onErrorCb(`Unable to download citation for doi: ${doi}`);
        }
        return;
      }
      DataCiteService.executeDownload(
        fileName,
        citationFormat.mime,
        provCitation,
        onSuccessCb,
        onErrorCb,
      );
      return;
    }
    const citationUrl = DataCiteService.getDoiUrl(doi, citationFormat);
    const init: RequestInit = {
      method: 'GET',
    };
    fetch(citationUrl, init)
      .then((response: Response): Promise<string> => {
        if (!response.ok) {
          const errMsg = 'Unable to download citation for '
            + `doi: ${doi} and format: ${citationFormat}`;
          throw new Error(errMsg);
        }
        return response.text();
      })
      .then((data: string): void => {
        if (!isStringNonEmpty(data)) {
          if (onErrorCb) {
            const errMsg = 'Unable to download citation for '
              + `doi: ${doi} and format: ${citationFormat}`;
            onErrorCb(errMsg);
          }
          return;
        }
        DataCiteService.executeDownload(
          fileName,
          citationFormat.mime,
          data,
          onSuccessCb,
          onErrorCb,
        );
      })
      .catch((reason: unknown): void => {
        // eslint-disable-next-line no-console
        console.error(`Unable to download citation ${fileName}`, reason);
        if (onErrorCb) {
          onErrorCb(reason);
        }
      });
  },

  executeDownload: (
    fileName: string,
    mimeType: string,
    payload: string,
    onSuccessCb?: (data: string) => void,
    onErrorCb?: (error: unknown) => void,
  ): void => {
    try {
      const link = document.createElement('a');
      if (URL) {
        link.href = URL.createObjectURL(new Blob([payload], { type: mimeType }));
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
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error(e);
      if (onErrorCb) {
        onErrorCb(e);
      }
    }
  },
};

Object.freeze(DataCiteService);

export default DataCiteService;
