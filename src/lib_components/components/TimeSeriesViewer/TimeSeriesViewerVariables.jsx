/* eslint-disable react/forbid-prop-types */
import React from 'react';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import Select from 'react-select';

import { emphasize, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';

import Theme from '../Theme/Theme';
import TimeSeriesViewerContext from './TimeSeriesViewerContext';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 6,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
  optionSubtitle: {
    fontSize: '0.75rem',
    color: Theme.palette.grey[400],
  },
}));

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]).isRequired,
};

function Control(props) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
}

Control.propTypes = {
  children: PropTypes.node.isRequired,
  innerProps: PropTypes.shape({
    onMouseDown: PropTypes.func.isRequired,
  }).isRequired,
  innerRef: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]).isRequired,
  selectProps: PropTypes.object.isRequired,
};

function Option(props) {
  const classes = useStyles(Theme);
  const {
    innerRef,
    isFocused,
    isDisabled,
    innerProps,
    data,
  } = props;
  const {
    value,
    label,
    units,
    description,
  } = data;
  const textStyle = isDisabled ? {
    color: Theme.palette.grey[200],
  } : {};
  return (
    <MenuItem
      key={value}
      ref={innerRef}
      selected={isFocused && !isDisabled}
      component="div"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
      }}
      {...innerProps}
    >
      <Typography variant="body1" style={{ ...textStyle }}>
        {label}
        <span
          className={classes.optionSubtitle}
          style={{ ...textStyle, marginLeft: '8px' }}
        >
          {`(${units})`}
        </span>
      </Typography>
      <Typography
        variant="body2"
        className={classes.optionSubtitle}
        style={{ ...textStyle }}
        gutterBottom
      >
        {description}
      </Typography>
    </MenuItem>
  );
}

Option.propTypes = {
  children: PropTypes.node.isRequired,
  innerProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    key: PropTypes.string,
    onClick: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMouseOver: PropTypes.func,
    tabIndex: PropTypes.number.isRequired,
  }),
  innerRef: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]),
  isFocused: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  data: PropTypes.object.isRequired,
};
Option.defaultProps = {
  innerProps: null,
  innerRef: null,
  isDisabled: false,
};

function Placeholder(props) {
  const { selectProps, innerProps = {}, children } = props;
  const { placeholder } = selectProps.classes;
  return (
    <Typography color="textSecondary" className={placeholder} {...innerProps}>
      {children}
    </Typography>
  );
}

Placeholder.propTypes = {
  children: PropTypes.node.isRequired,
  innerProps: PropTypes.object.isRequired,
  selectProps: PropTypes.object.isRequired,
};

function ValueContainer(props) {
  const { selectProps, children } = props;
  const { valueContainer } = selectProps.classes;
  return <div className={valueContainer}>{children}</div>;
}

ValueContainer.propTypes = {
  children: PropTypes.node.isRequired,
  selectProps: PropTypes.object.isRequired,
};

function MultiValue(props) {
  const {
    selectProps,
    removeProps,
    isFocused,
    children,
    data,
  } = props;
  const { chip, chipFocused } = selectProps.classes;
  const { onClick } = removeProps;
  return (
    <Chip
      key={data.value}
      tabIndex={-1}
      label={children}
      className={clsx(chip, { [chipFocused]: isFocused })}
      onDelete={onClick}
      deleteIcon={<CancelIcon {...removeProps} />}
    />
  );
}

MultiValue.propTypes = {
  children: PropTypes.node,
  isFocused: PropTypes.bool.isRequired,
  removeProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    onTouchEnd: PropTypes.func.isRequired,
  }).isRequired,
  selectProps: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};
MultiValue.defaultProps = {
  children: null,
};

function Menu(props) {
  const { selectProps, innerProps, children } = props;
  const { paper } = selectProps.classes;
  return (
    <Paper square className={paper} {...innerProps}>
      {children}
    </Paper>
  );
}

Menu.propTypes = {
  children: PropTypes.element.isRequired,
  innerProps: PropTypes.object.isRequired,
  selectProps: PropTypes.object.isRequired,
};

const components = {
  Control,
  Menu,
  MultiValue,
  Option,
  Placeholder,
  ValueContainer,
};

export default function TimeSeriesViewerVariables() {
  const classes = useStyles(Theme);
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();

  const selectedVariables = state.selection.variables.map(variable => ({
    ...state.variables[variable],
    value: variable,
    label: variable,
    key: variable,
  }));
  const selectedUnits = Array.from(
    state.selection.variables.reduce((units, variable) => {
      units.add(state.variables[variable].units);
      return units;
    }, new Set()),
  );
  const selectableVariables = [
    { label: 'Basic Variables', options: [] },
    { label: 'Expanded Variables', options: [] },
  ];
  let selectableVariablesCount = 0;
  Object.keys(state.variables)
    .filter(variable => state.variables[variable].isSelectable)
    .forEach((variable) => {
      const groupIdx = state.variables[variable].downloadPkg === 'basic' ? 0 : 1;
      const isDisabled = selectedUnits.length === 2
        && !selectedUnits.includes(state.variables[variable].units);
      selectableVariables[groupIdx].options.push({
        ...state.variables[variable],
        label: variable,
        value: variable,
        key: variable,
        isDisabled,
      });
      selectableVariablesCount += 1;
    });

  // TODO: skeleton
  if (!selectableVariablesCount) {
    return null;
  }

  const selectStyles = {
    input: base => ({
      ...base,
      color: Theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
    clearIndicator: base => ({ ...base, display: 'none' }),
    indicatorSeparator: base => ({ ...base, display: 'none' }),
    dropdownIndicator: base => ({ ...base, cursor: 'pointer' }),
    groupHeading: base => ({
      ...base,
      fontSize: '1rem',
      fontWeight: 600,
      color: Theme.palette.primary.main,
    }),
  };

  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          isMulti
          classes={classes}
          styles={selectStyles}
          aria-label="Variables"
          data-gtm="time-series-viewer.variables"
          placeholder="Select multiple variables"
          options={selectableVariables}
          components={components}
          value={selectedVariables}
          onChange={(value) => {
            dispatch({ type: 'selectVariables', variables: value.map(v => v.value) });
          }}
        />
      </NoSsr>
    </div>
  );
}
