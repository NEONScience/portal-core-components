export default DataThemeIcon;
declare function DataThemeIcon(inProps: any): React.JSX.Element | null;
declare namespace DataThemeIcon {
    namespace propTypes {
        let theme: PropTypes.Validator<string>;
        let size: PropTypes.Requireable<number>;
        let avatar: PropTypes.Requireable<boolean>;
        let className: PropTypes.Requireable<string>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
