export namespace SITE_MAP_MODES {
    export const EXPLORE: string;
    export const SELECT: string;
}
export namespace TILE_LAYERS {
    export namespace NatGeo_World_Map {
        export const name: string;
        export const shortAttribution: string;
        export const fullAttribution: string;
        export const url: string;
    }
    export namespace World_Imagery {
        const name_1: string;
        export { name_1 as name };
        const shortAttribution_1: string;
        export { shortAttribution_1 as shortAttribution };
        const fullAttribution_1: string;
        export { fullAttribution_1 as fullAttribution };
        const url_1: string;
        export { url_1 as url };
    }
    export namespace World_Street_Map {
        const name_2: string;
        export { name_2 as name };
        const shortAttribution_2: string;
        export { shortAttribution_2 as shortAttribution };
        const fullAttribution_2: string;
        export { fullAttribution_2 as fullAttribution };
        const url_2: string;
        export { url_2 as url };
    }
    export namespace World_Topo_Map {
        const name_3: string;
        export { name_3 as name };
        const shortAttribution_3: string;
        export { shortAttribution_3 as shortAttribution };
        const fullAttribution_3: string;
        export { fullAttribution_3 as fullAttribution };
        const url_3: string;
        export { url_3 as url };
    }
}
export default SiteMap;
declare function SiteMap(props: any): JSX.Element;
declare namespace SiteMap {
    export namespace propTypes {
        export const aspectRatio: PropTypes.Requireable<number>;
        export const center: PropTypes.Requireable<(number | null | undefined)[]>;
        export const mode: PropTypes.Requireable<string>;
        export const zoom: PropTypes.Requireable<number>;
        export const tileLayer: PropTypes.Requireable<string>;
        export const sites: PropTypes.Requireable<PropTypes.Requireable<(PropTypes.InferProps<{
            siteCode: PropTypes.Validator<string>;
            siteDescription: PropTypes.Validator<string>;
            siteLatitude: PropTypes.Validator<number>;
            siteLongitude: PropTypes.Validator<number>;
            siteType: PropTypes.Requireable<string>;
            domainCode: PropTypes.Requireable<string>;
            stateCode: PropTypes.Requireable<string>;
            terrain: PropTypes.Requireable<string>;
        }> | null | undefined)[]> | PropTypes.Requireable<{
            [x: string]: PropTypes.InferProps<{
                description: PropTypes.Validator<string>;
                latitude: PropTypes.Validator<number>;
                longitude: PropTypes.Validator<number>;
                type: PropTypes.Validator<string>;
                terrain: PropTypes.Validator<string>;
                domainCode: PropTypes.Validator<string>;
                stateCode: PropTypes.Validator<string>;
            }> | null | undefined;
        }>>;
    }
    export namespace defaultProps {
        const aspectRatio_1: number;
        export { aspectRatio_1 as aspectRatio };
        const center_1: number[];
        export { center_1 as center };
        const mode_1: string;
        export { mode_1 as mode };
        const tileLayer_1: string;
        export { tileLayer_1 as tileLayer };
        const zoom_1: null;
        export { zoom_1 as zoom };
        const sites_1: null;
        export { sites_1 as sites };
    }
}
import PropTypes from "prop-types";
