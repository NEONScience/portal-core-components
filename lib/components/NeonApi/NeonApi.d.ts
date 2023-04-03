export default NeonApi;
export function getTestableItems(): {
    getApiTokenHeader?: undefined;
    getJsonObservable?: undefined;
    postJsonObservable?: undefined;
} | {
    getApiTokenHeader: (headers?: Object | undefined) => Object;
    getJsonObservable: (url: string, headers?: Object | undefined, includeToken?: boolean, withCredentials?: boolean) => import("rxjs").Observable<any>;
    postJsonObservable: (url: string, body: any, headers?: Object | undefined, includeToken?: boolean, withCredentials?: boolean) => import("rxjs").Observable<import("rxjs/ajax").AjaxResponse<any>> | import("rxjs").Observable<null>;
};
declare namespace NeonApi {
    function getApiTokenHeader(headers?: Object | undefined): Object;
    function getJsonObservable(url: string, headers?: Object | undefined, includeToken?: boolean): import("rxjs").Observable<any>;
    function postJsonObservable(url: string, body: any, headers?: Object | undefined, includeToken?: boolean): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse<any>> | import("rxjs").Observable<null>;
    function headJsonObservable(url: string, headers?: Object | undefined, includeToken?: boolean): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse<any>> | import("rxjs").Observable<null>;
    function getJson(url: string, callback: any, errorCallback: any, cancellationSubject$: any, headers?: Object | undefined): import("rxjs").Subscription;
    function getProductsObservable(): import("rxjs").Observable<any>;
    function getProductObservable(productCode: string, release?: string): import("rxjs").Observable<any>;
    function getProductTombstoneAvailabilityObservable(productCode: string, release: string): import("rxjs").Observable<any>;
    function getProductDoisObservable(productCode: string, release: string): import("rxjs").Observable<any>;
    function getProductBundlesObservable(release?: string): import("rxjs").Observable<any>;
    function getPrototypeDatasetsObservable(): import("rxjs").Observable<any>;
    function getPrototypeDatasetObservable(uuid: any): import("rxjs").Observable<any>;
    function getPrototypeManifestRollupObservable(uuid: any): import("rxjs").Observable<any>;
    function getPrototypeDataFileObservable(uuid: any, fileName: any): import("rxjs").Observable<any>;
    function getReleasesObservable(): import("rxjs").Observable<any>;
    function getReleaseObservable(release: string): import("rxjs").Observable<any>;
    function getSitesJsonObservable(): import("rxjs").Observable<any>;
    function getSiteJsonObservable(siteCode: string): import("rxjs").Observable<any>;
    function getSiteLocationHierarchyObservable(siteCode: string): import("rxjs").Observable<any>;
    function getLocationObservable(location: string): import("rxjs").Observable<any>;
    function getArcgisAssetObservable(feature: string, siteCode: string): import("rxjs").Observable<any>;
    function headDocumentObservable(name: string): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse<any>> | import("rxjs").Observable<null>;
    function getQuickStartGuideDetailObservable(name: string, version: string): import("rxjs").Observable<any>;
    function headQuickStartGuideObservable(name: string): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse<any>> | import("rxjs").Observable<null>;
}
