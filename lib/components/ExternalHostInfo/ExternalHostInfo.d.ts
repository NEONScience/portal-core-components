export default ExternalHostInfo;
declare function ExternalHostInfo(inProps: any): React.JSX.Element | null;
declare namespace ExternalHostInfo {
    namespace propTypes {
        let productCode: PropTypes.Validator<string>;
        let expandable: PropTypes.Requireable<boolean>;
        let siteCodes: PropTypes.Requireable<(string | null | undefined)[]>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
