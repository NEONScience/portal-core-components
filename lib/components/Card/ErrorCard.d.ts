import React from 'react';
import { BaseCardProps } from './BaseCard';
interface ErrorCardClasses {
    callout?: string;
    calloutIcon?: string;
}
declare type BaseErrorCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
declare type ErrorCardProps = BaseErrorCardProps & {
    classes?: ErrorCardClasses;
};
declare const ErrorCard: React.FC<ErrorCardProps>;
export default ErrorCard;
