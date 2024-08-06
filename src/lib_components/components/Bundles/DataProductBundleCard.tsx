import React from 'react';

import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faBoxesStacked } from '@fortawesome/free-solid-svg-icons';

import InfoMessageCard from '../Card/InfoMessageCard';
import Theme from '../Theme/Theme';
import { NeonTheme } from '../Theme/types';
import { exists } from '../../util/typeUtil';

const useStyles = makeStyles((theme: NeonTheme) => ({
  cardIcon: {
    color: 'rgba(0, 0, 0, 0.9)',
    padding: '5px 0px',
    fontSize: '1.5em',
    marginRight: theme.spacing(2),
  },
  cardSecondaryIcon: {
    color: 'rgba(138, 191, 236, 0.9)', // theme.colors.LIGHT_BLUE[200] with 'a' value applied
    marginLeft: theme.spacing(2),
    fontSize: '1.5rem',
  },
  cardTitleContentContainer: {
    padding: theme.spacing(2, 2.5, 0.5, 2.5),
  },
  cardMessageContentContainer: {
    padding: theme.spacing(0.25, 2.5, 2, 2.5),
  },
}));

export interface DataProductBundleCardClasses {
  cardIcon?: string;
}

export interface DataProductBundleCardProps {
  titleContent?: React.ReactNode;
  detailContent?: React.ReactNode;
  subTitleContent?: React.ReactNode;
  customContent?: React.ReactNode;
  isSplit?: boolean;
  classes?: DataProductBundleCardClasses;
}

const DataProductBundleCard: React.FC<DataProductBundleCardProps> = (
  props: DataProductBundleCardProps,
): React.JSX.Element => {
  const classes = useStyles(Theme);
  const {
    titleContent,
    subTitleContent,
    detailContent,
    customContent,
    isSplit,
    classes: customClasses,
  }: DataProductBundleCardProps = props;
  const customIconClass: string|undefined = customClasses
    ? customClasses.cardIcon
    : undefined;

  const renderContent = (): React.JSX.Element => {
    if (exists(customContent)) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return (<>{customContent}</>);
    }
    return (
      <>
        {!exists(titleContent) ? null : (
          <Typography variant="subtitle2">
            {titleContent}
          </Typography>
        )}
        {!exists(detailContent) ? null : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>{detailContent}</>
        )}
        {!exists(subTitleContent) ? null : (
          <Typography variant="body2">
            {subTitleContent}
          </Typography>
        )}
      </>
    );
  };

  return (
    <InfoMessageCard
      title="Data Product Bundle"
      messageContent={renderContent()}
      icon={(
        <FontAwesomeIcon
          icon={isSplit ? faBoxesStacked : faBox}
          size="1x"
          className={customIconClass || classes.cardIcon}
        />
      )}
      classes={{
        secondaryIcon: classes.cardSecondaryIcon,
        cardTitleContentContainer: classes.cardTitleContentContainer,
        messageContentContainer: classes.cardMessageContentContainer,
      }}
    />
  );
};

DataProductBundleCard.defaultProps = {
  titleContent: undefined,
  detailContent: undefined,
  subTitleContent: undefined,
  customContent: undefined,
  isSplit: false,
  classes: undefined,
};

export default DataProductBundleCard;
