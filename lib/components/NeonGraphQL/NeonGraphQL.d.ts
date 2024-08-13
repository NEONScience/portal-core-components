export namespace TYPES {
    let DATA_PRODUCTS: string;
    let SITES: string;
    let LOCATIONS: string;
}
export namespace DIMENSIONALITIES {
    let ONE: string;
    let MANY: string;
}
export default NeonGraphQL;
declare namespace NeonGraphQL {
    function getDataProductByCode(productCode: any, release: any, includeAvailableReleases?: boolean): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse<any>> | import("rxjs").Observable<null>;
    function getAllDataProducts(release: any, includeAvailableReleases?: boolean): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse<any>> | import("rxjs").Observable<null>;
    function getSiteByCode(siteCode: any): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse<any>> | import("rxjs").Observable<null>;
    function getAllSites(): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse<any>> | import("rxjs").Observable<null>;
    function getLocationByName(locationName: any): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse<any>> | import("rxjs").Observable<null>;
    function getManyLocationsByName(locationNames?: any[]): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse<any>> | import("rxjs").Observable<null>;
    function getGraphqlQuery(query: string): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse<any>> | import("rxjs").Observable<null>;
    function getGraphqlAjaxRequest(query: string): {
        method: string;
        crossDomain: boolean;
        withCredentials: boolean;
        url: string;
        headers: {
            'Content-Type': string;
        };
        responseType: string;
        body: any;
    };
}
