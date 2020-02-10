export function getSiteLeafletIcon(config: any): any;
export default SiteIcon;
declare function SiteIcon(props: any): JSX.Element;
declare namespace SiteIcon {
    export const propTypes: {
        zoom: PropTypes.Requireable<number>;
        siteCode: PropTypes.Requireable<string>;
        type: PropTypes.Validator<string>;
        terrain: PropTypes.Validator<string>;
        isSelected: PropTypes.Requireable<boolean>;
    };
    export namespace defaultProps {
        export const zoom: null;
        export const siteCode: null;
        export const isSelected: boolean;
    }
}
import PropTypes from "prop-types";
