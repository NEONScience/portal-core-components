export default SiteMapContainer;
declare function SiteMapContainer(props: any): React.JSX.Element;
declare namespace SiteMapContainer {
    namespace propTypes {
        let unusableVerticalSpace: PropTypes.Requireable<number>;
        let mapUniqueId: PropTypes.Requireable<number>;
    }
    namespace defaultProps {
        let unusableVerticalSpace_1: number;
        export { unusableVerticalSpace_1 as unusableVerticalSpace };
        let mapUniqueId_1: number;
        export { mapUniqueId_1 as mapUniqueId };
    }
}
import React from 'react';
import PropTypes from 'prop-types';
