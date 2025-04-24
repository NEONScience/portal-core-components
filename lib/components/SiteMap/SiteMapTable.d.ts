export default SiteMapTable;
export function getTestableItems(): {
    ucWord?: undefined;
    parseSearchTerms?: undefined;
    searchOnAttribs?: undefined;
    calculateMaxBodyHeight?: undefined;
    getFeatureName?: undefined;
    exportCsv?: undefined;
} | {
    ucWord: (word?: string) => string;
    parseSearchTerms: (input: string) => string[];
    searchOnAttribs: (searchString: any, searchableAttribs?: any[]) => boolean;
    calculateMaxBodyHeight: (tableRef: any) => number;
    getFeatureName: (featureKey: any) => any;
    exportCsv: (columns?: any[], rows?: any[]) => void;
};
declare function SiteMapTable(): import("react/jsx-runtime").JSX.Element | null;
