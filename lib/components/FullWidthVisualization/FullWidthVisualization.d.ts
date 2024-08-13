declare function FullWidthVisualization(props: any): React.JSX.Element;
declare namespace FullWidthVisualization {
    namespace propTypes {
        let vizRef: PropTypes.Validator<NonNullable<PropTypes.InferProps<{
            current: PropTypes.Requireable<Element>;
        }>>>;
        let minWidth: PropTypes.Requireable<number>;
        let handleRedraw: PropTypes.Requireable<(...args: any[]) => any>;
        let allowHeightResize: PropTypes.Requireable<boolean>;
        let deriveHeightFromWidth: PropTypes.Requireable<NonNullable<string | ((...args: any[]) => any) | null | undefined>>;
        let containerStyle: PropTypes.Requireable<{
            [x: string]: NonNullable<string | number | null | undefined> | null | undefined;
        }>;
        let children: PropTypes.Validator<NonNullable<NonNullable<PropTypes.ReactNodeLike>>>;
    }
    namespace defaultProps {
        let minWidth_1: number;
        export { minWidth_1 as minWidth };
        let handleRedraw_1: null;
        export { handleRedraw_1 as handleRedraw };
        let deriveHeightFromWidth_1: null;
        export { deriveHeightFromWidth_1 as deriveHeightFromWidth };
        let allowHeightResize_1: boolean;
        export { allowHeightResize_1 as allowHeightResize };
        let containerStyle_1: null;
        export { containerStyle_1 as containerStyle };
    }
}
export default FullWidthVisualization;
import React from 'react';
import PropTypes from 'prop-types';
