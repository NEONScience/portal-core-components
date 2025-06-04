/* eslint-disable react/forbid-prop-types */
import React from 'react';

import PropTypes from 'prop-types';
import Select from 'react-select';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import Skeleton from '@material-ui/lab/Skeleton';

import ClearIcon from '@material-ui/icons/Clear';
import MenuItem from '@material-ui/core/MenuItem';
import NoneIcon from '@material-ui/icons/NotInterested';
import SearchIcon from '@material-ui/icons/Search';
import SelectAllIcon from '@material-ui/icons/DoneAll';

import Theme from '../Theme/Theme';
import TimeSeriesViewerContext, {
  POINTS_PERFORMANCE_LIMIT,
} from './TimeSeriesViewerContext';

const useStyles = makeStyles((theme) => ({
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
  variableCard: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(1, 3, 1, 1),
    width: 'fit-content',
    backgroundColor: theme.palette.grey[50],
    marginRight: theme.spacing(2),
  },
  variableCardContainer: {
    lineHeight: '7em',
    marginTop: theme.spacing(2),
  },
  noneContainer: {
    color: theme.palette.grey[400],
    display: 'flex',
    alignItems: 'flex-start',
  },
  noneIcon: {
    color: theme.palette.grey[400],
    margin: theme.spacing(0.375, 0.5, 0, 0),
    fontSize: '1rem',
  },
  noneLabel: {
    fontSize: '0.95rem',
  },
  qualityFlagsContainer: {
    marginTop: theme.spacing(2),
  },
  qualityFlagsHeading: {
    fontWeight: 600,
    marginBottom: Theme.spacing(0.5),
  },
  qualityFlagsButtons: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
}));

const ucWord = (word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;

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

  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const labelText = TimeSeriesViewerContext.calcPredictedPointsForNewVariable(state)
  > POINTS_PERFORMANCE_LIMIT
    ? 'Add Variables (disabled)'
    : 'Add Variables';

  return (
    <TextField
      fullWidth
      label={labelText}
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
  input: (base) => ({
    ...base,
    color: Theme.palette.text.primary,
    '& input': {
      font: 'inherit',
    },
  }),
  clearIndicator: (base) => ({ ...base, display: 'none' }),
  indicatorSeparator: (base) => ({ ...base, display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, cursor: 'pointer' }),
  groupHeading: (base) => ({
    ...base,
    fontSize: '1rem',
    fontWeight: 600,
    color: Theme.palette.primary.main,
  }),
};

/**
   Quality Flags
*/
const QualityFlags = () => {
  const classes = useStyles(Theme);
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const { availableQualityFlags } = state;
  const { qualityFlags: selectedQualityFlags } = state.selection;
  const toggleFlag = (qualityFlag) => (event) => {
    dispatch({ type: 'selectToggleQualityFlag', qualityFlag, selected: event.target.checked });
  };
  if (!availableQualityFlags.size) {
    return (
      <div className={classes.noneContainer}>
        <NoneIcon className={classes.noneIcon} />
        <Typography variant="body1" className={classes.noneLabel}>
          No Quality Flags Available
        </Typography>
      </div>
    );
  }
  const organizedQualityFlags = { basic: [], expanded: [] };
  Array.from(availableQualityFlags).forEach((qf) => {
    if (!state.variables[qf]) { return; }
    const { downloadPkg } = state.variables[qf];
    organizedQualityFlags[downloadPkg].push(qf);
  });
  organizedQualityFlags.basic.sort();
  organizedQualityFlags.expanded.sort();
  const downloadPkgs = ['basic', 'expanded'];
  return (
    <>
      {availableQualityFlags.size > 1 ? (
        <div className={classes.qualityFlagsButtons}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => { dispatch({ type: 'selectNoneQualityFlags' }); }}
            startIcon={<ClearIcon />}
            style={{ marginRight: Theme.spacing(2) }}
          >
            Select None
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => { dispatch({ type: 'selectAllQualityFlags' }); }}
            startIcon={<SelectAllIcon />}
          >
            {`Select All (${availableQualityFlags.size})`}
          </Button>
        </div>
      ) : null}
      <FormGroup>
        {downloadPkgs.map((downloadPkg) => (
          <div key={downloadPkg}>
            <Typography variant="subtitle2">{ucWord(downloadPkg)}</Typography>
            {!organizedQualityFlags[downloadPkg].length ? (
              <Typography variant="body2" className={classes.noneLabel}>
                {`No ${downloadPkg} quality flags available`}
              </Typography>
            ) : (
              <>
                {organizedQualityFlags[downloadPkg].map((qf) => {
                  const checked = selectedQualityFlags.includes(qf);
                  const captionStyle = { display: 'block', color: Theme.palette.grey[400] };
                  return (
                    <FormControlLabel
                      key={qf}
                      style={{ alignItems: 'flex-start', marginBottom: Theme.spacing(1) }}
                      control={(
                        <Checkbox
                          value={qf}
                          color="primary"
                          checked={checked}
                          onChange={toggleFlag(qf)}
                        />
                      )}
                      label={(
                        <div style={{ paddingTop: Theme.spacing(0.5) }}>
                          <Typography variant="body2">
                            {qf}
                            <Typography variant="caption" style={captionStyle}>
                              {state.variables[qf].description}
                            </Typography>
                          </Typography>
                        </div>
                      )}
                    />
                  );
                })}
              </>
            )}
          </div>
        ))}
      </FormGroup>
    </>
  );
};

export default function TimeSeriesViewerVariables() {
  const classes = useStyles(Theme);
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();

  const selectedVariables = state.selection.variables.map((variable) => ({
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
    .filter((variable) => state.variables[variable].isSelectable)
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

  if (!selectableVariablesCount) {
    return (
      <Skeleton variant="rect" width="100%" height={56} />
    );
  }

  const isDisabled = TimeSeriesViewerContext.calcPredictedPointsForNewVariable(state)
    > POINTS_PERFORMANCE_LIMIT;

  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          isMulti
          isSearchable
          blurInputOnSelect="true"
          isDisabled={isDisabled}
          clearable={false}
          classes={classes}
          styles={selectStyles}
          aria-label="Add Variables"
          data-gtm="time-series-viewer.add-variables"
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
            dispatch({ type: 'selectVariables', variables: value.map((v) => v.value) });
          }}
        />
      </NoSsr>
      <div className={classes.variableCardContainer}>
        {state.selection.variables.map((variable) => {
          const { units, description } = state.variables[variable];
          return (
            <Card key={variable} variant="outlined" className={classes.variableCard}>
              <IconButton
                aria-label={`remove variable ${variable}`}
                disabled={state.selection.variables.length < 2}
                style={{ marginRight: Theme.spacing(1) }}
                onClick={() => {
                  dispatch({
                    type: 'selectVariables',
                    variables: state.selection.variables.filter((v) => v !== variable),
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
            </Card>
          );
        })}
      </div>
      <div className={classes.qualityFlagsContainer}>
        <Typography variant="subtitle1" className={classes.qualityFlagsHeading}>
          Quality Flags
        </Typography>
        <Typography variant="caption" style={{ color: Theme.palette.grey[400] }}>
          Enabling one or more quality flags will highlight regions on the chart
          to illustrate the results of data quality tests.
        </Typography>
        <div style={{ width: '100%', marginTop: Theme.spacing(1) }}>
          <QualityFlags />
        </div>
      </div>
    </div>
  );
}
