/**
   Main Function
*/
declare function EnhancedAvailabilityKey(props: any): JSX.Element;
declare namespace EnhancedAvailabilityKey {
    export namespace propTypes {
        export const selectionEnabled: PropTypes.Requireable<boolean>;
        export const rollUpPresent: PropTypes.Requireable<boolean>;
    }
    export namespace defaultProps {
        const selectionEnabled_1: boolean;
        export { selectionEnabled_1 as selectionEnabled };
        const rollUpPresent_1: boolean;
        export { rollUpPresent_1 as rollUpPresent };
    }
}
export default EnhancedAvailabilityKey;
import PropTypes from "prop-types";
