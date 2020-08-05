export default NeonMenu;
declare function NeonMenu(props: any): JSX.Element;
declare namespace NeonMenu {
    export namespace propTypes {
        export const loginPath: PropTypes.Requireable<string>;
        export const logoutPath: PropTypes.Requireable<string>;
        export const accountPath: PropTypes.Requireable<string>;
        export const notifications: PropTypes.Requireable<(PropTypes.InferProps<{
            id: PropTypes.Validator<string>;
            message: PropTypes.Validator<string>;
            dismissed: PropTypes.Validator<boolean>;
        }> | null | undefined)[]>;
        export const onShowNotifications: PropTypes.Requireable<(...args: any[]) => any>;
    }
    export namespace defaultProps {
        const loginPath_1: string;
        export { loginPath_1 as loginPath };
        const logoutPath_1: string;
        export { logoutPath_1 as logoutPath };
        const accountPath_1: string;
        export { accountPath_1 as accountPath };
        const notifications_1: never[];
        export { notifications_1 as notifications };
        const onShowNotifications_1: null;
        export { onShowNotifications_1 as onShowNotifications };
    }
}
import PropTypes from "prop-types";
