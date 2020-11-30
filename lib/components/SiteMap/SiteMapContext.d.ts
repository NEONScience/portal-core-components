export default SiteMapContext;
declare namespace SiteMapContext {
    export { Provider };
    export { useSiteMapContext };
    export { SORT_DIRECTIONS };
    export { VIEWS };
}
/**
   Context Provider
*/
declare function Provider(props: any): JSX.Element;
declare namespace Provider {
    export const propTypes: {
        children: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
        view: PropTypes.Requireable<string>;
        aspectRatio: PropTypes.Requireable<number>;
        fullscreen: PropTypes.Requireable<boolean>;
        unusableVerticalSpace: PropTypes.Requireable<number>;
        mapCenter: PropTypes.Requireable<(number | null | undefined)[]>;
        mapZoom: PropTypes.Requireable<number>;
        mapBaseLayer: PropTypes.Requireable<string>;
        tableFullHeight: PropTypes.Requireable<boolean>;
        location: PropTypes.Requireable<string>;
        selection: PropTypes.Requireable<string>;
        selectedItems: PropTypes.Requireable<import("../../types/core").Nullable<string>[]>;
        validItems: PropTypes.Requireable<import("../../types/core").Nullable<string>[]>;
        selectionLimit: (props: any, propName: any) => Error | null;
        onSelectionChange: PropTypes.Requireable<(...args: any[]) => any>;
        search: PropTypes.Requireable<string>;
        features: PropTypes.Requireable<import("../../types/core").Nullable<string>[]>;
    };
    export { SITE_MAP_DEFAULT_PROPS as defaultProps };
}
declare function useSiteMapContext(): any[] | {
    view: {
        current: null;
        initialized: {
            [k: string]: boolean;
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
};
import { SORT_DIRECTIONS } from "./SiteMapUtils";
import { VIEWS } from "./SiteMapUtils";
import PropTypes from "prop-types";
import { SITE_MAP_DEFAULT_PROPS } from "./SiteMapUtils";
