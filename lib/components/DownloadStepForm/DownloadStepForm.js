'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = DownloadStepForm;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _styles = require('@material-ui/core/styles');

var _Box = require('@material-ui/core/Box');

var _Box2 = _interopRequireDefault(_Box);

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Checkbox = require('@material-ui/core/Checkbox');

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _Chip = require('@material-ui/core/Chip');

var _Chip2 = _interopRequireDefault(_Chip);

var _CircularProgress = require('@material-ui/core/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _Divider = require('@material-ui/core/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _FormControl = require('@material-ui/core/FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _FormControlLabel = require('@material-ui/core/FormControlLabel');

var _FormControlLabel2 = _interopRequireDefault(_FormControlLabel);

var _Grid = require('@material-ui/core/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Radio = require('@material-ui/core/Radio');

var _Radio2 = _interopRequireDefault(_Radio);

var _RadioGroup = require('@material-ui/core/RadioGroup');

var _RadioGroup2 = _interopRequireDefault(_RadioGroup);

var _SnackbarContent = require('@material-ui/core/SnackbarContent');

var _SnackbarContent2 = _interopRequireDefault(_SnackbarContent);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _Info = require('@material-ui/icons/Info');

var _Info2 = _interopRequireDefault(_Info);

var _FormatQuote = require('@material-ui/icons/FormatQuote');

var _FormatQuote2 = _interopRequireDefault(_FormatQuote);

var _Assignment = require('@material-ui/icons/Assignment');

var _Assignment2 = _interopRequireDefault(_Assignment);

var _Description = require('@material-ui/icons/Description');

var _Description2 = _interopRequireDefault(_Description);

var _DoneAll = require('@material-ui/icons/DoneAll');

var _DoneAll2 = _interopRequireDefault(_DoneAll);

var _Clear = require('@material-ui/icons/Clear');

var _Clear2 = _interopRequireDefault(_Clear);

var _FilterList = require('@material-ui/icons/FilterList');

var _FilterList2 = _interopRequireDefault(_FilterList);

var _DeleteSweep = require('@material-ui/icons/DeleteSweep');

var _DeleteSweep2 = _interopRequireDefault(_DeleteSweep);

var _TouchApp = require('@material-ui/icons/TouchApp');

var _TouchApp2 = _interopRequireDefault(_TouchApp);

var _ReportProblem = require('@material-ui/icons/ReportProblem');

var _ReportProblem2 = _interopRequireDefault(_ReportProblem);

var _Explore = require('@material-ui/icons/Explore');

var _Explore2 = _interopRequireDefault(_Explore);

var _reactCopyToClipboard = require('react-copy-to-clipboard');

var _ToggleButton = require('@material-ui/lab/ToggleButton');

var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

var _ToggleButtonGroup = require('@material-ui/lab/ToggleButtonGroup');

var _ToggleButtonGroup2 = _interopRequireDefault(_ToggleButtonGroup);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _materialTable = require('material-table');

var _materialTable2 = _interopRequireDefault(_materialTable);

var _DownloadDataContext = require('../DownloadDataContext/DownloadDataContext');

var _DownloadDataContext2 = _interopRequireDefault(_DownloadDataContext);

var _DataProductAvailability = require('../DataProductAvailability/DataProductAvailability');

var _DataProductAvailability2 = _interopRequireDefault(_DataProductAvailability);

var _ExternalHost = require('../ExternalHost/ExternalHost');

var _ExternalHost2 = _interopRequireDefault(_ExternalHost);

var _ExternalHostProductSpecificLinks = require('../ExternalHostProductSpecificLinks/ExternalHostProductSpecificLinks');

var _ExternalHostProductSpecificLinks2 = _interopRequireDefault(_ExternalHostProductSpecificLinks);

var _SiteChip = require('../SiteChip/SiteChip');

var _SiteChip2 = _interopRequireDefault(_SiteChip);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

var _manifestUtil = require('../../util/manifestUtil');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    copyButton: {
      marginLeft: _Theme2.default.spacing(2),
      padding: _Theme2.default.spacing(0.5, 2),
      backgroundColor: '#fff'
    },
    fileTable: {
      position: 'relative',
      '& td': {
        whiteSpace: 'nowrap'
      },
      '& label + .MuiInput-formControl': {
        marginTop: '0px'
      }
    },
    formControlBold: {
      '& span': {
        fontWeight: 600
      }
    },
    loadingOverlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      textAlign: 'center',
      top: 0,
      left: 0,
      zIndex: 10,
      paddingTop: theme.spacing(14),
      backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    infoSnackbar: {
      backgroundColor: theme.palette.grey[50],
      color: '#000',
      border: '1px solid ' + theme.palette.primary.main + '80'
    },
    infoSnackbarIcon: {
      color: theme.palette.grey[300],
      marginRight: theme.spacing(2)
    },
    radio: {
      marginBottom: theme.spacing(1)
    },
    radioLabel: {
      marginTop: theme.spacing(1.5)
    },
    showColumnsLabel: {
      backgroundColor: theme.palette.grey[50],
      '& span': {
        color: '#000'
      }
    },
    startFlex: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    stepSummary: {
      marginBottom: theme.spacing(3)
    },
    stepSummaryHeader: {
      userSelect: 'none',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: theme.spacing(1)
    },
    stepSummaryContent: {
      marginLeft: theme.spacing(4.25)
    },
    summaryChip: {
      cursor: 'pointer',
      marginTop: theme.spacing(0.25),
      marginRight: theme.spacing(1),
      fontSize: '1rem',
      fontWeight: 600,
      height: theme.spacing(3),
      '& span': {
        padding: theme.spacing(0, 1)
      }
    },
    summaryText: {
      fontSize: '1.2rem'
    },
    summaryTextIncomplete: {
      fontSize: '1.2rem',
      fontStyle: 'italic',
      color: theme.palette.error.main
    }
  };
});

var dataUsageAndCitationPoliciesLink = _ExternalHost2.default.renderExternalLink('https://www.neonscience.org/data/about-data/data-policies', 'Data Usage and Citation Policies', 'NEON');

function DownloadStepForm(props) {
  var classes = useStyles(_Theme2.default);

  var stepKey = props.stepKey,
      changeToStep = props.changeToStep,
      changeToNextUncompletedStep = props.changeToNextUncompletedStep,
      renderDownloadButton = props.renderDownloadButton;

  var _DownloadDataContext$ = _DownloadDataContext2.default.useDownloadDataState(),
      _DownloadDataContext$2 = _slicedToArray(_DownloadDataContext$, 2),
      state = _DownloadDataContext$2[0],
      dispatch = _DownloadDataContext$2[1];

  var setState = function setState(stateKey, newValue) {
    return dispatch({
      type: 'setValidatableValue',
      key: stateKey,
      value: newValue
    });
  };

  var renderStepSummary = {
    sitesAndDateRange: function sitesAndDateRange() {
      var sites = state.sites.value;
      var dateRange = state.dateRange.value;

      var sitesPlural = sites.length > 1 ? 's' : '';
      var getYearMonthMoment = function getYearMonthMoment(yearMonth) {
        return (0, _moment2.default)(yearMonth + '-01');
      };
      var humanDateRange = getYearMonthMoment(dateRange[0]).format('MMM YYYY') + ' - ' + getYearMonthMoment(dateRange[1]).format('MMM YYYY');
      var siteChipLabel = sites.length + ' site' + sitesPlural + ' \u2014 ' + humanDateRange;
      return _react2.default.createElement(_SiteChip2.default, { size: 'large', variant: 'default', label: siteChipLabel });
    },
    documentation: function documentation() {
      var documentation = state.documentation.value;

      return _react2.default.createElement(
        _Typography2.default,
        { variant: 'body2', className: classes.summaryText },
        '' + documentation.charAt(0).toUpperCase() + documentation.substring(1)
      );
    },
    packageType: function packageType() {
      var packageType = state.packageType.value;

      return _react2.default.createElement(
        _Typography2.default,
        { variant: 'body2', className: classes.summaryText },
        '' + packageType.charAt(0).toUpperCase() + packageType.substring(1)
      );
    },
    s3Files: function s3Files() {
      var _state$s3Files = state.s3Files,
          files = _state$s3Files.value,
          totalSize = _state$s3Files.totalSize;

      return _react2.default.createElement(
        _Typography2.default,
        { variant: 'body2', className: classes.summaryText },
        files.length + ' file' + (files.length === 1 ? '' : 's') + ' (' + (0, _manifestUtil.formatBytes)(totalSize) + ' uncompressed)'
      );
    }
  };

  var renderStepForm = {
    /**
       SITES AND DATE RANGE
    */
    sitesAndDateRange: function sitesAndDateRange() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_DataProductAvailability2.default, {
          'data-selenium': 'download-data-dialog.step-form.sites-and-date-range',
          view: 'states',
          disableSelectionCollapse: true
        }),
        _react2.default.createElement(_SnackbarContent2.default, {
          className: classes.infoSnackbar,
          style: { marginTop: _Theme2.default.spacing(2), marginBottom: _Theme2.default.spacing(1), justifyContent: 'center' },
          message: _react2.default.createElement(
            'div',
            { className: classes.startFlex },
            _react2.default.createElement(_TouchApp2.default, { fontSize: 'large', className: classes.infoSnackbarIcon }),
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                _Typography2.default,
                { variant: 'body1', component: 'div' },
                _react2.default.createElement(
                  'ul',
                  { style: { margin: 0, paddingLeft: _Theme2.default.spacing(2.5) } },
                  _react2.default.createElement(
                    'li',
                    null,
                    'Drag the grid above to pan across time'
                  ),
                  _react2.default.createElement(
                    'li',
                    null,
                    'Click rows in the grid above to select sites or states'
                  ),
                  _react2.default.createElement(
                    'li',
                    null,
                    'Drag the sides of the selection to adjust the date range'
                  )
                )
              )
            )
          )
        })
      );
    },

    /**
       DOCUMENTATION
    */
    documentation: function documentation() {
      var neonFaqLink = _ExternalHost2.default.renderExternalLink('http://data.neonscience.org/faq', 'NEON FAQ', 'NEON');
      var knbLink = _ExternalHost2.default.renderExternalLink('https://eml.ecoinformatics.org/', 'KNB', 'KNB');
      var _state$documentation = state.documentation,
          value = _state$documentation.value,
          validValues = _state$documentation.validValues;

      return _react2.default.createElement(
        _Grid2.default,
        {
          container: true,
          spacing: 2,
          alignItems: 'flex-start',
          'data-selenium': 'download-data-dialog.step-form.documentation'
        },
        _react2.default.createElement(
          _Grid2.default,
          { item: true, xs: 12, md: 6 },
          _react2.default.createElement(
            _FormControl2.default,
            { component: 'fieldset' },
            _react2.default.createElement(
              _RadioGroup2.default,
              {
                'aria-label': 'Documentation',
                name: 'documentation',
                value: value || '',
                onChange: function onChange(e) {
                  setState('documentation', e.target.value);
                  changeToNextUncompletedStep();
                }
              },
              _react2.default.createElement(_FormControlLabel2.default, {
                className: classes.radio,
                value: validValues[0],
                control: _react2.default.createElement(_Radio2.default, null),
                label: _react2.default.createElement(
                  'div',
                  { className: classes.radioLabel },
                  _react2.default.createElement(
                    _Typography2.default,
                    { variant: 'h6' },
                    'Include'
                  ),
                  _react2.default.createElement(
                    _Typography2.default,
                    { variant: 'body2' },
                    'Include relevant documents for this Data Product'
                  )
                )
              }),
              _react2.default.createElement(_FormControlLabel2.default, {
                className: classes.radio,
                value: validValues[1],
                control: _react2.default.createElement(_Radio2.default, null),
                label: _react2.default.createElement(
                  'div',
                  { className: classes.radioLabel },
                  _react2.default.createElement(
                    _Typography2.default,
                    { variant: 'h6' },
                    'Exclude'
                  ),
                  _react2.default.createElement(
                    _Typography2.default,
                    { variant: 'body2' },
                    'Data only, no relevant documents for this Data Product'
                  )
                )
              })
            )
          )
        ),
        _react2.default.createElement(
          _Grid2.default,
          { item: true, xs: 12, md: 6 },
          _react2.default.createElement(_SnackbarContent2.default, {
            className: classes.infoSnackbar,
            style: { marginTop: _Theme2.default.spacing(1.5) },
            message: _react2.default.createElement(
              'div',
              { className: classes.startFlex },
              _react2.default.createElement(_Info2.default, { fontSize: 'large', className: classes.infoSnackbarIcon }),
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  _Typography2.default,
                  { variant: 'body1' },
                  'EML files for this Data Product are included in all downloads. Learn more about EML files in the ',
                  neonFaqLink,
                  ' and at ',
                  knbLink,
                  '.'
                )
              )
            )
          })
        )
      );
    },

    /**
       S3 Files
    */
    s3Files: function s3Files() {
      var s3FileFetches = state.s3FileFetches,
          s3FileFetchProgress = state.s3FileFetchProgress;

      var isLoading = Object.keys(s3FileFetches).some(function (key) {
        return ['awaitingFetchCall', 'fetching'].includes(s3FileFetches[key]);
      });
      var _state$s3Files2 = state.s3Files,
          selection = _state$s3Files2.value,
          validValues = _state$s3Files2.validValues,
          valueLookups = _state$s3Files2.valueLookups,
          totalSize = _state$s3Files2.totalSize,
          estimatedPostSize = _state$s3Files2.estimatedPostSize,
          filters = _state$s3Files2.filters,
          filteredFileCount = _state$s3Files2.filteredFileCount,
          visibleColumns = _state$s3Files2.visibleColumns;

      var columns = [{
        title: 'Site',
        field: 'site',
        lookup: valueLookups.site,
        defaultFilter: filters.site || [],
        hidden: !visibleColumns.includes('site')
      }, {
        title: 'Date',
        field: 'yearMonth',
        lookup: valueLookups.yearMonth,
        defaultFilter: filters.yearMonth || [],
        hidden: !visibleColumns.includes('date')
      }, {
        title: 'Visit',
        field: 'visit',
        lookup: valueLookups.visit,
        defaultFilter: filters.visit || [],
        hidden: !visibleColumns.includes('visit')
      }, {
        title: 'Name',
        field: 'name',
        defaultFilter: filters.name || '',
        hidden: !visibleColumns.includes('name')
      }, {
        title: 'Type',
        field: 'type',
        lookup: valueLookups.type,
        defaultFilter: filters.type || [],
        hidden: !visibleColumns.includes('type')
      }, {
        title: 'Size',
        field: 'size',
        filtering: false,
        removable: false,
        render: function render(row) {
          return (0, _manifestUtil.formatBytes)(row.size);
        }
      }];
      var aopHardDriveLink = _ExternalHost2.default.renderExternalLink('https://www.neonscience.org/data-collection/airborne-remote-sensing/aop-data-hard-drive-request', 'AOP Data to Hard Drive Request', 'NEON');
      var debouncedFilterDispatch = (0, _lodash.debounce)(function (filter, value) {
        dispatch({ type: 'setS3FilesFilterValue', filter: filter, value: value });
      }, 200);
      var noFiltersApplied = Object.keys(filters).every(function (col) {
        return !filters[col].length;
      });
      /* eslint-disable react/jsx-one-expression-per-line */
      var postSizeError = estimatedPostSize >= _manifestUtil.AOP_THRESHOLD_POST_BODY_SIZE ? _react2.default.createElement(
        _Grid2.default,
        { item: true, xs: 12 },
        _react2.default.createElement(_SnackbarContent2.default, {
          className: classes.infoSnackbar,
          style: { marginBottom: _Theme2.default.spacing(2), backgroundColor: _Theme.COLORS.ORANGE[100], justifyContent: 'center' },
          message: _react2.default.createElement(
            'div',
            { className: classes.startFlex },
            _react2.default.createElement(_ReportProblem2.default, {
              fontSize: 'large',
              className: classes.infoSnackbarIcon,
              style: { color: _Theme.COLORS.ORANGE[800] }
            }),
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                _Typography2.default,
                { variant: 'body1' },
                'Too many files requested! Current selection will make an estimated ',
                _react2.default.createElement(
                  'b',
                  null,
                  (0, _manifestUtil.formatBytes)(estimatedPostSize)
                ),
                ' request; max size is ',
                _react2.default.createElement(
                  'b',
                  null,
                  (0, _manifestUtil.formatBytes)(_manifestUtil.AOP_THRESHOLD_POST_BODY_SIZE)
                ),
                '. Please select fewer files in order to proceed.'
              )
            )
          )
        })
      ) : null;
      var downloadSizeWarning = !postSizeError && totalSize > _manifestUtil.AOP_THRESHOLD_HARD_DRIVE_WARN ? _react2.default.createElement(
        _Grid2.default,
        { item: true, xs: 12 },
        _react2.default.createElement(_SnackbarContent2.default, {
          className: classes.infoSnackbar,
          style: { marginBottom: _Theme2.default.spacing(2) },
          message: _react2.default.createElement(
            'div',
            { className: classes.startFlex },
            _react2.default.createElement(_Info2.default, { fontSize: 'small', className: classes.infoSnackbarIcon }),
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                _Typography2.default,
                { variant: 'body2' },
                'This will be a large download. An alternate way to obtain lots of data is to submit an ',
                aopHardDriveLink,
                '.'
              )
            )
          )
        })
      ) : null;
      var components = {
        Container: _Box2.default,
        Toolbar: function Toolbar(toolbarProps) {
          return _react2.default.createElement(
            _Grid2.default,
            { container: true, spacing: 2, alignItems: 'flex-start' },
            _react2.default.createElement(
              _Grid2.default,
              { item: true, xs: 12, md: 6 },
              _react2.default.createElement(
                'div',
                { style: { marginBottom: _Theme2.default.spacing(1) } },
                _react2.default.createElement(
                  _ToggleButtonGroup2.default,
                  {
                    size: 'small',
                    value: visibleColumns,
                    onChange: function onChange(event, newVisibleColumns) {
                      return dispatch({
                        type: 'setS3FilesVisibleColumns',
                        visibleColumns: newVisibleColumns
                      });
                    },
                    'aria-label': 'show and hide columns',
                    'data-selenium': 'download-data-dialog.s3-files.show-hide-columns-button-group'
                  },
                  _react2.default.createElement(
                    _ToggleButton2.default,
                    { value: 'label', className: classes.showColumnsLabel, disabled: true },
                    'Show Columns:'
                  ),
                  _react2.default.createElement(
                    _ToggleButton2.default,
                    { value: 'site' },
                    'Site'
                  ),
                  _react2.default.createElement(
                    _ToggleButton2.default,
                    { value: 'visit' },
                    'Visit'
                  ),
                  _react2.default.createElement(
                    _ToggleButton2.default,
                    { value: 'date' },
                    'Date'
                  ),
                  _react2.default.createElement(
                    _ToggleButton2.default,
                    { value: 'name' },
                    'Name'
                  ),
                  _react2.default.createElement(
                    _ToggleButton2.default,
                    { value: 'type' },
                    'Type'
                  )
                )
              ),
              _react2.default.createElement(
                'div',
                { style: { marginBottom: _Theme2.default.spacing(1) } },
                _react2.default.createElement(
                  _Button2.default,
                  {
                    'data-selenium': 'download-data-dialog.s3-files.select-all-button',
                    size: 'small',
                    color: 'primary',
                    variant: 'outlined',
                    onClick: function onClick() {
                      dispatch({ type: 'setS3FilesValueSelectAll' });
                    },
                    disabled: isLoading || !validValues.length,
                    style: { whiteSpace: 'nowrap' }
                  },
                  _react2.default.createElement(_DoneAll2.default, { fontSize: 'small', style: { marginRight: _Theme2.default.spacing(1) } }),
                  'Select All (',
                  isLoading ? '…' : validValues.length,
                  ')'
                ),
                _react2.default.createElement(
                  _Button2.default,
                  {
                    'data-selenium': 'download-data-dialog.s3-files.select-none-button',
                    size: 'small',
                    color: 'primary',
                    variant: 'outlined',
                    onClick: function onClick() {
                      dispatch({ type: 'setS3FilesValueSelectNone' });
                    },
                    disabled: isLoading || !validValues.length,
                    style: { marginLeft: _Theme2.default.spacing(1), whiteSpace: 'nowrap' }
                  },
                  _react2.default.createElement(_Clear2.default, { fontSize: 'small', style: { marginRight: _Theme2.default.spacing(1) } }),
                  'Select None'
                )
              ),
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  _Button2.default,
                  {
                    'data-selenium': 'download-data-dialog.s3-files.select-filtered-button',
                    size: 'small',
                    color: 'primary',
                    variant: 'outlined',
                    onClick: function onClick() {
                      dispatch({ type: 'setS3FilesValueSelectFiltered' });
                    },
                    disabled: noFiltersApplied || isLoading,
                    style: { whiteSpace: 'nowrap' }
                  },
                  _react2.default.createElement(_FilterList2.default, { fontSize: 'small', style: { marginRight: _Theme2.default.spacing(1) } }),
                  'Select Filtered',
                  noFiltersApplied ? '' : ' (' + (isLoading ? '…' : filteredFileCount) + ')'
                ),
                _react2.default.createElement(
                  _Button2.default,
                  {
                    'data-selenium': 'download-data-dialog.s3-files.clear-filters-button',
                    size: 'small',
                    color: 'primary',
                    variant: 'outlined',
                    disabled: noFiltersApplied || isLoading,
                    onClick: function onClick() {
                      dispatch({ type: 'clearS3FilesFilterValues' });
                    },
                    style: { marginLeft: _Theme2.default.spacing(1), whiteSpace: 'nowrap' }
                  },
                  _react2.default.createElement(_DeleteSweep2.default, { fontSize: 'small', style: { marginRight: _Theme2.default.spacing(1) } }),
                  'Clear Filters'
                )
              )
            ),
            _react2.default.createElement(
              _Grid2.default,
              { item: true, xs: 12, md: 6 },
              _react2.default.createElement(_materialTable.MTableToolbar, _extends({}, toolbarProps, { style: { borderRadius: _Theme2.default.spacing(0.5) } }))
            ),
            postSizeError,
            downloadSizeWarning
          );
        },
        FilterRow: function FilterRow(filterRowProps) {
          return _react2.default.createElement(_materialTable.MTableFilterRow, _extends({}, filterRowProps, {
            onFilterChanged: function onFilterChanged(columnId, value) {
              filterRowProps.onFilterChanged(columnId, value);
              var filter = columns[columnId].field;
              var current = filters[filter];
              if (filter === 'name' && value !== current) {
                debouncedFilterDispatch(filter, value);
                return;
              }
              if (current && (value.length !== current.length || value.some(function (v) {
                return !current.includes(v);
              }))) {
                dispatch({ type: 'setS3FilesFilterValue', filter: filter, value: value });
              }
            }
          }));
        }
      };
      /* eslint-enable react/jsx-one-expression-per-line */
      var localization = {
        pagination: {
          labelRowsSelect: 'files'
        },
        toolbar: {
          nRowsSelected: '{0} file' + (selection.length === 1 ? '' : 's') + ' selected (' + (0, _manifestUtil.formatBytes)(totalSize) + ' uncompressed)'
        },
        body: {
          emptyDataSourceMessage: 'No files to display. Select more sites, broaden date range, or broaden search / filters.'
        }
      };
      return validValues.length || isLoading ? _react2.default.createElement(
        'div',
        { className: classes.fileTable },
        _react2.default.createElement(_materialTable2.default, {
          components: components,
          columns: columns,
          data: validValues,
          localization: localization,
          options: {
            selection: true,
            showSelectAllCheckbox: false,
            padding: 'dense',
            filtering: true,
            columnsButton: false,
            pageSize: 10,
            pageSizeOptions: [5, 10, 50, 100],
            showTitle: false,
            search: false,
            isLoading: isLoading
          },
          onSelectionChange: function onSelectionChange(rows, file) {
            dispatch({
              type: 'setIndividualS3FileSelected',
              id: file.id,
              selected: file.tableData.checked
            });
          }
        }),
        _react2.default.createElement(
          'div',
          { className: classes.loadingOverlay, style: { display: isLoading ? 'block' : 'none' } },
          _react2.default.createElement(
            _Typography2.default,
            { variant: 'h6', style: { marginBottom: _Theme2.default.spacing(4) } },
            'Loading files (' + (s3FileFetchProgress || 0).toFixed(1) + '%)...'
          ),
          _react2.default.createElement(_CircularProgress2.default, { variant: 'static', value: s3FileFetchProgress })
        )
      ) : _react2.default.createElement(
        _Typography2.default,
        { variant: 'subtitle1', style: { marginTop: _Theme2.default.spacing(3) } },
        'Select sites and date range in order to generate a list of files to choose from.'
      );
    },

    /**
       PACKAGE TYPE
    */
    packageType: function packageType() {
      var _state$packageType = state.packageType,
          value = _state$packageType.value,
          validValues = _state$packageType.validValues;
      var _state$productData = state.productData,
          productBasicDescription = _state$productData.productBasicDescription,
          productExpandedDescription = _state$productData.productExpandedDescription;

      if (!productBasicDescription) {
        productBasicDescription = 'Includes the data product, summary statistics, expanded uncertainty, and final quality flag';
      }
      if (!productExpandedDescription) {
        productExpandedDescription = 'Includes the basic package information plus quality metrics for all of the quality assessment and quality control analysis';
      }
      return _react2.default.createElement(
        _FormControl2.default,
        {
          'data-selenium': 'download-data-dialog.step-form.package-type',
          component: 'fieldset'
        },
        _react2.default.createElement(
          _RadioGroup2.default,
          {
            'aria-label': 'Package Type',
            name: 'package-type',
            value: value || '',
            onChange: function onChange(e) {
              setState('packageType', e.target.value);
              changeToNextUncompletedStep();
            }
          },
          _react2.default.createElement(_FormControlLabel2.default, {
            className: classes.radio,
            value: validValues[0],
            control: _react2.default.createElement(_Radio2.default, null),
            label: _react2.default.createElement(
              'div',
              { className: classes.radioLabel },
              _react2.default.createElement(
                _Typography2.default,
                { variant: 'h6' },
                'Basic'
              ),
              _react2.default.createElement(
                _Typography2.default,
                { variant: 'body2' },
                productBasicDescription
              )
            )
          }),
          _react2.default.createElement(_FormControlLabel2.default, {
            className: classes.radio,
            value: validValues[1],
            control: _react2.default.createElement(_Radio2.default, null),
            label: _react2.default.createElement(
              'div',
              { className: classes.radioLabel },
              _react2.default.createElement(
                _Typography2.default,
                { variant: 'h6' },
                'Expanded'
              ),
              _react2.default.createElement(
                _Typography2.default,
                { variant: 'body2' },
                productExpandedDescription
              )
            )
          })
        )
      );
    },

    /**
       EXTERNAL LINKS - EXCLUSIVE HOSTING
    */
    externalExclusive: function externalExclusive() {
      var externalHost = _ExternalHost2.default.getByProductCode(state.productData.productCode);
      if (!externalHost) {
        return null;
      }
      return _react2.default.createElement(
        'div',
        { 'data-selenium': 'download-data-dialog.step-form.external-links.' + externalHost.id.toLowerCase() },
        _react2.default.createElement(_SnackbarContent2.default, {
          className: classes.infoSnackbar,
          style: { marginBottom: _Theme2.default.spacing(3) },
          message: _react2.default.createElement(
            'div',
            { className: classes.startFlex },
            _react2.default.createElement(_Info2.default, { fontSize: 'large', className: classes.infoSnackbarIcon }),
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                _Typography2.default,
                { variant: 'subtitle2' },
                'Data for this product is not currently available for download through the NEON Data Portal. Please use the links below to access data for this product for a particular site from the ',
                externalHost.renderLink(),
                '.'
              )
            )
          )
        }),
        _react2.default.createElement(_ExternalHostProductSpecificLinks2.default, { productCode: state.productData.productCode })
      );
    },

    /**
       POLICIES
    */
    policies: function policies() {
      var agreed = state.policies.value;

      var checkbox = _react2.default.createElement(_Checkbox2.default, {
        color: 'primary',
        value: 'policies',
        checked: agreed,
        disabled: agreed,
        onChange: function onChange() {
          setState('policies', true);
          changeToNextUncompletedStep();
        }
      });
      /* eslint-disable react/jsx-one-expression-per-line */
      return _react2.default.createElement(
        'div',
        { 'data-selenium': 'download-data-dialog.step-form.policies' },
        _react2.default.createElement(
          _Typography2.default,
          { variant: 'subtitle1', gutterBottom: true },
          'In order to proceed to download NEON data you must agree to the ',
          dataUsageAndCitationPoliciesLink,
          '.'
        ),
        _react2.default.createElement(_FormControlLabel2.default, {
          control: checkbox,
          className: classes.formControlBold,
          label: 'I agree to the NEON Data Usage and Citation Policies.'
        })
      );
      /* eslint-enable react/jsx-one-expression-per-line */
    },

    /**
       SUMMARY
    */
    summary: function summary() {
      var stepSummary = _react2.default.createElement(
        'div',
        { 'data-selenium': 'download-data-dialog.step-form.summary' },
        state.requiredSteps.map(function (step, index) {
          if (['summary', 'policies'].includes(step.key)) {
            return null;
          }
          var isComplete = state.requiredSteps[index].isComplete;

          return _react2.default.createElement(
            'div',
            { key: step.key, className: classes.stepSummary },
            _react2.default.createElement(
              'div',
              {
                role: 'button',
                tabIndex: 0,
                className: classes.stepSummaryHeader,
                onClick: function onClick() {
                  return changeToStep(index);
                },
                onKeyPress: function onKeyPress() {
                  return changeToStep(index);
                }
              },
              _react2.default.createElement(_Chip2.default, {
                color: isComplete ? 'primary' : 'default',
                label: index + 1,
                className: classes.summaryChip
              }),
              _react2.default.createElement(
                _Typography2.default,
                { variant: 'h6', style: { flexGrow: 1 } },
                _DownloadDataContext2.default.ALL_STEPS[step.key].label
              )
            ),
            _react2.default.createElement(
              'div',
              { className: classes.stepSummaryContent },
              isComplete ? renderStepSummary[step.key]() : _react2.default.createElement(
                _Typography2.default,
                { variant: 'body2', className: classes.summaryTextIncomplete },
                'Incomplete'
              )
            )
          );
        }),
        _react2.default.createElement(
          'div',
          { key: 'download', className: classes.stepSummary },
          renderDownloadButton()
        )
      );
      var downloadAndExploreLink = _ExternalHost2.default.renderExternalLink('https://www.neonscience.org/download-explore-neon-data', 'Download and Explore NEON Data', 'NEON');
      var downloadAndExploreSnackbar = _react2.default.createElement(
        'div',
        { 'data-selenium': 'download-data-dialog.step-form.summary.file-naming' },
        _react2.default.createElement(_SnackbarContent2.default, {
          className: classes.infoSnackbar,
          style: { margin: _Theme2.default.spacing(0.5, 0, 3, 0) },
          message: _react2.default.createElement(
            'div',
            { className: classes.startFlex },
            _react2.default.createElement(_Explore2.default, { fontSize: 'large', className: classes.infoSnackbarIcon }),
            _react2.default.createElement(
              _Typography2.default,
              { variant: 'subtitle2' },
              'Tip: Check out our ',
              downloadAndExploreLink,
              ' tutorial. This tutorial will explain how our neonUtilities package can be used to unzip and join data tables with just a few lines of code.'
            )
          )
        })
      );
      var fileNamingConventionsLink = _ExternalHost2.default.renderExternalLink('https://data.neonscience.org/file-naming-conventions', 'NEON File Naming Conventions', 'NEON');
      var fileNamingSnackbar = _react2.default.createElement(
        'div',
        { 'data-selenium': 'download-data-dialog.step-form.summary.file-naming' },
        _react2.default.createElement(_SnackbarContent2.default, {
          className: classes.infoSnackbar,
          style: { margin: _Theme2.default.spacing(0.5, 0, 3, 0) },
          message: _react2.default.createElement(
            'div',
            { className: classes.startFlex },
            _react2.default.createElement(_Description2.default, { fontSize: 'large', className: classes.infoSnackbarIcon }),
            _react2.default.createElement(
              _Typography2.default,
              { variant: 'subtitle2' },
              'Files in this download will follow ',
              fileNamingConventionsLink,
              '.'
            )
          )
        })
      );
      var _state$productData2 = state.productData,
          productCode = _state$productData2.productCode,
          productName = _state$productData2.productName;

      var year = (0, _moment2.default)().format('YYYY');
      var today = (0, _moment2.default)().format('MMMM D, YYYY');
      var maturity = 'Provisional';
      var url = 'http://data.neonscience.org';
      var citationText = 'National Ecological Observatory Network. ' + year + '. Data Product ' + productCode + ', ' + productName + '. ' + maturity + ' data downloaded from ' + url + ' on ' + today + '. Battelle, Boulder, CO, USA NEON. ' + year + '.';
      var citationSnackbar = _react2.default.createElement(
        'div',
        { 'data-selenium': 'download-data-dialog.step-form.summary.citation' },
        _react2.default.createElement(_SnackbarContent2.default, {
          className: classes.infoSnackbar,
          style: { margin: _Theme2.default.spacing(0.5, 0, 3, 0) },
          message: _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'div',
              { className: classes.startFlex },
              _react2.default.createElement(_FormatQuote2.default, { fontSize: 'large', className: classes.infoSnackbarIcon }),
              _react2.default.createElement(
                _Typography2.default,
                { variant: 'subtitle2', style: { flexGrow: 1 } },
                'Please use this citation in your publications. See ',
                dataUsageAndCitationPoliciesLink,
                ' for more info.'
              ),
              _react2.default.createElement(
                _reactCopyToClipboard.CopyToClipboard,
                { text: citationText },
                _react2.default.createElement(
                  _Button2.default,
                  { color: 'primary', variant: 'outlined', size: 'small', className: classes.copyButton },
                  _react2.default.createElement(_Assignment2.default, { fontSize: 'small', style: { marginRight: _Theme2.default.spacing(1) } }),
                  'Copy'
                )
              )
            ),
            _react2.default.createElement(_Divider2.default, { style: { margin: _Theme2.default.spacing(1.5, 0) } }),
            _react2.default.createElement(
              _Typography2.default,
              {
                variant: 'body2',
                style: { backgroundColor: 'rgba(255, 255, 255, 0.01)' } // For copy+paste
              },
              citationText
            )
          )
        })
      );
      return _react2.default.createElement(
        _Grid2.default,
        {
          container: true,
          spacing: 2,
          alignItems: 'flex-start'
        },
        _react2.default.createElement(
          _Grid2.default,
          { item: true, xs: 12, md: 6 },
          stepSummary
        ),
        _react2.default.createElement(
          _Grid2.default,
          { item: true, xs: 12, md: 6 },
          downloadAndExploreSnackbar,
          fileNamingSnackbar,
          citationSnackbar
        )
      );
    }
  };

  return renderStepForm[stepKey] ? renderStepForm[stepKey]() : null;
}

DownloadStepForm.propTypes = {
  stepKey: _propTypes2.default.oneOf(Object.keys(_DownloadDataContext2.default.ALL_STEPS)).isRequired,
  changeToStep: _propTypes2.default.func,
  changeToNextUncompletedStep: _propTypes2.default.func,
  renderDownloadButton: _propTypes2.default.func
};

DownloadStepForm.defaultProps = {
  changeToStep: function changeToStep() {},
  changeToNextUncompletedStep: function changeToNextUncompletedStep() {},
  renderDownloadButton: function renderDownloadButton() {
    return null;
  }
};