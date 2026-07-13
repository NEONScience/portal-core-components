import React from 'react';
import { AccountValidationStep } from '../../types/account';
export type ValidationStepDisplay = {
    displayLabel: string;
    getContents: (completed: boolean) => React.JSX.Element;
};
export type AccountValidationStepperProps = {
    isAuthenticated: boolean;
    accountValidated: boolean;
    accountValidationSteps: AccountValidationStep[];
    accountValidationStepDisplay?: Record<string, ValidationStepDisplay>;
};
declare const AccountValidationStepper: React.FC<AccountValidationStepperProps>;
export default AccountValidationStepper;
