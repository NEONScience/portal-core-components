export function fetchDomainHierarchy(domain?: string): Promise<import("../../vendor/paralleljs/lib/parallel")>;
export function fetchSingleLocationREST(location: any): Promise<any>;
export function fetchManyLocationsGraphQL(locations: any): Promise<import("../../vendor/paralleljs/lib/parallel")>;
export function getTestableItems(): {
    domainIsValid?: undefined;
} | {
    domainIsValid: (domainString: any) => boolean;
};
