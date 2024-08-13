/**
   Main Function
*/
declare function EnhancedAvailabilityKey(props: any): React.JSX.Element;
declare namespace EnhancedAvailabilityKey {
    namespace propTypes {
        let selectionEnabled: PropTypes.Requireable<boolean>;
        let rollUpPresent: PropTypes.Requireable<boolean>;
    }
    namespace defaultProps {
        let selectionEnabled_1: boolean;
        export { selectionEnabled_1 as selectionEnabled };
        let rollUpPresent_1: boolean;
        export { rollUpPresent_1 as rollUpPresent };
    }
}
export default EnhancedAvailabilityKey;
import React from 'react';
import PropTypes from 'prop-types';
