import React, { useState } from 'react';

import Link from '@material-ui/core/Link';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step/Step';
import StepContent from '@material-ui/core/StepContent';
import StepButton from '@material-ui/core/StepButton';
import Typography from '@material-ui/core/Typography';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  makeStyles,
  createStyles,
} from '@material-ui/core/styles';

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import Theme from '../Theme/Theme';
import NeonSignInButton from '../NeonSignInButton/NeonSignInButton';
import { StylesHook } from '../../types/muiTypes';
import { NeonTheme } from '../Theme/types';
import { AccountValidationStep } from '../../types/account';
import { exists, existsNonEmpty } from '../../util/typeUtil';

const myAccountLink = (
  <Link
    target="_self"
    href={NeonEnvironment.route.buildAccountRoute()}
  >
    My Account
  </Link>
);

type ValidationStepDisplay = {
  displayLabel: string,
  getContents: (completed: boolean) => JSX.Element,
}

const VALIDATION_STEPS: Record<string, ValidationStepDisplay> = {
  login: {
    displayLabel: 'Sign In',
    getContents: (completed: boolean): JSX.Element => {
      if (!completed) {
        return (
          <div>
            <Typography variant="body2">
              Sign in or create an account before proceeding
            </Typography>
            <NeonSignInButton />
          </div>
        );
      }
      return (
        <Typography variant="body2">
          Sign In Completed
        </Typography>
      );
    },
  },
  'verify-email': {
    displayLabel: 'Verify Email',
    getContents: (completed: boolean): JSX.Element => {
      if (!completed) {
        return (
          <Typography variant="body2">
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            Navigate to {myAccountLink} to verify email
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          </Typography>
        );
      }
      return (
        <Typography variant="body2">
          Verify Email Completed
        </Typography>
      );
    },
  },
};

const getAppliedSteps = (
  isAuthenticated: boolean,
  accountValidationSteps?: AccountValidationStep[],
): AccountValidationStep[] => {
  if (!existsNonEmpty(accountValidationSteps)) {
    return [];
  }
  const loginStep: AccountValidationStep = {
    step: 'login',
    completed: isAuthenticated,
  };
  return [
    loginStep,
    ...(accountValidationSteps as AccountValidationStep[]),
  ];
};

const getInitialActiveStep = (accountValidationSteps: AccountValidationStep[]): string => {
  const initialStep: AccountValidationStep|undefined = accountValidationSteps.find(
    (value: AccountValidationStep): boolean => !value.completed,
  );
  if (!exists(initialStep)) {
    return accountValidationSteps[0].step;
  }
  return (initialStep as AccountValidationStep).step;
};

const getActiveStep = (
  activeStep: string,
  accountValidationSteps: AccountValidationStep[],
): AccountValidationStep|undefined => (
  accountValidationSteps.find((value: AccountValidationStep): boolean => (
    value.step === activeStep
  ))
);

const getActiveStepIndex = (
  activeStep: string,
  accountValidationSteps: AccountValidationStep[],
): number => {
  const idx = accountValidationSteps.findIndex((value: AccountValidationStep): boolean => (
    value.step === activeStep
  ));
  if (idx < 0) {
    return 0;
  }
  return idx;
};

const useStyles: StylesHook = makeStyles((theme: NeonTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    accountValidationNotesContainer: {
      margin: theme.spacing(1, 0, 0, 0),
    },
    validationStepsRoot: {
      width: '100%',
      margin: theme.spacing(2, 0, 2, 0),
    },
    validationStepperRoot: {
      margin: theme.spacing(1, 0, 0, 0),
      backgroundColor: 'transparent',
    },
    horizontalContentsContainer: {
      margin: theme.spacing(0, 0, 0, 4),
    },
  })) as StylesHook;

export type AccountValidationStepperProps = {
  isAuthenticated: boolean;
  accountValidated: boolean;
  accountValidationSteps: AccountValidationStep[];
};

const AccountValidationStepper: React.FC<AccountValidationStepperProps> = (
  props: AccountValidationStepperProps,
): JSX.Element => {
  const {
    isAuthenticated,
    accountValidated,
    accountValidationSteps,
  }: AccountValidationStepperProps = props;
  const appliedSteps: AccountValidationStep[] = getAppliedSteps(
    isAuthenticated,
    accountValidationSteps,
  );
  const classes = useStyles(Theme);
  const belowMd = useMediaQuery(Theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState<string>(getInitialActiveStep(appliedSteps));

  const renderVerticalStepContents = (): JSX.Element|null => {
    if (!belowMd) {
      return null;
    }
    const stepCompleted = getActiveStep(activeStep, appliedSteps)?.completed || false;
    const stepContents = exists(VALIDATION_STEPS[activeStep])
      ? VALIDATION_STEPS[activeStep].getContents(stepCompleted)
      : activeStep;
    return (
      <StepContent>
        {stepContents}
      </StepContent>
    );
  };
  const renderHorizontalStepContents = (): JSX.Element|null => {
    if (belowMd) {
      return null;
    }
    const stepCompleted = getActiveStep(activeStep, appliedSteps)?.completed || false;
    const stepContents = exists(VALIDATION_STEPS[activeStep])
      ? VALIDATION_STEPS[activeStep].getContents(stepCompleted)
      : activeStep;
    return (
      <div className={classes.horizontalContentsContainer}>
        {stepContents}
      </div>
    );
  };
  const renderValidationSteps = (steps: AccountValidationStep[]): JSX.Element[] => (
    steps.map((step: AccountValidationStep): JSX.Element => {
      const stepDisplayLabel = exists(VALIDATION_STEPS[step.step])
        ? VALIDATION_STEPS[step.step].displayLabel
        : step.step;
      return (
        <Step key={step.step} completed={step.completed}>
          <StepButton onClick={() => setActiveStep(step.step)} completed={step.completed}>
            {stepDisplayLabel}
          </StepButton>
          {renderVerticalStepContents()}
        </Step>
      );
    })
  );
  const renderValidation = (): JSX.Element|null => {
    if (exists(accountValidated) && (accountValidated === true)) {
      return null;
    }
    if (!existsNonEmpty(appliedSteps)) {
      return null;
    }
    return (
      <div className={classes.validationStepsRoot}>
        <Typography variant="subtitle2">
          Account Validation Steps
        </Typography>
        <Typography variant="body2" className={classes.accountValidationNotesContainer}>
          Information on account validation link.
        </Typography>
        <Stepper
          nonLinear
          orientation={belowMd ? 'vertical' : 'horizontal'}
          activeStep={getActiveStepIndex(activeStep, appliedSteps)}
          className={classes.validationStepperRoot}
        >
          {renderValidationSteps(appliedSteps)}
        </Stepper>
        {renderHorizontalStepContents()}
      </div>
    );
  };
  return (
    <div>
      {renderValidation()}
    </div>
  );
};

export default AccountValidationStepper;
