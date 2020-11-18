export default NeonApi;
declare namespace NeonApi {
    export function getApiTokenHeader(headers?: Object | undefined): Object;
    export function getJsonObservable(url: string, headers?: Object | undefined, includeToken?: boolean): import("rxjs").Observable<any>;
    export function getJson(url: string, callback: any, errorCallback: any, cancellationSubject$: any, headers?: Object | undefined): import("rxjs").Subscription;
    export function getProductsObservable(): import("rxjs").Observable<any>;
    export function getProductObservable(productCode: string, release?: string): import("rxjs").Observable<any>;
    export function getReleasesObservable(): import("rxjs").Observable<any>;
    export function getReleaseObservable(release: string): import("rxjs").Observable<any>;
    export function getSitesJsonObservable(): import("rxjs").Observable<any>;
    export function getSiteJsonObservable(siteCode: string): import("rxjs").Observable<any>;
    export function getSiteLocationHierarchyObservable(siteCode: string): import("rxjs").Observable<any>;
    export function getLocationObservable(location: string): import("rxjs").Observable<any>;
    export function getArcgisAssetObservable(feature: string, siteCode: string): import("rxjs").Observable<any>;
}
