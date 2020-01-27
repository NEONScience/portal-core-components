/**
   Main Function
*/
declare function AvailabilityLegend(props: any): JSX.Element;
declare namespace AvailabilityLegend {
    export namespace propTypes {
        export const selectionEnabled: PropTypes.Requireable<boolean>;
    }
    export namespace defaultProps {
        const selectionEnabled_1: boolean;
        export { selectionEnabled_1 as selectionEnabled };
    }
}
export default AvailabilityLegend;
import PropTypes from "prop-types";
