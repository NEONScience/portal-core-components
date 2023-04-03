/**
 * Service for building routes and paths
 */
export interface IRouteService {
    /**
     * Gets the root web home page path
     * @returns
     */
    getWebHomePath: () => string;
    /**
     * Gets the path to the user accounts information page
     * @returns
     */
    getUserAccountsPath: () => string;
    /**
     * Gets the path to the NEON data policies information page
     * @returns
     */
    getDataPoliciesPath: () => string;
    /**
     * Gets the path to the NEON data citation policies information page
     * @returns
     */
    getDataPoliciesCitationPath: () => string;
    /**
     * Gets the path to the NEON data quality information page
     * @returns
     */
    getDataQualityPath: () => string;
    /**
     * Gets the path to the NEON news information page
     * @returns
     */
    getNewsPath: () => string;
    /**
     * Gets the path to the NEON data notifications information page
     * @returns
     */
    getDataNotificationsPath: () => string;
    /**
     * Gets the path to the NEON FAQ information page
     * @returns
     */
    getFaqPath: () => string;
    /**
     * Gets the path to the NEON Contact Us information page
     * @returns
     */
    getContactUsPath: () => string;
    /**
     * Gets the path to the NEON download and explore information page
     * @returns
     */
    getDownloadExplorePath: () => string;
    /**
     * Gets the path to the NEON file naming conventions information page
     * @returns
     */
    getFileNamingConventionsPath: () => string;
    /**
     * Gets the path the NEON data revisions and releases information page
     * @returns
     */
    getDataRevisionsReleasePath: () => string;
    /**
     * Gets the data-samples path
     * @returns
     */
    getDataSamplesPath: () => string;
    /**
     * Gets the data-samples/data path
     * @returns
     */
    getDataSamplesDataPath: () => string;
    /**
     * Gets the samples path
     * @returns
     */
    getSamplesPath: () => string;
    /**
     * Gets the path to the data availability information page
     * @returns
     */
    getDataAvailabilityPath: () => string;
    /**
     * Gets the path to the data product bundles information page
     * @returns
     */
    getDataProductBundlesPath: () => string;
    /**
     * Gets the path to the NEONUtilities data stack in R page
     * @returns
     */
    getNeonUtilitiesDataStackRPath: () => string;
    /**
     * Gets the path to the observatory status page
     * @returns
     */
    getObservatoryStatusPath: () => string;
    /**
     * Gets the path to the theme detail page
     * @param theme
     * @returns
     */
    getThemeDetailPath: (theme: string) => string;
    /**
     * Gets the path to the field site detail page
     * @param siteCode
     * @returns
     */
    getFieldSiteDetailPath: (siteCode: string) => string;
    /**
     * Gets the path to the domain detail page
     * @param domainCode
     * @returns
     */
    getDomainDetailPath: (domainCode: string) => string;
    /**
     * Gets the path to the release detail page
     * @param release
     * @returns
     */
    getReleaseDetailPath: (release: string) => string;
    /**
     * Gets the data product citation download URL
     * @returns
     */
    getDataProductCitationDownloadUrl: () => string;
    /**
     * Gets the data api documentation path
     * @returns
     */
    getDataApiPath: () => string;
    /**
     * Gets the explore data products with with the query applied to search
     * @returns
     */
    getDataProductExploreSearchPath: (query: string) => string;
    /**
     * Gets the data product explore page path
     * @returns
     */
    getDataProductExplorePath: () => string;
    /**
     * Gets the product detail page path
     * @param productCode The product code to build with
     * @param release The release to build with
     * @returns The full path to the page
     */
    getProductDetailPath: (productCode: string, release?: string) => string;
    /**
     * Gets the prototype datasets page path
     * @returns
     */
    getPrototypeDatasetsPath: () => string;
    /**
     * Gets the prototype dataset detail page path
     * @param uuid
     * @returns
     */
    getPrototypeDatasetDetailPath: (uuid: string) => string;
    /**
     * Gets the taxonomic lists page path
     * @returns The path
     */
    getTaxonomicListsPath: () => string;
}
declare const RouteService: IRouteService;
export default RouteService;
