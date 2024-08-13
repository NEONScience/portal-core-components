export default NeonJsonLd;
declare namespace NeonJsonLd {
    let CITATION_AUTHOR: string;
    function getJsonLdObservable(url: string): import("rxjs").Observable<any>;
    function getRepoJsonLdObservable(): import("rxjs").Observable<any>;
    function getProductJsonLdObservable(productCode: string, release: string): import("rxjs").Observable<any>;
    function inject(data: Object | null | undefined, injectReleaseMeta?: boolean): void;
    function injectReleaseMeta(data: Object | null | undefined, metadataUseMultiParent?: boolean | undefined): void;
    function removeAllMetadata(): void;
    function removeJsonLdScript(): void;
    function removeReleaseMeta(): void;
    function getJsonLdWithInjection(url: string, injectReleaseMeta?: boolean): void;
    function injectRepo(): void;
    function injectProduct(productCode: string, release: string, injectReleaseMeta?: boolean, onNotExistsOnly?: boolean): void | null;
    function injectPrototypeDataset(uuid: string, onNotExistsOnly?: boolean): void | null;
}
