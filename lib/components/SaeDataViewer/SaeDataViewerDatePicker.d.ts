import React from 'react';
export declare enum DateSelectionType {
    RANGE = "RANGE",
    SINGLE = "SINGLE"
}
interface SaeDataViewerDatePickerProps {
    sidebarMode?: boolean;
}
declare const SaeDataViewerDatePicker: React.FC<SaeDataViewerDatePickerProps>;
export default SaeDataViewerDatePicker;
