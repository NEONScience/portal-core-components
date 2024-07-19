export default LiferayNotifications;
declare function LiferayNotifications(props: any): import("react/jsx-runtime").JSX.Element | null;
declare namespace LiferayNotifications {
    namespace propTypes {
        const notifications: PropTypes.Requireable<(PropTypes.InferProps<{
            id: PropTypes.Validator<string>;
            message: PropTypes.Validator<string>;
            dismissed: PropTypes.Validator<boolean>;
        }> | null | undefined)[]>;
        const onHideNotifications: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const notifications_1: never[];
        export { notifications_1 as notifications };
        const onHideNotifications_1: null;
        export { onHideNotifications_1 as onHideNotifications };
    }
}
import PropTypes from "prop-types";
