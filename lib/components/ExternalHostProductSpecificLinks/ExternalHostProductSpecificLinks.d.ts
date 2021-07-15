declare function ExternalHostProductSpecificLinks(props: any): JSX.Element | null;
declare namespace ExternalHostProductSpecificLinks {
    export namespace propTypes {
        export const productCode: PropTypes.Requireable<string>;
        export const siteCodes: PropTypes.Requireable<(string | null | undefined)[]>;
    }
    export namespace defaultProps {
        const productCode_1: null;
        export { productCode_1 as productCode };
        const siteCodes_1: null;
        export { siteCodes_1 as siteCodes };
    }
}
export default ExternalHostProductSpecificLinks;
import PropTypes from "prop-types";
