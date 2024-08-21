export default LiferayNotifications;
declare function LiferayNotifications(inProps: any): React.JSX.Element | null;
declare namespace LiferayNotifications {
    namespace propTypes {
        let notifications: PropTypes.Requireable<(PropTypes.InferProps<{
            id: PropTypes.Validator<string>;
            message: PropTypes.Validator<string>;
            dismissed: PropTypes.Validator<boolean>;
        }> | null | undefined)[]>;
        let onHideNotifications: PropTypes.Requireable<(...args: any[]) => any>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
