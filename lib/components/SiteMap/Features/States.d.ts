export default States;
declare function States(props: any): JSX.Element | null;
declare namespace States {
    export namespace propTypes {
        export const classes: PropTypes.Validator<{
            [x: string]: import("../../../types/coreTypes").Nullable<string>;
        }>;
        export const positionPopup: PropTypes.Validator<(...args: any[]) => any>;
        export const renderPopupSitesList: PropTypes.Validator<(...args: any[]) => any>;
    }
}
import PropTypes from "prop-types";
