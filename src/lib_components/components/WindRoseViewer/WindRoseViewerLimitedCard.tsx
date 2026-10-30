import React from 'react';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { useStateContext, useWindRoseViewerAccess, WindRoseViewerState } from './Context';

import LoginRequiredCard from '../Card/LoginRequiredCard';
import NeonAuthContext from '../NeonContext/NeonAuthContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonSignInButton from '../NeonSignInButton/NeonSignInButton';
import RouteService from '../../service/RouteService';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { AccountValidationStep } from '../../types/account';
import { Nullable } from '../../types/core';
import { isStringNonEmpty } from '../../util/typeUtil';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  messageContent: {
    margin: theme.spacing(0, 0, 2, 0),
  },
}));

/**
 * Indicates that the viewer is displaying a limited dataset because the user is not signed in
 * to an account that can access data
 */
const WindRoseViewerLimitedCard: React.FC = (): Nullable<React.JSX.Element> => {
  const { classes } = useStyles();
  const { release }: WindRoseViewerState = useStateContext();
  const { ready, isViewerLimited } = useWindRoseViewerAccess();
  const neonAuthContextSessionState = NeonAuthContext.useNeonAuthContextSessionState();
  if (!ready || !isViewerLimited) {
    return null;
  }
  const hasRelease = isStringNonEmpty(release);
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
  const title = hasRelease
    ? 'Login Required'
    : 'Viewing Limited Wind Rose Data - Login Required';
  const details = hasRelease
    ? 'You must sign in or create and validate an account before viewing release data.'
    : `The wind rose viewer is displaying a limited dataset that does not
      reflect the actual data availability for this data product. You must sign in or create
      and validate an account before viewing the full dataset for this data product.
      `;
  return (
    <LoginRequiredCard
      showValidation
      customTitle={title}
      customContent={(
        <>
          <Typography variant="body2" className={classes.messageContent}>
            {details}
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            {' '} Navigate to {myAccountLink} to sign in or create an account.
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            {' '} {accountInfoLink} about the benefits of having an account.
          </Typography>
          {(neonAuthContextSessionState.authenticated === true)
            ? null
            : <NeonSignInButton disableMargin />}
        </>
      )}
      isAuthenticated={neonAuthContextSessionState.authenticated}
      accountValidated={neonAuthContextSessionState.accountValidated}
      accountValidationSteps={
        (neonAuthContextSessionState.accountValidationSteps as AccountValidationStep[] | undefined)
      }
    />
  );
};

export default WindRoseViewerLimitedCard;
