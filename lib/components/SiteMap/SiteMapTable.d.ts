export default SiteMapTable;
export function getTestableItems(): {
    ucWord?: undefined;
    parseSearchTerms?: undefined;
    searchOnAttribs?: undefined;
    calculateMaxBodyHeight?: undefined;
    getFeatureName?: undefined;
} | {
    ucWord: (word?: string) => string;
    parseSearchTerms: (input: string) => string[];
    searchOnAttribs: (searchString: any, searchableAttribs?: any[]) => boolean;
    calculateMaxBodyHeight: (tableRef: any) => number;
    getFeatureName: (featureKey: any) => any;
};
declare function SiteMapTable(): JSX.Element | null;
