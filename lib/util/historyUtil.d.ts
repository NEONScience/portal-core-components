export default HistoryService;
declare namespace HistoryService {
    export { history };
    export { cleanPath };
}
declare const history: import("history").History<unknown>;
/**
 * Cleans the current browser path
 */
declare function cleanPath(): void;
