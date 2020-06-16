export const MAP_ZOOM_RANGE: number[];
export const MIN_TABLE_MAX_BODY_HEIGHT: 100;
export const KM2_TO_ACRES: 247.10538146717;
export const SITE_LOCATION_HIERARCHIES_MIN_ZOOM: 9;
export namespace SORT_DIRECTIONS {
    export const ASC: string;
    export const DESC: string;
}
export namespace FEATURE_TYPES {
    export const SITES: string;
    export const SITE_LOCATION_HIERARCHIES: string;
    export const LOCATIONS: string;
    export const SAMPLING_POINTS: string;
    export const BOUNDARIES: string;
    export const GROUP: string;
    export const OTHER: string;
}
export namespace FEATURE_DATA_LOAD_TYPES {
    export const FETCH: string;
    export const IMPORT: string;
    export const NEON_CONTEXT: string;
}
export namespace SELECTABLE_FEATURE_TYPES {
    export { SITES };
}
export namespace SELECTION_PORTIONS {
    export const PARTIAL: string;
    export const TOTAL: string;
}
export namespace SELECTION_STATUS {
    export const SELECTED: string;
    export const UNSELECTED: string;
}
export namespace HIGHLIGHT_STATUS {
    export const NONE: string;
    export const HIGHLIGHT: string;
    export const SELECT: string;
}
export namespace VIEWS {
    export const MAP: string;
    export const TABLE: string;
}
export namespace FETCH_STATUS {
    export const AWAITING_CALL: string;
    export const FETCHING: string;
    export const ERROR: string;
    export const SUCCESS: string;
}
export namespace PLOT_SAMPLING_MODULES {
    export const bbc: string;
    export const bet: string;
    export const bgc: string;
    export const brd: string;
    export const cdw: string;
    export const cfc: string;
    export const dhp: string;
    export const div: string;
    export const hbp: string;
    export const ltr: string;
    export const mam: string;
    export const mfb: string;
    export const mos: string;
    export const mpt: string;
    export const phe: string;
    export const sme: string;
    export const tck: string;
    export const vst: string;
}
export namespace FEATURES {
    export const DOMAINS: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        hideByDefault: boolean;
        dataLoadType: string;
        primaryIdOnly: boolean;
        featureShape: string;
        style: {
            color: string;
        };
    };
    export const STATES: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        hideByDefault: boolean;
        dataLoadType: string;
        primaryIdOnly: boolean;
        featureShape: string;
        style: {
            color: string;
        };
    };
    export const FLIGHT_BOX_BOUNDARIES: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        description: string;
        featureShape: string;
        style: {
            color: string;
            dashArray: string;
        };
    };
    export const AQUATIC_WATERSHEDS: {
        name: string;
        type: string;
        minZoom: number;
        description: string;
    };
    export const WATERSHED_BOUNDARIES: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        description: string;
        parent: string;
        featureShape: string;
        style: {
            color: string;
            dashArray: string;
        };
    };
    export const DRAINAGE_LINES: {
        name: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        description: string;
        parent: string;
        featureShape: string;
        style: {
            color: string;
        };
    };
    export const POUR_POINTS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        description: string;
        parent: string;
        iconSvg: any;
        iconShape: string;
    };
    export const SAMPLING_BOUNDARIES: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        description: string;
        parent: string;
        featureShape: string;
        style: {
            color: string;
            dashArray: string;
        };
    };
    export const AQUATIC_REACHES: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        description: string;
        parent: string;
        featureShape: string;
        style: {
            color: string;
            dashArray: string;
        };
    };
    export const TOWER_AIRSHEDS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        description: string;
        parent: string;
        featureShape: string;
        style: {
            color: string;
            dashArray: string;
        };
    };
    export const TERRESTRIAL_SITE_FEATURES: {
        name: string;
        type: string;
        minZoom: number;
        description: string;
        dataLoadType: string;
        matchLocationType: string;
        fetchingForFeatures: string[];
    };
    export const TOWERS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
    };
    export const HUTS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
    };
    export const MEGAPITS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
    };
    export const TOWER_PLOTS: {
        name: string;
        type: string;
        minZoom: number;
        description: string;
        parent: string;
    };
    export const TOWER_PHENOLOGY_PLOTS: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        dataLoadType: string;
        matchLocationType: string;
        focusZoom: number;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
    };
    export const TOWER_BASE_PLOTS: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        focusZoom: number;
        iconSvg: any;
        iconShape: string;
    };
    export const TOWER_SOIL_PLOTS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        focusZoom: number;
        iconSvg: any;
        iconShape: string;
    };
    export const DISTRIBUTED_PLOTS: {
        name: string;
        type: string;
        minZoom: number;
        description: string;
        parent: string;
    };
    export const DISTRIBUTED_BIRD_GRIDS: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        dataLoadType: string;
        matchLocationType: string;
        iconScale: number;
        focusZoom: number;
        iconSvg: any;
        iconShape: string;
    };
    export const DISTRIBUTED_MAMMAL_GRIDS: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        dataLoadType: string;
        matchLocationType: string;
        iconScale: number;
        focusZoom: number;
        iconSvg: any;
        iconShape: string;
    };
    export const DISTRIBUTED_BASE_PLOTS: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        iconScale: number;
        focusZoom: number;
        iconSvg: any;
        iconShape: string;
    };
    export const DISTRIBUTED_TICK_PLOTS: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        dataLoadType: string;
        matchLocationType: string;
        iconScale: number;
        focusZoom: number;
        iconSvg: any;
        iconShape: string;
    };
    export const DISTRIBUTED_MOSQUITO_POINTS: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        dataLoadType: string;
        matchLocationType: string;
        iconSvg: any;
        iconShape: string;
        focusZoom: number;
    };
    export const DISTRIBUTED_PLOTS_SAMPLING_POINTS: {
        name: string;
        type: string;
        minZoom: number;
        description: string;
        parent: string;
    };
    export const DISTRIBUTED_BIRD_GRID_POINTS: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        parentDataFeatureKey: string;
        dataLoadType: string;
        minZoom: number;
        featureShape: string;
        style: {
            color: string;
        };
    };
    export const DISTRIBUTED_MAMMAL_GRID_POINTS: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        parentDataFeatureKey: string;
        dataLoadType: string;
        minZoom: number;
        featureShape: string;
        style: {
            color: string;
        };
    };
    export const DISTRIBUTED_TICK_PLOT_POINTS: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        parentDataFeatureKey: string;
        dataLoadType: string;
        minZoom: number;
        featureShape: string;
        style: {
            color: string;
        };
    };
    export const AQUATIC_SITE_FEATURES: {
        name: string;
        type: string;
        minZoom: number;
        description: string;
    };
    export const AQUATIC_BENCHMARKS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
    };
    export const AQUATIC_AUTOMATED_INSTRUMENTS: {
        name: string;
        type: string;
        minZoom: number;
        description: string;
        parent: string;
    };
    export const AQUATIC_OBSERVATIONAL_SAMPLING: {
        name: string;
        type: string;
        minZoom: number;
        description: string;
        parent: string;
    };
    export const AQUATIC_RIPARIAN_ASSESSMENTS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconSvg: any;
        iconShape: string;
    };
    export const AQUATIC_WET_DEPOSITION_POINTS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
    };
    export const AQUATIC_GROUNDWATER_WELLS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
    };
    export const AQUATIC_METEOROLOGICAL_STATIONS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
    };
    export const AQUATIC_DISCHARGE_POINTS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconSvg: any;
        iconShape: string;
    };
    export const AQUATIC_FISH_POINTS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconSvg: any;
        iconShape: string;
    };
    export const AQUATIC_PLANT_TRANSECTS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
    };
    export const AQUATIC_SEDIMENT_POINTS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconSvg: any;
        iconShape: string;
    };
    export const AQUATIC_STAFF_GAUGES: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconSvg: any;
        iconShape: string;
    };
    export const AQUATIC_SENSOR_STATIONS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: RegExp;
        description: string;
        parent: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
    };
    export const AQUATIC_BUOYS: {
        name: string;
        nameSingular: string;
        type: string;
        minZoom: number;
        dataLoadType: string;
        matchLocationType: string;
        description: string;
        parent: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
    };
    export const SITE_MARKERS: {
        name: string;
        type: string;
        description: string;
        maxZoom: number;
    };
    export const TERRESTRIAL_CORE_SITES: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        attributes: {
            type: string;
            terrain: string;
        };
        dataLoadType: string;
        primaryIdOnly: boolean;
        iconScale: number;
        iconSvg: any;
        iconSelectedSvg: any;
        iconShape: string;
    };
    export const TERRESTRIAL_RELOCATABLE_SITES: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        attributes: {
            type: string;
            terrain: string;
        };
        dataLoadType: string;
        primaryIdOnly: boolean;
        iconScale: number;
        iconSvg: any;
        iconSelectedSvg: any;
        iconShape: string;
    };
    export const AQUATIC_CORE_SITES: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        attributes: {
            type: string;
            terrain: string;
        };
        dataLoadType: string;
        primaryIdOnly: boolean;
        iconScale: number;
        iconSvg: any;
        iconSelectedSvg: any;
        iconShape: string;
    };
    export const AQUATIC_RELOCATABLE_SITES: {
        name: string;
        nameSingular: string;
        type: string;
        description: string;
        parent: string;
        attributes: {
            type: string;
            terrain: string;
        };
        dataLoadType: string;
        primaryIdOnly: boolean;
        iconScale: number;
        iconSvg: any;
        iconSelectedSvg: any;
        iconShape: string;
    };
}
export namespace BOUNDARY_COLORS {
    export const partialSelected: string;
    export const totalSelected: string;
    export const hover: string;
}
export function calculateFeatureAvailability(state: any): any;
/**
   URL Bases
   Used in construction of URLs when linking out to other pages
*/
export const SITE_DETAILS_URL_BASE: "https://www.neonscience.org/field-sites/field-sites-map/";
export const EXPLORE_DATA_PRODUCTS_URL_BASE: "https://data.neonscience.org/data-products/explore?site=";
export namespace TILE_LAYERS {
    export namespace NATGEO_WORLD_MAP {
        export const KEY: string;
        export const name: string;
        export const shortAttribution: string;
        export const fullAttribution: string;
        export const url: string;
    }
    export namespace WORLD_IMAGERY {
        const KEY_1: string;
        export { KEY_1 as KEY };
        const name_1: string;
        export { name_1 as name };
        const shortAttribution_1: string;
        export { shortAttribution_1 as shortAttribution };
        const fullAttribution_1: string;
        export { fullAttribution_1 as fullAttribution };
        const url_1: string;
        export { url_1 as url };
    }
    export namespace WORLD_STREET_MAP {
        const KEY_2: string;
        export { KEY_2 as KEY };
        const name_2: string;
        export { name_2 as name };
        const shortAttribution_2: string;
        export { shortAttribution_2 as shortAttribution };
        const fullAttribution_2: string;
        export { fullAttribution_2 as fullAttribution };
        const url_2: string;
        export { url_2 as url };
    }
    export namespace WORLD_TOPO_MAP {
        const KEY_3: string;
        export { KEY_3 as KEY };
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
export const TILE_LAYERS_BY_NAME: {};
export namespace DEFAULT_STATE {
    export namespace filters {
        export namespace features {
            export const available: any;
        }
    }
}
export function hydrateNeonContextData(state: any, neonContextData: any): any;
export namespace SITE_MAP_PROP_TYPES {
    export const view: PropTypes.Requireable<string>;
    export const aspectRatio: PropTypes.Requireable<number>;
    export const filterPosition: PropTypes.Requireable<string>;
    export const unusableVerticalSpace: PropTypes.Requireable<number>;
    export const mapCenter: PropTypes.Requireable<(number | null | undefined)[]>;
    export const mapZoom: PropTypes.Requireable<number>;
    export const mapTileLayer: PropTypes.Requireable<string>;
    export const location: PropTypes.Requireable<string>;
    export const selection: PropTypes.Requireable<string>;
    export const maxSelectable: PropTypes.Requireable<number>;
    export const search: PropTypes.Requireable<string>;
    export const features: PropTypes.Requireable<import("../../types/coreTypes").Nullable<string>[]>;
}
export namespace SITE_MAP_DEFAULT_PROPS {
    const view_1: string;
    export { view_1 as view };
    const aspectRatio_1: null;
    export { aspectRatio_1 as aspectRatio };
    const filterPosition_1: string;
    export { filterPosition_1 as filterPosition };
    const unusableVerticalSpace_1: number;
    export { unusableVerticalSpace_1 as unusableVerticalSpace };
    const mapCenter_1: number[];
    export { mapCenter_1 as mapCenter };
    const mapZoom_1: null;
    export { mapZoom_1 as mapZoom };
    const mapTileLayer_1: string;
    export { mapTileLayer_1 as mapTileLayer };
    const location_1: null;
    export { location_1 as location };
    const selection_1: null;
    export { selection_1 as selection };
    const maxSelectable_1: null;
    export { maxSelectable_1 as maxSelectable };
    const search_1: null;
    export { search_1 as search };
    const features_1: null;
    export { features_1 as features };
}
export function getDynamicAspectRatio(unusableVerticalSpace?: number): number;
export function parseLocationData(data?: {}): {
    type: any;
    description: any;
    siteCode: any;
    children: any;
};
export function parseLocationHierarchy(inHierarchy: any, parent?: any): {};
export function getZoomedIcons(zoom: any): {};
export function getMapStateForFocusLocation(state?: {}): any;
export function boundsAreValid(bounds: any): boolean;
export function calculateLocationsInMap(locations: any, bounds?: any, buffer?: boolean): string[];
import PropTypes from "prop-types";
