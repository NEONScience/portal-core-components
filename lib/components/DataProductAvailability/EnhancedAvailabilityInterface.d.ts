export default EnhancedAvailabilityInterface;
declare function EnhancedAvailabilityInterface(inProps: any): React.JSX.Element;
declare namespace EnhancedAvailabilityInterface {
    namespace propTypes {
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
        let view: PropTypes.Requireable<string>;
        let table: PropTypes.Requireable<string>;
        let sortMethod: PropTypes.Requireable<string>;
        let sortDirection: PropTypes.Requireable<string>;
        let disableSelection: PropTypes.Requireable<boolean>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
