declare function ExternalHostProductSpecificLinks(props: any): React.JSX.Element | null;
declare namespace ExternalHostProductSpecificLinks {
    namespace propTypes {
        let productCode: PropTypes.Requireable<string>;
        let siteCodes: PropTypes.Requireable<(string | null | undefined)[]>;
    }
    namespace defaultProps {
        let productCode_1: null;
        export { productCode_1 as productCode };
        let siteCodes_1: null;
        export { siteCodes_1 as siteCodes };
    }
}
export default ExternalHostProductSpecificLinks;
import React from 'react';
import PropTypes from 'prop-types';
