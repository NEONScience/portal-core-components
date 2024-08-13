export default DownloadStepForm;
declare function DownloadStepForm(props: any): React.JSX.Element | null;
declare namespace DownloadStepForm {
    namespace propTypes {
        let stepKey: PropTypes.Validator<string>;
        let changeToStep: PropTypes.Requireable<(...args: any[]) => any>;
        let changeToNextUncompletedStep: PropTypes.Requireable<(...args: any[]) => any>;
        let renderDownloadButton: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        export function changeToStep_1(): void;
        export { changeToStep_1 as changeToStep };
        export function changeToNextUncompletedStep_1(): void;
        export { changeToNextUncompletedStep_1 as changeToNextUncompletedStep };
        export function renderDownloadButton_1(): null;
        export { renderDownloadButton_1 as renderDownloadButton };
    }
}
import React from 'react';
import PropTypes from 'prop-types';
