export default SiteMarker;
declare function SiteMarker(props: any): JSX.Element | null;
declare namespace SiteMarker {
    export namespace propTypes {
        export const zoom: PropTypes.Requireable<number>;
        export const isSelected: PropTypes.Requireable<boolean>;
        export const popupHrefNew: PropTypes.Requireable<boolean>;
        export const popupExploreDataProductsButton: PropTypes.Requireable<boolean>;
        export const site: PropTypes.Validator<PropTypes.InferProps<{
            siteCode: PropTypes.Validator<string>;
            description: PropTypes.Validator<string>;
            latitude: PropTypes.Validator<number>;
            longitude: PropTypes.Validator<number>;
            type: PropTypes.Validator<string>;
            terrain: PropTypes.Validator<string>;
            domainCode: PropTypes.Validator<string>;
            stateCode: PropTypes.Validator<string>;
        }>>;
    }
    export namespace defaultProps {
        const zoom_1: null;
        export { zoom_1 as zoom };
        const isSelected_1: boolean;
        export { isSelected_1 as isSelected };
        const popupHrefNew_1: boolean;
        export { popupHrefNew_1 as popupHrefNew };
        const popupExploreDataProductsButton_1: boolean;
        export { popupExploreDataProductsButton_1 as popupExploreDataProductsButton };
    }
}
import PropTypes from "prop-types";
