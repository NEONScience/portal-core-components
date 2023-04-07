import React from 'react';
export declare enum MessageCardType {
    INFO = "INFO"
}
export interface BaseMessageCardClasses {
    card: string;
    primaryIcon: string;
    secondaryIcon: string;
    cardTitleContentContainer?: string;
    messageContentContainer?: string;
}
export interface BaseMessageCardProps {
    type: MessageCardType;
    messageCardClasses: BaseMessageCardClasses;
    icon?: React.ReactNode;
    title?: string;
    titleContent?: React.ReactNode;
    message?: string;
    messageContent?: React.ReactNode;
}
declare const BaseMessageCard: React.FC<BaseMessageCardProps>;
export default BaseMessageCard;
