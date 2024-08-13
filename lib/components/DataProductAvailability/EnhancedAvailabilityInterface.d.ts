export default EnhancedAvailabilityInterface;
declare function EnhancedAvailabilityInterface(props: any): React.JSX.Element;
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
    namespace defaultProps {
        let sites_1: never[];
        export { sites_1 as sites };
        let view_1: null;
        export { view_1 as view };
        let table_1: string;
        export { table_1 as table };
        let sortMethod_1: null;
        export { sortMethod_1 as sortMethod };
        let sortDirection_1: string;
        export { sortDirection_1 as sortDirection };
        let disableSelection_1: boolean;
        export { disableSelection_1 as disableSelection };
    }
}
import React from 'react';
import PropTypes from 'prop-types';
