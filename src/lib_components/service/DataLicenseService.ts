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

const ExternalLinkService: IExternalLinkService = {
  getDataLicensePath: (): string => 'https://creativecommons.org/licenses/by/4.0/',
  getDataLicenseDisplayName: (): string => (
    'Creative Commons Attribution 4.0 International (CC BY 4.0)'
  ),
};

Object.freeze(ExternalLinkService);

export default ExternalLinkService;
