import React from 'react';
import { BaseCardProps } from './BaseCard';
export declare type ErrorCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
declare const InfoCard: React.FC<ErrorCardProps>;
export default InfoCard;
