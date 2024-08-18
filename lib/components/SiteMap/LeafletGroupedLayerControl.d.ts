/** @jsxImportSource @emotion/react */
import React from 'react';
import { type ControlOptions } from 'leaflet';
export interface BaseLayer {
    name: string;
    title: string;
}
export interface Overlay {
    checked: boolean;
    groupTitle: string;
    name: string;
    title: string;
}
export interface LeafletGroupedLayerControlProps extends ControlOptions {
    baseLayers: BaseLayer[];
    checkedBaseLayer: string;
    exclusiveGroups?: string[];
    overlays?: Overlay[];
    renderToLeafletControlContainer?: boolean;
    onBaseLayerChange?: (id: string) => void;
    onOverlayChange?: (newOverlays: Overlay[]) => void;
}
declare const LeafletGroupedLayerControl: React.FC<LeafletGroupedLayerControlProps>;
export default LeafletGroupedLayerControl;
