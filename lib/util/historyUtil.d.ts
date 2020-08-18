export default HistoryService;
declare namespace HistoryService {
    export { history };
    export { cleanPath };
}
declare const history: import("history").History<import("history").History.UnknownFacade>;
declare function cleanPath(): void;
