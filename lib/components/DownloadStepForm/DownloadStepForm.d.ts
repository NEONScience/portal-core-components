export default DownloadStepForm;
declare function DownloadStepForm(props: any): import("react/jsx-runtime").JSX.Element | null;
declare namespace DownloadStepForm {
    namespace propTypes {
        const stepKey: PropTypes.Validator<string>;
        const changeToStep: PropTypes.Requireable<(...args: any[]) => any>;
        const changeToNextUncompletedStep: PropTypes.Requireable<(...args: any[]) => any>;
        const renderDownloadButton: PropTypes.Requireable<(...args: any[]) => any>;
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
import PropTypes from "prop-types";
