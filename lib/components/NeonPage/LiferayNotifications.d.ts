export default LiferayNotifications;
declare function LiferayNotifications(props: any): JSX.Element | null;
declare namespace LiferayNotifications {
    export namespace propTypes {
        export const notifications: PropTypes.Requireable<(PropTypes.InferProps<{
            id: PropTypes.Validator<string>;
            message: PropTypes.Validator<string>;
            dismissed: PropTypes.Validator<boolean>;
        }> | null | undefined)[]>;
        export const onHideNotifications: PropTypes.Requireable<(...args: any[]) => any>;
    }
    export namespace defaultProps {
        const notifications_1: never[];
        export { notifications_1 as notifications };
        const onHideNotifications_1: null;
        export { onHideNotifications_1 as onHideNotifications };
    }
}
import PropTypes from "prop-types";
