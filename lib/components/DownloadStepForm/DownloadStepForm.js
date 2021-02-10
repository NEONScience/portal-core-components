"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DownloadStepForm;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _styles = require("@material-ui/core/styles");

var _Box = _interopRequireDefault(require("@material-ui/core/Box"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Card = _interopRequireDefault(require("@material-ui/core/Card"));

var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));

var _Checkbox = _interopRequireDefault(require("@material-ui/core/Checkbox"));

var _Chip = _interopRequireDefault(require("@material-ui/core/Chip"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _FormControl = _interopRequireDefault(require("@material-ui/core/FormControl"));

var _FormControlLabel = _interopRequireDefault(require("@material-ui/core/FormControlLabel"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Link = _interopRequireDefault(require("@material-ui/core/Link"));

var _Radio = _interopRequireDefault(require("@material-ui/core/Radio"));

var _RadioGroup = _interopRequireDefault(require("@material-ui/core/RadioGroup"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Info = _interopRequireDefault(require("@material-ui/icons/Info"));

var _FormatQuote = _interopRequireDefault(require("@material-ui/icons/FormatQuote"));

var _Assignment = _interopRequireDefault(require("@material-ui/icons/Assignment"));

var _Description = _interopRequireDefault(require("@material-ui/icons/Description"));

var _DoneAll = _interopRequireDefault(require("@material-ui/icons/DoneAll"));

var _Clear = _interopRequireDefault(require("@material-ui/icons/Clear"));

var _FilterList = _interopRequireDefault(require("@material-ui/icons/FilterList"));

var _DeleteSweep = _interopRequireDefault(require("@material-ui/icons/DeleteSweep"));

var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));

var _Explore = _interopRequireDefault(require("@material-ui/icons/Explore"));

var _reactCopyToClipboard = require("react-copy-to-clipboard");

var _ToggleButton = _interopRequireDefault(require("@material-ui/lab/ToggleButton"));

var _ToggleButtonGroup = _interopRequireDefault(require("@material-ui/lab/ToggleButtonGroup"));

var _moment = _interopRequireDefault(require("moment"));

var _materialTable = _interopRequireWildcard(require("material-table"));

var _DownloadDataContext = _interopRequireDefault(require("../DownloadDataContext/DownloadDataContext"));

var _DataProductAvailability = _interopRequireDefault(require("../DataProductAvailability/DataProductAvailability"));

var _ExternalHost = _interopRequireDefault(require("../ExternalHost/ExternalHost"));

var _ExternalHostProductSpecificLinks = _interopRequireDefault(require("../ExternalHostProductSpecificLinks/ExternalHostProductSpecificLinks"));

var _MaterialTableIcons = _interopRequireDefault(require("../MaterialTableIcons/MaterialTableIcons"));

var _SiteChip = _interopRequireDefault(require("../SiteChip/SiteChip"));

var _Theme = _interopRequireWildcard(require("../Theme/Theme"));

var _manifestUtil = require("../../util/manifestUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    copyButton: {
      marginLeft: theme.spacing(2)
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
    calloutIcon: {
      color: theme.palette.grey[300],
      marginRight: theme.spacing(2)
    },
    calloutIconBrown: {
      color: _Theme.default.colors.BROWN[300],
      marginRight: theme.spacing(2)
    },
    calloutBrown: {
      marginBottom: theme.spacing(3),
      backgroundColor: _Theme.default.colors.BROWN[50],
      borderColor: _Theme.default.colors.BROWN[300]
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

var dataUsageAndCitationPoliciesLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
  target: "_blank",
  href: "https://www.neonscience.org/data/about-data/data-policies",
  "data-gtm": "download-data-dialog.policies-link"
}, "Data Usage and Citation Policies");

function DownloadStepForm(props) {
  var classes = useStyles(_Theme.default);
  var stepKey = props.stepKey,
      changeToStep = props.changeToStep,
      changeToNextUncompletedStep = props.changeToNextUncompletedStep,
      renderDownloadButton = props.renderDownloadButton;

  var _DownloadDataContext$ = _DownloadDataContext.default.useDownloadDataState(),
      _DownloadDataContext$2 = _slicedToArray(_DownloadDataContext$, 2),
      state = _DownloadDataContext$2[0],
      dispatch = _DownloadDataContext$2[1]; // Effect to keep focus on the file name search field if it was the last filter updated


  (0, _react.useEffect)(function () {
    if (state.s3Files.lastFilterChanged !== 'name') {
      return;
    }

    var mTable = document.querySelector('#s3Files-selection-table-container');

    if (!mTable) {
      return;
    }

    var nameSearch = mTable.querySelector('input[type="search"]');

    if (!nameSearch) {
      return;
    }

    nameSearch.focus();
  });

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
        return (0, _moment.default)("".concat(yearMonth, "-01"));
      };

      var humanDateRange = "".concat(getYearMonthMoment(dateRange[0]).format('MMM YYYY'), " - ").concat(getYearMonthMoment(dateRange[1]).format('MMM YYYY'));
      var siteChipLabel = "".concat(sites.length, " site").concat(sitesPlural, " \u2014 ").concat(humanDateRange);
      return /*#__PURE__*/_react.default.createElement(_SiteChip.default, {
        size: "large",
        variant: "default",
        label: siteChipLabel
      });
    },
    documentation: function documentation() {
      var documentation = state.documentation.value;
      return /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2",
        className: classes.summaryText
      }, "".concat(documentation.charAt(0).toUpperCase()).concat(documentation.substring(1)));
    },
    packageType: function packageType() {
      var packageType = state.packageType.value;
      return /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2",
        className: classes.summaryText
      }, "".concat(packageType.charAt(0).toUpperCase()).concat(packageType.substring(1)));
    },
    s3Files: function s3Files() {
      var _state$s3Files = state.s3Files,
          files = _state$s3Files.value,
          totalSize = _state$s3Files.totalSize;
      return /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2",
        className: classes.summaryText
      }, "".concat(files.length, " file").concat(files.length === 1 ? '' : 's', " (").concat((0, _manifestUtil.formatBytes)(totalSize), " uncompressed)"));
    }
  };
  var renderStepForm = {
    /**
       SITES AND DATE RANGE
    */
    sitesAndDateRange: function sitesAndDateRange() {
      return /*#__PURE__*/_react.default.createElement(_DataProductAvailability.default, {
        "data-selenium": "download-data-dialog.step-form.sites-and-date-range"
      });
    },

    /**
       DOCUMENTATION
    */
    documentation: function documentation() {
      var neonFaqLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
        target: "_blank",
        href: "http://data.neonscience.org/faq",
        "data-gtm": "download-data-dialog.neon-faq-link"
      }, "NEON FAQ");

      var knbLink = _ExternalHost.default.renderExternalHostLink('https://eml.ecoinformatics.org', 'KNB', 'KNB', state.productData.productCode);

      var _state$documentation = state.documentation,
          value = _state$documentation.value,
          validValues = _state$documentation.validValues;
      return /*#__PURE__*/_react.default.createElement(_Grid.default, {
        container: true,
        spacing: 2,
        alignItems: "flex-start",
        "data-selenium": "download-data-dialog.step-form.documentation"
      }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12,
        md: 6
      }, /*#__PURE__*/_react.default.createElement(_FormControl.default, {
        component: "fieldset"
      }, /*#__PURE__*/_react.default.createElement(_RadioGroup.default, {
        "aria-label": "Documentation",
        name: "documentation",
        value: value || '',
        onChange: function onChange(e) {
          setState('documentation', e.target.value);
          changeToNextUncompletedStep();
        }
      }, /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
        className: classes.radio,
        value: validValues[0],
        control: /*#__PURE__*/_react.default.createElement(_Radio.default, null),
        label: /*#__PURE__*/_react.default.createElement("div", {
          className: classes.radioLabel
        }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "h6"
        }, "Include"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "body2"
        }, "Include relevant documents for this Data Product"))
      }), /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
        className: classes.radio,
        value: validValues[1],
        control: /*#__PURE__*/_react.default.createElement(_Radio.default, null),
        label: /*#__PURE__*/_react.default.createElement("div", {
          className: classes.radioLabel
        }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "h6"
        }, "Exclude"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "body2"
        }, "Data only, no relevant documents for this Data Product"))
      })))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12,
        md: 6
      }, /*#__PURE__*/_react.default.createElement(_Card.default, {
        style: {
          marginTop: _Theme.default.spacing(1.5)
        }
      }, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
        className: classes.startFlex
      }, /*#__PURE__*/_react.default.createElement(_Info.default, {
        fontSize: "large",
        className: classes.calloutIcon
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body1"
      }, "EML files for this Data Product are included in all downloads. Learn more about EML files in the ", neonFaqLink, " and at ", knbLink, ".")))));
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
      var debouncedFilterDispatch = (0, _lodash.debounce)(function (filter, value) {
        dispatch({
          type: 'setS3FilesFilterValue',
          filter: filter,
          value: value
        });
      }, 200);
      var noFiltersApplied = Object.keys(filters).every(function (col) {
        return !filters[col].length;
      });
      /* eslint-disable react/jsx-one-expression-per-line */

      var postSizeError = estimatedPostSize >= _manifestUtil.MAX_POST_BODY_SIZE ? /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12
      }, /*#__PURE__*/_react.default.createElement(_Card.default, {
        style: {
          marginBottom: _Theme.default.spacing(2),
          backgroundColor: _Theme.COLORS.GOLD[300]
        }
      }, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
        className: classes.startFlex,
        style: {
          justifyContent: 'center'
        }
      }, /*#__PURE__*/_react.default.createElement(_Warning.default, {
        fontSize: "large",
        className: classes.calloutIcon,
        style: {
          color: _Theme.COLORS.GOLD[800]
        }
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body1"
      }, "Too many files requested! Current selection will make an estimated ", /*#__PURE__*/_react.default.createElement("b", null, (0, _manifestUtil.formatBytes)(estimatedPostSize)), " request; max size is ", /*#__PURE__*/_react.default.createElement("b", null, (0, _manifestUtil.formatBytes)(_manifestUtil.MAX_POST_BODY_SIZE)), ". Please select fewer files in order to proceed.")))) : null;
      var components = {
        Container: _Box.default,
        Toolbar: function Toolbar(toolbarProps) {
          return /*#__PURE__*/_react.default.createElement(_Grid.default, {
            container: true,
            spacing: 2,
            alignItems: "flex-start",
            style: {
              marginBottom: '24px'
            }
          }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
            item: true,
            xs: 12,
            md: 6
          }, /*#__PURE__*/_react.default.createElement("div", {
            style: {
              marginBottom: _Theme.default.spacing(1)
            }
          }, /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
            size: "small",
            value: visibleColumns,
            onChange: function onChange(event, newVisibleColumns) {
              return dispatch({
                type: 'setS3FilesVisibleColumns',
                visibleColumns: newVisibleColumns
              });
            },
            "aria-label": "show and hide columns",
            "data-selenium": "download-data-dialog.s3-files.show-hide-columns-button-group"
          }, /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
            value: "label",
            className: classes.showColumnsLabel,
            disabled: true
          }, "Show Columns:"), /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
            value: "site"
          }, "Site"), /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
            value: "visit"
          }, "Visit"), /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
            value: "date"
          }, "Date"), /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
            value: "name"
          }, "Name"), /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
            value: "type"
          }, "Type"))), /*#__PURE__*/_react.default.createElement("div", {
            style: {
              marginBottom: _Theme.default.spacing(1)
            }
          }, /*#__PURE__*/_react.default.createElement(_Button.default, {
            "data-selenium": "download-data-dialog.s3-files.select-all-button",
            size: "small",
            color: "primary",
            variant: "outlined",
            onClick: function onClick() {
              dispatch({
                type: 'setS3FilesValueSelectAll'
              });
            },
            disabled: isLoading || !validValues.length,
            style: {
              whiteSpace: 'nowrap'
            }
          }, /*#__PURE__*/_react.default.createElement(_DoneAll.default, {
            fontSize: "small",
            style: {
              marginRight: _Theme.default.spacing(1)
            }
          }), "Select All (", isLoading ? '…' : validValues.length, ")"), /*#__PURE__*/_react.default.createElement(_Button.default, {
            "data-selenium": "download-data-dialog.s3-files.select-none-button",
            size: "small",
            color: "primary",
            variant: "outlined",
            onClick: function onClick() {
              dispatch({
                type: 'setS3FilesValueSelectNone'
              });
            },
            disabled: isLoading || !validValues.length,
            style: {
              marginLeft: _Theme.default.spacing(1),
              whiteSpace: 'nowrap'
            }
          }, /*#__PURE__*/_react.default.createElement(_Clear.default, {
            fontSize: "small",
            style: {
              marginRight: _Theme.default.spacing(1)
            }
          }), "Select None")), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Button.default, {
            "data-selenium": "download-data-dialog.s3-files.select-filtered-button",
            size: "small",
            color: "primary",
            variant: "outlined",
            onClick: function onClick() {
              dispatch({
                type: 'setS3FilesValueSelectFiltered'
              });
            },
            disabled: noFiltersApplied || isLoading,
            style: {
              whiteSpace: 'nowrap'
            }
          }, /*#__PURE__*/_react.default.createElement(_FilterList.default, {
            fontSize: "small",
            style: {
              marginRight: _Theme.default.spacing(1)
            }
          }), "Select Filtered", noFiltersApplied ? '' : " (".concat(isLoading ? '…' : filteredFileCount, ")")), /*#__PURE__*/_react.default.createElement(_Button.default, {
            "data-selenium": "download-data-dialog.s3-files.clear-filters-button",
            size: "small",
            color: "primary",
            variant: "outlined",
            disabled: noFiltersApplied || isLoading,
            onClick: function onClick() {
              dispatch({
                type: 'clearS3FilesFilterValues'
              });
            },
            style: {
              marginLeft: _Theme.default.spacing(1),
              whiteSpace: 'nowrap'
            }
          }, /*#__PURE__*/_react.default.createElement(_DeleteSweep.default, {
            fontSize: "small",
            style: {
              marginRight: _Theme.default.spacing(1)
            }
          }), "Clear Filters"))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
            item: true,
            xs: 12,
            md: 6
          }, /*#__PURE__*/_react.default.createElement(_materialTable.MTableToolbar, toolbarProps)), postSizeError);
        },
        FilterRow: function FilterRow(filterRowProps) {
          return /*#__PURE__*/_react.default.createElement(_materialTable.MTableFilterRow, _extends({}, filterRowProps, {
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
                dispatch({
                  type: 'setS3FilesFilterValue',
                  filter: filter,
                  value: value
                });
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
          nRowsSelected: "{0} file".concat(selection.length === 1 ? '' : 's', " selected (").concat((0, _manifestUtil.formatBytes)(totalSize), " uncompressed)")
        },
        body: {
          emptyDataSourceMessage: 'No files to display. Select more sites, broaden date range, or broaden search / filters.'
        }
      };
      return validValues.length || isLoading ? /*#__PURE__*/_react.default.createElement("div", {
        className: classes.fileTable,
        id: "s3Files-selection-table-container"
      }, /*#__PURE__*/_react.default.createElement(_materialTable.default, {
        icons: _MaterialTableIcons.default,
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
            url: file.url,
            selected: file.tableData.checked
          });
        }
      }), /*#__PURE__*/_react.default.createElement("div", {
        className: classes.loadingOverlay,
        style: {
          display: isLoading ? 'block' : 'none'
        }
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "h6",
        style: {
          marginBottom: _Theme.default.spacing(4)
        }
      }, "Loading files (".concat(Math.floor(s3FileFetchProgress || 0), "%)...")), /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
        variant: "determinate",
        value: s3FileFetchProgress
      }))) : /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle1",
        style: {
          marginTop: _Theme.default.spacing(3)
        }
      }, "Select sites and date range in order to generate a list of files to choose from.");
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

      return /*#__PURE__*/_react.default.createElement(_FormControl.default, {
        "data-selenium": "download-data-dialog.step-form.package-type",
        component: "fieldset"
      }, /*#__PURE__*/_react.default.createElement(_RadioGroup.default, {
        "aria-label": "Package Type",
        name: "package-type",
        value: value || '',
        onChange: function onChange(e) {
          setState('packageType', e.target.value);
          changeToNextUncompletedStep();
        }
      }, /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
        className: classes.radio,
        value: validValues[0],
        control: /*#__PURE__*/_react.default.createElement(_Radio.default, null),
        label: /*#__PURE__*/_react.default.createElement("div", {
          className: classes.radioLabel
        }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "h6"
        }, "Basic"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "body2"
        }, productBasicDescription))
      }), /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
        className: classes.radio,
        value: validValues[1],
        control: /*#__PURE__*/_react.default.createElement(_Radio.default, null),
        label: /*#__PURE__*/_react.default.createElement("div", {
          className: classes.radioLabel
        }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "h6"
        }, "Expanded"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "body2"
        }, productExpandedDescription))
      })));
    },

    /**
       EXTERNAL LINKS - EXCLUSIVE HOSTING
    */
    externalExclusive: function externalExclusive() {
      var externalHost = _ExternalHost.default.getByProductCode(state.productData.productCode);

      if (!externalHost) {
        return null;
      }

      var hostLink = externalHost.renderLink(state.productData.productCode);
      var availableSiteCodes = (state.productData.siteCodes || []).map(function (site) {
        return site.siteCode;
      });
      return /*#__PURE__*/_react.default.createElement("div", {
        "data-selenium": "download-data-dialog.step-form.external-links.".concat(externalHost.id.toLowerCase())
      }, /*#__PURE__*/_react.default.createElement(_Card.default, {
        className: classes.calloutBrown
      }, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
        className: classes.startFlex
      }, /*#__PURE__*/_react.default.createElement(_Info.default, {
        fontSize: "large",
        className: classes.calloutIconBrown
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2"
      }, "Data for this product is not currently available for download through the NEON Data Portal. Please use the links below to access data for this product for a particular site from the ", hostLink, "."))), /*#__PURE__*/_react.default.createElement(_ExternalHostProductSpecificLinks.default, {
        productCode: state.productData.productCode,
        siteCodes: availableSiteCodes
      }));
    },

    /**
       POLICIES
    */
    policies: function policies() {
      var agreed = state.policies.value;

      var checkbox = /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
        color: "primary",
        value: "policies",
        checked: agreed,
        disabled: agreed,
        onChange: function onChange() {
          setState('policies', true);
          changeToNextUncompletedStep();
        }
      });
      /* eslint-disable react/jsx-one-expression-per-line */


      return /*#__PURE__*/_react.default.createElement("div", {
        "data-selenium": "download-data-dialog.step-form.policies"
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle1",
        gutterBottom: true
      }, "In order to proceed to download NEON data you must agree to the ", dataUsageAndCitationPoliciesLink, "."), /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
        control: checkbox,
        className: classes.formControlBold,
        label: "I agree to the NEON Data Usage and Citation Policies."
      }));
      /* eslint-enable react/jsx-one-expression-per-line */
    },

    /**
       SUMMARY
    */
    summary: function summary() {
      var stepSummary = /*#__PURE__*/_react.default.createElement("div", {
        "data-selenium": "download-data-dialog.step-form.summary"
      }, state.requiredSteps.map(function (step, index) {
        if (['summary', 'policies'].includes(step.key)) {
          return null;
        }

        var isComplete = state.requiredSteps[index].isComplete;
        return /*#__PURE__*/_react.default.createElement("div", {
          key: step.key,
          className: classes.stepSummary
        }, /*#__PURE__*/_react.default.createElement("div", {
          role: "button",
          tabIndex: 0,
          className: classes.stepSummaryHeader,
          onClick: function onClick() {
            return changeToStep(index);
          },
          onKeyPress: function onKeyPress() {
            return changeToStep(index);
          }
        }, /*#__PURE__*/_react.default.createElement(_Chip.default, {
          color: isComplete ? 'primary' : 'default',
          label: index + 1,
          className: classes.summaryChip
        }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "h6",
          style: {
            flexGrow: 1
          }
        }, _DownloadDataContext.default.ALL_STEPS[step.key].label)), /*#__PURE__*/_react.default.createElement("div", {
          className: classes.stepSummaryContent
        }, isComplete ? renderStepSummary[step.key]() : /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "body2",
          className: classes.summaryTextIncomplete
        }, "Incomplete")));
      }), /*#__PURE__*/_react.default.createElement("div", {
        key: "download",
        className: classes.stepSummary
      }, renderDownloadButton()));

      var downloadAndExploreLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
        target: "_blank",
        href: "https://www.neonscience.org/download-explore-neon-data",
        "data-gtm": "download-data-dialog.download-and-explore-link"
      }, "Download and Explore NEON Data");

      var downloadAndExploreCallout = /*#__PURE__*/_react.default.createElement(_Card.default, {
        style: {
          margin: _Theme.default.spacing(0.5, 0, 3, 0)
        },
        "data-selenium": "download-data-dialog.step-form.summary.download-and-explore"
      }, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
        className: classes.startFlex
      }, /*#__PURE__*/_react.default.createElement(_Explore.default, {
        fontSize: "large",
        className: classes.calloutIcon
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2"
      }, "Tip: Check out our ", downloadAndExploreLink, " tutorial. This tutorial will explain how our neonUtilities package can be used to unzip and join data tables with just a few lines of code.")));

      var fileNamingConventionsLink = /*#__PURE__*/_react.default.createElement(_Link.default, {
        target: "_blank",
        href: "https://data.neonscience.org/file-naming-conventions",
        "data-gtm": "download-data-dialog.file-naming-conventions-link"
      }, "NEON File Naming Conventions");

      var fileNamingCallout = /*#__PURE__*/_react.default.createElement(_Card.default, {
        style: {
          margin: _Theme.default.spacing(0.5, 0, 3, 0)
        },
        "data-selenium": "download-data-dialog.step-form.summary.file-naming"
      }, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
        className: classes.startFlex
      }, /*#__PURE__*/_react.default.createElement(_Description.default, {
        fontSize: "large",
        className: classes.calloutIcon
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2"
      }, "Files in this download will follow ", fileNamingConventionsLink, ".")));

      var _state$productData2 = state.productData,
          productCode = _state$productData2.productCode,
          productName = _state$productData2.productName;
      var year = (0, _moment.default)().format('YYYY');
      var today = (0, _moment.default)().format('MMMM D, YYYY');
      var maturity = 'Provisional';
      var url = 'http://data.neonscience.org';
      var citationText = "National Ecological Observatory Network. ".concat(year, ". Data Product ").concat(productCode, ", ").concat(productName, ". ").concat(maturity, " data downloaded from ").concat(url, " on ").concat(today, ". Battelle, Boulder, CO, USA NEON. ").concat(year, ".");

      var citationCallout = /*#__PURE__*/_react.default.createElement(_Card.default, {
        style: {
          margin: _Theme.default.spacing(0.5, 0, 3, 0)
        },
        "data-selenium": "download-data-dialog.step-form.summary.citation"
      }, /*#__PURE__*/_react.default.createElement(_CardContent.default, null, /*#__PURE__*/_react.default.createElement("div", {
        className: classes.startFlex
      }, /*#__PURE__*/_react.default.createElement(_FormatQuote.default, {
        fontSize: "large",
        className: classes.calloutIcon
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2",
        style: {
          flexGrow: 1
        }
      }, "Please use this citation in your publications. See ", dataUsageAndCitationPoliciesLink, " for more info."), /*#__PURE__*/_react.default.createElement(_reactCopyToClipboard.CopyToClipboard, {
        text: citationText
      }, /*#__PURE__*/_react.default.createElement(_Button.default, {
        color: "primary",
        variant: "outlined",
        size: "small",
        className: classes.copyButton,
        startIcon: /*#__PURE__*/_react.default.createElement(_Assignment.default, null)
      }, "Copy"))), /*#__PURE__*/_react.default.createElement(_Divider.default, {
        style: {
          margin: _Theme.default.spacing(1.5, 0)
        }
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2",
        style: {
          backgroundColor: 'rgba(255, 255, 255, 0.01)'
        } // For copy+paste

      }, citationText)));

      return /*#__PURE__*/_react.default.createElement(_Grid.default, {
        container: true,
        spacing: 2,
        alignItems: "flex-start"
      }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12,
        md: 6
      }, stepSummary), /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12,
        md: 6
      }, downloadAndExploreCallout, fileNamingCallout, citationCallout));
    }
  };
  return renderStepForm[stepKey] ? renderStepForm[stepKey]() : null;
}

DownloadStepForm.propTypes = {
  stepKey: _propTypes.default.oneOf(Object.keys(_DownloadDataContext.default.ALL_STEPS)).isRequired,
  changeToStep: _propTypes.default.func,
  changeToNextUncompletedStep: _propTypes.default.func,
  renderDownloadButton: _propTypes.default.func
};
DownloadStepForm.defaultProps = {
  changeToStep: function changeToStep() {},
  changeToNextUncompletedStep: function changeToNextUncompletedStep() {},
  renderDownloadButton: function renderDownloadButton() {
    return null;
  }
};