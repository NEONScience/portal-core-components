declare function ExternalHostProductSpecificLinks(props: any): JSX.Element | null;
declare namespace ExternalHostProductSpecificLinks {
    export namespace propTypes {
        export const productCode: PropTypes.Requireable<string>;
    }
    export namespace defaultProps {
        const productCode_1: null;
        export { productCode_1 as productCode };
    }
}
export default ExternalHostProductSpecificLinks;
import PropTypes from "prop-types";
