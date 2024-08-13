export default BasicAvailabilityInterface;
/**
   Main Function
*/
declare function BasicAvailabilityInterface(props: any): React.JSX.Element;
declare namespace BasicAvailabilityInterface {
    namespace propTypes {
        let siteCodes: PropTypes.Requireable<(PropTypes.InferProps<{
            siteCode: PropTypes.Validator<string>;
            availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
            availableReleases: PropTypes.Requireable<(PropTypes.InferProps<{
                release: PropTypes.Validator<string>;
                availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
            }> | null | undefined)[]>;
        }> | null | undefined)[]>;
        let dataProducts: PropTypes.Requireable<(PropTypes.InferProps<{
            dataProductCode: PropTypes.Validator<string>;
            dataProductTitle: PropTypes.Validator<string>;
            availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
            availableReleases: PropTypes.Requireable<(PropTypes.InferProps<{
                release: PropTypes.Validator<string>;
                availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
            }> | null | undefined)[]>;
        }> | null | undefined)[]>;
        let view: PropTypes.Requireable<string>;
        let sortMethod: PropTypes.Requireable<string>;
        let sortDirection: PropTypes.Requireable<string>;
        let disableSelection: PropTypes.Requireable<boolean>;
        let delineateRelease: PropTypes.Requireable<boolean>;
        let availabilityStatusType: PropTypes.Requireable<string>;
    }
    namespace defaultProps {
        let siteCodes_1: never[];
        export { siteCodes_1 as siteCodes };
        let dataProducts_1: never[];
        export { dataProducts_1 as dataProducts };
        let view_1: null;
        export { view_1 as view };
        let sortMethod_1: null;
        export { sortMethod_1 as sortMethod };
        let sortDirection_1: string;
        export { sortDirection_1 as sortDirection };
        let disableSelection_1: boolean;
        export { disableSelection_1 as disableSelection };
        let delineateRelease_1: boolean;
        export { delineateRelease_1 as delineateRelease };
        let availabilityStatusType_1: null;
        export { availabilityStatusType_1 as availabilityStatusType };
    }
}
import React from 'react';
import PropTypes from 'prop-types';
