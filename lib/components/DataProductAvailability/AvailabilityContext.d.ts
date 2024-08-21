export default AvailabilityContext;
export function getTestableItems(): {
    DEFAULT_STATE?: undefined;
    calculateRows?: undefined;
    extractTables?: undefined;
    hydrateNeonContextData?: undefined;
    reducer?: undefined;
} | {
    DEFAULT_STATE: {
        sites: never[];
        tables: {};
        rows: {};
        rowTitles: {};
        rowLabels: never[];
        breakouts: never[];
        validBreakouts: string[];
        sortDirection: string;
        neonContextHydrated: boolean;
        reference: {
            sites: {};
            states: {};
            domains: {};
        };
    };
    calculateRows: (state: any) => any;
    extractTables: (state: any) => {};
    hydrateNeonContextData: (state: any, neonContextData: any) => any;
    reducer: (state: any, action: any) => any;
};
declare namespace AvailabilityContext {
    export { Provider };
    export { useAvailabilityState };
    export { SORT_DIRECTIONS };
}
/**
   Context Provider
*/
declare function Provider(inProps: any): React.JSX.Element;
declare namespace Provider {
    namespace propTypes {
        let dataAvailabilityUniqueId: PropTypes.Requireable<number>;
        let sites: PropTypes.Requireable<(PropTypes.InferProps<{
            siteCode: PropTypes.Validator<string>;
            tables: PropTypes.Validator<(PropTypes.InferProps<{
                name: PropTypes.Validator<string>;
                description: PropTypes.Validator<string>;
                waitInterval: PropTypes.Validator<string>;
                months: PropTypes.Validator<{
                    [x: string]: string | null | undefined;
                }>;
            }> | null | undefined)[]>;
        }> | null | undefined)[]>;
        let children: PropTypes.Validator<NonNullable<NonNullable<PropTypes.ReactNodeLike>>>;
    }
}
declare function useAvailabilityState(): {
    sites: never[];
    tables: {};
    rows: {};
    rowTitles: {};
    rowLabels: never[];
    breakouts: never[];
    validBreakouts: string[];
    sortDirection: string;
    neonContextHydrated: boolean;
    reference: {
        sites: {};
        states: {};
        domains: {};
    };
} | ({
    sites: never[];
    tables: {};
    rows: {};
    rowTitles: {};
    rowLabels: never[];
    breakouts: never[];
    validBreakouts: string[];
    sortDirection: string;
    neonContextHydrated: boolean;
    reference: {
        sites: {};
        states: {};
        domains: {};
    };
} | (() => void))[];
declare namespace SORT_DIRECTIONS {
    let ASC: string;
    let DESC: string;
}
import React from 'react';
import PropTypes from 'prop-types';
