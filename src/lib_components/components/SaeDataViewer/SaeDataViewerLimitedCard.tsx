import React from 'react';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import LoginRequiredCard from '../Card/LoginRequiredCard';
import NeonContext from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonSignInButton from '../NeonSignInButton/NeonSignInButton';
import RouteService from '../../service/RouteService';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { AccountValidationStep } from '../../types/account';

import SaeDataViewerContext from './SaeDataViewerContext';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  messageContent: {
    margin: theme.spacing(0, 0, 2, 0),
  },
}));

const SaeDataViewerLimitedCard: React.FC = (): React.JSX.Element => {
  const state = SaeDataViewerContext.useSaeDataViewerContextState();
  const neonContextSessionState = NeonContext.useNeonContextSessionState();
  const { classes } = useStyles();
  if (!state.isViewerLimitedMode || !neonContextSessionState.ready) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
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
  const renderTitle = (): string => 'Viewing Limited SAE Viewer Data - Login Required';
  const renderContents = (): React.JSX.Element => {
    const details = `The SAE viewer is displaying a limited dataset that does not
      reflect the actual data availability for SAE data products. You must sign in or create
      and validate an account before viewing the full set of SAE data available.
      `;
    return (
      <Typography variant="body2" className={classes.messageContent}>
        {details}
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        {' '} Navigate to {myAccountLink} to sign in or create an account.
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        {' '} {accountInfoLink} about the benefits of having an account.
      </Typography>
    );
  };
  const renderSignInButton = (): React.JSX.Element => {
    if (neonContextSessionState.authenticated === true) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }
    return <NeonSignInButton disableMargin />;
  };
  return (
    <LoginRequiredCard
      showValidation
      customTitle={renderTitle()}
      customContent={(
        <>
          {renderContents()}
          {renderSignInButton()}
        </>
      )}
      isAuthenticated={neonContextSessionState.authenticated}
      accountValidated={neonContextSessionState.accountValidated}
      accountValidationSteps={
        (neonContextSessionState.accountValidationSteps as AccountValidationStep[] | undefined)
      }
    />
  );
};

export default SaeDataViewerLimitedCard;
