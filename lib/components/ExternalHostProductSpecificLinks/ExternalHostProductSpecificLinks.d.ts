declare function ExternalHostProductSpecificLinks(props: any): import("react/jsx-runtime").JSX.Element | null;
declare namespace ExternalHostProductSpecificLinks {
    namespace propTypes {
        const productCode: PropTypes.Requireable<string>;
        const siteCodes: PropTypes.Requireable<(string | null | undefined)[]>;
    }
    namespace defaultProps {
        const productCode_1: null;
        export { productCode_1 as productCode };
        const siteCodes_1: null;
        export { siteCodes_1 as siteCodes };
    }
}
export default ExternalHostProductSpecificLinks;
import PropTypes from "prop-types";
