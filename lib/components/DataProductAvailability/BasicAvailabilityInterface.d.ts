export default BasicAvailabilityInterface;
/**
   Main Function
*/
declare function BasicAvailabilityInterface(inProps: any): React.JSX.Element;
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
}
import React from 'react';
import PropTypes from 'prop-types';
