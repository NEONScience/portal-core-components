export default NeonJsonLd;
declare namespace NeonJsonLd {
    export const CITATION_AUTHOR: string;
    export function getJsonLdObservable(url: string): import("rxjs").Observable<any>;
    export function getRepoJsonLdObservable(): import("rxjs").Observable<any>;
    export function getProductJsonLdObservable(productCode: string, release: string): import("rxjs").Observable<any>;
    export function inject(data: Object | null | undefined, injectReleaseMeta?: boolean): void;
    export function injectReleaseMeta(data: Object | null | undefined): void;
    export function removeAllMetadata(): void;
    export function removeJsonLdScript(): void;
    export function removeReleaseMeta(): void;
    export function getJsonLdWithInjection(url: string, injectReleaseMeta?: boolean): void;
    export function injectRepo(): void;
    export function injectProduct(productCode: string, release: string, injectReleaseMeta?: boolean, onNotExistsOnly?: boolean): void | null;
    export function injectPrototypeDataset(uuid: string, onNotExistsOnly?: boolean): void | null;
}
