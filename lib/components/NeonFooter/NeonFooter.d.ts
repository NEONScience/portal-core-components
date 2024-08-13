export default NeonFooter;
declare function NeonFooter(props: any): React.JSX.Element;
declare namespace NeonFooter {
    namespace propTypes {
        let drupalCssLoaded: PropTypes.Requireable<boolean>;
        let showSkeleton: PropTypes.Requireable<boolean>;
    }
    namespace defaultProps {
        let drupalCssLoaded_1: boolean;
        export { drupalCssLoaded_1 as drupalCssLoaded };
        let showSkeleton_1: boolean;
        export { showSkeleton_1 as showSkeleton };
    }
}
import React from 'react';
import PropTypes from 'prop-types';
