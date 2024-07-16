export default SiteMapContext;
export function getTestableItems(): {
    deriveRegionSelections?: undefined;
    isSelectable?: undefined;
    getSelectableSet?: undefined;
    validateSelection?: undefined;
    isBasePlot?: undefined;
    zoomIsValid?: undefined;
    centerIsValid?: undefined;
    calculateFeatureDataFetches?: undefined;
    updateMapTileWithZoom?: undefined;
    completeOverallFetch?: undefined;
    applyFeatureVisibilityToChildren?: undefined;
    applyFeatureVisibilityToParents?: undefined;
    setFetchStatusFromAction?: undefined;
    reducer?: undefined;
} | {
    deriveRegionSelections: (state: any) => any;
    isSelectable: (item: any, validSet?: null) => any;
    getSelectableSet: (setArg: any, validSet?: null) => Set<any>;
    validateSelection: (state: any) => any;
    isBasePlot: (featureKey: any) => boolean;
    zoomIsValid: (zoom: any) => boolean;
    centerIsValid: (center: any) => boolean;
    calculateFeatureDataFetches: (state: any, requiredSites?: any[]) => any;
    updateMapTileWithZoom: (state: any) => any;
    completeOverallFetch: (state: any) => any;
    applyFeatureVisibilityToChildren: (state: any, feature: any, visible: any) => any;
    applyFeatureVisibilityToParents: (state: any, feature: any) => any;
    setFetchStatusFromAction: (state: any, action: any, status: any) => any;
    reducer: (state: any, action: any) => any;
};
declare namespace SiteMapContext {
    export { Provider };
    export { useSiteMapContext };
    export { SORT_DIRECTIONS };
    export { VIEWS };
}
/** Context Provider */
declare function Provider(props: any): import("react/jsx-runtime").JSX.Element;
declare namespace Provider {
    export const propTypes: {
        children: PropTypes.Validator<NonNullable<NonNullable<PropTypes.ReactNodeLike>>>;
        view: PropTypes.Requireable<string>;
        aspectRatio: PropTypes.Requireable<number>;
        fullscreen: PropTypes.Requireable<boolean>;
        unusableVerticalSpace: PropTypes.Requireable<number>;
        mapUniqueId: PropTypes.Requireable<number>;
        mapCenter: PropTypes.Requireable<(number | null | undefined)[]>;
        mapZoom: PropTypes.Requireable<number>;
        mapBaseLayer: PropTypes.Requireable<string>;
        tableFullHeight: PropTypes.Requireable<boolean>;
        location: PropTypes.Requireable<string>;
        selection: PropTypes.Requireable<string>;
        selectedItems: PropTypes.Requireable<(string | null | undefined)[]>;
        validItems: PropTypes.Requireable<(string | null | undefined)[]>;
        selectionLimit: (props: any, propName: any) => Error | null;
        onSelectionChange: PropTypes.Requireable<(...args: any[]) => any>;
        search: PropTypes.Requireable<string>;
        features: PropTypes.Requireable<(string | null | undefined)[]>;
        manualLocationData: PropTypes.Requireable<(PropTypes.InferProps<{
            manualLocationType: PropTypes.Validator<string>;
        }> | null | undefined)[]>;
    };
    export { SITE_MAP_DEFAULT_PROPS as defaultProps };
}
declare function useSiteMapContext(): {
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
        zoom: null;
        center: never[];
        bounds: null;
        baseLayer: null;
        baseLayerAutoChangedAbove17: boolean;
        overlays: Set<any>;
        mouseMode: string;
        zoomedIcons: {};
        repositionOpenPopupFunc: null;
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
} | ({
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
        zoom: null;
        center: never[];
        bounds: null;
        baseLayer: null;
        baseLayerAutoChangedAbove17: boolean;
        overlays: Set<any>;
        mouseMode: string;
        zoomedIcons: {};
        repositionOpenPopupFunc: null;
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
} | (() => void))[];
import { SORT_DIRECTIONS } from "./SiteMapUtils";
import { VIEWS } from "./SiteMapUtils";
import PropTypes from "prop-types";
import { SITE_MAP_DEFAULT_PROPS } from "./SiteMapUtils";
