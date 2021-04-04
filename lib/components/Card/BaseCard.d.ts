import React from 'react';
export declare enum CardType {
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR"
}
export interface BaseCardClasses {
    callout: string;
    calloutIcon: string;
}
export interface BaseCardProps {
    type: CardType;
    title: string;
    calloutClasses: BaseCardClasses;
    message?: string;
}
declare const BaseCard: React.FC<BaseCardProps>;
export default BaseCard;
