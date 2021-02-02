export default NeonDrawerMenu;
declare function NeonDrawerMenu(props: any): JSX.Element;
declare namespace NeonDrawerMenu {
    export namespace propTypes {
        export const items: PropTypes.Validator<(PropTypes.InferProps<{
            name: PropTypes.Validator<string>;
            url: PropTypes.Validator<string>;
            children: PropTypes.Requireable<any[]>;
        }> | null | undefined)[]>;
    }
}
import PropTypes from "prop-types";
