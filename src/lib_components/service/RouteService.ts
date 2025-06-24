import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
import { isStringNonEmpty } from '../util/typeUtil';

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

const RouteService: IRouteService = {
  getWebHomePath: (): string => NeonEnvironment.getWebHost(),
  getUserAccountsPath: (): string => (
    `${NeonEnvironment.getWebHost()}/about/user-accounts`
  ),
  getDataPoliciesPath: (): string => (
    `${NeonEnvironment.getWebHost()}/data-samples/guidelines-policies`
  ),
  getDataPoliciesCitationPath: (): string => (
    `${NeonEnvironment.getWebHost()}/data-samples/guidelines-policies/citing`
  ),
  getDataQualityPath: (): string => (
    `${NeonEnvironment.getWebHost()}/data-samples/data-management/data-quality-program`
  ),
  getNewsPath: (): string => (
    `${NeonEnvironment.getWebHost()}/impact/newsroom/neon-news`
  ),
  getDataNotificationsPath: (): string => (
    `${NeonEnvironment.getWebHost()}/data-samples/data-notifications`
  ),
  getFaqPath: (): string => (
    `${NeonEnvironment.getWebHost()}/about/faq`
  ),
  getContactUsPath: (): string => (
    `${NeonEnvironment.getWebHost()}/about/contact-us`
  ),
  getDownloadExplorePath: (): string => (
    `${NeonEnvironment.getWebHost()}/resources/learning-hub/tutorials/download-explore-neon-data`
  ),
  getFileNamingConventionsPath: (): string => (
    `${NeonEnvironment.getWebHost()}/data-samples/data-management/data-formats-conventions`
  ),
  getDataRevisionsReleasePath: (): string => (
    `${NeonEnvironment.getWebHost()}/data-samples/data-management/data-revisions-releases`
  ),
  getDataSamplesPath: (): string => (
    `${NeonEnvironment.getWebHost()}/data-samples`
  ),
  getSamplesPath: (): string => (
    `${NeonEnvironment.getWebHost()}/samples`
  ),
  getDataSamplesDataPath: (): string => (
    `${NeonEnvironment.getWebHost()}/data-samples/data`
  ),
  getDataAvailabilityPath: (): string => (
    `${NeonEnvironment.getWebHost()}/data-samples/data-management/data-availability`
  ),
  getDataProductBundlesPath: (): string => (
    `${NeonEnvironment.getWebHost()}/data-samples/data-management/data-product-bundles`
  ),
  getNeonUtilitiesDataStackRPath: (): string => (
    `${NeonEnvironment.getWebHost()}/resources/learning-hub/tutorials/neondatastackr`
  ),
  getObservatoryStatusPath: (): string => (
    `${NeonEnvironment.getWebHost()}/impact/observatory-blog/observatory-status`
  ),
  getThemeDetailPath: (theme: string): string => (
    `${NeonEnvironment.getWebHost()}/data-samples/data-themes/${theme}`
  ),
  getFieldSiteDetailPath: (siteCode: string): string => (
    `${NeonEnvironment.getWebHost()}/field-sites/${siteCode}`
  ),
  getDomainDetailPath: (domainCode: string): string => (
    `${NeonEnvironment.getWebHost()}/domains/${domainCode}`
  ),
  getReleaseDetailPath: (release: string): string => (
    `${NeonEnvironment.getWebHost()}/data-samples/data-management/data-revisions-releases/${release}`
  ),

  getDataApiPath: (): string => (
    `${NeonEnvironment.getApiHost()}/data-api`
  ),

  getTaxonomicListsPath: (): string => (
    // TODO: replace with web host once switch over happens
    `${NeonEnvironment.getApiHost()}/taxonomic-lists`
  ),
  getDataProductCitationDownloadUrl: (): string => (
    // TODO: replace with web host once switch over happens
    NeonEnvironment.getApiHost()
  ),
  getDataProductExploreSearchPath: (query: string): string => (
    `${RouteService.getDataProductExplorePath()}?search=${encodeURIComponent(query)}`
  ),
  getDataProductExplorePath: (): string => (
    // TODO: replace with web host once switch over happens
    `${NeonEnvironment.getApiHost()}/data-products/explore`
  ),
  getProductDetailPath: (productCode: string, release?: string): string => {
    const releasePath = isStringNonEmpty(release) ? `/${release}` : '';
    // TODO: replace with web host once switch over happens
    return `${NeonEnvironment.getApiHost()}/data-products/${productCode}${releasePath}`;
  },
  getPrototypeDatasetsPath: (): string => (
    // TODO: replace with web host once switch over happens
    `${NeonEnvironment.getApiHost()}/prototype-datasets`
  ),
  getPrototypeDatasetDetailPath: (uuid: string): string => (
    // TODO: replace with web host once switch over happens
    `${NeonEnvironment.getApiHost()}/prototype-datasets/${uuid}`
  ),
};

Object.freeze(RouteService);

export default RouteService;
