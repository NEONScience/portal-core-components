export default DownloadStepForm;
declare function DownloadStepForm(inProps: any): React.JSX.Element | null;
declare namespace DownloadStepForm {
    namespace propTypes {
        let stepKey: PropTypes.Validator<string>;
        let changeToStep: PropTypes.Requireable<(...args: any[]) => any>;
        let changeToNextUncompletedStep: PropTypes.Requireable<(...args: any[]) => any>;
        let renderDownloadButton: PropTypes.Requireable<(...args: any[]) => any>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
