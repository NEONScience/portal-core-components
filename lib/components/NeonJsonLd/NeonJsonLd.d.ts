export default NeonJsonLd;
declare namespace NeonJsonLd {
    export function getJsonLdObservable(url: string): import("rxjs").Observable<any>;
    export function getRepoJsonLdObservable(): import("rxjs").Observable<any>;
    export function getProductJsonLdObservable(productCode: string): import("rxjs").Observable<any>;
    export function inject(data: Object | null | undefined): void;
    export function getJsonLdWithInjection(url: string): void;
    export function injectRepo(): void;
    export function injectProduct(productCode: string): void;
}
