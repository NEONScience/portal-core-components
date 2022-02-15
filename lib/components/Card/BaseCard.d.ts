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
    calloutClasses: BaseCardClasses;
    title?: string;
    titleContent?: React.ReactNode;
    message?: string;
    actionLabel?: string;
    onActionClick?: () => void;
}
declare const BaseCard: React.FC<BaseCardProps>;
export default BaseCard;
