import moment from 'moment';
import RouteService from './RouteService';
import { exists, isStringNonEmpty } from '../util/typeUtil';
const NEON = 'NEON (National Ecological Observatory Network)';
const CitationService = {
    getDateFormatted: ()=>{
        const now = new Date();
        return moment(now).format('MMMM D, YYYY');
    },
    buildDataProductCitationText: (product, productReleaseObject)=>{
        if (!exists(product)) {
            return '';
        }
        const hasRelease = exists(productReleaseObject) && isStringNonEmpty(productReleaseObject.release);
        const hasDoi = hasRelease && exists(productReleaseObject.productDoi) && isStringNonEmpty(productReleaseObject.productDoi.url);
        const citationDoi = hasDoi ? productReleaseObject.productDoi.url : null;
        const today = CitationService.getDateFormatted();
        const productName = !hasRelease ? `${product.productName} (${product.productCode}), provisional data` : `${product.productName} (${product.productCode}), ` + `${productReleaseObject.release}`;
        const doiText = citationDoi ? `. ${citationDoi}` : '';
        const url = RouteService.getProductDetailPath(product.productCode, hasRelease ? productReleaseObject.release : undefined);
        const accessed = !hasRelease ? `Dataset accessed from ${url} on ${today}. Data archived at [your DOI].` : `Dataset accessed from ${url} on ${today}.`;
        return `${NEON}. ${productName}${doiText}. ${accessed}`;
    },
    buildPrototypeDatasetCitationText: (dataset)=>{
        if (!dataset) {
            return '';
        }
        const { doi, projectTitle, uuid, version } = dataset;
        const hasDoi = doi && doi.url;
        const today = CitationService.getDateFormatted();
        const doiId = hasDoi ? doi.url.split('/').slice(-2).join('/') : uuid;
        const url = hasDoi ? `${doi.url}.` : `${RouteService.getPrototypeDatasetDetailPath(uuid)}`;
        const accessed = 'Dataset accessed from ' + `${RouteService.getPrototypeDatasetDetailPath(uuid)} on ${today}.`;
        const title = version ? `${projectTitle}, ${version}` : projectTitle;
        return `${NEON}. ${title} (${doiId}). ${url} ${accessed}`;
    }
};
export default CitationService;
