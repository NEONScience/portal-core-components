declare function DownloadStepForm(props: any): any;
declare namespace DownloadStepForm {
    export namespace propTypes {
        export const stepKey: PropTypes.Validator<string>;
        export const changeToStep: PropTypes.Requireable<(...args: any[]) => any>;
        export const changeToNextUncompletedStep: PropTypes.Requireable<(...args: any[]) => any>;
        export const renderDownloadButton: PropTypes.Requireable<(...args: any[]) => any>;
    }
    export namespace defaultProps {
        export function changeToStep_1(): void;
        export { changeToStep_1 as changeToStep };
        export function changeToNextUncompletedStep_1(): void;
        export { changeToNextUncompletedStep_1 as changeToNextUncompletedStep };
        export function renderDownloadButton_1(): null;
        export { renderDownloadButton_1 as renderDownloadButton };
    }
}
export default DownloadStepForm;
import PropTypes from "prop-types";
