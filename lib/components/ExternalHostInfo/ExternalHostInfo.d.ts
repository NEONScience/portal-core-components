export default ExternalHostInfo;
declare function ExternalHostInfo(props: any): JSX.Element | null;
declare namespace ExternalHostInfo {
    export namespace propTypes {
        export const productCode: PropTypes.Validator<string>;
        export const expandable: PropTypes.Requireable<boolean>;
    }
    export namespace defaultProps {
        const expandable_1: boolean;
        export { expandable_1 as expandable };
    }
}
import PropTypes from "prop-types";
