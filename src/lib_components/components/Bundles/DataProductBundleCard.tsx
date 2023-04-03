import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faBoxesStacked } from '@fortawesome/free-solid-svg-icons';

import Theme from '../Theme/Theme';
import { NeonTheme } from '../Theme/types';
import { exists } from '../../util/typeUtil';

const useStyles = makeStyles((theme: NeonTheme) => ({
  card: {
    backgroundColor: (Theme as NeonTheme).colors.GOLD[50],
    borderColor: (Theme as NeonTheme).colors.GOLD[200],
    marginTop: theme.spacing(1),
  },
  cardContent: {
    padding: theme.spacing(2),
    paddingBottom: `${theme.spacing(2)}px !important`,
  },
  cardContentFlexContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    paddingBottom: `${theme.spacing(2)}px !important`,
  },
  cardContentContainer: {
    flexGrow: 1,
  },
  cardIcon: {
    color: theme.colors.GOLD[700],
    padding: '5px',
    fontSize: '2.3875em',
    marginRight: theme.spacing(2),
  },
  cardIconBoxesStacked: {
    color: theme.colors.GOLD[700],
    fontSize: '2.3875em',
    marginRight: theme.spacing(2),
  },
}));

export interface DataProductBundleCardClasses {
  card?: string;
  cardContent?: string;
  cardContentFlexContainer?: string;
  cardContentContainer?: string;
  cardIcon?: string;
}

export interface DataProductBundleCardProps {
  titleContent?: React.ReactNode;
  detailContent?: React.ReactNode;
  subTitleContent?: React.ReactNode;
  customContent?: React.ReactNode;
  isSplit?: boolean;
  showIcon?: boolean;
  classes?: DataProductBundleCardClasses;
}

const DataProductBundleCard: React.FC<DataProductBundleCardProps> = (
  props: DataProductBundleCardProps,
): JSX.Element => {
  const classes = useStyles(Theme);
  const {
    titleContent,
    subTitleContent,
    detailContent,
    customContent,
    isSplit,
    showIcon,
    classes: customClasses,
  }: DataProductBundleCardProps = props;
  const customCardClass: string|undefined = customClasses
    ? customClasses.card
    : undefined;
  const customCardContentClass: string|undefined = customClasses
    ? customClasses.cardContent
    : undefined;
  const customCardContentFlexContainerClass: string|undefined = customClasses
    ? customClasses.cardContentFlexContainer
    : undefined;
  const customCardContentContainerClass: string|undefined = customClasses
    ? customClasses.cardContentContainer
    : undefined;
  const customIconClass: string|undefined = customClasses
    ? customClasses.cardIcon
    : undefined;

  const renderContent = (): JSX.Element => {
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

  const renderCardContent = (): JSX.Element => {
    if (!showIcon) {
      return renderContent();
    }
    return (
      <>
        <FontAwesomeIcon
          icon={isSplit ? faBoxesStacked : faBox}
          size="2x"
          className={customIconClass
            || isSplit ? classes.cardIconBoxesStacked : classes.cardIcon}
        />
        <div className={customCardContentContainerClass || classes.cardContentContainer}>
          {renderContent()}
        </div>
      </>
    );
  };

  return (
    <Card className={customCardClass || classes.card}>
      <CardContent
        className={showIcon
          ? (customCardContentFlexContainerClass || classes.cardContentFlexContainer)
          : (customCardContentClass || classes.cardContent)}
      >
        {renderCardContent()}
      </CardContent>
    </Card>
  );
};

DataProductBundleCard.defaultProps = {
  titleContent: undefined,
  detailContent: undefined,
  subTitleContent: undefined,
  customContent: undefined,
  isSplit: false,
  showIcon: true,
  classes: undefined,
};

export default DataProductBundleCard;
