export default LiferayNotifications;
declare function LiferayNotifications(props: any): React.JSX.Element | null;
declare namespace LiferayNotifications {
    namespace propTypes {
        let notifications: PropTypes.Requireable<(PropTypes.InferProps<{
            id: PropTypes.Validator<string>;
            message: PropTypes.Validator<string>;
            dismissed: PropTypes.Validator<boolean>;
        }> | null | undefined)[]>;
        let onHideNotifications: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        let notifications_1: never[];
        export { notifications_1 as notifications };
        let onHideNotifications_1: null;
        export { onHideNotifications_1 as onHideNotifications };
    }
}
import React from 'react';
import PropTypes from 'prop-types';
