/* eslint-disable react/forbid-prop-types */
import React from 'react';

import PropTypes from 'prop-types';
import Select from 'react-select';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

import Theme from '../Theme/Theme';
import TimeSeriesViewerContext from './TimeSeriesViewerContext';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  input: {
    display: 'flex',
    padding: '2px',
    height: 'auto',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
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
  variablePaper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(1, 3, 1, 1),
    borderRadius: theme.spacing(2),
    width: 'fit-content',
    backgroundColor: theme.palette.grey[50],
    marginRight: theme.spacing(2),
  },
  variablePaperContainer: {
    lineHeight: '5em',
    marginTop: theme.spacing(2.5),
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
    selectProps: { TextFieldProps },
  } = props;

  return (
    <TextField
      fullWidth
      label="Search Variables"
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
          ref: innerRef,
          children,
          ...innerProps,
        },
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon color="disabled" />
          </InputAdornment>
        ),
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
        {value}
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
  children: PropTypes.node,
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
  children: null,
  innerProps: null,
  innerRef: null,
  isDisabled: false,
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
  Option,
  ValueContainer,
  Placeholder: () => null,
  MultiValue: () => null,
  IndicatorsContainer: () => null,
};

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

export default function TimeSeriesViewerVariables() {
  const classes = useStyles(Theme);
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();

  const selectedVariables = state.selection.variables.map(variable => ({
    ...state.variables[variable],
    value: variable,
  }));
  const selectedUnits = Array.from(
    state.selection.variables.reduce((units, variable) => {
      if (state.variables[variable]) { units.add(state.variables[variable].units); }
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
        value: variable,
        isDisabled,
      });
      selectableVariablesCount += 1;
    });

  // TODO: skeleton
  if (!selectableVariablesCount) {
    return null;
  }

  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          isMulti
          isSearchable
          clearable={false}
          classes={classes}
          styles={selectStyles}
          aria-label="Search Variables"
          data-gtm="time-series-viewer.search-variables"
          options={selectableVariables}
          components={components}
          value={selectedVariables}
          controlShouldRenderValue={false}
          filterOption={(option, searchText) => (
            option.data.value.toLowerCase().includes(searchText.toLowerCase())
              || option.data.units.toLowerCase().includes(searchText.toLowerCase())
              || option.data.description.toLowerCase().includes(searchText.toLowerCase())
          )}
          onChange={(value) => {
            if (!value) { return; }
            dispatch({ type: 'selectVariables', variables: value.map(v => v.value) });
          }}
        />
      </NoSsr>
      <div className={classes.variablePaperContainer}>
        {state.selection.variables.map((variable) => {
          const { units, description } = state.variables[variable];
          return (
            <Paper key={variable} className={classes.variablePaper}>
              <IconButton
                aria-label={`remove variable ${variable}`}
                disabled={state.selection.variables.length < 2}
                style={{ marginRight: Theme.spacing(1) }}
                onClick={() => {
                  dispatch({
                    type: 'selectVariables',
                    variables: state.selection.variables.filter(v => v !== variable),
                  });
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
              <div style={{ flexGrow: 1 }}>
                <Typography variant="body1">
                  {variable}
                  <span className={classes.optionSubtitle} style={{ marginLeft: '8px' }}>
                    {`(${units})`}
                  </span>
                </Typography>
                <Typography variant="body2" className={classes.optionSubtitle} gutterBottom>
                  {description}
                </Typography>
              </div>
            </Paper>
          );
        })}
      </div>
    </div>
  );
}
