export function isCoord(c: any): boolean;
export const MAP_ZOOM_RANGE: number[];
export const OBSERVATORY_CENTER: number[];
export const MAP_ZOOM_DEFAULT: 2;
export const MIN_CONTAINER_HEIGHT: 300;
export const MIN_TABLE_MAX_BODY_HEIGHT: 100;
export const KM2_TO_ACRES: 247.10538146717;
export const LOCATION_BOUNDS_SAMPLING_MAX: 10000;
export const SITE_LOCATION_HIERARCHIES_MIN_ZOOM: 9;
export namespace SORT_DIRECTIONS {
    let ASC: string;
    let DESC: string;
}
export namespace SITE_TERRAINS {
    let AQUATIC: string;
    let TERRESTRIAL: string;
}
export namespace MANUAL_LOCATION_TYPES {
    let PROTOTYPE_SITE: string;
}
export const LEAFLET_ATTR_PREFIX: "\n<a href=\"https://leafletjs.com\" title=\"A JS library for interactive maps\">Leaflet</a>\n";
export namespace FEATURE_TYPES {
    namespace SITES {
        let unit: string;
        let units: string;
        let selectable: boolean;
        let viewableInTable: boolean;
        let deriveRegionSelections: boolean;
    }
    namespace SITE_LOCATION_HIERARCHIES {
        let selectable_1: boolean;
        export { selectable_1 as selectable };
    }
    namespace LOCATIONS {
        let selectable_2: boolean;
        export { selectable_2 as selectable };
        let viewableInTable_1: boolean;
        export { viewableInTable_1 as viewableInTable };
    }
    namespace SAMPLING_POINTS {
        let selectable_3: boolean;
        export { selectable_3 as selectable };
    }
    namespace BOUNDARIES {
        let selectable_4: boolean;
        export { selectable_4 as selectable };
    }
    namespace DOMAINS {
        let unit_1: string;
        export { unit_1 as unit };
        let units_1: string;
        export { units_1 as units };
        let selectable_5: boolean;
        export { selectable_5 as selectable };
        let viewableInTable_2: boolean;
        export { viewableInTable_2 as viewableInTable };
    }
    namespace STATES {
        let unit_2: string;
        export { unit_2 as unit };
        let units_2: string;
        export { units_2 as units };
        let selectable_6: boolean;
        export { selectable_6 as selectable };
        let viewableInTable_3: boolean;
        export { viewableInTable_3 as viewableInTable };
    }
    namespace GROUP {
        let selectable_7: boolean;
        export { selectable_7 as selectable };
    }
    namespace OTHER {
        let selectable_8: boolean;
        export { selectable_8 as selectable };
    }
}
export namespace FEATURE_DATA_SOURCES {
    let REST_LOCATIONS_API: string;
    let GRAPHQL_LOCATIONS_API: string;
    let ARCGIS_ASSETS_API: string;
    let NEON_CONTEXT: string;
    let MANUAL_LOCATIONS: string;
}
export namespace SELECTION_PORTIONS {
    let PARTIAL: string;
    let TOTAL: string;
}
export namespace SELECTION_STATUS {
    let SELECTED: string;
    let UNSELECTED: string;
}
export const UNSELECTABLE_MARKER_FILTER: "sepia(0.8) contrast(0.3) brightness(1.35)";
export namespace HIGHLIGHT_STATUS {
    let NONE: string;
    let HIGHLIGHT: string;
    let SELECT: string;
}
export namespace VIEWS {
    let MAP: string;
    let TABLE: string;
    let SPLIT: string;
}
export namespace MAP_MOUSE_MODES {
    let PAN: string;
    let AREA_SELECT: string;
}
export namespace FETCH_STATUS {
    let AWAITING_CALL: string;
    let FETCHING: string;
    let ERROR: string;
    let SUCCESS: string;
}
export namespace PLOT_SAMPLING_MODULES {
    let bbc: string;
    let bet: string;
    let bgc: string;
    let brd: string;
    let cdw: string;
    let cfc: string;
    let dhp: string;
    let div: string;
    let hbp: string;
    let ltr: string;
    let mam: string;
    let mfb: string;
    let mos: string;
    let mpt: string;
    let phe: string;
    let sme: string;
    let tck: string;
    let vst: string;
}
export namespace NLCD_CLASSES {
    namespace openWater {
        let name: string;
        let value: number;
        let description: string;
        let color: string;
        let category: string;
    }
    namespace perennialIceSnow {
        let name_1: string;
        export { name_1 as name };
        export let vaule: number;
        let description_1: string;
        export { description_1 as description };
        let color_1: string;
        export { color_1 as color };
        let category_1: string;
        export { category_1 as category };
    }
    namespace developedOpenSpace {
        let name_2: string;
        export { name_2 as name };
        let value_1: number;
        export { value_1 as value };
        let description_2: string;
        export { description_2 as description };
        let color_2: string;
        export { color_2 as color };
        let category_2: string;
        export { category_2 as category };
    }
    namespace developedLowIntensity {
        let name_3: string;
        export { name_3 as name };
        let value_2: number;
        export { value_2 as value };
        let description_3: string;
        export { description_3 as description };
        let color_3: string;
        export { color_3 as color };
        let category_3: string;
        export { category_3 as category };
    }
    namespace developedMediumIntensity {
        let name_4: string;
        export { name_4 as name };
        let value_3: number;
        export { value_3 as value };
        let description_4: string;
        export { description_4 as description };
        let color_4: string;
        export { color_4 as color };
        let category_4: string;
        export { category_4 as category };
    }
    namespace developedHighIntensity {
        let name_5: string;
        export { name_5 as name };
        let value_4: number;
        export { value_4 as value };
        let description_5: string;
        export { description_5 as description };
        let color_5: string;
        export { color_5 as color };
        let category_5: string;
        export { category_5 as category };
    }
    namespace barrenLand {
        let name_6: string;
        export { name_6 as name };
        let value_5: number;
        export { value_5 as value };
        let description_6: string;
        export { description_6 as description };
        let color_6: string;
        export { color_6 as color };
        let category_6: string;
        export { category_6 as category };
    }
    namespace deciduousForest {
        let name_7: string;
        export { name_7 as name };
        let value_6: number;
        export { value_6 as value };
        let description_7: string;
        export { description_7 as description };
        let color_7: string;
        export { color_7 as color };
        let category_7: string;
        export { category_7 as category };
    }
    namespace evergreenForest {
        let name_8: string;
        export { name_8 as name };
        let value_7: number;
        export { value_7 as value };
        let description_8: string;
        export { description_8 as description };
        let color_8: string;
        export { color_8 as color };
        let category_8: string;
        export { category_8 as category };
    }
    namespace mixedForest {
        let name_9: string;
        export { name_9 as name };
        let value_8: number;
        export { value_8 as value };
        let description_9: string;
        export { description_9 as description };
        let color_9: string;
        export { color_9 as color };
        let category_9: string;
        export { category_9 as category };
    }
    namespace dwarfScrub {
        let name_10: string;
        export { name_10 as name };
        let value_9: number;
        export { value_9 as value };
        let description_10: string;
        export { description_10 as description };
        let color_10: string;
        export { color_10 as color };
        let category_10: string;
        export { category_10 as category };
    }
    namespace shrubScrub {
        let name_11: string;
        export { name_11 as name };
        let value_10: number;
        export { value_10 as value };
        let description_11: string;
        export { description_11 as description };
        let color_11: string;
        export { color_11 as color };
        let category_11: string;
        export { category_11 as category };
    }
    namespace grasslandHerbaceous {
        let name_12: string;
        export { name_12 as name };
        let value_11: number;
        export { value_11 as value };
        let description_12: string;
        export { description_12 as description };
        let color_12: string;
        export { color_12 as color };
        let category_12: string;
        export { category_12 as category };
    }
    namespace sedgeHerbaceous {
        let name_13: string;
        export { name_13 as name };
        let value_12: number;
        export { value_12 as value };
        let description_13: string;
        export { description_13 as description };
        let color_13: string;
        export { color_13 as color };
        let category_13: string;
        export { category_13 as category };
    }
    namespace lichens {
        let name_14: string;
        export { name_14 as name };
        let value_13: number;
        export { value_13 as value };
        let description_14: string;
        export { description_14 as description };
        let color_14: string;
        export { color_14 as color };
        let category_14: string;
        export { category_14 as category };
    }
    namespace moss {
        let name_15: string;
        export { name_15 as name };
        let value_14: number;
        export { value_14 as value };
        let description_15: string;
        export { description_15 as description };
        let color_15: string;
        export { color_15 as color };
        let category_15: string;
        export { category_15 as category };
    }
    namespace pastureHay {
        let name_16: string;
        export { name_16 as name };
        let value_15: number;
        export { value_15 as value };
        let description_16: string;
        export { description_16 as description };
        let color_16: string;
        export { color_16 as color };
        let category_16: string;
        export { category_16 as category };
    }
    namespace cultivatedCrops {
        let name_17: string;
        export { name_17 as name };
        let value_16: number;
        export { value_16 as value };
        let description_17: string;
        export { description_17 as description };
        let color_17: string;
        export { color_17 as color };
        let category_17: string;
        export { category_17 as category };
    }
    namespace woodyWetlands {
        let name_18: string;
        export { name_18 as name };
        let value_17: number;
        export { value_17 as value };
        let description_18: string;
        export { description_18 as description };
        let color_18: string;
        export { color_18 as color };
        let category_18: string;
        export { category_18 as category };
    }
    namespace emergentHerbaceousWetlands {
        let name_19: string;
        export { name_19 as name };
        let value_18: number;
        export { value_18 as value };
        let description_19: string;
        export { description_19 as description };
        let color_19: string;
        export { color_19 as color };
        let category_19: string;
        export { category_19 as category };
    }
}
export namespace LOCATION_ICON_SVG_SHAPES {
    namespace CIRCLE {
        let KEY: string;
        let iconSize: number[];
        let iconAnchor: number[];
        let popupAnchor: number[];
        let shadow: {
            [x: string]: {
                svg: any;
                size: number[];
                anchor: number[];
            };
        };
    }
    namespace DIAMOND {
        let KEY_1: string;
        export { KEY_1 as KEY };
        let iconSize_1: number[];
        export { iconSize_1 as iconSize };
        let iconAnchor_1: number[];
        export { iconAnchor_1 as iconAnchor };
        let popupAnchor_1: number[];
        export { popupAnchor_1 as popupAnchor };
        let shadow_1: {
            [x: string]: {
                svg: any;
                size: number[];
                anchor: number[];
            };
        };
        export { shadow_1 as shadow };
    }
    namespace HOMEPLATE {
        let KEY_2: string;
        export { KEY_2 as KEY };
        let iconSize_2: number[];
        export { iconSize_2 as iconSize };
        let iconAnchor_2: number[];
        export { iconAnchor_2 as iconAnchor };
        let popupAnchor_2: number[];
        export { popupAnchor_2 as popupAnchor };
        let shadow_2: {
            [x: string]: {
                svg: any;
                size: number[];
                anchor: number[];
            };
        };
        export { shadow_2 as shadow };
    }
    namespace SQUARE {
        let KEY_3: string;
        export { KEY_3 as KEY };
        let iconSize_3: number[];
        export { iconSize_3 as iconSize };
        let iconAnchor_3: number[];
        export { iconAnchor_3 as iconAnchor };
        let popupAnchor_3: number[];
        export { popupAnchor_3 as popupAnchor };
        let shadow_3: {
            [x: string]: {
                svg: any;
                size: number[];
                anchor: number[];
            };
        };
        export { shadow_3 as shadow };
    }
}
export namespace FEATURES {
    export namespace STATES_1 {
        let name_20: string;
        export { name_20 as name };
        export let nameSingular: string;
        export let type: any;
        export let hideByDefault: boolean;
        import dataSource = FEATURE_DATA_SOURCES.NEON_CONTEXT;
        export { dataSource };
        export let primaryIdOnly: boolean;
        export let featureShape: string;
        export namespace style {
            let color_20: string;
            export { color_20 as color };
            export let weight: number;
        }
        export let generalLegendGroup: boolean;
    }
    export { STATES_1 as STATES };
    export namespace DOMAINS_1 {
        let name_21: string;
        export { name_21 as name };
        let nameSingular_1: string;
        export { nameSingular_1 as nameSingular };
        let type_1: any;
        export { type_1 as type };
        let hideByDefault_1: boolean;
        export { hideByDefault_1 as hideByDefault };
        import dataSource_1 = FEATURE_DATA_SOURCES.NEON_CONTEXT;
        export { dataSource_1 as dataSource };
        let primaryIdOnly_1: boolean;
        export { primaryIdOnly_1 as primaryIdOnly };
        let featureShape_1: string;
        export { featureShape_1 as featureShape };
        export let matchLocationType: string;
        export let amplifyHighlighted: boolean;
        export namespace style_1 {
            let color_21: string;
            export { color_21 as color };
            let weight_1: number;
            export { weight_1 as weight };
        }
        export { style_1 as style };
    }
    export { DOMAINS_1 as DOMAINS };
    export namespace FLIGHT_BOX_BOUNDARIES {
        let name_22: string;
        export { name_22 as name };
        let nameSingular_2: string;
        export { nameSingular_2 as nameSingular };
        let type_2: any;
        export { type_2 as type };
        export let minZoom: number;
        import dataSource_2 = FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API;
        export { dataSource_2 as dataSource };
        let featureShape_2: string;
        export { featureShape_2 as featureShape };
        export namespace style_2 {
            let color_22: string;
            export { color_22 as color };
            export let dashArray: string;
        }
        export { style_2 as style };
    }
    export namespace AQUATIC_WATERSHEDS {
        let name_23: string;
        export { name_23 as name };
        let type_3: any;
        export { type_3 as type };
        let minZoom_1: number;
        export { minZoom_1 as minZoom };
    }
    export namespace WATERSHED_BOUNDARIES {
        let name_24: string;
        export { name_24 as name };
        let nameSingular_3: string;
        export { nameSingular_3 as nameSingular };
        let type_4: any;
        export { type_4 as type };
        let minZoom_2: number;
        export { minZoom_2 as minZoom };
        import dataSource_3 = FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API;
        export { dataSource_3 as dataSource };
        export let parent: string;
        let featureShape_3: string;
        export { featureShape_3 as featureShape };
        export namespace style_3 {
            let color_23: string;
            export { color_23 as color };
            let dashArray_1: string;
            export { dashArray_1 as dashArray };
        }
        export { style_3 as style };
    }
    export namespace DRAINAGE_LINES {
        let name_25: string;
        export { name_25 as name };
        let type_5: any;
        export { type_5 as type };
        let minZoom_3: number;
        export { minZoom_3 as minZoom };
        import dataSource_4 = FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API;
        export { dataSource_4 as dataSource };
        let parent_1: string;
        export { parent_1 as parent };
        let featureShape_4: string;
        export { featureShape_4 as featureShape };
        export namespace style_4 {
            let color_24: string;
            export { color_24 as color };
        }
        export { style_4 as style };
    }
    export namespace POUR_POINTS {
        let name_26: string;
        export { name_26 as name };
        let nameSingular_4: string;
        export { nameSingular_4 as nameSingular };
        let type_6: any;
        export { type_6 as type };
        let minZoom_4: number;
        export { minZoom_4 as minZoom };
        import dataSource_5 = FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API;
        export { dataSource_5 as dataSource };
        let parent_2: string;
        export { parent_2 as parent };
        let featureShape_5: string;
        export { featureShape_5 as featureShape };
        export let iconSvg: any;
        import iconShape = KEY;
        export { iconShape };
    }
    export namespace SAMPLING_BOUNDARIES {
        let name_27: string;
        export { name_27 as name };
        let nameSingular_5: string;
        export { nameSingular_5 as nameSingular };
        let type_7: any;
        export { type_7 as type };
        let minZoom_5: number;
        export { minZoom_5 as minZoom };
        import dataSource_6 = FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API;
        export { dataSource_6 as dataSource };
        let description_20: string;
        export { description_20 as description };
        let parent_3: string;
        export { parent_3 as parent };
        let featureShape_6: string;
        export { featureShape_6 as featureShape };
        export namespace style_5 {
            let color_25: string;
            export { color_25 as color };
            let dashArray_2: string;
            export { dashArray_2 as dashArray };
        }
        export { style_5 as style };
    }
    export namespace AQUATIC_REACHES {
        let name_28: string;
        export { name_28 as name };
        let nameSingular_6: string;
        export { nameSingular_6 as nameSingular };
        let type_8: any;
        export { type_8 as type };
        let minZoom_6: number;
        export { minZoom_6 as minZoom };
        import dataSource_7 = FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API;
        export { dataSource_7 as dataSource };
        let parent_4: string;
        export { parent_4 as parent };
        let featureShape_7: string;
        export { featureShape_7 as featureShape };
        export namespace style_6 {
            let color_26: string;
            export { color_26 as color };
            let dashArray_3: string;
            export { dashArray_3 as dashArray };
        }
        export { style_6 as style };
    }
    export namespace TOWER_AIRSHEDS {
        let name_29: string;
        export { name_29 as name };
        let nameSingular_7: string;
        export { nameSingular_7 as nameSingular };
        let type_9: any;
        export { type_9 as type };
        let minZoom_7: number;
        export { minZoom_7 as minZoom };
        import dataSource_8 = FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API;
        export { dataSource_8 as dataSource };
        let parent_5: string;
        export { parent_5 as parent };
        let featureShape_8: string;
        export { featureShape_8 as featureShape };
        export namespace style_7 {
            let color_27: string;
            export { color_27 as color };
            let dashArray_4: string;
            export { dashArray_4 as dashArray };
        }
        export { style_7 as style };
    }
    export namespace TERRESTRIAL_SITE_FEATURES {
        let name_30: string;
        export { name_30 as name };
        let type_10: any;
        export { type_10 as type };
        let minZoom_8: number;
        export { minZoom_8 as minZoom };
        export let fetchingForFeatures: string[];
    }
    export namespace TOWERS {
        let name_31: string;
        export { name_31 as name };
        let nameSingular_8: string;
        export { nameSingular_8 as nameSingular };
        let type_11: any;
        export { type_11 as type };
        let minZoom_9: number;
        export { minZoom_9 as minZoom };
        import dataSource_9 = FEATURE_DATA_SOURCES.REST_LOCATIONS_API;
        export { dataSource_9 as dataSource };
        let matchLocationType_1: string;
        export { matchLocationType_1 as matchLocationType };
        let parent_6: string;
        export { parent_6 as parent };
        let featureShape_9: string;
        export { featureShape_9 as featureShape };
        export let iconScale: number;
        let iconSvg_1: any;
        export { iconSvg_1 as iconSvg };
        import iconShape_1 = KEY;
        export { iconShape_1 as iconShape };
        import siteTerrain = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain };
    }
    export namespace HUTS {
        let name_32: string;
        export { name_32 as name };
        let nameSingular_9: string;
        export { nameSingular_9 as nameSingular };
        let type_12: any;
        export { type_12 as type };
        let minZoom_10: number;
        export { minZoom_10 as minZoom };
        import dataSource_10 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_10 as dataSource };
        let matchLocationType_2: string;
        export { matchLocationType_2 as matchLocationType };
        let parent_7: string;
        export { parent_7 as parent };
        let featureShape_10: string;
        export { featureShape_10 as featureShape };
        let iconScale_1: number;
        export { iconScale_1 as iconScale };
        let iconSvg_2: any;
        export { iconSvg_2 as iconSvg };
        import iconShape_2 = KEY;
        export { iconShape_2 as iconShape };
        import siteTerrain_1 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_1 as siteTerrain };
    }
    export namespace MEGAPITS {
        let name_33: string;
        export { name_33 as name };
        let nameSingular_10: string;
        export { nameSingular_10 as nameSingular };
        let type_13: any;
        export { type_13 as type };
        let minZoom_11: number;
        export { minZoom_11 as minZoom };
        import dataSource_11 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_11 as dataSource };
        let matchLocationType_3: string;
        export { matchLocationType_3 as matchLocationType };
        let parent_8: string;
        export { parent_8 as parent };
        let featureShape_11: string;
        export { featureShape_11 as featureShape };
        let iconScale_2: number;
        export { iconScale_2 as iconScale };
        let iconSvg_3: any;
        export { iconSvg_3 as iconSvg };
        import iconShape_3 = KEY;
        export { iconShape_3 as iconShape };
        import siteTerrain_2 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_2 as siteTerrain };
    }
    export namespace TOWER_PLOTS {
        let name_34: string;
        export { name_34 as name };
        let type_14: any;
        export { type_14 as type };
        let minZoom_12: number;
        export { minZoom_12 as minZoom };
        let description_21: string;
        export { description_21 as description };
        let parent_9: string;
        export { parent_9 as parent };
    }
    export namespace TOWER_PHENOLOGY_PLOTS {
        let name_35: string;
        export { name_35 as name };
        let nameSingular_11: string;
        export { nameSingular_11 as nameSingular };
        let type_15: any;
        export { type_15 as type };
        let description_22: string;
        export { description_22 as description };
        let parent_10: string;
        export { parent_10 as parent };
        import dataSource_12 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_12 as dataSource };
        let matchLocationType_4: string;
        export { matchLocationType_4 as matchLocationType };
        let featureShape_12: string;
        export { featureShape_12 as featureShape };
        let minZoom_13: number;
        export { minZoom_13 as minZoom };
        export let focusZoom: number;
        let iconScale_3: number;
        export { iconScale_3 as iconScale };
        let iconSvg_4: any;
        export { iconSvg_4 as iconSvg };
        import iconShape_4 = KEY;
        export { iconShape_4 as iconShape };
        import siteTerrain_3 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_3 as siteTerrain };
    }
    export namespace TOWER_BASE_PLOTS {
        let name_36: string;
        export { name_36 as name };
        let nameSingular_12: string;
        export { nameSingular_12 as nameSingular };
        let type_16: any;
        export { type_16 as type };
        let description_23: string;
        export { description_23 as description };
        let parent_11: string;
        export { parent_11 as parent };
        import dataSource_13 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_13 as dataSource };
        let matchLocationType_5: string;
        export { matchLocationType_5 as matchLocationType };
        let featureShape_13: string;
        export { featureShape_13 as featureShape };
        let minZoom_14: number;
        export { minZoom_14 as minZoom };
        let focusZoom_1: number;
        export { focusZoom_1 as focusZoom };
        let iconSvg_5: any;
        export { iconSvg_5 as iconSvg };
        import iconShape_5 = KEY;
        export { iconShape_5 as iconShape };
        import siteTerrain_4 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_4 as siteTerrain };
    }
    export namespace TOWER_SOIL_PLOTS {
        let name_37: string;
        export { name_37 as name };
        let nameSingular_13: string;
        export { nameSingular_13 as nameSingular };
        let type_17: any;
        export { type_17 as type };
        import dataSource_14 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_14 as dataSource };
        let matchLocationType_6: string;
        export { matchLocationType_6 as matchLocationType };
        let description_24: string;
        export { description_24 as description };
        let parent_12: string;
        export { parent_12 as parent };
        let featureShape_14: string;
        export { featureShape_14 as featureShape };
        let minZoom_15: number;
        export { minZoom_15 as minZoom };
        let focusZoom_2: number;
        export { focusZoom_2 as focusZoom };
        let iconScale_4: number;
        export { iconScale_4 as iconScale };
        let iconSvg_6: any;
        export { iconSvg_6 as iconSvg };
        import iconShape_6 = KEY;
        export { iconShape_6 as iconShape };
        import siteTerrain_5 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_5 as siteTerrain };
    }
    export namespace DISTRIBUTED_PLOTS {
        let name_38: string;
        export { name_38 as name };
        let type_18: any;
        export { type_18 as type };
        let minZoom_16: number;
        export { minZoom_16 as minZoom };
        let description_25: string;
        export { description_25 as description };
        let parent_13: string;
        export { parent_13 as parent };
    }
    export namespace DISTRIBUTED_BIRD_GRIDS {
        let name_39: string;
        export { name_39 as name };
        let nameSingular_14: string;
        export { nameSingular_14 as nameSingular };
        let type_19: any;
        export { type_19 as type };
        let description_26: string;
        export { description_26 as description };
        let parent_14: string;
        export { parent_14 as parent };
        import dataSource_15 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_15 as dataSource };
        let matchLocationType_7: string;
        export { matchLocationType_7 as matchLocationType };
        let featureShape_15: string;
        export { featureShape_15 as featureShape };
        let iconScale_5: number;
        export { iconScale_5 as iconScale };
        let focusZoom_3: number;
        export { focusZoom_3 as focusZoom };
        let iconSvg_7: any;
        export { iconSvg_7 as iconSvg };
        import iconShape_7 = KEY;
        export { iconShape_7 as iconShape };
        import siteTerrain_6 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_6 as siteTerrain };
    }
    export namespace DISTRIBUTED_MAMMAL_GRIDS {
        let name_40: string;
        export { name_40 as name };
        let nameSingular_15: string;
        export { nameSingular_15 as nameSingular };
        let type_20: any;
        export { type_20 as type };
        let description_27: string;
        export { description_27 as description };
        let parent_15: string;
        export { parent_15 as parent };
        import dataSource_16 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_16 as dataSource };
        let matchLocationType_8: string;
        export { matchLocationType_8 as matchLocationType };
        let featureShape_16: string;
        export { featureShape_16 as featureShape };
        let iconScale_6: number;
        export { iconScale_6 as iconScale };
        let focusZoom_4: number;
        export { focusZoom_4 as focusZoom };
        let iconSvg_8: any;
        export { iconSvg_8 as iconSvg };
        import iconShape_8 = KEY;
        export { iconShape_8 as iconShape };
        import siteTerrain_7 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_7 as siteTerrain };
    }
    export namespace DISTRIBUTED_BASE_PLOTS {
        let name_41: string;
        export { name_41 as name };
        let nameSingular_16: string;
        export { nameSingular_16 as nameSingular };
        let type_21: any;
        export { type_21 as type };
        let description_28: string;
        export { description_28 as description };
        let parent_16: string;
        export { parent_16 as parent };
        let featureShape_17: string;
        export { featureShape_17 as featureShape };
        import dataSource_17 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_17 as dataSource };
        let matchLocationType_9: string;
        export { matchLocationType_9 as matchLocationType };
        let iconScale_7: number;
        export { iconScale_7 as iconScale };
        let focusZoom_5: number;
        export { focusZoom_5 as focusZoom };
        let iconSvg_9: any;
        export { iconSvg_9 as iconSvg };
        import iconShape_9 = KEY;
        export { iconShape_9 as iconShape };
        import siteTerrain_8 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_8 as siteTerrain };
    }
    export namespace DISTRIBUTED_TICK_PLOTS {
        let name_42: string;
        export { name_42 as name };
        let nameSingular_17: string;
        export { nameSingular_17 as nameSingular };
        let type_22: any;
        export { type_22 as type };
        let description_29: string;
        export { description_29 as description };
        let parent_17: string;
        export { parent_17 as parent };
        import dataSource_18 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_18 as dataSource };
        let matchLocationType_10: string;
        export { matchLocationType_10 as matchLocationType };
        let featureShape_18: string;
        export { featureShape_18 as featureShape };
        let iconScale_8: number;
        export { iconScale_8 as iconScale };
        let focusZoom_6: number;
        export { focusZoom_6 as focusZoom };
        let iconSvg_10: any;
        export { iconSvg_10 as iconSvg };
        import iconShape_10 = KEY;
        export { iconShape_10 as iconShape };
        import siteTerrain_9 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_9 as siteTerrain };
    }
    export namespace DISTRIBUTED_MOSQUITO_POINTS {
        let name_43: string;
        export { name_43 as name };
        let nameSingular_18: string;
        export { nameSingular_18 as nameSingular };
        let type_23: any;
        export { type_23 as type };
        let description_30: string;
        export { description_30 as description };
        let parent_18: string;
        export { parent_18 as parent };
        import dataSource_19 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_19 as dataSource };
        let matchLocationType_11: string;
        export { matchLocationType_11 as matchLocationType };
        let iconSvg_11: any;
        export { iconSvg_11 as iconSvg };
        import iconShape_11 = KEY;
        export { iconShape_11 as iconShape };
        let featureShape_19: string;
        export { featureShape_19 as featureShape };
        let focusZoom_7: number;
        export { focusZoom_7 as focusZoom };
        import siteTerrain_10 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_10 as siteTerrain };
    }
    export namespace PLOT_BOUNDARIES {
        let name_44: string;
        export { name_44 as name };
        let type_24: any;
        export { type_24 as type };
        let minZoom_17: number;
        export { minZoom_17 as minZoom };
        let description_31: string;
        export { description_31 as description };
        let parent_19: string;
        export { parent_19 as parent };
    }
    export namespace TOWER_PHENOLOGY_PLOT_BOUNDARIES {
        let name_45: string;
        export { name_45 as name };
        let nameSingular_19: string;
        export { nameSingular_19 as nameSingular };
        let type_25: any;
        export { type_25 as type };
        export let descriptionFromParentDataFeatureKey: boolean;
        let parent_20: string;
        export { parent_20 as parent };
        export let parentDataFeatureKey: string;
        import dataSource_20 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_20 as dataSource };
        export let matchLocationName: RegExp;
        export let matchLocationCoordinateMap: string[];
        let minZoom_18: number;
        export { minZoom_18 as minZoom };
        let featureShape_20: string;
        export { featureShape_20 as featureShape };
        export namespace style_8 {
            let color_28: string;
            export { color_28 as color };
            let dashArray_5: string;
            export { dashArray_5 as dashArray };
        }
        export { style_8 as style };
        import siteTerrain_11 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_11 as siteTerrain };
    }
    export namespace TOWER_SOIL_PLOT_BOUNDARIES {
        let name_46: string;
        export { name_46 as name };
        let nameSingular_20: string;
        export { nameSingular_20 as nameSingular };
        let type_26: any;
        export { type_26 as type };
        let descriptionFromParentDataFeatureKey_1: boolean;
        export { descriptionFromParentDataFeatureKey_1 as descriptionFromParentDataFeatureKey };
        let parent_21: string;
        export { parent_21 as parent };
        let parentDataFeatureKey_1: string;
        export { parentDataFeatureKey_1 as parentDataFeatureKey };
        let minZoom_19: number;
        export { minZoom_19 as minZoom };
        let featureShape_21: string;
        export { featureShape_21 as featureShape };
        export namespace style_9 {
            let color_29: string;
            export { color_29 as color };
            let dashArray_6: string;
            export { dashArray_6 as dashArray };
        }
        export { style_9 as style };
    }
    export namespace DISTRIBUTED_BIRD_GRID_BOUNDARIES {
        let name_47: string;
        export { name_47 as name };
        let nameSingular_21: string;
        export { nameSingular_21 as nameSingular };
        let type_27: any;
        export { type_27 as type };
        let descriptionFromParentDataFeatureKey_2: boolean;
        export { descriptionFromParentDataFeatureKey_2 as descriptionFromParentDataFeatureKey };
        let parent_22: string;
        export { parent_22 as parent };
        let parentDataFeatureKey_2: string;
        export { parentDataFeatureKey_2 as parentDataFeatureKey };
        import dataSource_21 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_21 as dataSource };
        let matchLocationName_1: RegExp;
        export { matchLocationName_1 as matchLocationName };
        let matchLocationCoordinateMap_1: string[];
        export { matchLocationCoordinateMap_1 as matchLocationCoordinateMap };
        let minZoom_20: number;
        export { minZoom_20 as minZoom };
        let featureShape_22: string;
        export { featureShape_22 as featureShape };
        export namespace style_10 {
            let color_30: string;
            export { color_30 as color };
            let dashArray_7: string;
            export { dashArray_7 as dashArray };
        }
        export { style_10 as style };
        import siteTerrain_12 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_12 as siteTerrain };
    }
    export namespace DISTRIBUTED_MAMMAL_GRID_BOUNDARIES {
        let name_48: string;
        export { name_48 as name };
        let nameSingular_22: string;
        export { nameSingular_22 as nameSingular };
        let type_28: any;
        export { type_28 as type };
        let descriptionFromParentDataFeatureKey_3: boolean;
        export { descriptionFromParentDataFeatureKey_3 as descriptionFromParentDataFeatureKey };
        let parent_23: string;
        export { parent_23 as parent };
        let parentDataFeatureKey_3: string;
        export { parentDataFeatureKey_3 as parentDataFeatureKey };
        import dataSource_22 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_22 as dataSource };
        let matchLocationName_2: RegExp;
        export { matchLocationName_2 as matchLocationName };
        let matchLocationCoordinateMap_2: string[];
        export { matchLocationCoordinateMap_2 as matchLocationCoordinateMap };
        let minZoom_21: number;
        export { minZoom_21 as minZoom };
        let featureShape_23: string;
        export { featureShape_23 as featureShape };
        export namespace style_11 {
            let color_31: string;
            export { color_31 as color };
            let dashArray_8: string;
            export { dashArray_8 as dashArray };
        }
        export { style_11 as style };
        import siteTerrain_13 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_13 as siteTerrain };
    }
    export namespace DISTRIBUTED_TICK_PLOT_BOUNDARIES {
        let name_49: string;
        export { name_49 as name };
        let nameSingular_23: string;
        export { nameSingular_23 as nameSingular };
        let type_29: any;
        export { type_29 as type };
        let descriptionFromParentDataFeatureKey_4: boolean;
        export { descriptionFromParentDataFeatureKey_4 as descriptionFromParentDataFeatureKey };
        let parent_24: string;
        export { parent_24 as parent };
        let parentDataFeatureKey_4: string;
        export { parentDataFeatureKey_4 as parentDataFeatureKey };
        import dataSource_23 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_23 as dataSource };
        let matchLocationName_3: RegExp;
        export { matchLocationName_3 as matchLocationName };
        let matchLocationCoordinateMap_3: string[];
        export { matchLocationCoordinateMap_3 as matchLocationCoordinateMap };
        let minZoom_22: number;
        export { minZoom_22 as minZoom };
        let featureShape_24: string;
        export { featureShape_24 as featureShape };
        export namespace style_12 {
            let color_32: string;
            export { color_32 as color };
            let dashArray_9: string;
            export { dashArray_9 as dashArray };
        }
        export { style_12 as style };
        import siteTerrain_14 = SITE_TERRAINS.TERRESTRIAL;
        export { siteTerrain_14 as siteTerrain };
    }
    export namespace AQUATIC_SITE_FEATURES {
        let name_50: string;
        export { name_50 as name };
        let type_30: any;
        export { type_30 as type };
        let minZoom_23: number;
        export { minZoom_23 as minZoom };
    }
    export namespace AQUATIC_BENCHMARKS {
        let name_51: string;
        export { name_51 as name };
        let nameSingular_24: string;
        export { nameSingular_24 as nameSingular };
        let type_31: any;
        export { type_31 as type };
        let minZoom_24: number;
        export { minZoom_24 as minZoom };
        import dataSource_24 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_24 as dataSource };
        let matchLocationType_12: string;
        export { matchLocationType_12 as matchLocationType };
        let parent_25: string;
        export { parent_25 as parent };
        let featureShape_25: string;
        export { featureShape_25 as featureShape };
        let iconScale_9: number;
        export { iconScale_9 as iconScale };
        let iconSvg_12: any;
        export { iconSvg_12 as iconSvg };
        import iconShape_12 = KEY;
        export { iconShape_12 as iconShape };
        import siteTerrain_15 = SITE_TERRAINS.AQUATIC;
        export { siteTerrain_15 as siteTerrain };
    }
    export namespace AQUATIC_AUTOMATED_INSTRUMENTS {
        let name_52: string;
        export { name_52 as name };
        let type_32: any;
        export { type_32 as type };
        let minZoom_25: number;
        export { minZoom_25 as minZoom };
        let parent_26: string;
        export { parent_26 as parent };
    }
    export namespace AQUATIC_OBSERVATIONAL_SAMPLING {
        let name_53: string;
        export { name_53 as name };
        let type_33: any;
        export { type_33 as type };
        let minZoom_26: number;
        export { minZoom_26 as minZoom };
        let parent_27: string;
        export { parent_27 as parent };
    }
    export namespace AQUATIC_RIPARIAN_ASSESSMENTS {
        let name_54: string;
        export { name_54 as name };
        let nameSingular_25: string;
        export { nameSingular_25 as nameSingular };
        let type_34: any;
        export { type_34 as type };
        let minZoom_27: number;
        export { minZoom_27 as minZoom };
        import dataSource_25 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_25 as dataSource };
        let matchLocationType_13: string;
        export { matchLocationType_13 as matchLocationType };
        let description_32: string;
        export { description_32 as description };
        let parent_28: string;
        export { parent_28 as parent };
        let featureShape_26: string;
        export { featureShape_26 as featureShape };
        let iconSvg_13: any;
        export { iconSvg_13 as iconSvg };
        import iconShape_13 = KEY;
        export { iconShape_13 as iconShape };
        import siteTerrain_16 = SITE_TERRAINS.AQUATIC;
        export { siteTerrain_16 as siteTerrain };
    }
    export namespace AQUATIC_WET_DEPOSITION_POINTS {
        let name_55: string;
        export { name_55 as name };
        let nameSingular_26: string;
        export { nameSingular_26 as nameSingular };
        let type_35: any;
        export { type_35 as type };
        let minZoom_28: number;
        export { minZoom_28 as minZoom };
        import dataSource_26 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_26 as dataSource };
        let matchLocationType_14: string;
        export { matchLocationType_14 as matchLocationType };
        let parent_29: string;
        export { parent_29 as parent };
        let featureShape_27: string;
        export { featureShape_27 as featureShape };
        let iconScale_10: number;
        export { iconScale_10 as iconScale };
        let iconSvg_14: any;
        export { iconSvg_14 as iconSvg };
        import iconShape_14 = KEY;
        export { iconShape_14 as iconShape };
        import siteTerrain_17 = SITE_TERRAINS.AQUATIC;
        export { siteTerrain_17 as siteTerrain };
    }
    export namespace AQUATIC_GROUNDWATER_WELLS {
        let name_56: string;
        export { name_56 as name };
        let nameSingular_27: string;
        export { nameSingular_27 as nameSingular };
        let type_36: any;
        export { type_36 as type };
        let minZoom_29: number;
        export { minZoom_29 as minZoom };
        import dataSource_27 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_27 as dataSource };
        let matchLocationType_15: string;
        export { matchLocationType_15 as matchLocationType };
        let description_33: string;
        export { description_33 as description };
        let parent_30: string;
        export { parent_30 as parent };
        let featureShape_28: string;
        export { featureShape_28 as featureShape };
        let iconScale_11: number;
        export { iconScale_11 as iconScale };
        let iconSvg_15: any;
        export { iconSvg_15 as iconSvg };
        import iconShape_15 = KEY;
        export { iconShape_15 as iconShape };
        import siteTerrain_18 = SITE_TERRAINS.AQUATIC;
        export { siteTerrain_18 as siteTerrain };
    }
    export namespace AQUATIC_METEOROLOGICAL_STATIONS {
        let name_57: string;
        export { name_57 as name };
        let nameSingular_28: string;
        export { nameSingular_28 as nameSingular };
        let type_37: any;
        export { type_37 as type };
        let minZoom_30: number;
        export { minZoom_30 as minZoom };
        import dataSource_28 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_28 as dataSource };
        let matchLocationType_16: string;
        export { matchLocationType_16 as matchLocationType };
        let description_34: string;
        export { description_34 as description };
        let parent_31: string;
        export { parent_31 as parent };
        let featureShape_29: string;
        export { featureShape_29 as featureShape };
        let iconScale_12: number;
        export { iconScale_12 as iconScale };
        let iconSvg_16: any;
        export { iconSvg_16 as iconSvg };
        import iconShape_16 = KEY;
        export { iconShape_16 as iconShape };
        import siteTerrain_19 = SITE_TERRAINS.AQUATIC;
        export { siteTerrain_19 as siteTerrain };
    }
    export namespace AQUATIC_DISCHARGE_POINTS {
        let name_58: string;
        export { name_58 as name };
        let nameSingular_29: string;
        export { nameSingular_29 as nameSingular };
        let type_38: any;
        export { type_38 as type };
        let minZoom_31: number;
        export { minZoom_31 as minZoom };
        import dataSource_29 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_29 as dataSource };
        let matchLocationType_17: string;
        export { matchLocationType_17 as matchLocationType };
        let parent_32: string;
        export { parent_32 as parent };
        let featureShape_30: string;
        export { featureShape_30 as featureShape };
        let iconSvg_17: any;
        export { iconSvg_17 as iconSvg };
        import iconShape_17 = KEY;
        export { iconShape_17 as iconShape };
        import siteTerrain_20 = SITE_TERRAINS.AQUATIC;
        export { siteTerrain_20 as siteTerrain };
    }
    export namespace AQUATIC_FISH_POINTS {
        let name_59: string;
        export { name_59 as name };
        let nameSingular_30: string;
        export { nameSingular_30 as nameSingular };
        let type_39: any;
        export { type_39 as type };
        let minZoom_32: number;
        export { minZoom_32 as minZoom };
        import dataSource_30 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_30 as dataSource };
        let matchLocationType_18: string;
        export { matchLocationType_18 as matchLocationType };
        let parent_33: string;
        export { parent_33 as parent };
        let featureShape_31: string;
        export { featureShape_31 as featureShape };
        let iconSvg_18: any;
        export { iconSvg_18 as iconSvg };
        import iconShape_18 = KEY;
        export { iconShape_18 as iconShape };
        import siteTerrain_21 = SITE_TERRAINS.AQUATIC;
        export { siteTerrain_21 as siteTerrain };
    }
    export namespace AQUATIC_PLANT_TRANSECTS {
        let name_60: string;
        export { name_60 as name };
        let nameSingular_31: string;
        export { nameSingular_31 as nameSingular };
        let type_40: any;
        export { type_40 as type };
        let minZoom_33: number;
        export { minZoom_33 as minZoom };
        import dataSource_31 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_31 as dataSource };
        let matchLocationType_19: string;
        export { matchLocationType_19 as matchLocationType };
        let parent_34: string;
        export { parent_34 as parent };
        let featureShape_32: string;
        export { featureShape_32 as featureShape };
        let iconScale_13: number;
        export { iconScale_13 as iconScale };
        let iconSvg_19: any;
        export { iconSvg_19 as iconSvg };
        import iconShape_19 = KEY;
        export { iconShape_19 as iconShape };
        import siteTerrain_22 = SITE_TERRAINS.AQUATIC;
        export { siteTerrain_22 as siteTerrain };
    }
    export namespace AQUATIC_SEDIMENT_POINTS {
        let name_61: string;
        export { name_61 as name };
        let nameSingular_32: string;
        export { nameSingular_32 as nameSingular };
        let type_41: any;
        export { type_41 as type };
        let minZoom_34: number;
        export { minZoom_34 as minZoom };
        import dataSource_32 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_32 as dataSource };
        let matchLocationType_20: string;
        export { matchLocationType_20 as matchLocationType };
        let parent_35: string;
        export { parent_35 as parent };
        let featureShape_33: string;
        export { featureShape_33 as featureShape };
        let iconSvg_20: any;
        export { iconSvg_20 as iconSvg };
        import iconShape_20 = KEY;
        export { iconShape_20 as iconShape };
        import siteTerrain_23 = SITE_TERRAINS.AQUATIC;
        export { siteTerrain_23 as siteTerrain };
    }
    export namespace AQUATIC_STAFF_GAUGES {
        let name_62: string;
        export { name_62 as name };
        let nameSingular_33: string;
        export { nameSingular_33 as nameSingular };
        let type_42: any;
        export { type_42 as type };
        let minZoom_35: number;
        export { minZoom_35 as minZoom };
        import dataSource_33 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_33 as dataSource };
        let matchLocationType_21: string;
        export { matchLocationType_21 as matchLocationType };
        let description_35: string;
        export { description_35 as description };
        let parent_36: string;
        export { parent_36 as parent };
        let featureShape_34: string;
        export { featureShape_34 as featureShape };
        let iconSvg_21: any;
        export { iconSvg_21 as iconSvg };
        import iconShape_21 = KEY;
        export { iconShape_21 as iconShape };
        import siteTerrain_24 = SITE_TERRAINS.AQUATIC;
        export { siteTerrain_24 as siteTerrain };
    }
    export namespace AQUATIC_SENSOR_STATIONS {
        let name_63: string;
        export { name_63 as name };
        let nameSingular_34: string;
        export { nameSingular_34 as nameSingular };
        let type_43: any;
        export { type_43 as type };
        let minZoom_36: number;
        export { minZoom_36 as minZoom };
        import dataSource_34 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_34 as dataSource };
        let matchLocationType_22: RegExp;
        export { matchLocationType_22 as matchLocationType };
        let description_36: string;
        export { description_36 as description };
        let parent_37: string;
        export { parent_37 as parent };
        let featureShape_35: string;
        export { featureShape_35 as featureShape };
        let iconScale_14: number;
        export { iconScale_14 as iconScale };
        let iconSvg_22: any;
        export { iconSvg_22 as iconSvg };
        import iconShape_22 = KEY;
        export { iconShape_22 as iconShape };
        import siteTerrain_25 = SITE_TERRAINS.AQUATIC;
        export { siteTerrain_25 as siteTerrain };
    }
    export namespace AQUATIC_BUOYS {
        let name_64: string;
        export { name_64 as name };
        let nameSingular_35: string;
        export { nameSingular_35 as nameSingular };
        let type_44: any;
        export { type_44 as type };
        let minZoom_37: number;
        export { minZoom_37 as minZoom };
        import dataSource_35 = FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
        export { dataSource_35 as dataSource };
        let matchLocationType_23: string;
        export { matchLocationType_23 as matchLocationType };
        let parent_38: string;
        export { parent_38 as parent };
        let featureShape_36: string;
        export { featureShape_36 as featureShape };
        let iconScale_15: number;
        export { iconScale_15 as iconScale };
        let iconSvg_23: any;
        export { iconSvg_23 as iconSvg };
        import iconShape_23 = KEY;
        export { iconShape_23 as iconShape };
        import siteTerrain_26 = SITE_TERRAINS.AQUATIC;
        export { siteTerrain_26 as siteTerrain };
    }
    export namespace SITE_MARKERS {
        let name_65: string;
        export { name_65 as name };
        let type_45: any;
        export { type_45 as type };
        export let maxZoom: number;
    }
    export namespace TERRESTRIAL_CORE_SITES {
        let name_66: string;
        export { name_66 as name };
        let nameSingular_36: string;
        export { nameSingular_36 as nameSingular };
        let type_46: any;
        export { type_46 as type };
        let description_37: string;
        export { description_37 as description };
        let parent_39: string;
        export { parent_39 as parent };
        export namespace attributes {
            let type_47: string;
            export { type_47 as type };
            export let terrain: string;
        }
        import dataSource_36 = FEATURE_DATA_SOURCES.NEON_CONTEXT;
        export { dataSource_36 as dataSource };
        let primaryIdOnly_2: boolean;
        export { primaryIdOnly_2 as primaryIdOnly };
        let featureShape_37: string;
        export { featureShape_37 as featureShape };
        let iconScale_16: number;
        export { iconScale_16 as iconScale };
        let iconSvg_24: any;
        export { iconSvg_24 as iconSvg };
        export let iconSelectedSvg: any;
        import iconShape_24 = KEY;
        export { iconShape_24 as iconShape };
        let maxZoom_1: number;
        export { maxZoom_1 as maxZoom };
    }
    export namespace TERRESTRIAL_GRADIENT_SITES {
        let name_67: string;
        export { name_67 as name };
        let nameSingular_37: string;
        export { nameSingular_37 as nameSingular };
        let type_48: any;
        export { type_48 as type };
        let description_38: string;
        export { description_38 as description };
        let parent_40: string;
        export { parent_40 as parent };
        export namespace attributes_1 {
            let type_49: string;
            export { type_49 as type };
            let terrain_1: string;
            export { terrain_1 as terrain };
        }
        export { attributes_1 as attributes };
        import dataSource_37 = FEATURE_DATA_SOURCES.NEON_CONTEXT;
        export { dataSource_37 as dataSource };
        let primaryIdOnly_3: boolean;
        export { primaryIdOnly_3 as primaryIdOnly };
        let featureShape_38: string;
        export { featureShape_38 as featureShape };
        let iconScale_17: number;
        export { iconScale_17 as iconScale };
        let iconSvg_25: any;
        export { iconSvg_25 as iconSvg };
        let iconSelectedSvg_1: any;
        export { iconSelectedSvg_1 as iconSelectedSvg };
        import iconShape_25 = KEY;
        export { iconShape_25 as iconShape };
        let maxZoom_2: number;
        export { maxZoom_2 as maxZoom };
    }
    export namespace AQUATIC_CORE_SITES {
        let name_68: string;
        export { name_68 as name };
        let nameSingular_38: string;
        export { nameSingular_38 as nameSingular };
        let type_50: any;
        export { type_50 as type };
        let description_39: string;
        export { description_39 as description };
        let parent_41: string;
        export { parent_41 as parent };
        export namespace attributes_2 {
            let type_51: string;
            export { type_51 as type };
            let terrain_2: string;
            export { terrain_2 as terrain };
        }
        export { attributes_2 as attributes };
        import dataSource_38 = FEATURE_DATA_SOURCES.NEON_CONTEXT;
        export { dataSource_38 as dataSource };
        let primaryIdOnly_4: boolean;
        export { primaryIdOnly_4 as primaryIdOnly };
        let featureShape_39: string;
        export { featureShape_39 as featureShape };
        let iconScale_18: number;
        export { iconScale_18 as iconScale };
        let iconSvg_26: any;
        export { iconSvg_26 as iconSvg };
        let iconSelectedSvg_2: any;
        export { iconSelectedSvg_2 as iconSelectedSvg };
        import iconShape_26 = KEY;
        export { iconShape_26 as iconShape };
        let maxZoom_3: number;
        export { maxZoom_3 as maxZoom };
    }
    export namespace AQUATIC_GRADIENT_SITES {
        let name_69: string;
        export { name_69 as name };
        let nameSingular_39: string;
        export { nameSingular_39 as nameSingular };
        let type_52: any;
        export { type_52 as type };
        let description_40: string;
        export { description_40 as description };
        let parent_42: string;
        export { parent_42 as parent };
        export namespace attributes_3 {
            let type_53: string;
            export { type_53 as type };
            let terrain_3: string;
            export { terrain_3 as terrain };
        }
        export { attributes_3 as attributes };
        import dataSource_39 = FEATURE_DATA_SOURCES.NEON_CONTEXT;
        export { dataSource_39 as dataSource };
        let primaryIdOnly_5: boolean;
        export { primaryIdOnly_5 as primaryIdOnly };
        let featureShape_40: string;
        export { featureShape_40 as featureShape };
        let iconScale_19: number;
        export { iconScale_19 as iconScale };
        let iconSvg_27: any;
        export { iconSvg_27 as iconSvg };
        let iconSelectedSvg_3: any;
        export { iconSelectedSvg_3 as iconSelectedSvg };
        import iconShape_27 = KEY;
        export { iconShape_27 as iconShape };
        let maxZoom_4: number;
        export { maxZoom_4 as maxZoom };
    }
    export namespace DECOMMISSIONED_SITES {
        let name_70: string;
        export { name_70 as name };
        let nameSingular_40: string;
        export { nameSingular_40 as nameSingular };
        let type_54: any;
        export { type_54 as type };
        let description_41: string;
        export { description_41 as description };
        let parent_43: string;
        export { parent_43 as parent };
        export namespace attributes_4 {
            let type_55: string;
            export { type_55 as type };
            let terrain_4: string;
            export { terrain_4 as terrain };
        }
        export { attributes_4 as attributes };
        import dataSource_40 = FEATURE_DATA_SOURCES.MANUAL_LOCATIONS;
        export { dataSource_40 as dataSource };
        let primaryIdOnly_6: boolean;
        export { primaryIdOnly_6 as primaryIdOnly };
        let featureShape_41: string;
        export { featureShape_41 as featureShape };
        let iconScale_20: number;
        export { iconScale_20 as iconScale };
        let iconSvg_28: any;
        export { iconSvg_28 as iconSvg };
        let iconSelectedSvg_4: any;
        export { iconSelectedSvg_4 as iconSelectedSvg };
        import iconShape_28 = KEY;
        export { iconShape_28 as iconShape };
        let maxZoom_5: number;
        export { maxZoom_5 as maxZoom };
    }
}
export namespace GRAPHQL_LOCATIONS_API_CONSTANTS {
    export { FEATURES_TO_MINZOOM_MAP };
    export { MINZOOM_TO_FEATURES_MAP };
}
export namespace BOUNDARY_COLORS {
    let partialSelected: string;
    let totalSelected: string;
    let hover: string;
}
export function calculateFeatureAvailability(state: any): any;
export function getHref(key: any, arg?: null): string;
export namespace BASE_LAYERS {
    namespace NATGEO_WORLD_MAP {
        let title: string;
        let shortAttribution: string;
        let fullAttribution: string;
        let url: string;
    }
    namespace WORLD_IMAGERY {
        let title_1: string;
        export { title_1 as title };
        let shortAttribution_1: string;
        export { shortAttribution_1 as shortAttribution };
        let fullAttribution_1: string;
        export { fullAttribution_1 as fullAttribution };
        let url_1: string;
        export { url_1 as url };
    }
    namespace WORLD_STREET_MAP {
        let title_2: string;
        export { title_2 as title };
        let shortAttribution_2: string;
        export { shortAttribution_2 as shortAttribution };
        let fullAttribution_2: string;
        export { fullAttribution_2 as fullAttribution };
        let url_2: string;
        export { url_2 as url };
    }
    namespace WORLD_TOPO_MAP {
        let title_3: string;
        export { title_3 as title };
        let shortAttribution_3: string;
        export { shortAttribution_3 as shortAttribution };
        let fullAttribution_3: string;
        export { fullAttribution_3 as fullAttribution };
        let url_3: string;
        export { url_3 as url };
    }
}
export const BASE_LAYERS_BY_TITLE: {};
export namespace OVERLAY_GROUPS {
    namespace NLCD {
        let title_4: string;
        export { title_4 as title };
        let description_42: string;
        export { description_42 as description };
        export namespace commonProps {
            let format: string;
            let transparent: boolean;
        }
    }
}
export const OVERLAY_GROUPS_BY_TITLE: {};
export namespace OVERLAYS {
    namespace LAND_COVER {
        export let group: any;
        let title_5: string;
        export { title_5 as title };
        let description_43: string;
        export { description_43 as description };
        export namespace commonProps_1 {
            let attribution: string;
        }
        export { commonProps_1 as commonProps };
        export { NLCD_CLASSES as legend };
        export let components: {
            type: string;
            key: string;
            props: {
                url: string;
                layers: string;
            };
        }[];
    }
    namespace IMPERVIOUS {
        let group_1: any;
        export { group_1 as group };
        let title_6: string;
        export { title_6 as title };
        let description_44: string;
        export { description_44 as description };
        export namespace commonProps_2 {
            let attribution_1: string;
            export { attribution_1 as attribution };
        }
        export { commonProps_2 as commonProps };
        export let legend: {
            10: {
                name: string;
                description: string;
                color: string;
            };
            20: {
                name: string;
                description: string;
                color: string;
            };
            30: {
                name: string;
                description: string;
                color: string;
            };
            40: {
                name: string;
                description: string;
                color: string;
            };
            50: {
                name: string;
                description: string;
                color: string;
            };
            60: {
                name: string;
                description: string;
                color: string;
            };
            70: {
                name: string;
                description: string;
                color: string;
            };
            80: {
                name: string;
                description: string;
                color: string;
            };
            90: {
                name: string;
                description: string;
                color: string;
            };
            100: {
                name: string;
                description: string;
                color: string;
            };
        };
        let components_1: {
            type: string;
            key: string;
            props: {
                url: string;
                layers: string;
            };
        }[];
        export { components_1 as components };
    }
}
export namespace MAP_STATE_STATUS_TYPE {
    let INIT: string;
    let READY: string;
}
export function getDefaultState(): {
    view: {
        current: null;
        initialized: {
            [x: string]: boolean;
        };
    };
    neonContextHydrated: boolean;
    overallFetch: {
        expected: number;
        completed: number;
        pendingHierarchy: number;
    };
    focusLocation: {
        current: null;
        data: null;
        fetch: {
            status: null;
            error: null;
        };
        map: {
            zoom: null;
            center: never[];
        };
    };
    aspectRatio: {
        currentValue: null;
        isDynamic: boolean;
        resizeEventListenerInitialized: boolean;
        widthReference: number;
    };
    table: {
        focus: any;
        availableFeatureTypes: {
            [x: number]: boolean;
        };
        fullHeight: boolean;
        maxBodyHeight: null;
        maxBodyHeightUpdateFromAspectRatio: boolean;
    };
    map: {
        status: string;
        zoom: null;
        center: number[];
        initialZoom: number;
        initialCenter: number[];
        bounds: null;
        baseLayer: null;
        baseLayerAutoChangedAbove17: boolean;
        overlays: Set<any>;
        mouseMode: string;
        zoomedIcons: {};
        isDraggingAreaSelection: boolean;
    };
    selection: {
        active: null;
        limit: null;
        valid: boolean;
        set: Set<any>;
        validSet: null;
        hideUnselectable: boolean;
        showSummary: boolean;
        changed: boolean;
        onChange: () => void;
        derived: {
            [x: number]: {};
        };
    };
    featureDataFetchesHasAwaiting: boolean;
    featureDataFetches: {
        [k: string]: {};
    };
    featureData: {
        [k: string]: {};
    };
    sites: {};
    filters: {
        search: null;
        legendOpen: boolean;
        features: {
            available: {};
            visible: {
                [k: string]: boolean;
            };
            collapsed: Set<any>;
        };
        overlays: {
            expanded: Set<any>;
        };
    };
    fullscreen: boolean;
    manualLocationData: null;
};
export namespace SITE_MAP_PROP_TYPES {
    export let view: PropTypes.Requireable<string>;
    export let aspectRatio: PropTypes.Requireable<number>;
    export let fullscreen: PropTypes.Requireable<boolean>;
    export let unusableVerticalSpace: PropTypes.Requireable<number>;
    export let mapUniqueId: PropTypes.Requireable<number>;
    export let mapCenter: PropTypes.Requireable<(number | null | undefined)[]>;
    export let mapZoom: PropTypes.Requireable<number>;
    export let mapBaseLayer: PropTypes.Requireable<string>;
    export let tableFullHeight: PropTypes.Requireable<boolean>;
    export let location: PropTypes.Requireable<string>;
    export let selection: PropTypes.Requireable<string>;
    export let selectedItems: PropTypes.Requireable<(string | null | undefined)[]>;
    export let validItems: PropTypes.Requireable<(string | null | undefined)[]>;
    export { SelectionLimitPropType as selectionLimit };
    export let onSelectionChange: PropTypes.Requireable<(...args: any[]) => any>;
    export let search: PropTypes.Requireable<string>;
    export let features: PropTypes.Requireable<(string | null | undefined)[]>;
    export let manualLocationData: PropTypes.Requireable<(PropTypes.InferProps<{
        manualLocationType: PropTypes.Validator<string>;
    }> | null | undefined)[]>;
}
export namespace SITE_MAP_DEFAULT_PROPS {
    let view_1: string;
    export { view_1 as view };
    let aspectRatio_1: null;
    export { aspectRatio_1 as aspectRatio };
    let fullscreen_1: boolean;
    export { fullscreen_1 as fullscreen };
    let unusableVerticalSpace_1: number;
    export { unusableVerticalSpace_1 as unusableVerticalSpace };
    let mapUniqueId_1: number;
    export { mapUniqueId_1 as mapUniqueId };
    export { OBSERVATORY_CENTER as mapCenter };
    let mapZoom_1: null;
    export { mapZoom_1 as mapZoom };
    let mapBaseLayer_1: string;
    export { mapBaseLayer_1 as mapBaseLayer };
    let tableFullHeight_1: boolean;
    export { tableFullHeight_1 as tableFullHeight };
    let location_1: null;
    export { location_1 as location };
    let selection_1: null;
    export { selection_1 as selection };
    let selectedItems_1: never[];
    export { selectedItems_1 as selectedItems };
    let validItems_1: null;
    export { validItems_1 as validItems };
    export let selectionLimit: null;
    export function onSelectionChange_1(): void;
    export { onSelectionChange_1 as onSelectionChange };
    let search_1: null;
    export { search_1 as search };
    let features_1: null;
    export { features_1 as features };
    let manualLocationData_1: null;
    export { manualLocationData_1 as manualLocationData };
}
export function zoomIsValid(zoom: any): boolean;
export function centerIsValid(center: any): boolean;
export function boundsAreValid(bounds: any): boolean;
export function determineMapStatus(state: any): string | false;
export function getZoomedIcon(featureKey?: null, zoom?: number, highlight?: string, selection?: string): L.Icon<{
    iconUrl: any;
    iconRetinaUrl: any;
    iconSize: any;
    iconAnchor: any;
    popupAnchor: any;
}>;
export function getZoomedIcons(zoom: any): {};
export function getPhantomLeafletMap(state: any): any;
export function mapIsAtFocusLocation(state?: {}): any;
export function getMapStateForFocusLocation(state?: {}): any;
export function findCentroid(coords?: any[]): any[] | null;
export function getMapStateForManualLocationData(state: any): any;
export function parseManualLocationFeatureData(state: any): any;
export function hydrateNeonContextData(state: any, neonContextData: any): any;
export function getDynamicAspectRatio(unusableVerticalSpace?: number): number;
export function calculateLocationsInBounds(locations: any, bounds?: null, extendMap?: boolean, extendPoints?: number): string[];
export function deriveFullObservatoryZoomLevel(map: any): number;
/**
   GRAPHQL_LOCATIONS_API Constants
   The Locations API groups fetchable assets by minZoom (i.e. all assets for all locations features
   with the same minZoom are fetched together, for a given field site). Thus we want lookups of
   minZoom by feature key and vice versa. These values never change, so derive them now.
*/
declare const FEATURES_TO_MINZOOM_MAP: {};
declare const MINZOOM_TO_FEATURES_MAP: {};
import PropTypes from 'prop-types';
/**
   PropTypes and defaultProps
*/
declare function SelectionLimitPropType(props: any, propName: any): Error | null;
import L from 'leaflet';
export {};
