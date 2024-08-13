export default BasicAvailabilityKey;
declare function BasicAvailabilityKey(props: any): React.JSX.Element;
declare namespace BasicAvailabilityKey {
    namespace propTypes {
        let selectionEnabled: PropTypes.Requireable<boolean>;
        let delineateRelease: PropTypes.Requireable<boolean>;
        let availabilityStatusType: PropTypes.Requireable<string>;
        let dialogOnly: PropTypes.Requireable<boolean>;
    }
    namespace defaultProps {
        let selectionEnabled_1: boolean;
        export { selectionEnabled_1 as selectionEnabled };
        let delineateRelease_1: boolean;
        export { delineateRelease_1 as delineateRelease };
        let availabilityStatusType_1: string;
        export { availabilityStatusType_1 as availabilityStatusType };
        let dialogOnly_1: boolean;
        export { dialogOnly_1 as dialogOnly };
    }
}
import React from 'react';
import PropTypes from 'prop-types';
