export default MapSelectionButton;
declare function MapSelectionButton(inProps: any): React.JSX.Element;
declare namespace MapSelectionButton {
    namespace propTypes {
        let label: PropTypes.Requireable<string>;
        let icon: PropTypes.Requireable<boolean>;
        let dialogTitle: PropTypes.Requireable<string>;
        let buttonProps: PropTypes.Requireable<PropTypes.InferProps<any>>;
        let siteMapProps: PropTypes.Requireable<PropTypes.InferProps<{
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
        }>>;
        let tooltipProps: PropTypes.Requireable<PropTypes.InferProps<any>>;
        let selection: PropTypes.Validator<string>;
        let validItems: PropTypes.Requireable<(string | null | undefined)[]>;
        let selectedItems: PropTypes.Requireable<(string | null | undefined)[]>;
        let selectionLimit: (props: any, propName: any) => Error | null;
        let onSave: PropTypes.Requireable<(...args: any[]) => any>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
