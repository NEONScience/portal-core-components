import React from 'react';
import { BaseCardProps } from './BaseCard';
export declare type WarningCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
declare const WarningCard: React.FC<WarningCardProps>;
export default WarningCard;
