import React from 'react';

import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import {
  makeStyles,
  createStyles,
} from '@material-ui/core/styles';

import AccountValidationStepper, { ValidationStepDisplay } from '../Accounts/AccountValidationStepper';
import InfoMessageCard, { InfoMessageCardProps } from './InfoMessageCard';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import Theme from '../Theme/Theme';
import RouteService from '../../service/RouteService';
import { StylesHook } from '../../types/muiTypes';
import { NeonTheme } from '../Theme/types';
import { AccountValidationStep } from '../../types/account';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../util/typeUtil';

const useStyles: StylesHook = makeStyles((theme: NeonTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    loginContentsDivider: {
      margin: theme.spacing(2, 0, 2, 0),
    },
    card: {
      margin: theme.spacing(0.5, 0, 3, 0),
      backgroundColor: theme.colors.GOLD[50],
      borderColor: theme.colors.GOLD[300],
    },
    cardSecondaryIcon: {
      color: theme.colors.GOLD[300],
      marginLeft: theme.spacing(2),
    },
  })) as StylesHook;

export type LoginRequiredProps = InfoMessageCardProps & {
  customTitle?: string;
  isAuthenticated?: boolean;
  details?: string;
  showValidation?: boolean;
  accountValidated?: boolean;
  accountValidationSteps?: AccountValidationStep[];
  accountValidationStepDisplay?: Record<string, ValidationStepDisplay>;
};

const LoginRequiredCard: React.FC<LoginRequiredProps> = (
  props: LoginRequiredProps,
): JSX.Element => {
  const {
    customTitle,
    isAuthenticated,
    details,
    showValidation,
    accountValidated,
    accountValidationSteps,
    accountValidationStepDisplay,
  }: LoginRequiredProps = props;
  const classes = useStyles(Theme);

  const myAccountLink = (
    <Link
      target="_self"
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

  const renderValidation = (): JSX.Element|null => {
    if (showValidation !== true) {
      return null;
    }
    if (exists(accountValidated) && (accountValidated === true)) {
      return null;
    }
    if (!existsNonEmpty(accountValidationSteps)) {
      return null;
    }
    return (
      <AccountValidationStepper
        isAuthenticated={isAuthenticated as boolean}
        accountValidated={accountValidated as boolean}
        accountValidationSteps={accountValidationSteps as AccountValidationStep[]}
        accountValidationStepDisplay={accountValidationStepDisplay}
      />
    );
  };
  const renderContents = (): JSX.Element => {
    const appliedDetails = isStringNonEmpty(details)
      ? details
      : undefined;
    let message: JSX.Element;
    if (isStringNonEmpty(appliedDetails)) {
      message = (
        <Typography variant="body2">
          {appliedDetails}
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          {' '} Navigate to {myAccountLink} to sign in or create an account.
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          {' '} {accountInfoLink} about the benefits of having an account.
        </Typography>
      );
    } else {
      message = (
        <Typography variant="body2">
          You must sign in or create and validate an account before proceeding.
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          {' '} Navigate to {myAccountLink} to sign in or create an account.
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          {' '} {accountInfoLink} about the benefits of having an account.
        </Typography>
      );
    }
    return (
      <>
        <Divider className={classes.loginContentsDivider} />
        <div>
          {message}
          {renderValidation()}
        </div>
      </>
    );
  };
  return (
    <InfoMessageCard
      {...props}
      title={isStringNonEmpty(customTitle) ? customTitle : 'Login Required'}
      classes={{
        card: classes.card,
        secondaryIcon: classes.cardSecondaryIcon,
      }}
      messageContent={renderContents()}
    />
  );
};

LoginRequiredCard.defaultProps = {
  customTitle: undefined,
  isAuthenticated: false,
  details: undefined,
  showValidation: true,
  accountValidated: undefined,
  accountValidationSteps: undefined,
  accountValidationStepDisplay: undefined,
};

export default LoginRequiredCard;
