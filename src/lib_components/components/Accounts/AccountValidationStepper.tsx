import React, { useState } from 'react';

import Divider from '@material-ui/core/Divider';
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
import CompletedIcon from '@material-ui/icons/CheckCircle';
import VerifiedEmailIcon from '@material-ui/icons/VerifiedUser';

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import Theme from '../Theme/Theme';
import NeonSignInButton from '../NeonSignInButton/NeonSignInButton';
import RouteService from '../../service/RouteService';
import { StylesHook } from '../../types/muiTypes';
import { NeonTheme } from '../Theme/types';
import { AccountValidationStep } from '../../types/account';
import { exists, existsNonEmpty } from '../../util/typeUtil';

const myAccountLink = (
  <Link
    target="_blank"
    href={NeonEnvironment.route.buildAccountRoute()}
  >
    My Account
  </Link>
);
const accountInfoLink = (
  <Link
    target="_blank"
    href={RouteService.getUserAccountsPath()}
  >
    Learn
  </Link>
);

export type ValidationStepDisplay = {
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
            <Typography variant="body2" style={{ marginBottom: Theme.spacing(2) }}>
              Sign in or create an account before proceeding
            </Typography>
            <NeonSignInButton disableMargin />
          </div>
        );
      }
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CompletedIcon color="primary" style={{ marginRight: Theme.spacing(1.5) }} />
          <Typography variant="body2">
            Sign In Completed
          </Typography>
        </div>
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <VerifiedEmailIcon color="primary" style={{ marginRight: Theme.spacing(1.5) }} />
          <Typography variant="body2">
            Email Verified
          </Typography>
        </div>
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

const hasStep = (
  activeStep: string,
  customSteps?: Record<string, ValidationStepDisplay>,
): boolean => (
  exists(VALIDATION_STEPS[activeStep])
    || (exists(customSteps)
      && exists((customSteps as Record<string, ValidationStepDisplay>)[activeStep]))
);

const getStepDisplayLabel = (
  activeStep: string,
  customSteps?: Record<string, ValidationStepDisplay>,
): string => {
  const hasCustomStep = (exists(customSteps)
    && exists((customSteps as Record<string, ValidationStepDisplay>)[activeStep]));
  if (hasCustomStep) {
    const coercedStep = (customSteps as Record<string, ValidationStepDisplay>)[activeStep];
    return coercedStep.displayLabel;
  }
  if (exists(VALIDATION_STEPS[activeStep])) {
    return VALIDATION_STEPS[activeStep].displayLabel;
  }
  return activeStep;
};

const getStepContents = (
  activeStep: string,
  stepCompleted: boolean,
  customSteps?: Record<string, ValidationStepDisplay>,
): JSX.Element => {
  const hasCustomStep = (exists(customSteps)
    && exists((customSteps as Record<string, ValidationStepDisplay>)[activeStep]));
  if (hasCustomStep) {
    const coercedStep = (customSteps as Record<string, ValidationStepDisplay>)[activeStep];
    return coercedStep.getContents(stepCompleted);
  }
  if (exists(VALIDATION_STEPS[activeStep])) {
    return VALIDATION_STEPS[activeStep].getContents(stepCompleted);
  }
  return <div>{activeStep}</div>;
};

const useStyles: StylesHook = makeStyles((theme: NeonTheme) => createStyles({
  accountValidationNotesContainer: {
    margin: theme.spacing(1, 0, 0, 0),
  },
  stepperTopDivider: {
    margin: theme.spacing(2, 0, 0, 0),
  },
  stepperBottomDivider: {
    margin: theme.spacing(1, 0, 2, 0),
  },
  validationStepsRoot: {
    width: '100%',
    margin: theme.spacing(2, 0, 0, 0),
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
  accountValidationStepDisplay?: Record<string, ValidationStepDisplay>;
};

const AccountValidationStepper: React.FC<AccountValidationStepperProps> = (
  props: AccountValidationStepperProps,
): JSX.Element => {
  const {
    isAuthenticated,
    accountValidated,
    accountValidationSteps,
    accountValidationStepDisplay,
  }: AccountValidationStepperProps = props;
  const appliedSteps: AccountValidationStep[] = getAppliedSteps(
    isAuthenticated,
    accountValidationSteps,
  );
  const classes = useStyles(Theme);
  const belowMd = useMediaQuery(Theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState<string>(getInitialActiveStep(appliedSteps));

  const renderStepsCompleted = (): string => {
    if (appliedSteps.length <= 0) {
      return 'Complete all validation steps';
    }
    const numCompleted = appliedSteps.reduce(
      (acc: number, item: AccountValidationStep): number => (
        acc + (item.completed === true ? 1 : 0)
      ),
      0,
    );
    if (numCompleted === appliedSteps.length) {
      return 'All steps completed';
    }
    return `${numCompleted} of ${appliedSteps.length} completed`;
  };
  const renderVerticalStepContents = (): JSX.Element|null => {
    if (!belowMd) {
      return null;
    }
    const stepCompleted = getActiveStep(activeStep, appliedSteps)?.completed || false;
    const stepContents = hasStep(activeStep, accountValidationStepDisplay)
      ? getStepContents(activeStep, stepCompleted, accountValidationStepDisplay)
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
    const stepContents = hasStep(activeStep, accountValidationStepDisplay)
      ? getStepContents(activeStep, stepCompleted, accountValidationStepDisplay)
      : activeStep;
    return (
      <div className={classes.horizontalContentsContainer}>
        {stepContents}
      </div>
    );
  };
  const renderValidationSteps = (steps: AccountValidationStep[]): JSX.Element[] => (
    steps.map((step: AccountValidationStep): JSX.Element => {
      const stepDisplayLabel = hasStep(step.step, accountValidationStepDisplay)
        ? getStepDisplayLabel(step.step, accountValidationStepDisplay)
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
        <Typography variant="caption">
          {renderStepsCompleted()}
        </Typography>
        <Typography variant="body2" className={classes.accountValidationNotesContainer}>
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          {accountInfoLink} about account validation.
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        </Typography>
        <Divider className={classes.stepperTopDivider} />
        <Stepper
          nonLinear
          orientation={belowMd ? 'vertical' : 'horizontal'}
          activeStep={getActiveStepIndex(activeStep, appliedSteps)}
          className={classes.validationStepperRoot}
        >
          {renderValidationSteps(appliedSteps)}
        </Stepper>
        {belowMd ? null : <Divider className={classes.stepperBottomDivider} /> }
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

AccountValidationStepper.defaultProps = {
  accountValidationStepDisplay: undefined,
};

export default AccountValidationStepper;
