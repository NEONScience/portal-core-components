/**
   Primary Component
*/
declare function TimeSeriesViewerSites(props: any): React.JSX.Element;
declare namespace TimeSeriesViewerSites {
    export { TabComponentPropTypes as propTypes };
}
export default TimeSeriesViewerSites;
export function getTestableItems(): {
    ucWord?: undefined;
    PositionHistoryButton?: undefined;
    PositionDetail?: undefined;
    SelectedPosition?: undefined;
    SelectPositionsButton?: undefined;
    SitesControl?: undefined;
    SiteOption?: undefined;
    SelectedSite?: undefined;
} | {
    ucWord: (word: any) => string;
    PositionHistoryButton: typeof PositionHistoryButton;
    PositionDetail: typeof PositionDetail;
    SelectedPosition: typeof SelectedPosition;
    SelectPositionsButton: typeof SelectPositionsButton;
    SitesControl: typeof SitesControl;
    SiteOption: typeof SiteOption;
    SelectedSite: typeof SelectedSite;
};
import React from 'react';
import { TabComponentPropTypes } from './TimeSeriesViewerContext';
/**
   PositionHistoryButton - button that opens a dialog to show all history for a given position
*/
declare function PositionHistoryButton(inProps: any): React.JSX.Element;
declare namespace PositionHistoryButton {
    namespace propTypes {
        let siteCode: PropTypes.Validator<string>;
        let position: PropTypes.Validator<string>;
        let fullWidth: PropTypes.Requireable<boolean>;
        let history: PropTypes.Validator<(PropTypes.InferProps<{
            horVer: PropTypes.Validator<string>;
            azimuth: PropTypes.Requireable<number>;
            pitch: PropTypes.Requireable<number>;
            roll: PropTypes.Requireable<number>;
            sensorStartDateTime: PropTypes.Requireable<string>;
            sensorEndDateTime: PropTypes.Requireable<string>;
            xOffset: PropTypes.Requireable<number>;
            yOffset: PropTypes.Requireable<number>;
            zOffset: PropTypes.Requireable<number>;
            referenceLocationStartDateTime: PropTypes.Requireable<string>;
            referenceLocationEndDateTime: PropTypes.Requireable<string>;
            referenceLocationLatitude: PropTypes.Requireable<number>;
            referenceLocationLongitude: PropTypes.Requireable<number>;
            referenceLocationElevation: PropTypes.Requireable<number>;
        }> | null | undefined)[]>;
    }
}
/**
   PositionDetail - Component to display neatly-formatted position content
*/
declare function PositionDetail(inProps: any): React.JSX.Element;
declare namespace PositionDetail {
    export namespace propTypes_1 {
        let siteCode_1: PropTypes.Validator<string>;
        export { siteCode_1 as siteCode };
        let position_1: PropTypes.Validator<string>;
        export { position_1 as position };
        export let wide: PropTypes.Requireable<boolean>;
    }
    export { propTypes_1 as propTypes };
}
/**
   Selected Position - Component for a single deletable position paper to show within a SelectedSite
*/
declare function SelectedPosition(inProps: any): React.JSX.Element;
declare namespace SelectedPosition {
    export namespace propTypes_2 {
        let siteCode_2: PropTypes.Validator<string>;
        export { siteCode_2 as siteCode };
        let position_2: PropTypes.Validator<string>;
        export { position_2 as position };
        export let disabled: PropTypes.Requireable<boolean>;
    }
    export { propTypes_2 as propTypes };
}
/**
   SelectPositionsButton - button that opens a dialog for position selection
*/
declare function SelectPositionsButton(props: any): React.JSX.Element;
declare namespace SelectPositionsButton {
    export namespace propTypes_3 {
        let selectedSite: PropTypes.Validator<NonNullable<PropTypes.InferProps<{
            siteCode: PropTypes.Validator<string>;
            positions: PropTypes.Validator<(string | null | undefined)[]>;
        }>>>;
    }
    export { propTypes_3 as propTypes };
}
/**
   SitesControl - Component for the top-level Sites search field
*/
declare function SitesControl(props: any): React.JSX.Element;
declare namespace SitesControl {
    export { ControlPropTypes as propTypes };
}
/**
   SiteOption - Component for a single site as it appears in the drop-down menu
*/
declare function SiteOption(inProps: any): React.JSX.Element;
declare namespace SiteOption {
    export { OptionPropTypes as propTypes };
}
/**
   Selected Site - Component for a single deletable site paper to show below the search box
*/
declare function SelectedSite(inProps: any): React.JSX.Element;
declare namespace SelectedSite {
    let propTypes_4: {
        setSelectedTab: PropTypes.Validator<(...args: any[]) => any>;
        TAB_IDS: PropTypes.Validator<{
            [x: string]: string | null | undefined;
        }>;
        site: PropTypes.Validator<NonNullable<PropTypes.InferProps<{
            siteCode: PropTypes.Validator<string>;
            positions: PropTypes.Validator<(string | null | undefined)[]>;
        }>>>;
        disabled: PropTypes.Requireable<boolean>;
    };
    export { propTypes_4 as propTypes };
}
import PropTypes from 'prop-types';
declare namespace ControlPropTypes {
    let children: PropTypes.Validator<NonNullable<PropTypes.ReactNodeLike>>;
    let innerProps: PropTypes.Validator<NonNullable<PropTypes.InferProps<{
        onMouseDown: PropTypes.Validator<(...args: any[]) => any>;
    }>>>;
    let innerRef: PropTypes.Validator<NonNullable<NonNullable<((...args: any[]) => any) | PropTypes.InferProps<{
        current: PropTypes.Validator<any>;
    }> | null | undefined>>>;
    let selectProps: PropTypes.Validator<object>;
}
declare namespace OptionPropTypes {
    let children_1: PropTypes.Requireable<PropTypes.ReactNodeLike>;
    export { children_1 as children };
    let innerProps_1: PropTypes.Requireable<PropTypes.InferProps<{
        id: PropTypes.Validator<string>;
        key: PropTypes.Requireable<string>;
        onClick: PropTypes.Requireable<(...args: any[]) => any>;
        onMouseMove: PropTypes.Requireable<(...args: any[]) => any>;
        onMouseOver: PropTypes.Requireable<(...args: any[]) => any>;
        tabIndex: PropTypes.Validator<number>;
    }>>;
    export { innerProps_1 as innerProps };
    let innerRef_1: PropTypes.Requireable<NonNullable<((...args: any[]) => any) | PropTypes.InferProps<{
        current: PropTypes.Validator<any>;
    }> | null | undefined>>;
    export { innerRef_1 as innerRef };
    export let isFocused: PropTypes.Validator<boolean>;
    export let isSelected: PropTypes.Validator<boolean>;
    export let isDisabled: PropTypes.Requireable<boolean>;
    export let data: PropTypes.Validator<object>;
}
