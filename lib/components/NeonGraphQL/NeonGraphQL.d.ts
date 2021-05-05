export namespace TYPES {
    export const DATA_PRODUCTS: string;
    export const SITES: string;
    export const LOCATIONS: string;
}
export namespace DIMENSIONALITIES {
    export const ONE: string;
    export const MANY: string;
}
export default NeonGraphQL;
declare namespace NeonGraphQL {
    export function getDataProductByCode(productCode: any, release: any): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse> | import("rxjs").Observable<null>;
    export function getAllDataProducts(release: any): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse> | import("rxjs").Observable<null>;
    export function getSiteByCode(siteCode: any): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse> | import("rxjs").Observable<null>;
    export function getAllSites(): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse> | import("rxjs").Observable<null>;
    export function getLocationByName(locationName: any): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse> | import("rxjs").Observable<null>;
    export function getManyLocationsByName(locationNames?: any[]): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse> | import("rxjs").Observable<null>;
    export function getGraphqlQuery(query: string): import("rxjs").Observable<import("rxjs/ajax").AjaxResponse> | import("rxjs").Observable<null>;
    export function getGraphqlAjaxRequest(query: string): {
        method: string;
        crossDomain: boolean;
        url: string;
        headers: {
            'Content-Type': string;
        };
        responseType: string;
        body: any;
    };
}
