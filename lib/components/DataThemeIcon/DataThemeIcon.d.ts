export default DataThemeIcon;
declare function DataThemeIcon(props: any): JSX.Element;
declare namespace DataThemeIcon {
    export namespace propTypes {
        export const theme: PropTypes.Validator<string>;
        export const size: PropTypes.Requireable<number>;
        export const avatar: PropTypes.Requireable<boolean>;
        export const className: PropTypes.Requireable<string>;
    }
    export namespace defaultProps {
        const size_1: number;
        export { size_1 as size };
        const avatar_1: boolean;
        export { avatar_1 as avatar };
        const className_1: null;
        export { className_1 as className };
    }
}
import PropTypes from "prop-types";
