declare function ExternalHostProductSpecificLinks(inProps: any): React.JSX.Element | null;
declare namespace ExternalHostProductSpecificLinks {
    namespace propTypes {
        let productCode: PropTypes.Requireable<string>;
        let siteCodes: PropTypes.Requireable<(string | null | undefined)[]>;
    }
}
export default ExternalHostProductSpecificLinks;
import React from 'react';
import PropTypes from 'prop-types';
