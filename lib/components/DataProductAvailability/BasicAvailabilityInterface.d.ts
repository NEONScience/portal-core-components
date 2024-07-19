export default BasicAvailabilityInterface;
/**
   Main Function
*/
declare function BasicAvailabilityInterface(props: any): import("react/jsx-runtime").JSX.Element;
declare namespace BasicAvailabilityInterface {
    namespace propTypes {
        const siteCodes: PropTypes.Requireable<(PropTypes.InferProps<{
            siteCode: PropTypes.Validator<string>;
            availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
            availableReleases: PropTypes.Requireable<(PropTypes.InferProps<{
                release: PropTypes.Validator<string>;
                availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
            }> | null | undefined)[]>;
        }> | null | undefined)[]>;
        const dataProducts: PropTypes.Requireable<(PropTypes.InferProps<{
            dataProductCode: PropTypes.Validator<string>;
            dataProductTitle: PropTypes.Validator<string>;
            availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
            availableReleases: PropTypes.Requireable<(PropTypes.InferProps<{
                release: PropTypes.Validator<string>;
                availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
            }> | null | undefined)[]>;
        }> | null | undefined)[]>;
        const view: PropTypes.Requireable<string>;
        const sortMethod: PropTypes.Requireable<string>;
        const sortDirection: PropTypes.Requireable<string>;
        const disableSelection: PropTypes.Requireable<boolean>;
        const delineateRelease: PropTypes.Requireable<boolean>;
        const availabilityStatusType: PropTypes.Requireable<string>;
    }
    namespace defaultProps {
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
        const availabilityStatusType_1: null;
        export { availabilityStatusType_1 as availabilityStatusType };
    }
}
import PropTypes from "prop-types";
