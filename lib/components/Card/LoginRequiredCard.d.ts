import React from 'react';
import { ValidationStepDisplay } from '../Accounts/AccountValidationStepper';
import { InfoMessageCardProps } from './InfoMessageCard';
import { AccountValidationStep } from '../../types/account';
export type LoginRequiredProps = InfoMessageCardProps & {
    customTitle?: string;
    customContent?: React.ReactNode;
    isAuthenticated?: boolean;
    showValidation?: boolean;
    accountValidated?: boolean;
    accountValidationSteps?: AccountValidationStep[];
    accountValidationStepDisplay?: Record<string, ValidationStepDisplay>;
};
declare const LoginRequiredCard: React.FC<LoginRequiredProps>;
export default LoginRequiredCard;
