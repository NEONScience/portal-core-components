/**
   Main Function
*/
declare function EnhancedAvailabilityKey(props: any): import("react/jsx-runtime").JSX.Element;
declare namespace EnhancedAvailabilityKey {
    namespace propTypes {
        const selectionEnabled: PropTypes.Requireable<boolean>;
        const rollUpPresent: PropTypes.Requireable<boolean>;
    }
    namespace defaultProps {
        const selectionEnabled_1: boolean;
        export { selectionEnabled_1 as selectionEnabled };
        const rollUpPresent_1: boolean;
        export { rollUpPresent_1 as rollUpPresent };
    }
}
export default EnhancedAvailabilityKey;
import PropTypes from "prop-types";
