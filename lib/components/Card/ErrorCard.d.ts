import React from 'react';
import { BaseCardProps } from './BaseCard';
interface ErrorCardClasses {
    callout?: string;
    calloutIcon?: string;
}
type BaseErrorCardProps = Omit<BaseCardProps, 'type' | 'calloutClasses'>;
type ErrorCardProps = BaseErrorCardProps & {
    classes?: ErrorCardClasses;
};
declare const ErrorCard: React.FC<ErrorCardProps>;
export default ErrorCard;
