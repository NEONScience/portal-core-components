import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
import { isStringNonEmpty } from '../util/typeUtil';
const RouteService = {
    getWebHomePath: ()=>NeonEnvironment.getWebHost(),
    getUserAccountsPath: ()=>`${NeonEnvironment.getWebHost()}/about/user-accounts`,
    getDataPoliciesPath: ()=>`${NeonEnvironment.getWebHost()}/data-samples/guidelines-policies`,
    getDataPoliciesCitationPath: ()=>`${NeonEnvironment.getWebHost()}/data-samples/guidelines-policies/citing`,
    getDataQualityPath: ()=>`${NeonEnvironment.getWebHost()}/data-samples/data-management/data-quality-program`,
    getNewsPath: ()=>`${NeonEnvironment.getWebHost()}/impact/newsroom/neon-news`,
    getDataNotificationsPath: ()=>`${NeonEnvironment.getWebHost()}/data-samples/data-notifications`,
    getFaqPath: ()=>`${NeonEnvironment.getWebHost()}/about/faq`,
    getContactUsPath: ()=>`${NeonEnvironment.getWebHost()}/about/contact-us`,
    getDownloadExplorePath: ()=>`${NeonEnvironment.getWebHost()}/resources/learning-hub/tutorials/download-explore-neon-data`,
    getFileNamingConventionsPath: ()=>`${NeonEnvironment.getWebHost()}/data-samples/data-management/data-formats-conventions`,
    getDataRevisionsReleasePath: ()=>`${NeonEnvironment.getWebHost()}/data-samples/data-management/data-revisions-releases`,
    getDataSamplesPath: ()=>`${NeonEnvironment.getWebHost()}/data-samples`,
    getSamplesPath: ()=>`${NeonEnvironment.getWebHost()}/samples`,
    getDataSamplesDataPath: ()=>`${NeonEnvironment.getWebHost()}/data-samples/data`,
    getDataAvailabilityPath: ()=>`${NeonEnvironment.getWebHost()}/data-samples/data-management/data-availability`,
    getDataProductBundlesPath: ()=>`${NeonEnvironment.getWebHost()}/data-samples/data-management/data-product-bundles`,
    getNeonUtilitiesDataStackRPath: ()=>`${NeonEnvironment.getWebHost()}/resources/learning-hub/tutorials/neondatastackr`,
    getObservatoryStatusPath: ()=>`${NeonEnvironment.getWebHost()}/impact/observatory-blog/observatory-status`,
    getThemeDetailPath: (theme)=>`${NeonEnvironment.getWebHost()}/data-samples/data-themes/${theme}`,
    getFieldSiteDetailPath: (siteCode)=>`${NeonEnvironment.getWebHost()}/field-sites/${siteCode}`,
    getDomainDetailPath: (domainCode)=>`${NeonEnvironment.getWebHost()}/domains/${domainCode}`,
    getReleaseDetailPath: (release)=>`${NeonEnvironment.getWebHost()}/data-samples/data-management/data-revisions-releases/${release}`,
    getDataApiPath: ()=>`${NeonEnvironment.getApiHost()}/data-api`,
    getTaxonomicListsPath: ()=>// TODO: replace with web host once switch over happens
        `${NeonEnvironment.getApiHost()}/taxonomic-lists`,
    getDataProductCitationDownloadUrl: ()=>// TODO: replace with web host once switch over happens
        NeonEnvironment.getApiHost(),
    getDataProductExploreSearchPath: (query)=>`${RouteService.getDataProductExplorePath()}?search=${encodeURIComponent(query)}`,
    getDataProductExplorePath: ()=>// TODO: replace with web host once switch over happens
        `${NeonEnvironment.getApiHost()}/data-products/explore`,
    getProductDetailPath: (productCode, release)=>{
        const releasePath = isStringNonEmpty(release) ? `/${release}` : '';
        // TODO: replace with web host once switch over happens
        return `${NeonEnvironment.getApiHost()}/data-products/${productCode}${releasePath}`;
    },
    getPrototypeDatasetsPath: ()=>// TODO: replace with web host once switch over happens
        `${NeonEnvironment.getApiHost()}/prototype-datasets`,
    getPrototypeDatasetDetailPath: (uuid)=>// TODO: replace with web host once switch over happens
        `${NeonEnvironment.getApiHost()}/prototype-datasets/${uuid}`
};
Object.freeze(RouteService);
export default RouteService;
