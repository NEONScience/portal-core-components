export interface IAnalyticsService {
    /**
     * Sends a GA explore data products search event with the specified search term.
     * This function is debounced to reduce noise.
     * @param searchTerm The search term to record.
     */
    gaExploreSearchEvent: (searchTerm: string) => void;
    /**
     * Sends a GA prototype data search event with the specified search term.
     * This function is debounced to reduce noise.
     * @param searchTerm The search term to record.
     */
    gaPrototypeDataSearchEvent: (searchTerm: string) => void;
    /**
     * Sends a GA portal home search event with the specified search term.
     * @param searchTerm The search term to record.
     */
    gaPortalHomeSearchEvent: (searchTerm: string) => void;
}
declare const AnalyticsService: IAnalyticsService;
export default AnalyticsService;
