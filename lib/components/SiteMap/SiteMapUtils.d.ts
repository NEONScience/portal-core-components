export const MAP_ZOOM_RANGE: number[];
export const OBSERVATORY_CENTER: number[];
export const MIN_CONTAINER_HEIGHT: 300;
export const MIN_TABLE_MAX_BODY_HEIGHT: 100;
export const KM2_TO_ACRES: 247.10538146717;
export const SITE_LOCATION_HIERARCHIES_MIN_ZOOM: 9;
export namespace SORT_DIRECTIONS {
    export const ASC: string;
    export const DESC: string;
}
export namespace SITE_TERRAINS {
    export const AQUATIC: string;
    export const TERRESTRIAL: string;
}
export namespace MANUAL_LOCATION_TYPES {
    export const PROTOTYPE_SITE: string;
}
export namespace FEATURE_TYPES {
    export namespace SITES {
        export const unit: string;
        export const units: string;
        export const selectable: boolean;
        export const viewableInTable: boolean;
        export const deriveRegionSelections: boolean;
    }
    export namespace SITE_LOCATION_HIERARCHIES {
        const selectable_1: boolean;
        export { selectable_1 as selectable };
    }
    export namespace LOCATIONS {
        const selectable_2: boolean;
        export { selectable_2 as selectable };
        const viewableInTable_1: boolean;
        export { viewableInTable_1 as viewableInTable };
    }
    export namespace SAMPLING_POINTS {
        const selectable_3: boolean;
        export { selectable_3 as selectable };
    }
    export namespace BOUNDARIES {
        const selectable_4: boolean;
        export { selectable_4 as selectable };
    }
    export namespace DOMAINS {
        const unit_1: string;
        export { unit_1 as unit };
        const units_1: string;
        export { units_1 as units };
        const selectable_5: boolean;
        export { selectable_5 as selectable };
        const viewableInTable_2: boolean;
        export { viewableInTable_2 as viewableInTable };
    }
    export namespace STATES {
        const unit_2: string;
        export { unit_2 as unit };
        const units_2: string;
        export { units_2 as units };
        const selectable_6: boolean;
        export { selectable_6 as selectable };
        const viewableInTable_3: boolean;
        export { viewableInTable_3 as viewableInTable };
    }
    export namespace GROUP {
        const selectable_7: boolean;
        export { selectable_7 as selectable };
    }
    export namespace OTHER {
        const selectable_8: boolean;
        export { selectable_8 as selectable };
    }
}
export namespace FEATURE_DATA_SOURCES {
    export const REST_LOCATIONS_API: string;
    export const GRAPHQL_LOCATIONS_API: string;
    export const ARCGIS_ASSETS_API: string;
    export const NEON_CONTEXT: string;
    export const MANUAL_LOCATIONS: string;
}
export namespace SELECTION_PORTIONS {
    export const PARTIAL: string;
    export const TOTAL: string;
}
export namespace SELECTION_STATUS {
    export const SELECTED: string;
    export const UNSELECTED: string;
}
export const UNSELECTABLE_MARKER_FILTER: "sepia(0.8) contrast(0.3) brightness(1.35)";
export namespace HIGHLIGHT_STATUS {
    export const NONE: string;
    export const HIGHLIGHT: string;
    export const SELECT: string;
}
export namespace VIEWS {
    export const MAP: string;
    export const TABLE: string;
}
export namespace MAP_MOUSE_MODES {
    export const PAN: string;
    export const AREA_SELECT: string;
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
export namespace NLCD_CLASSES {
    export namespace openWater {
        export const name: string;
        export const value: number;
        export const description: string;
        export const color: string;
        export const category: string;
    }
    export namespace perennialIceSnow {
        const name_1: string;
        export { name_1 as name };
        export const vaule: number;
        const description_1: string;
        export { description_1 as description };
        const color_1: string;
        export { color_1 as color };
        const category_1: string;
        export { category_1 as category };
    }
    export namespace developedOpenSpace {
        const name_2: string;
        export { name_2 as name };
        const value_1: number;
        export { value_1 as value };
        const description_2: string;
        export { description_2 as description };
        const color_2: string;
        export { color_2 as color };
        const category_2: string;
        export { category_2 as category };
    }
    export namespace developedLowIntensity {
        const name_3: string;
        export { name_3 as name };
        const value_2: number;
        export { value_2 as value };
        const description_3: string;
        export { description_3 as description };
        const color_3: string;
        export { color_3 as color };
        const category_3: string;
        export { category_3 as category };
    }
    export namespace developedMediumIntensity {
        const name_4: string;
        export { name_4 as name };
        const value_3: number;
        export { value_3 as value };
        const description_4: string;
        export { description_4 as description };
        const color_4: string;
        export { color_4 as color };
        const category_4: string;
        export { category_4 as category };
    }
    export namespace developedHighIntensity {
        const name_5: string;
        export { name_5 as name };
        const value_4: number;
        export { value_4 as value };
        const description_5: string;
        export { description_5 as description };
        const color_5: string;
        export { color_5 as color };
        const category_5: string;
        export { category_5 as category };
    }
    export namespace barrenLand {
        const name_6: string;
        export { name_6 as name };
        const value_5: number;
        export { value_5 as value };
        const description_6: string;
        export { description_6 as description };
        const color_6: string;
        export { color_6 as color };
        const category_6: string;
        export { category_6 as category };
    }
    export namespace deciduousForest {
        const name_7: string;
        export { name_7 as name };
        const value_6: number;
        export { value_6 as value };
        const description_7: string;
        export { description_7 as description };
        const color_7: string;
        export { color_7 as color };
        const category_7: string;
        export { category_7 as category };
    }
    export namespace evergreenForest {
        const name_8: string;
        export { name_8 as name };
        const value_7: number;
        export { value_7 as value };
        const description_8: string;
        export { description_8 as description };
        const color_8: string;
        export { color_8 as color };
        const category_8: string;
        export { category_8 as category };
    }
    export namespace mixedForest {
        const name_9: string;
        export { name_9 as name };
        const value_8: number;
        export { value_8 as value };
        const description_9: string;
        export { description_9 as description };
        const color_9: string;
        export { color_9 as color };
        const category_9: string;
        export { category_9 as category };
    }
    export namespace dwarfScrub {
        const name_10: string;
        export { name_10 as name };
        const value_9: number;
        export { value_9 as value };
        const description_10: string;
        export { description_10 as description };
        const color_10: string;
        export { color_10 as color };
        const category_10: string;
        export { category_10 as category };
    }
    export namespace shrubScrub {
        const name_11: string;
        export { name_11 as name };
        const value_10: number;
        export { value_10 as value };
        const description_11: string;
        export { description_11 as description };
        const color_11: string;
        export { color_11 as color };
        const category_11: string;
        export { category_11 as category };
    }
    export namespace grasslandHerbaceous {
        const name_12: string;
        export { name_12 as name };
        const value_11: number;
        export { value_11 as value };
        const description_12: string;
        export { description_12 as description };
        const color_12: string;
        export { color_12 as color };
        const category_12: string;
        export { category_12 as category };
    }
    export namespace sedgeHerbaceous {
        const name_13: string;
        export { name_13 as name };
        const value_12: number;
        export { value_12 as value };
        const description_13: string;
        export { description_13 as description };
        const color_13: string;
        export { color_13 as color };
        const category_13: string;
        export { category_13 as category };
    }
    export namespace lichens {
        const name_14: string;
        export { name_14 as name };
        const value_13: number;
        export { value_13 as value };
        const description_14: string;
        export { description_14 as description };
        const color_14: string;
        export { color_14 as color };
        const category_14: string;
        export { category_14 as category };
    }
    export namespace moss {
        const name_15: string;
        export { name_15 as name };
        const value_14: number;
        export { value_14 as value };
        const description_15: string;
        export { description_15 as description };
        const color_15: string;
        export { color_15 as color };
        const category_15: string;
        export { category_15 as category };
    }
    export namespace pastureHay {
        const name_16: string;
        export { name_16 as name };
        const value_15: number;
        export { value_15 as value };
        const description_16: string;
        export { description_16 as description };
        const color_16: string;
        export { color_16 as color };
        const category_16: string;
        export { category_16 as category };
    }
    export namespace cultivatedCrops {
        const name_17: string;
        export { name_17 as name };
        const value_16: number;
        export { value_16 as value };
        const description_17: string;
        export { description_17 as description };
        const color_17: string;
        export { color_17 as color };
        const category_17: string;
        export { category_17 as category };
    }
    export namespace woodyWetlands {
        const name_18: string;
        export { name_18 as name };
        const value_17: number;
        export { value_17 as value };
        const description_18: string;
        export { description_18 as description };
        const color_18: string;
        export { color_18 as color };
        const category_18: string;
        export { category_18 as category };
    }
    export namespace emergentHerbaceousWetlands {
        const name_19: string;
        export { name_19 as name };
        const value_18: number;
        export { value_18 as value };
        const description_19: string;
        export { description_19 as description };
        const color_19: string;
        export { color_19 as color };
        const category_19: string;
        export { category_19 as category };
    }
}
export namespace LOCATION_ICON_SVG_SHAPES {
    export namespace CIRCLE {
        export const KEY: string;
        export const iconSize: number[];
        export const iconAnchor: number[];
        export const popupAnchor: number[];
        export const shadow: {
            [x: string]: {
                svg: any;
                size: number[];
                anchor: number[];
            };
        };
    }
    export namespace DIAMOND {
        const KEY_1: string;
        export { KEY_1 as KEY };
        const iconSize_1: number[];
        export { iconSize_1 as iconSize };
        const iconAnchor_1: number[];
        export { iconAnchor_1 as iconAnchor };
        const popupAnchor_1: number[];
        export { popupAnchor_1 as popupAnchor };
        const shadow_1: {
            [x: string]: {
                svg: any;
                size: number[];
                anchor: number[];
            };
        };
        export { shadow_1 as shadow };
    }
    export namespace HOMEPLATE {
        const KEY_2: string;
        export { KEY_2 as KEY };
        const iconSize_2: number[];
        export { iconSize_2 as iconSize };
        const iconAnchor_2: number[];
        export { iconAnchor_2 as iconAnchor };
        const popupAnchor_2: number[];
        export { popupAnchor_2 as popupAnchor };
        const shadow_2: {
            [x: string]: {
                svg: any;
                size: number[];
                anchor: number[];
            };
        };
        export { shadow_2 as shadow };
    }
    export namespace SQUARE {
        const KEY_3: string;
        export { KEY_3 as KEY };
        const iconSize_3: number[];
        export { iconSize_3 as iconSize };
        const iconAnchor_3: number[];
        export { iconAnchor_3 as iconAnchor };
        const popupAnchor_3: number[];
        export { popupAnchor_3 as popupAnchor };
        const shadow_3: {
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
    const STATES_1: {
        name: string;
        nameSingular: string;
        type: any;
        hideByDefault: boolean;
        dataSource: string;
        primaryIdOnly: boolean;
        featureShape: string;
        style: {
            color: string;
            weight: number;
        };
        generalLegendGroup: boolean;
    };
    export { STATES_1 as STATES };
    const DOMAINS_1: {
        name: string;
        nameSingular: string;
        type: any;
        hideByDefault: boolean;
        dataSource: string;
        primaryIdOnly: boolean;
        featureShape: string;
        style: {
            color: string;
            weight: number;
        };
    };
    export { DOMAINS_1 as DOMAINS };
    export const FLIGHT_BOX_BOUNDARIES: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        featureShape: string;
        style: {
            color: string;
            dashArray: string;
        };
    };
    export const AQUATIC_WATERSHEDS: {
        name: string;
        type: any;
        minZoom: number;
    };
    export const WATERSHED_BOUNDARIES: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        parent: string;
        featureShape: string;
        style: {
            color: string;
            dashArray: string;
        };
    };
    export const DRAINAGE_LINES: {
        name: string;
        type: any;
        minZoom: number;
        dataSource: string;
        parent: string;
        featureShape: string;
        style: {
            color: string;
        };
    };
    export const POUR_POINTS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        parent: string;
        featureShape: string;
        iconSvg: any;
        iconShape: string;
    };
    export const SAMPLING_BOUNDARIES: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
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
        type: any;
        minZoom: number;
        dataSource: string;
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
        type: any;
        minZoom: number;
        dataSource: string;
        parent: string;
        featureShape: string;
        style: {
            color: string;
            dashArray: string;
        };
    };
    export const TERRESTRIAL_SITE_FEATURES: {
        name: string;
        type: any;
        minZoom: number;
        fetchingForFeatures: string[];
    };
    export const TOWERS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        parent: string;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const HUTS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        parent: string;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const MEGAPITS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        parent: string;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const TOWER_PLOTS: {
        name: string;
        type: any;
        minZoom: number;
        description: string;
        parent: string;
    };
    export const TOWER_PHENOLOGY_PLOTS: {
        name: string;
        nameSingular: string;
        type: any;
        description: string;
        parent: string;
        dataSource: string;
        matchLocationType: string;
        featureShape: string;
        minZoom: number;
        focusZoom: number;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const TOWER_BASE_PLOTS: {
        name: string;
        nameSingular: string;
        type: any;
        description: string;
        parent: string;
        dataSource: string;
        matchLocationType: string;
        featureShape: string;
        minZoom: number;
        focusZoom: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const TOWER_SOIL_PLOTS: {
        name: string;
        nameSingular: string;
        type: any;
        dataSource: string;
        matchLocationType: string;
        description: string;
        parent: string;
        featureShape: string;
        minZoom: number;
        focusZoom: number;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const DISTRIBUTED_PLOTS: {
        name: string;
        type: any;
        minZoom: number;
        description: string;
        parent: string;
    };
    export const DISTRIBUTED_BIRD_GRIDS: {
        name: string;
        nameSingular: string;
        type: any;
        description: string;
        parent: string;
        dataSource: string;
        matchLocationType: string;
        featureShape: string;
        iconScale: number;
        focusZoom: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const DISTRIBUTED_MAMMAL_GRIDS: {
        name: string;
        nameSingular: string;
        type: any;
        description: string;
        parent: string;
        dataSource: string;
        matchLocationType: string;
        featureShape: string;
        iconScale: number;
        focusZoom: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const DISTRIBUTED_BASE_PLOTS: {
        name: string;
        nameSingular: string;
        type: any;
        description: string;
        parent: string;
        featureShape: string;
        dataSource: string;
        matchLocationType: string;
        iconScale: number;
        focusZoom: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const DISTRIBUTED_TICK_PLOTS: {
        name: string;
        nameSingular: string;
        type: any;
        description: string;
        parent: string;
        dataSource: string;
        matchLocationType: string;
        featureShape: string;
        iconScale: number;
        focusZoom: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const DISTRIBUTED_MOSQUITO_POINTS: {
        name: string;
        nameSingular: string;
        type: any;
        description: string;
        parent: string;
        dataSource: string;
        matchLocationType: string;
        iconSvg: any;
        iconShape: string;
        featureShape: string;
        focusZoom: number;
        siteTerrain: string;
    };
    export const PLOT_BOUNDARIES: {
        name: string;
        type: any;
        minZoom: number;
        description: string;
        parent: string;
    };
    export const TOWER_PHENOLOGY_PLOT_BOUNDARIES: {
        name: string;
        nameSingular: string;
        type: any;
        descriptionFromParentDataFeatureKey: boolean;
        parent: string;
        parentDataFeatureKey: string;
        dataSource: string;
        matchLocationName: RegExp;
        matchLocationCoordinateMap: string[];
        minZoom: number;
        featureShape: string;
        style: {
            color: string;
            dashArray: string;
        };
        siteTerrain: string;
    };
    export const TOWER_SOIL_PLOT_BOUNDARIES: {
        name: string;
        nameSingular: string;
        type: any;
        descriptionFromParentDataFeatureKey: boolean;
        parent: string;
        parentDataFeatureKey: string;
        minZoom: number;
        featureShape: string;
        style: {
            color: string;
            dashArray: string;
        };
    };
    export const DISTRIBUTED_BIRD_GRID_BOUNDARIES: {
        name: string;
        nameSingular: string;
        type: any;
        descriptionFromParentDataFeatureKey: boolean;
        parent: string;
        parentDataFeatureKey: string;
        dataSource: string;
        matchLocationName: RegExp;
        matchLocationCoordinateMap: string[];
        minZoom: number;
        featureShape: string;
        style: {
            color: string;
            dashArray: string;
        };
        siteTerrain: string;
    };
    export const DISTRIBUTED_MAMMAL_GRID_BOUNDARIES: {
        name: string;
        nameSingular: string;
        type: any;
        descriptionFromParentDataFeatureKey: boolean;
        parent: string;
        parentDataFeatureKey: string;
        dataSource: string;
        matchLocationName: RegExp;
        matchLocationCoordinateMap: string[];
        minZoom: number;
        featureShape: string;
        style: {
            color: string;
            dashArray: string;
        };
        siteTerrain: string;
    };
    export const DISTRIBUTED_TICK_PLOT_BOUNDARIES: {
        name: string;
        nameSingular: string;
        type: any;
        descriptionFromParentDataFeatureKey: boolean;
        parent: string;
        parentDataFeatureKey: string;
        dataSource: string;
        matchLocationName: RegExp;
        matchLocationCoordinateMap: string[];
        minZoom: number;
        featureShape: string;
        style: {
            color: string;
            dashArray: string;
        };
        siteTerrain: string;
    };
    export const AQUATIC_SITE_FEATURES: {
        name: string;
        type: any;
        minZoom: number;
    };
    export const AQUATIC_BENCHMARKS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        parent: string;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const AQUATIC_AUTOMATED_INSTRUMENTS: {
        name: string;
        type: any;
        minZoom: number;
        parent: string;
    };
    export const AQUATIC_OBSERVATIONAL_SAMPLING: {
        name: string;
        type: any;
        minZoom: number;
        parent: string;
    };
    export const AQUATIC_RIPARIAN_ASSESSMENTS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        description: string;
        parent: string;
        featureShape: string;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const AQUATIC_WET_DEPOSITION_POINTS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        parent: string;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const AQUATIC_GROUNDWATER_WELLS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        description: string;
        parent: string;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const AQUATIC_METEOROLOGICAL_STATIONS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        description: string;
        parent: string;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const AQUATIC_DISCHARGE_POINTS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        parent: string;
        featureShape: string;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const AQUATIC_FISH_POINTS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        parent: string;
        featureShape: string;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const AQUATIC_PLANT_TRANSECTS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        parent: string;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const AQUATIC_SEDIMENT_POINTS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        parent: string;
        featureShape: string;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const AQUATIC_STAFF_GAUGES: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        description: string;
        parent: string;
        featureShape: string;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const AQUATIC_SENSOR_STATIONS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: RegExp;
        description: string;
        parent: string;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const AQUATIC_BUOYS: {
        name: string;
        nameSingular: string;
        type: any;
        minZoom: number;
        dataSource: string;
        matchLocationType: string;
        parent: string;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconShape: string;
        siteTerrain: string;
    };
    export const SITE_MARKERS: {
        name: string;
        type: any;
        maxZoom: number;
    };
    export const TERRESTRIAL_CORE_SITES: {
        name: string;
        nameSingular: string;
        type: any;
        description: string;
        parent: string;
        attributes: {
            type: string;
            terrain: string;
        };
        dataSource: string;
        primaryIdOnly: boolean;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconSelectedSvg: any;
        iconShape: string;
        maxZoom: number;
    };
    export const TERRESTRIAL_RELOCATABLE_SITES: {
        name: string;
        nameSingular: string;
        type: any;
        description: string;
        parent: string;
        attributes: {
            type: string;
            terrain: string;
        };
        dataSource: string;
        primaryIdOnly: boolean;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconSelectedSvg: any;
        iconShape: string;
        maxZoom: number;
    };
    export const AQUATIC_CORE_SITES: {
        name: string;
        nameSingular: string;
        type: any;
        description: string;
        parent: string;
        attributes: {
            type: string;
            terrain: string;
        };
        dataSource: string;
        primaryIdOnly: boolean;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconSelectedSvg: any;
        iconShape: string;
        maxZoom: number;
    };
    export const AQUATIC_RELOCATABLE_SITES: {
        name: string;
        nameSingular: string;
        type: any;
        description: string;
        parent: string;
        attributes: {
            type: string;
            terrain: string;
        };
        dataSource: string;
        primaryIdOnly: boolean;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconSelectedSvg: any;
        iconShape: string;
        maxZoom: number;
    };
    export const DECOMMISSIONED_SITES: {
        name: string;
        nameSingular: string;
        type: any;
        description: string;
        parent: string;
        attributes: {
            type: string;
            terrain: string;
        };
        dataSource: string;
        primaryIdOnly: boolean;
        featureShape: string;
        iconScale: number;
        iconSvg: any;
        iconSelectedSvg: any;
        iconShape: string;
        maxZoom: number;
    };
}
export namespace GRAPHQL_LOCATIONS_API_CONSTANTS {
    export { FEATURES_TO_MINZOOM_MAP };
    export { MINZOOM_TO_FEATURES_MAP };
}
export namespace BOUNDARY_COLORS {
    export const partialSelected: string;
    export const totalSelected: string;
    export const hover: string;
}
export function calculateFeatureAvailability(state: any): any;
export function getHref(key: any, arg?: any): string;
export namespace BASE_LAYERS {
    export namespace NATGEO_WORLD_MAP {
        export const title: string;
        export const shortAttribution: string;
        export const fullAttribution: string;
        export const url: string;
    }
    export namespace WORLD_IMAGERY {
        const title_1: string;
        export { title_1 as title };
        const shortAttribution_1: string;
        export { shortAttribution_1 as shortAttribution };
        const fullAttribution_1: string;
        export { fullAttribution_1 as fullAttribution };
        const url_1: string;
        export { url_1 as url };
    }
    export namespace WORLD_STREET_MAP {
        const title_2: string;
        export { title_2 as title };
        const shortAttribution_2: string;
        export { shortAttribution_2 as shortAttribution };
        const fullAttribution_2: string;
        export { fullAttribution_2 as fullAttribution };
        const url_2: string;
        export { url_2 as url };
    }
    export namespace WORLD_TOPO_MAP {
        const title_3: string;
        export { title_3 as title };
        const shortAttribution_3: string;
        export { shortAttribution_3 as shortAttribution };
        const fullAttribution_3: string;
        export { fullAttribution_3 as fullAttribution };
        const url_3: string;
        export { url_3 as url };
    }
}
export const BASE_LAYERS_BY_TITLE: {};
export namespace OVERLAY_GROUPS {
    export namespace NLCD {
        const title_4: string;
        export { title_4 as title };
        const description_20: string;
        export { description_20 as description };
        export namespace commonProps {
            export const format: string;
            export const transparent: boolean;
        }
    }
}
export const OVERLAY_GROUPS_BY_TITLE: {};
export namespace OVERLAYS {
    export namespace LAND_COVER {
        export const group: any;
        const title_5: string;
        export { title_5 as title };
        const description_21: string;
        export { description_21 as description };
        export namespace commonProps_1 {
            export const attribution: string;
        }
        export { commonProps_1 as commonProps };
        export { NLCD_CLASSES as legend };
        export const components: {
            type: string;
            key: string;
            props: {
                url: string;
                layers: string;
            };
        }[];
    }
    export namespace IMPERVIOUS {
        const group_1: any;
        export { group_1 as group };
        const title_6: string;
        export { title_6 as title };
        const description_22: string;
        export { description_22 as description };
        export namespace commonProps_2 {
            const attribution_1: string;
            export { attribution_1 as attribution };
        }
        export { commonProps_2 as commonProps };
        export const legend: {
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
        const components_1: {
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
export namespace DEFAULT_STATE {
    export namespace filters {
        export namespace features {
            export const available: any;
        }
    }
}
export namespace SITE_MAP_PROP_TYPES {
    export const view: PropTypes.Requireable<string>;
    export const aspectRatio: PropTypes.Requireable<number>;
    export const fullscreen: PropTypes.Requireable<boolean>;
    export const unusableVerticalSpace: PropTypes.Requireable<number>;
    export const mapCenter: PropTypes.Requireable<(number | null | undefined)[]>;
    export const mapZoom: PropTypes.Requireable<number>;
    export const mapBaseLayer: PropTypes.Requireable<string>;
    export const tableFullHeight: PropTypes.Requireable<boolean>;
    export const location: PropTypes.Requireable<string>;
    export const selection: PropTypes.Requireable<string>;
    export const selectedItems: PropTypes.Requireable<import("../../types/core").Nullable<string>[]>;
    export const validItems: PropTypes.Requireable<import("../../types/core").Nullable<string>[]>;
    export { SelectionLimitPropType as selectionLimit };
    export const onSelectionChange: PropTypes.Requireable<(...args: any[]) => any>;
    export const search: PropTypes.Requireable<string>;
    export const features: PropTypes.Requireable<import("../../types/core").Nullable<string>[]>;
    export const manualLocationData: PropTypes.Requireable<(PropTypes.InferProps<{
        manualLocationType: PropTypes.Validator<string>;
    }> | null | undefined)[]>;
}
export namespace SITE_MAP_DEFAULT_PROPS {
    const view_1: string;
    export { view_1 as view };
    const aspectRatio_1: null;
    export { aspectRatio_1 as aspectRatio };
    const fullscreen_1: boolean;
    export { fullscreen_1 as fullscreen };
    const unusableVerticalSpace_1: number;
    export { unusableVerticalSpace_1 as unusableVerticalSpace };
    export { OBSERVATORY_CENTER as mapCenter };
    const mapZoom_1: null;
    export { mapZoom_1 as mapZoom };
    const mapBaseLayer_1: string;
    export { mapBaseLayer_1 as mapBaseLayer };
    const tableFullHeight_1: boolean;
    export { tableFullHeight_1 as tableFullHeight };
    const location_1: null;
    export { location_1 as location };
    const selection_1: null;
    export { selection_1 as selection };
    const selectedItems_1: never[];
    export { selectedItems_1 as selectedItems };
    const validItems_1: null;
    export { validItems_1 as validItems };
    export const selectionLimit: null;
    export function onSelectionChange_1(): void;
    export { onSelectionChange_1 as onSelectionChange };
    const search_1: null;
    export { search_1 as search };
    const features_1: null;
    export { features_1 as features };
    const manualLocationData_1: null;
    export { manualLocationData_1 as manualLocationData };
}
export function getZoomedIcon(featureKey?: any, zoom?: number, highlight?: string, selection?: string): any;
export function getZoomedIcons(zoom: any): {};
export function mapIsAtFocusLocation(state?: {}): boolean;
export function getMapStateForFocusLocation(state?: {}): any;
export function findCentroid(coords?: any[]): any[] | null;
export function getMapStateForManualLocationData(state: any): any;
export function parseManualLocationFeatureData(state: any): any;
export function hydrateNeonContextData(state: any, neonContextData: any): any;
export function getDynamicAspectRatio(unusableVerticalSpace?: number): number;
export function boundsAreValid(bounds: any): boolean;
export function calculateLocationsInBounds(locations: any, bounds?: any, extendMap?: boolean, extendPoints?: number): string[];
export function deriveFullObservatoryZoomLevel(mapRef: any): number;
/**
   GRAPHQL_LOCATIONS_API Constants
   The Locations API groups fetchable assets by minZoom (i.e. all assets for all locations features
   with the same minZoom are fetched together, for a given field site). Thus we want lookups of
   minZoom by feature key and vice versa. These values never change, so derive them now.
*/
declare const FEATURES_TO_MINZOOM_MAP: {};
declare const MINZOOM_TO_FEATURES_MAP: {};
import PropTypes from "prop-types";
/**
   PropTypes and defaultProps
*/
declare function SelectionLimitPropType(props: any, propName: any): Error | null;
export {};
