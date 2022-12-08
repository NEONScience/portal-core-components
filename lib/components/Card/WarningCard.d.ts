import React from 'react';
import { BaseCardProps } from './BaseCard';
interface WarningCardClasses {
    callout?: string;
    calloutIcon?: string;
}
type BaseWarningCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
type WarningCardProps = BaseWarningCardProps & {
    classes?: WarningCardClasses;
};
declare const WarningCard: React.FC<WarningCardProps>;
export default WarningCard;
