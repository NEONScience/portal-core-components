export default AvailabilityContext;
declare namespace AvailabilityContext {
    export { Provider };
    export { useAvailabilityState };
    export { SORT_DIRECTIONS };
}
declare function Provider(props: any): JSX.Element;
declare namespace Provider {
    export namespace propTypes {
        export const sites: PropTypes.Requireable<(PropTypes.InferProps<{
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
        export const children: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
    }
    export namespace defaultProps {
        const sites_1: never[];
        export { sites_1 as sites };
    }
}
declare function useAvailabilityState(): any[] | {
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
declare namespace SORT_DIRECTIONS {
    export const ASC: string;
    export const DESC: string;
}
import PropTypes from "prop-types";
