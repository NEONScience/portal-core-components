import React from 'react';
import { BaseCardProps } from './BaseCard';
interface InfoCardClasses {
    callout?: string;
    calloutIcon?: string;
}
declare type BaseInfoCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
declare type InfoCardProps = BaseInfoCardProps & {
    classes?: InfoCardClasses;
};
declare const InfoCard: React.FC<InfoCardProps>;
export default InfoCard;
