import React from 'react';
export interface SidebarFilterOption {
    title: string;
    value: string;
}
export interface SidebarFilterProps {
    title: string;
    selected: string;
    values: SidebarFilterOption[];
    onChange: (value: string) => void;
    skeleton?: boolean;
    maxWidth?: number;
    horizontal?: boolean;
    tooltipText?: string;
    helperText?: string;
}
declare const SidebarFilter: React.FC<SidebarFilterProps>;
export default SidebarFilter;
