import React from 'react';
import { InfoMessageCardProps } from './InfoMessageCard';
import { AccountValidationStep } from '../../types/account';
export type LoginRequiredProps = InfoMessageCardProps & {
    isAuthenticated?: boolean;
    details?: string;
    showValidation?: boolean;
    accountValidated?: boolean;
    accountValidationSteps?: AccountValidationStep[];
};
declare const LoginRequiredCard: React.FC<LoginRequiredProps>;
export default LoginRequiredCard;
