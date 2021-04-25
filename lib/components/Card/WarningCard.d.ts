import React from 'react';
import { BaseCardProps } from './BaseCard';
interface WarningCardClasses {
    callout?: string;
    calloutIcon?: string;
}
declare type BaseWarningCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
declare type WarningCardProps = BaseWarningCardProps & {
    classes?: WarningCardClasses;
};
declare const WarningCard: React.FC<WarningCardProps>;
export default WarningCard;
