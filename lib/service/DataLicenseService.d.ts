/**
 * Service for data license
 */
export interface IExternalLinkService {
    /**
     * Gets the path to the Create Commons Attribution (CC BY 4.0) data license
     * @returns The full path to the license page
     */
    getDataLicensePath: () => string;
    /**
     * Gets the display name / title for the data license
     * @returns The display name for the data license
     */
    getDataLicenseDisplayName: () => string;
}
declare const ExternalLinkService: IExternalLinkService;
export default ExternalLinkService;
