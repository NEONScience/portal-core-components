export default Domains;
declare function Domains(props: any): JSX.Element | null;
declare namespace Domains {
    export namespace propTypes {
        export const classes: PropTypes.Validator<{
            [x: string]: import("../../../types/coreTypes").Nullable<string>;
        }>;
        export const positionPopup: PropTypes.Validator<(...args: any[]) => any>;
        export const renderPopupSitesList: PropTypes.Validator<(...args: any[]) => any>;
    }
}
import PropTypes from "prop-types";
