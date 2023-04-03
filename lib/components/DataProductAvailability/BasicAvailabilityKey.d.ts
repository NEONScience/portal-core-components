/**
   Main Function
*/
declare function BasicAvailabilityKey(props: any): JSX.Element;
declare namespace BasicAvailabilityKey {
    namespace propTypes {
        const orientation: PropTypes.Requireable<string>;
        const selectionEnabled: PropTypes.Requireable<boolean>;
        const delineateRelease: PropTypes.Requireable<boolean>;
        const availabilityStatusType: PropTypes.Requireable<string>;
    }
    namespace defaultProps {
        const orientation_1: string;
        export { orientation_1 as orientation };
        const selectionEnabled_1: boolean;
        export { selectionEnabled_1 as selectionEnabled };
        const delineateRelease_1: boolean;
        export { delineateRelease_1 as delineateRelease };
        const availabilityStatusType_1: null;
        export { availabilityStatusType_1 as availabilityStatusType };
    }
}
export default BasicAvailabilityKey;
import PropTypes from "prop-types";
