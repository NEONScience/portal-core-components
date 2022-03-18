import dateFormat from 'dateformat';

import RouteService from './RouteService';

import { exists, isStringNonEmpty } from '../util/typeUtil';
import { DataProductRelease } from '../types/neonApi';
import { Nullable } from '../types/core';

export interface ICitationService {
  getDateFormatted: () => string;
  buildDataProductCitationText: (
    product: any,
    productReleaseObject: Nullable<DataProductRelease>,
  ) => string;
  buildPrototypeDatasetCitationText: (dataset: any) => string;
}

const NEON = 'NEON (National Ecological Observatory Network)';

const CitationService: ICitationService = {
  getDateFormatted: (): string => {
    const now = new Date();
    return dateFormat(now, 'mmmm d, yyyy');
  },
  buildDataProductCitationText: (
    product: any,
    productReleaseObject: Nullable<DataProductRelease>,
  ): string => {
    if (!exists(product)) { return ''; }
    const hasRelease = exists(productReleaseObject)
      && isStringNonEmpty((productReleaseObject as DataProductRelease).release);
    const hasDoi = hasRelease
      && exists((productReleaseObject as DataProductRelease).productDoi)
      && isStringNonEmpty((productReleaseObject as DataProductRelease).productDoi.url);
    const citationDoi = hasDoi
      ? (productReleaseObject as DataProductRelease).productDoi.url
      : null;
    const today = CitationService.getDateFormatted();
    const productName = !hasRelease
      ? `${product.productName} (${product.productCode})`
      : `${product.productName} (${product.productCode}), `
          + `${(productReleaseObject as DataProductRelease).release}`;
    const doiText = citationDoi ? `. ${citationDoi}` : '';
    const url = RouteService.getDataProductCitationDownloadUrl();
    const accessed = !hasRelease
      ? `${url} (accessed ${today})`
      : `Dataset accessed from ${url} on ${today}`;
    return `${NEON}. ${productName}${doiText}. ${accessed}`;
  },
  buildPrototypeDatasetCitationText: (dataset: any): string => {
    if (!dataset) { return ''; }
    const {
      doi,
      projectTitle,
      uuid,
      version,
    } = dataset;
    const hasDoi = doi && doi.url;
    const today = CitationService.getDateFormatted();
    const doiId = hasDoi
      ? doi.url.split('/').slice(-2).join('/')
      : uuid;
    const url = hasDoi
      ? `${doi.url}.`
      : `${RouteService.getPrototypeDatasetDetailPath(uuid)}`;
    const accessed = hasDoi
      ? `Dataset accessed from ${RouteService.getDataProductCitationDownloadUrl()} on ${today}`
      : `(accessed ${today})`;
    const title = version
      ? `${projectTitle}, ${version}`
      : projectTitle;
    return `${NEON}. ${title} (${doiId}). ${url} ${accessed}`;
  },
};

export default CitationService;
