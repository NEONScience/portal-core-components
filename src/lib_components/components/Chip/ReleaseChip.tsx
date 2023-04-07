/* eslint-disable react/require-default-props */
import React from 'react';

import Chip from '@material-ui/core/Chip';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import {
  makeStyles,
  createStyles,
} from '@material-ui/core/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

import Theme from '../Theme/Theme';
import { NeonTheme } from '../Theme/types';
import { StylesHook } from '../../types/muiTypes';

const useStyles: StylesHook = makeStyles((theme: NeonTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    releaseIcon: {
      color: theme.colors.LIGHT_BLUE[600],
      fontSize: '1em',
      marginRight: theme.spacing(0.75),
    },
    releaseChip: {
      color: theme.colors.LIGHT_BLUE[600],
      border: `1px solid ${theme.colors.LIGHT_BLUE[600]}`,
      backgroundColor: theme.colors.LIGHT_BLUE[50],
      fontWeight: 600,
      cursor: 'help',
    },
  })) as StylesHook;

interface ReleaseChipClasses {
  chip?: string;
  icon?: string;
}

type ReleaseChipTooltipProps = Omit<TooltipProps, 'title'>;

interface ReleaseChipProps {
  tooltipTitle: React.ReactNode;
  chipLabel: string|React.ReactNode;
  classes?: ReleaseChipClasses;
  chipStyle?: React.CSSProperties;
  tooltipProps?: ReleaseChipTooltipProps;
}

const ReleaseChip: React.FC<ReleaseChipProps> = (props: ReleaseChipProps): JSX.Element => {
  const classes = useStyles(Theme);
  const {
    tooltipTitle,
    chipLabel,
    classes: customClasses,
    chipStyle,
    tooltipProps,
  }: ReleaseChipProps = props;
  const injectedChipClass: string|undefined = customClasses
    ? customClasses.chip
    : undefined;
  const injectedChipIconClass: string|undefined = customClasses
    ? customClasses.icon
    : undefined;
  return (
    <Tooltip
      {...tooltipProps}
      // eslint-disable-next-line react/jsx-no-useless-fragment
      title={(<>{tooltipTitle}</>)}
    >
      <Chip
        size="small"
        className={injectedChipClass || classes.releaseChip}
        style={chipStyle}
        label={(
          <>
            <FontAwesomeIcon
              icon={faTag}
              size="1x"
              className={injectedChipIconClass || classes.releaseIcon}
            />
            {chipLabel}
          </>
        )}
      />
    </Tooltip>
  );
};

export default ReleaseChip;
