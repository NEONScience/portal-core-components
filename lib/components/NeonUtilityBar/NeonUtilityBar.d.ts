export default NeonUtilityBar;
declare function NeonUtilityBar(props: any): JSX.Element;
declare namespace NeonUtilityBar {
    export namespace propTypes {
        export const selectedTab: PropTypes.Requireable<string>;
    }
    export namespace defaultProps {
        const selectedTab_1: string;
        export { selectedTab_1 as selectedTab };
    }
}
import PropTypes from "prop-types";
