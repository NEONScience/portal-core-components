export default HistoryService;
declare namespace HistoryService {
    export { history };
    export { cleanPath };
}
declare const history: import("history").History<import("history").History.UnknownFacade>;
/**
 * Cleans the current browser path
 */
declare function cleanPath(): void;
