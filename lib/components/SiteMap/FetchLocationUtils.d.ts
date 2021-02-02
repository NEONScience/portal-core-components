export function fetchDomainHierarchy(domain?: string): Promise<any>;
export function fetchSingleLocationREST(location: any): Promise<any>;
export function fetchManyLocationsGraphQL(locations: any): Promise<any>;
export function getTestableItems(): {
    domainIsValid?: undefined;
} | {
    domainIsValid: (domainString: any) => boolean;
};
