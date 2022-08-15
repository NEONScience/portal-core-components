export default HistoryService;
declare namespace HistoryService {
    export { history };
    export { cleanPath };
}
declare const history: import("history").BrowserHistory;
/**
 * Cleans the current browser path
 */
declare function cleanPath(): void;
