export default BasicAvailabilityKey;
declare function BasicAvailabilityKey(props: any): import("react/jsx-runtime").JSX.Element;
declare namespace BasicAvailabilityKey {
    namespace propTypes {
        const selectionEnabled: PropTypes.Requireable<boolean>;
        const delineateRelease: PropTypes.Requireable<boolean>;
        const availabilityStatusType: PropTypes.Requireable<string>;
        const dialogOnly: PropTypes.Requireable<boolean>;
    }
    namespace defaultProps {
        const selectionEnabled_1: boolean;
        export { selectionEnabled_1 as selectionEnabled };
        const delineateRelease_1: boolean;
        export { delineateRelease_1 as delineateRelease };
        const availabilityStatusType_1: string;
        export { availabilityStatusType_1 as availabilityStatusType };
        const dialogOnly_1: boolean;
        export { dialogOnly_1 as dialogOnly };
    }
}
import PropTypes from "prop-types";
