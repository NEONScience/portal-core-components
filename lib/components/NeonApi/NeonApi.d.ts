export default NeonApi;
export function getTestableItems(): {
    getApiTokenHeader?: undefined;
    getJsonObservable?: undefined;
    postJsonObservable?: undefined;
} | {
    getApiTokenHeader: (headers?: Object | undefined) => Object;
    getJsonObservable: (url: string, headers?: Object | undefined, includeToken?: boolean) => import("rxjs").Observable<any>;
    postJsonObservable: (url: string, body: any, headers?: Object | undefined, includeToken?: boolean) => import("rxjs").Observable<import("rxjs/ajax").AjaxResponse> | import("rxjs").Observable<null>;
};
declare namespace NeonApi {
    export function getApiTokenHeader(headers?: Object | undefined): Object;
    export function getJsonObservable(url: string, headers?: Object | undefined, includeToken?: boolean): import("rxjs").Observable<any>;
    export function postJsonObservable(url: string, body: any, headers?: Object | undefined, includeToken?: boolean): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse> | import("rxjs").Observable<null>;
    export function getJson(url: string, callback: any, errorCallback: any, cancellationSubject$: any, headers?: Object | undefined): import("rxjs").Subscription;
    export function getProductsObservable(): import("rxjs").Observable<any>;
    export function getProductObservable(productCode: string, release?: string): import("rxjs").Observable<any>;
    export function getPrototypeDatasetsObservable(): import("rxjs").Observable<any>;
    export function getPrototypeDatasetObservable(uuid: any): import("rxjs").Observable<any>;
    export function getPrototypeManifestRollupObservable(uuid: any): import("rxjs").Observable<any>;
    export function getPrototypeDataFileObservable(uuid: any, fileName: any): import("rxjs").Observable<any>;
    export function getReleasesObservable(): import("rxjs").Observable<any>;
    export function getReleaseObservable(release: string): import("rxjs").Observable<any>;
    export function getSitesJsonObservable(): import("rxjs").Observable<any>;
    export function getSiteJsonObservable(siteCode: string): import("rxjs").Observable<any>;
    export function getSiteLocationHierarchyObservable(siteCode: string): import("rxjs").Observable<any>;
    export function getLocationObservable(location: string): import("rxjs").Observable<any>;
    export function getArcgisAssetObservable(feature: string, siteCode: string): import("rxjs").Observable<any>;
}
