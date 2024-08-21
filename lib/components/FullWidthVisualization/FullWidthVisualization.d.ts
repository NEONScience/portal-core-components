declare function FullWidthVisualization(inProps: any): React.JSX.Element;
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
}
export default FullWidthVisualization;
import React from 'react';
import PropTypes from 'prop-types';
