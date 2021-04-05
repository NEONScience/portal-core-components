/**
   Main Function
*/
declare function BasicAvailabilityKey(props: any): JSX.Element;
declare namespace BasicAvailabilityKey {
    export namespace propTypes {
        export const orientation: PropTypes.Requireable<string>;
        export const selectionEnabled: PropTypes.Requireable<boolean>;
        export const delineateRelease: PropTypes.Requireable<boolean>;
    }
    export namespace defaultProps {
        const orientation_1: string;
        export { orientation_1 as orientation };
        const selectionEnabled_1: boolean;
        export { selectionEnabled_1 as selectionEnabled };
        const delineateRelease_1: boolean;
        export { delineateRelease_1 as delineateRelease };
    }
}
export default BasicAvailabilityKey;
import PropTypes from "prop-types";
