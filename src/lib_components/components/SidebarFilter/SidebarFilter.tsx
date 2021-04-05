import React from 'react';

import { useId } from 'react-id-generator';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  createStyles,
  Theme as MuiTheme,
} from '@material-ui/core/styles';

import Skeleton from '@material-ui/lab/Skeleton';

import InfoIcon from '@material-ui/icons/InfoOutlined';

import Theme from '../Theme/Theme';
import { StylesHook } from '../../types/muiTypes';
import { isStringNonEmpty } from '../../util/typeUtil';

const useStyles: StylesHook = makeStyles((muiTheme: MuiTheme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    title: {
      fontWeight: 500,
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginBottom: muiTheme.spacing(1),
    },
    selectInput: {
      width: '100%',
      marginBottom: muiTheme.spacing(0.5),
      backgroundColor: '#fff',
    },
    descriptionContainer: {
      marginTop: muiTheme.spacing(0.5),
    },
    descriptionFlexInnerContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    description: {
      display: 'block',
      color: muiTheme.palette.grey[400],
      overflowWrap: 'break-word',
    },
    descriptionLabel: {
      fontWeight: 700,
      color: muiTheme.palette.grey[400],
      marginRight: muiTheme.spacing(1),
    },
    menuItemSubtitle: {
      color: muiTheme.palette.grey[400],
    },
    horizontalFlex: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    horizontalDescriptions: {
      marginLeft: Theme.spacing(3),
      '& > div:first-child': {
        marginTop: '-2px !important',
      },
    },
  })) as StylesHook;

export interface SidebarFilterOption {
  title: string;
  value: string;
}

export interface SidebarFilterProps {
  title: string;
  selected: string;
  values: SidebarFilterOption[];
  onChange: (value: string) => void;
  skeleton?: boolean;
  maxWidth?: number;
  horizontal?: boolean;
  tooltipText?: string;
  helperText?: string;
}

const SidebarFilter: React.FC<SidebarFilterProps> = (props: SidebarFilterProps): JSX.Element => {
  const classes = useStyles(Theme);
  const {
    title,
    skeleton,
    selected,
    values,
    maxWidth,
    horizontal,
    onChange,
    tooltipText,
    helperText,
    ...otherProps
  }: SidebarFilterProps = props;

  const [instanceId] = useId();
  const inputId = `sidebar-filter-input-${instanceId}`;
  const labelId = `sidebar-filter-label-${instanceId}`;

  // SANITY CHECK: Render nothing if there are no releases and null release is excluded
  const optionCount = values.length + (values ? 0 : 1);
  if (!optionCount) { return (<></>); }

  const handleChange = (nextValue: string): void => onChange(nextValue);

  const maxWidthStyle = maxWidth ? { maxWidth: `${maxWidth}px` } : {};

  const input: JSX.Element = (
    <OutlinedInput
      id={inputId}
      name={inputId}
      margin="dense"
      className={classes.selectInput}
      style={maxWidthStyle}
    />
  );

  /* eslint-disable react/jsx-one-expression-per-line */
  const tooltip: React.ReactChild = !isStringNonEmpty(tooltipText)
    ? (<></>)
    : (
      <div>
        {tooltipText}
      </div>
    );
  /* eslint-enable react/jsx-one-expression-per-line */
  const titleNode = !title ? null : (
    <div className={classes.titleContainer}>
      <Typography variant="h5" component="h3" className={classes.title} id={labelId}>
        {title}
      </Typography>
      <Tooltip placement="right" title={tooltip} interactive>
        <IconButton size="small" style={{ marginLeft: Theme.spacing(0.5) }}>
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );

  // Render skeleton
  if (skeleton) {
    const skeletonStyle = { marginBottom: Theme.spacing(1) };
    return (
      <div {...otherProps} style={{ maxWidth: `${maxWidth}px`, overflow: 'hidden' }}>
        {titleNode}
        <Skeleton variant="rect" width={maxWidth} height={36} style={skeletonStyle} />
        <Skeleton width="70%" height={16} style={skeletonStyle} />
      </div>
    );
  }

  const selectNode = (
    <Select
      data-selenium="release-filter"
      value={selected}
      onChange={(event) => handleChange(event.target.value as string)}
      input={input}
      aria-labelledby={labelId}
      disabled={optionCount < 2}
    >
      {values.map((option: SidebarFilterOption): JSX.Element => {
        return (
          <MenuItem key={option.value} value={option.value}>
            <div>
              <Typography display="block">
                {option.title}
              </Typography>
            </div>
          </MenuItem>
        );
      })}
    </Select>
  );

  const renderHelperText = (): JSX.Element => {
    if (!isStringNonEmpty(helperText)) {
      return (<></>);
    }
    return (
      <div className={classes.descriptionContainer}>
        <Typography variant="caption" className={classes.description}>
          {helperText}
        </Typography>
      </div>
    );
  };

  // Final Render
  return horizontal ? (
    <div {...otherProps}>
      <div>
        {titleNode}
      </div>
      <div className={classes.horizontalFlex}>
        <div style={maxWidth ? { width: `${maxWidth}px` } : {}}>
          {selectNode}
        </div>
        <div className={classes.horizontalDescriptions}>
          {renderHelperText()}
        </div>
      </div>
    </div>
  ) : (
    <div {...otherProps} style={{ width: '100%', ...maxWidthStyle }}>
      {titleNode}
      {selectNode}
      {renderHelperText()}
    </div>
  );
};

export default SidebarFilter;
