import React from 'react';
import { BaseCardProps } from './BaseCard';
export declare type InfoCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
declare const InfoCard: React.FC<InfoCardProps>;
export default InfoCard;
