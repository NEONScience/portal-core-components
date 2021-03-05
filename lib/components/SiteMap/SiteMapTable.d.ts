export default SiteMapTable;
export function getTestableItems(): {
    ucWord?: undefined;
    parseSearchTerms?: undefined;
    searchOnAttribs?: undefined;
} | {
    ucWord: (word?: string) => string;
    parseSearchTerms: (input: string) => string[];
    searchOnAttribs: (searchString: any, searchableAttribs?: any[]) => boolean;
};
declare function SiteMapTable(): JSX.Element | null;
