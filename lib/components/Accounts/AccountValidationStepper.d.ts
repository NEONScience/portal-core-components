import React from 'react';
import { AccountValidationStep } from '../../types/account';
export type AccountValidationStepperProps = {
    isAuthenticated: boolean;
    accountValidated: boolean;
    accountValidationSteps: AccountValidationStep[];
};
declare const AccountValidationStepper: React.FC<AccountValidationStepperProps>;
export default AccountValidationStepper;
