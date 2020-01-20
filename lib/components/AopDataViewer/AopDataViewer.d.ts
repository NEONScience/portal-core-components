/**
   Main Function
*/
declare function AopDataViewer(props: any): JSX.Element;
declare namespace AopDataViewer {
    export namespace propTypes {
        export const productCode: PropTypes.Validator<string>;
        export const showTitle: PropTypes.Requireable<boolean>;
        export const initialSite: PropTypes.Requireable<string>;
        export const initialYear: PropTypes.Requireable<number>;
        export const initialFlight: PropTypes.Requireable<number>;
    }
    export namespace defaultProps {
        const showTitle_1: boolean;
        export { showTitle_1 as showTitle };
        const initialSite_1: null;
        export { initialSite_1 as initialSite };
        const initialYear_1: null;
        export { initialYear_1 as initialYear };
        const initialFlight_1: null;
        export { initialFlight_1 as initialFlight };
    }
}
export default AopDataViewer;
import PropTypes from "prop-types";
