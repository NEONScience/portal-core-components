declare function AvailabilityPending(props: any): JSX.Element | null;
declare namespace AvailabilityPending {
    export namespace propTypes {
        export const message: PropTypes.Requireable<string>;
    }
    export namespace defaultProps {
        const message_1: string;
        export { message_1 as message };
    }
}
export default AvailabilityPending;
import PropTypes from "prop-types";
