import React from 'react';

import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import {
  makeStyles,
  createStyles,
} from '@material-ui/core/styles';

import LoginRequiredCard from '../Card/LoginRequiredCard';
import NeonContext from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonSignInButton from '../NeonSignInButton/NeonSignInButton';
import Theme from '../Theme/Theme';
import RouteService from '../../service/RouteService';
import { StylesHook } from '../../types/muiTypes';
import { NeonTheme } from '../Theme/types';
import { isStringNonEmpty } from '../../util/typeUtil';

import TimeSeriesViewerContext from './TimeSeriesViewerContext';

const useStyles: StylesHook = makeStyles((theme: NeonTheme) => createStyles({
  messageContent: {
    margin: theme.spacing(0, 0, 2, 0),
  },
  messageContentNoMargin: {
    margin: theme.spacing(0, 0, 0, 0),
  },
})) as StylesHook;

export interface TimeSeriesViewerLimitedCardProps {
  showInfoOnly?: boolean;
}

const TimeSeriesViewerLimitedCard = (props: TimeSeriesViewerLimitedCardProps): JSX.Element => {
  const { showInfoOnly }: TimeSeriesViewerLimitedCardProps = props;
  // @ts-ignore
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const neonContextSessionState = NeonContext.useNeonContextSessionState();
  const classes = useStyles(Theme);
  if (!state.isViewerLimitedMode) {
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
  const renderTitle = (): string => {
    if (isStringNonEmpty(state.release)) {
      return 'Login Required';
    }
    return 'Viewing Limited Time Series Data - Login Required';
  };
  const renderContents = (): JSX.Element => {
    let details = `The time series viewer is displaying a limited dataset that does not
      reflect the actual data availability for this data product. You must sign in or create
      and validate an account before viewing the full dataset for this data product.
      `;
    if (isStringNonEmpty(state.release)) {
      details = 'You must sign in or create and validate an account before viewing release data.';
    }
    const appliedMessageContentClass: string = (showInfoOnly === true)
      ? classes.messageContentNoMargin
      : classes.messageContent;
    return (
      <Typography variant="body2" className={appliedMessageContentClass}>
        {details}
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        {' '} Navigate to {myAccountLink} to sign in or create an account.
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        {' '} {accountInfoLink} about the benefits of having an account.
      </Typography>
    );
  };
  const renderSignInButton = (): JSX.Element => {
    if (showInfoOnly === true) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }
    if (neonContextSessionState.authenticated === true) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }
    return <NeonSignInButton disableMargin />;
  };
  return (
    <LoginRequiredCard
      showValidation={showInfoOnly !== true}
      customTitle={renderTitle()}
      customContent={(
        <>
          {renderContents()}
          {renderSignInButton()}
        </>
      )}
      isAuthenticated={neonContextSessionState.authenticated}
      accountValidated={neonContextSessionState.accountValidated}
      accountValidationSteps={neonContextSessionState.accountValidationSteps}
    />
  );
};

TimeSeriesViewerLimitedCard.defaultProps = {
  showInfoOnly: undefined,
};

export default TimeSeriesViewerLimitedCard;
