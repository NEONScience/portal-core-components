export default NeonHeader;
declare function NeonHeader(inProps: any): React.JSX.Element;
declare namespace NeonHeader {
    namespace propTypes {
        let ref: PropTypes.Requireable<PropTypes.ReactElementLike>;
        let drupalCssLoaded: PropTypes.Requireable<boolean>;
        let unstickyDrupalHeader: PropTypes.Requireable<boolean>;
        let showSkeleton: PropTypes.Requireable<boolean>;
        let customizeAuthContainer: PropTypes.Requireable<boolean>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
