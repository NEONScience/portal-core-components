import React from 'react';

import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import AccountValidationStepper, { ValidationStepDisplay } from '../Accounts/AccountValidationStepper';
import InfoMessageCard, { InfoMessageCardProps } from './InfoMessageCard';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonSignInButton from '../NeonSignInButton/NeonSignInButton';
import RouteService from '../../service/RouteService';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { AccountValidationStep } from '../../types/account';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  loginContentsDivider: {
    margin: theme.spacing(0, 0, 2, 0),
  },
  messageContent: {
    margin: theme.spacing(0, 0, 2, 0),
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
}));

export type LoginRequiredProps = InfoMessageCardProps & {
  customTitle?: string;
  customContent?: React.ReactNode;
  isAuthenticated?: boolean;
  showValidation?: boolean;
  accountValidated?: boolean;
  accountValidationSteps?: AccountValidationStep[];
  accountValidationStepDisplay?: Record<string, ValidationStepDisplay>;
};

const defaultProps = {
  customTitle: undefined,
  customContent: undefined,
  isAuthenticated: false,
  showValidation: true,
  accountValidated: undefined,
  accountValidationSteps: undefined,
  accountValidationStepDisplay: undefined,
};

const LoginRequiredCard: React.FC<LoginRequiredProps> = (
  inProps: LoginRequiredProps,
): React.JSX.Element => {
  const props = resolveProps(defaultProps, inProps) as LoginRequiredProps;
  const {
    customTitle,
    customContent,
    isAuthenticated,
    showValidation,
    accountValidated,
    accountValidationSteps,
    accountValidationStepDisplay,
  }: LoginRequiredProps = props;
  const { classes } = useStyles();
  const hasValidationSteps = existsNonEmpty(accountValidationSteps);

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

  const renderValidation = (): React.JSX.Element|null => {
    if (showValidation !== true) {
      return null;
    }
    if (exists(accountValidated) && (accountValidated === true)) {
      return null;
    }
    if (!hasValidationSteps) {
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
  const renderContents = (): React.JSX.Element => {
    let message: React.JSX.Element;
    if (exists(customContent)) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      message = (<>{customContent}</>);
    } else {
      message = (
        <>
          <Typography variant="body2" className={classes.messageContent}>
            You must sign in or create and validate an account before proceeding.
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            {' '} Navigate to {myAccountLink} to sign in or create an account.
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            {' '} {accountInfoLink} about the benefits of having an account.
          </Typography>
          {!hasValidationSteps ? <NeonSignInButton disableMargin /> : null}
        </>
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

export default LoginRequiredCard;
