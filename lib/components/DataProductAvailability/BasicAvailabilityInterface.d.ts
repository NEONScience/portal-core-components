export default BasicAvailabilityInterface;
/**
   Main Function
*/
declare function BasicAvailabilityInterface(props: any): JSX.Element;
declare namespace BasicAvailabilityInterface {
    export namespace propTypes {
        export const siteCodes: PropTypes.Requireable<(PropTypes.InferProps<{
            siteCode: PropTypes.Validator<string>;
            availableMonths: PropTypes.Validator<import("../../types/core").Nullable<string>[]>;
            availableReleases: PropTypes.Requireable<(PropTypes.InferProps<{
                release: PropTypes.Validator<string>;
                availableMonths: PropTypes.Validator<import("../../types/core").Nullable<string>[]>;
            }> | null | undefined)[]>;
        }> | null | undefined)[]>;
        export const dataProducts: PropTypes.Requireable<(PropTypes.InferProps<{
            dataProductCode: PropTypes.Validator<string>;
            dataProductTitle: PropTypes.Validator<string>;
            availableMonths: PropTypes.Validator<import("../../types/core").Nullable<string>[]>;
            availableReleases: PropTypes.Requireable<(PropTypes.InferProps<{
                release: PropTypes.Validator<string>;
                availableMonths: PropTypes.Validator<import("../../types/core").Nullable<string>[]>;
            }> | null | undefined)[]>;
        }> | null | undefined)[]>;
        export const view: PropTypes.Requireable<string>;
        export const sortMethod: PropTypes.Requireable<string>;
        export const sortDirection: PropTypes.Requireable<string>;
        export const disableSelection: PropTypes.Requireable<boolean>;
        export const delineateRelease: PropTypes.Requireable<boolean>;
    }
    export namespace defaultProps {
        const siteCodes_1: never[];
        export { siteCodes_1 as siteCodes };
        const dataProducts_1: never[];
        export { dataProducts_1 as dataProducts };
        const view_1: null;
        export { view_1 as view };
        const sortMethod_1: null;
        export { sortMethod_1 as sortMethod };
        const sortDirection_1: string;
        export { sortDirection_1 as sortDirection };
        const disableSelection_1: boolean;
        export { disableSelection_1 as disableSelection };
        const delineateRelease_1: boolean;
        export { delineateRelease_1 as delineateRelease };
    }
}
import PropTypes from "prop-types";
