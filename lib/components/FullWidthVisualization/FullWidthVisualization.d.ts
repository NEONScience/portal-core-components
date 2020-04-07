declare function FullWidthVisualization(props: any): JSX.Element;
declare namespace FullWidthVisualization {
    export namespace propTypes {
        export const vizRef: PropTypes.Validator<PropTypes.InferProps<{
            current: PropTypes.Requireable<Element>;
        }>>;
        export const minWidth: PropTypes.Requireable<number>;
        export const handleRedraw: PropTypes.Requireable<(...args: any[]) => any>;
        export const deriveHeightFromWidth: PropTypes.Requireable<string | ((...args: any[]) => any)>;
        export const children: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
    }
    export namespace defaultProps {
        const minWidth_1: number;
        export { minWidth_1 as minWidth };
        const handleRedraw_1: null;
        export { handleRedraw_1 as handleRedraw };
        const deriveHeightFromWidth_1: null;
        export { deriveHeightFromWidth_1 as deriveHeightFromWidth };
    }
}
export default FullWidthVisualization;
import PropTypes from "prop-types";
