import React from 'react';
import { BaseCardProps } from './BaseCard';
interface InfoCardClasses {
    callout?: string;
    calloutIcon?: string;
}
type BaseInfoCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
type InfoCardProps = BaseInfoCardProps & {
    classes?: InfoCardClasses;
};
declare const InfoCard: React.FC<InfoCardProps>;
export default InfoCard;
