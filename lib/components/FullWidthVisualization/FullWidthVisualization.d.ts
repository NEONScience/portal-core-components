declare function FullWidthVisualization(props: any): JSX.Element;
declare namespace FullWidthVisualization {
    namespace propTypes {
        const vizRef: PropTypes.Validator<PropTypes.InferProps<{
            current: PropTypes.Requireable<Element>;
        }>>;
        const minWidth: PropTypes.Requireable<number>;
        const handleRedraw: PropTypes.Requireable<(...args: any[]) => any>;
        const allowHeightResize: PropTypes.Requireable<boolean>;
        const deriveHeightFromWidth: PropTypes.Requireable<string | ((...args: any[]) => any)>;
        const containerStyle: PropTypes.Requireable<{
            [x: string]: string | number | null | undefined;
        }>;
        const children: PropTypes.Validator<string | number | boolean | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
    }
    namespace defaultProps {
        const minWidth_1: number;
        export { minWidth_1 as minWidth };
        const handleRedraw_1: null;
        export { handleRedraw_1 as handleRedraw };
        const deriveHeightFromWidth_1: null;
        export { deriveHeightFromWidth_1 as deriveHeightFromWidth };
        const allowHeightResize_1: boolean;
        export { allowHeightResize_1 as allowHeightResize };
        const containerStyle_1: null;
        export { containerStyle_1 as containerStyle };
    }
}
export default FullWidthVisualization;
import PropTypes from "prop-types";
