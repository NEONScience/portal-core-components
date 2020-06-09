export default SiteMapFeature;
declare function SiteMapFeature(props: any): JSX.Element | null;
declare namespace SiteMapFeature {
    export namespace propTypes {
        export const mapRef: PropTypes.Validator<PropTypes.InferProps<{
            current: PropTypes.Requireable<any>;
        }>>;
        export const featureKey: PropTypes.Validator<string>;
    }
}
import PropTypes from "prop-types";
