import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import AvailabilityContext from './AvailabilityContext';
import EnhancedAvailabilityInterface from './EnhancedAvailabilityInterface';
import ErrorCard from '../Card/ErrorCard';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { AsyncStateType } from '../../types/asyncFlow';
import { Nullable } from '../../types/core';
import { exists } from '../../util/typeUtil';
import {
  EnhancedAvailabilitySourceProps,
  useEnhancedAvailabilitySource,
} from './EnhancedAvailabilitySource';
import { AvailabilityInheritanceMode } from './EnhancedAvailabilityInheritance';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
  fetchingProgress: {
    marginBottom: theme.spacing(2),
  },
}));

export interface EnhancedAvailabilityContainerProps extends EnhancedAvailabilitySourceProps {
  dataAvailabilityUniqueId?: number;
  // What packages and tables inherit from their site-month, defaults to
  // DEFAULT_AVAILABILITY_INHERITANCE_MODE
  inheritanceMode?: Nullable<AvailabilityInheritanceMode>;
  // Remaining props are passed to the enhanced availability interface
  [key: string]: unknown;
}

/**
   Presents enhanced availability that is either provided or fetched for a product. The context
   provider stays mounted while loading or showing an error so view and sort selections persist
   when availability is fetched again.
*/
const EnhancedAvailabilityContainer: React.FC<EnhancedAvailabilityContainerProps> = (
  props: EnhancedAvailabilityContainerProps,
): React.JSX.Element => {
  const { classes } = useStyles();
  const {
    enhancedAvailability,
    productCode,
    release,
    dataLevel,
    dataAvailabilityUniqueId,
    inheritanceMode,
    ...interfaceProps
  }: EnhancedAvailabilityContainerProps = props;
  const { status, availability, error } = useEnhancedAvailabilitySource({
    enhancedAvailability,
    productCode,
    release,
    dataLevel,
  });
  const isFetching = status === AsyncStateType.WORKING;

  let content: React.JSX.Element;
  if (status === AsyncStateType.FAILED) {
    content = (
      <div data-selenium="data-product-availability.error">
        <ErrorCard title="Data Product Availability" message={error || undefined} />
      </div>
    );
  } else if (isFetching && !exists(availability)) {
    content = (
      <Card style={{ width: '100%' }} data-selenium="data-product-availability.loading">
        <CardContent className={classes.loadingContent} role="status">
          <Typography variant="subtitle2" component="h6" gutterBottom>
            Loading Data Availability...
          </Typography>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  } else {
    // Previously fetched availability stays presented while availability is fetched again
    content = (
      <>
        {!isFetching ? null : (
          <LinearProgress
            className={classes.fetchingProgress}
            aria-label="Loading data availability"
          />
        )}
        <EnhancedAvailabilityInterface {...interfaceProps} />
      </>
    );
  }

  return (
    <AvailabilityContext.Provider
      dataAvailabilityUniqueId={dataAvailabilityUniqueId}
      enhancedAvailability={availability}
      inheritanceMode={inheritanceMode}
    >
      {content}
    </AvailabilityContext.Provider>
  );
};

export default EnhancedAvailabilityContainer;
