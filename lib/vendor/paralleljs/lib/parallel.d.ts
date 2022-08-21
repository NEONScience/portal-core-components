export default Parallel;
declare function Parallel(data: any, options: any): void;
declare class Parallel {
    constructor(data: any, options: any);
    data: any;
    options: any;
    operation: Operation;
    requiredScripts: any[];
    requiredFunctions: any[];
    getWorkerSource(cb: any, env: any): string;
    require(...args: any[]): Parallel;
    _spawnWorker(cb: any, env: any): Worker | undefined;
    spawn(cb: any, env: any): Parallel;
    _spawnMapWorker(i: any, cb: any, done: any, env: any, wrk: any): void;
    map(cb: any, env: any): Parallel;
    _spawnReduceWorker(data: any, cb: any, done: any, env: any, wrk: any): void;
    reduce(cb: any, env: any): Parallel;
    then(cb: any, errCb: any): Parallel;
}
declare namespace Parallel {
    function isSupported(): boolean;
}
declare function Operation(): void;
declare class Operation {
    _callbacks: any[];
    _errCallbacks: any[];
    _resolved: number;
    _result: any;
    resolve(err: any, res: any): void;
    then(cb: any, errCb: any): Operation | undefined;
}
