export default EnhancedAvailabilityInterface;
declare function EnhancedAvailabilityInterface(props: any): JSX.Element;
declare namespace EnhancedAvailabilityInterface {
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
        export const view: PropTypes.Requireable<string>;
        export const table: PropTypes.Requireable<string>;
        export const sortMethod: PropTypes.Requireable<string>;
        export const sortDirection: PropTypes.Requireable<string>;
        export const disableSelection: PropTypes.Requireable<boolean>;
    }
    export namespace defaultProps {
        const sites_1: never[];
        export { sites_1 as sites };
        const view_1: null;
        export { view_1 as view };
        const table_1: string;
        export { table_1 as table };
        const sortMethod_1: null;
        export { sortMethod_1 as sortMethod };
        const sortDirection_1: string;
        export { sortDirection_1 as sortDirection };
        const disableSelection_1: boolean;
        export { disableSelection_1 as disableSelection };
    }
}
import PropTypes from "prop-types";
