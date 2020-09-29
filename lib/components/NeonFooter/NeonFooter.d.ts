export default NeonFooter;
declare function NeonFooter(props: any): JSX.Element;
declare namespace NeonFooter {
    export namespace propTypes {
        export const drupalCssLoaded: PropTypes.Requireable<boolean>;
        export const useCoreHeader: PropTypes.Requireable<boolean>;
    }
    export namespace defaultProps {
        const drupalCssLoaded_1: boolean;
        export { drupalCssLoaded_1 as drupalCssLoaded };
        const useCoreHeader_1: boolean;
        export { useCoreHeader_1 as useCoreHeader };
    }
}
import PropTypes from "prop-types";
