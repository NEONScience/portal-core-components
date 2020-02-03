export namespace TYPES {
    export const DATA_PRODUCTS: string;
    export const SITES: string;
}
export namespace DIMENSIONALITIES {
    export const ONE: string;
    export const MANY: string;
}
export default NeonGraphQL;
declare namespace NeonGraphQL {
    export function getDataProductByCode(code: any): import("rxjs").Observable<null> | import("rxjs").Observable<import("rxjs/ajax").AjaxResponse> | null;
    export function getAllDataProducts(): import("rxjs").Observable<null> | import("rxjs").Observable<import("rxjs/ajax").AjaxResponse> | null;
    export function getSiteByCode(code: any): import("rxjs").Observable<null> | import("rxjs").Observable<import("rxjs/ajax").AjaxResponse> | null;
    export function getAllSites(): import("rxjs").Observable<null> | import("rxjs").Observable<import("rxjs/ajax").AjaxResponse> | null;
    export function getGraphqlQuery(query: string): import("rxjs").Observable<null> | import("rxjs").Observable<import("rxjs/ajax").AjaxResponse>;
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
