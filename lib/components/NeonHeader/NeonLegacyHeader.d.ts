export default NeonHeader;
declare function NeonHeader(props: any): JSX.Element;
declare namespace NeonHeader {
    export namespace propTypes {
        export const notifications: PropTypes.Requireable<(PropTypes.InferProps<{
            id: PropTypes.Validator<string>;
            message: PropTypes.Validator<string>;
            dismissed: PropTypes.Validator<boolean>;
        }> | null | undefined)[]>;
        export const onShowNotifications: PropTypes.Requireable<(...args: any[]) => any>;
    }
    export namespace defaultProps {
        const notifications_1: never[];
        export { notifications_1 as notifications };
        const onShowNotifications_1: null;
        export { onShowNotifications_1 as onShowNotifications };
    }
}
import PropTypes from "prop-types";
