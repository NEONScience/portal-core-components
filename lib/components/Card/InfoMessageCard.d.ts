import React from 'react';
import { BaseMessageCardProps } from './BaseMessageCard';
interface InfoMessageCardClasses {
    card?: string;
    primaryIcon?: string;
    secondaryIcon?: string;
    cardTitleContentContainer?: string;
    messageContentContainer?: string;
}
type BaseInfoMessageCardProps = Omit<BaseMessageCardProps, 'type' | 'messageCardClasses'>;
export type InfoMessageCardProps = BaseInfoMessageCardProps & {
    classes?: InfoMessageCardClasses;
};
declare const InfoCard: React.FC<InfoMessageCardProps>;
export default InfoCard;
