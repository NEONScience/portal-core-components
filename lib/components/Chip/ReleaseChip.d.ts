import React from 'react';
import { TooltipProps } from '@mui/material/Tooltip';
interface ReleaseChipClasses {
    chip?: string;
    icon?: string;
}
type ReleaseChipTooltipProps = Omit<TooltipProps, 'title'>;
interface ReleaseChipProps {
    tooltipTitle: React.ReactNode;
    chipLabel: string | React.ReactNode;
    classes?: ReleaseChipClasses;
    chipStyle?: React.CSSProperties;
    tooltipProps?: ReleaseChipTooltipProps;
}
declare const ReleaseChip: React.FC<ReleaseChipProps>;
export default ReleaseChip;
