export default NeonHeader;
declare function NeonHeader(props: any): JSX.Element;
declare namespace NeonHeader {
    export const propTypes: {
        useCoreHeader: PropTypes.Requireable<boolean>;
        notifications: PropTypes.Requireable<(PropTypes.InferProps<{
            id: PropTypes.Validator<string>;
            message: PropTypes.Validator<string>;
            dismissed: PropTypes.Validator<boolean>;
        }> | null | undefined)[]>;
        onShowNotifications: PropTypes.Requireable<(...args: any[]) => any>;
    };
    export const defaultProps: {
        useCoreHeader: boolean;
        notifications: never[];
        onShowNotifications: null;
    };
}
import PropTypes from "prop-types";
