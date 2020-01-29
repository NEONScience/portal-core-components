/**
   Main Function
*/
declare function DataProductAvailability(props: any): JSX.Element;
declare namespace DataProductAvailability {
    export namespace propTypes {
        export const siteCodes: PropTypes.Requireable<(PropTypes.InferProps<{
            siteCode: PropTypes.Validator<string>;
            availableMonths: PropTypes.Validator<import("../../types/coreTypes").Nullable<string>[]>;
        }> | null | undefined)[]>;
        export const view: PropTypes.Requireable<string>;
        export const sortMethod: PropTypes.Requireable<string>;
        export const sortDirection: PropTypes.Requireable<string>;
        export const disableSelection: PropTypes.Requireable<boolean>;
        export const disableSelectionCollapse: PropTypes.Requireable<boolean>;
    }
    export namespace defaultProps {
        const siteCodes_1: never[];
        export { siteCodes_1 as siteCodes };
        const view_1: null;
        export { view_1 as view };
        const sortMethod_1: null;
        export { sortMethod_1 as sortMethod };
        const sortDirection_1: string;
        export { sortDirection_1 as sortDirection };
        const disableSelection_1: boolean;
        export { disableSelection_1 as disableSelection };
        const disableSelectionCollapse_1: boolean;
        export { disableSelectionCollapse_1 as disableSelectionCollapse };
    }
}
export default DataProductAvailability;
import PropTypes from "prop-types";
