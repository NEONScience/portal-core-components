export default SiteMapContext;
declare namespace SiteMapContext {
    export { Provider };
    export { useSiteMapContext };
    export { SORT_DIRECTIONS };
    export { VIEWS };
}
declare function Provider(props: any): JSX.Element;
declare namespace Provider {
    export const propTypes: {
        children: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
        view: PropTypes.Requireable<string>;
        aspectRatio: PropTypes.Requireable<number>;
        filterPosition: PropTypes.Requireable<string>;
        mapCenter: PropTypes.Requireable<(number | null | undefined)[]>;
        mapZoom: PropTypes.Requireable<number>;
        mapTileLayer: PropTypes.Requireable<string>;
        location: PropTypes.Requireable<string>;
        selection: PropTypes.Requireable<string>;
        maxSelectable: PropTypes.Requireable<number>;
        search: PropTypes.Requireable<string>;
        features: PropTypes.Requireable<import("../../types/coreTypes").Nullable<string>[]>;
    };
    export { SITE_MAP_DEFAULT_PROPS as defaultProps };
}
declare function useSiteMapContext(): any[] | {
    view: {
        current: null;
        initialized: {
            [x: string]: boolean;
            [x: number]: boolean;
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
    };
    aspectRatio: {
        currentValue: null;
        isDynamic: boolean;
        resizeEventListenerInitialized: boolean;
        widthReference: number;
    };
    table: {
        focus: string;
        availableFeatureTypes: {
            [x: string]: boolean;
        };
        maxBodyHeight: null;
        maxBodyHeightUpdateFromAspectRatio: boolean;
    };
    map: {
        zoom: null;
        center: never[];
        bounds: null;
        tileLayer: null;
        tileLayerAutoChangedAbove17: boolean;
        zoomedIcons: {};
        repositionOpenPopupFunc: null;
    };
    selection: {
        active: null;
        maxSelectable: number;
        derived: {
            [x: number]: {};
        };
    };
    featureDataFetchesHasAwaiting: boolean;
    featureDataFetches: {
        [x: string]: {};
        [x: number]: {};
    };
    featureData: {
        [x: string]: {};
        [x: number]: {};
    };
    sites: {};
    filters: {
        position: null;
        search: null;
        features: {
            open: boolean;
            available: {};
            visible: {
                [x: string]: boolean;
                [x: number]: boolean;
            };
            collapsed: Set<any>;
        };
    };
};
import { SORT_DIRECTIONS } from "./SiteMapUtils";
import { VIEWS } from "./SiteMapUtils";
import PropTypes from "prop-types";
import { SITE_MAP_DEFAULT_PROPS } from "./SiteMapUtils";
