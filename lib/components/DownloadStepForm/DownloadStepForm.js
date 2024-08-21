"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _lodash = require("lodash");
var _styles = require("@mui/styles");
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _Card = _interopRequireDefault(require("@mui/material/Card"));
var _CardContent = _interopRequireDefault(require("@mui/material/CardContent"));
var _Checkbox = _interopRequireDefault(require("@mui/material/Checkbox"));
var _Chip = _interopRequireDefault(require("@mui/material/Chip"));
var _CircularProgress = _interopRequireDefault(require("@mui/material/CircularProgress"));
var _FormControl = _interopRequireDefault(require("@mui/material/FormControl"));
var _FormControlLabel = _interopRequireDefault(require("@mui/material/FormControlLabel"));
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _Link = _interopRequireDefault(require("@mui/material/Link"));
var _Radio = _interopRequireDefault(require("@mui/material/Radio"));
var _RadioGroup = _interopRequireDefault(require("@mui/material/RadioGroup"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Info = _interopRequireDefault(require("@mui/icons-material/Info"));
var _Description = _interopRequireDefault(require("@mui/icons-material/Description"));
var _DoneAll = _interopRequireDefault(require("@mui/icons-material/DoneAll"));
var _Clear = _interopRequireDefault(require("@mui/icons-material/Clear"));
var _FilterList = _interopRequireDefault(require("@mui/icons-material/FilterList"));
var _DeleteSweep = _interopRequireDefault(require("@mui/icons-material/DeleteSweep"));
var _Warning = _interopRequireDefault(require("@mui/icons-material/Warning"));
var _Explore = _interopRequireDefault(require("@mui/icons-material/Explore"));
var _ToggleButton = _interopRequireDefault(require("@mui/material/ToggleButton"));
var _ToggleButtonGroup = _interopRequireDefault(require("@mui/material/ToggleButtonGroup"));
var _moment = _interopRequireDefault(require("moment"));
var _materialTable = _interopRequireWildcard(require("material-table"));
var _reactMarkdown = _interopRequireDefault(require("react-markdown"));
var _remarkGfm = _interopRequireDefault(require("remark-gfm"));
var _ComponentErrorBoundary = _interopRequireDefault(require("../Error/ComponentErrorBoundary"));
var _CustomComponentFallback = _interopRequireDefault(require("../Error/CustomComponentFallback"));
var _DataProductCitation = _interopRequireDefault(require("../Citation/DataProductCitation"));
var _DownloadDataContext = _interopRequireDefault(require("../DownloadDataContext/DownloadDataContext"));
var _DataProductAvailability = _interopRequireDefault(require("../DataProductAvailability/DataProductAvailability"));
var _InfoMessageCard = _interopRequireDefault(require("../Card/InfoMessageCard"));
var _ExternalHost = _interopRequireDefault(require("../ExternalHost/ExternalHost"));
var _ExternalHostProductSpecificLinks = _interopRequireDefault(require("../ExternalHostProductSpecificLinks/ExternalHostProductSpecificLinks"));
var _MaterialTableIcons = _interopRequireDefault(require("../MaterialTableIcons/MaterialTableIcons"));
var _SiteChip = _interopRequireDefault(require("../SiteChip/SiteChip"));
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
var _defaultProps = require("../../util/defaultProps");
var _ReleaseService = _interopRequireDefault(require("../../service/ReleaseService"));
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _manifestUtil = require("../../util/manifestUtil");
var _typeUtil = require("../../util/typeUtil");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/* eslint-disable react/no-unstable-nested-components */

const useStyles = (0, _styles.makeStyles)(theme => ({
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
  },
  markdownWrapper: {
    '& p': {
      margin: 0
    }
  }
}));
const textComponentDefaultProps = {
  content: null
};
const TextComponent = inProps => {
  const props = (0, _defaultProps.resolveProps)(textComponentDefaultProps, inProps);
  const {
    content
  } = props;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
    variant: "body2",
    component: "p",
    children: content
  });
};
TextComponent.propTypes = {
  content: _propTypes.default.string
};
const MarkdownFallbackComponent = props => /*#__PURE__*/(0, _jsxRuntime.jsx)(_CustomComponentFallback.default
// eslint-disable-next-line react/no-unstable-nested-components
, {
  FallbackComponent: () => /*#__PURE__*/(0, _jsxRuntime.jsx)(TextComponent, {
    ...props
  })
});
const dataUsageAndCitationPoliciesLink = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
  target: "_blank",
  href: _RouteService.default.getDataPoliciesPath(),
  "data-gtm": "download-data-dialog.policies-link",
  children: "Data Usage and Citation Policies"
});
const renderStepSummary = {
  sitesAndDateRange: (classes, state) => {
    const {
      value: sites
    } = state.sites;
    const {
      value: dateRange
    } = state.dateRange;
    const sitesPlural = sites.length > 1 ? 's' : '';
    const getYearMonthMoment = yearMonth => (0, _moment.default)(`${yearMonth}-01`);
    const startDateRange = `${getYearMonthMoment(dateRange[0]).format('MMM YYYY')}`;
    const endDateRange = `${getYearMonthMoment(dateRange[1]).format('MMM YYYY')}`;
    const humanDateRange = `${startDateRange} - ${endDateRange}`;
    const siteChipLabel = `${sites.length} site${sitesPlural} — ${humanDateRange}`;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_SiteChip.default, {
      size: "large",
      variant: "default",
      label: siteChipLabel
    });
  },
  documentation: (classes, state) => {
    const {
      value: documentation
    } = state.documentation;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "body2",
      className: classes.summaryText,
      children: `${documentation.charAt(0).toUpperCase()}${documentation.substring(1)}`
    });
  },
  packageType: (classes, state) => {
    const {
      value: packageType
    } = state.packageType;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "body2",
      className: classes.summaryText,
      children: `${packageType.charAt(0).toUpperCase()}${packageType.substring(1)}`
    });
  },
  provisionalData: (classes, state) => {
    const {
      value: provisionalData
    } = state.provisionalData;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "body2",
      className: classes.summaryText,
      children: `${provisionalData.charAt(0).toUpperCase()}${provisionalData.substring(1)}`
    });
  },
  s3Files: (classes, state) => {
    const {
      value: files,
      totalSize
    } = state.s3Files;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "body2",
      className: classes.summaryText,
      children: `${files.length} file${files.length === 1 ? '' : 's'} (${(0, _manifestUtil.formatBytes)(totalSize)} uncompressed)`
    });
  }
};
const downloadStepFormDefaultProps = {
  changeToStep: () => {},
  changeToNextUncompletedStep: () => {},
  renderDownloadButton: () => null
};
const DownloadStepForm = inProps => {
  const props = (0, _defaultProps.resolveProps)(downloadStepFormDefaultProps, inProps);
  const classes = useStyles(_Theme.default);
  const {
    stepKey,
    changeToStep,
    changeToNextUncompletedStep,
    renderDownloadButton
  } = props;
  const [state, dispatch] = _DownloadDataContext.default.useDownloadDataState();
  const {
    release
  } = state;
  const delineateAvaRelease = _ReleaseService.default.determineDelineateAvaRelease(release.value);

  // Effect to keep focus on the file name search field if it was the last filter updated
  (0, _react.useEffect)(() => {
    if (state.s3Files.lastFilterChanged !== 'name') {
      return;
    }
    const mTable = document.querySelector('#s3Files-selection-table-container');
    if (!mTable) {
      return;
    }
    const nameSearch = mTable.querySelector('input[type="search"]');
    if (!nameSearch) {
      return;
    }
    nameSearch.focus();
  });
  const setState = (stateKey, newValue) => dispatch({
    type: 'setValidatableValue',
    key: stateKey,
    value: newValue
  });
  const renderSitesAndDateRangeStep = () => {
    const {
      requiredSteps,
      provisionalData
    } = state;
    const hasProvisionalDataStep = requiredSteps.some(step => step.key === 'provisionalData');
    const excludeProvisionalData = hasProvisionalDataStep && provisionalData.value === 'exclude';
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [!excludeProvisionalData ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_InfoMessageCard.default, {
        title: "Provisional Data",
        messageContent: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "body1",
          children: "Provisional data are currently being excluded from the download package. To make those data available, include those data from within the Provisional Data step."
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_DataProductAvailability.default, {
        "data-selenium": "download-data-dialog.step-form.sites-and-date-range",
        delineateRelease: delineateAvaRelease
      })]
    });
  };
  const renderDocumentationStep = () => {
    const neonFaqLink = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
      target: "_blank",
      href: _RouteService.default.getFaqPath(),
      "data-gtm": "download-data-dialog.neon-faq-link",
      children: "NEON FAQ"
    });
    const knbLink = _ExternalHost.default.renderExternalHostLink('https://eml.ecoinformatics.org', 'KNB', 'KNB', state.productData.productCode);
    const {
      value,
      validValues
    } = state.documentation;
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
      container: true,
      spacing: 2,
      alignItems: "flex-start",
      "data-selenium": "download-data-dialog.step-form.documentation",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12,
        md: 6,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControl.default, {
          component: "fieldset",
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_RadioGroup.default, {
            "aria-label": "Documentation",
            name: "documentation",
            value: value || '',
            onChange: e => {
              setState('documentation', e.target.value);
              changeToNextUncompletedStep();
            },
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControlLabel.default, {
              className: classes.radio,
              value: validValues[0],
              control: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Radio.default, {}),
              label: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                className: classes.radioLabel,
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                  variant: "h6",
                  children: "Include"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                  variant: "body2",
                  children: "Include relevant documents for this Data Product"
                })]
              })
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControlLabel.default, {
              className: classes.radio,
              value: validValues[1],
              control: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Radio.default, {}),
              label: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                className: classes.radioLabel,
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                  variant: "h6",
                  children: "Exclude"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                  variant: "body2",
                  children: "Data only, no relevant documents for this Data Product"
                })]
              })
            })]
          })
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12,
        md: 6,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Card.default, {
          style: {
            marginTop: _Theme.default.spacing(1.5)
          },
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_CardContent.default, {
            className: classes.startFlex,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Info.default, {
              fontSize: "large",
              className: classes.calloutIcon
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
              variant: "body1",
              children: ["EML files for this Data Product are included in all downloads. Learn more about EML files in the ", neonFaqLink, " and at ", knbLink, "."]
            })]
          })
        })
      })]
    });
  };
  const renderProvisionalDataStep = () => {
    const neonDataRevisionReleaseLink = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
      target: "_blank",
      href: _RouteService.default.getDataRevisionsReleasePath(),
      "data-gtm": "download-data-dialog.neon-data-revisions-releases-link",
      children: "NEON Data Revisions and Releases"
    });
    const {
      value,
      validValues
    } = state.provisionalData;
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
      container: true,
      spacing: 2,
      alignItems: "flex-start",
      "data-selenium": "download-data-dialog.step-form.provisional-data",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12,
        md: 6,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControl.default, {
          component: "fieldset",
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_RadioGroup.default, {
            "aria-label": "Provisional Data",
            name: "provisional-data",
            value: value || '',
            onChange: e => {
              setState('provisionalData', e.target.value);
              changeToNextUncompletedStep();
            },
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControlLabel.default, {
              className: classes.radio,
              value: validValues[0],
              control: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Radio.default, {}),
              label: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                className: classes.radioLabel,
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                  variant: "h6",
                  children: "Include"
                }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
                  variant: "body2",
                  children: ["Include provisional data in this download package (", /*#__PURE__*/(0, _jsxRuntime.jsx)("b", {
                    children: "Warning:"
                  }), " subject to change and not reproducible)"]
                })]
              })
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControlLabel.default, {
              className: classes.radio,
              value: validValues[1],
              control: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Radio.default, {}),
              label: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                className: classes.radioLabel,
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                  variant: "h6",
                  children: "Exclude"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                  variant: "body2",
                  children: "Release data only, no provisional data included in this download package"
                })]
              })
            })]
          })
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12,
        md: 6,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Card.default, {
          style: {
            marginTop: _Theme.default.spacing(1.5)
          },
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_CardContent.default, {
            className: classes.startFlex,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Info.default, {
              fontSize: "large",
              className: classes.calloutIcon
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
              variant: "body1",
              children: ["Learn more about data product revisions, releases and provisional data at ", neonDataRevisionReleaseLink, "."]
            })]
          })
        })
      })]
    });
  };
  const renderS3FilesStep = () => {
    const {
      s3FileFetches,
      s3FileFetchProgress,
      requiredSteps,
      provisionalData
    } = state;
    const {
      value: selection,
      validValues,
      valueLookups,
      totalSize,
      estimatedPostSize,
      filters,
      filteredFileCount,
      visibleColumns,
      maxNumFilesSelected
    } = state.s3Files;
    const isLoading = Object.keys(s3FileFetches).some(key => ['awaitingFetchCall', 'fetching'].includes(s3FileFetches[key]));
    const hasProvisionalDataStep = requiredSteps.some(step => step.key === 'provisionalData');
    const excludeProvisionalData = hasProvisionalDataStep && provisionalData.value === 'exclude';
    let appliedValidValues = validValues;
    let areProvDataExcluded = false;
    if (excludeProvisionalData) {
      appliedValidValues = appliedValidValues.filter(value => {
        const includeValue = (0, _typeUtil.isStringNonEmpty)(value.release) && !_ReleaseService.default.isNonRelease(value.release);
        if (!includeValue) {
          areProvDataExcluded = true;
        }
        return includeValue;
      });
    }
    const allowSelectAll = appliedValidValues.length <= maxNumFilesSelected;
    const allowSelectFiltered = filteredFileCount <= maxNumFilesSelected;
    const columns = [{
      title: 'Site',
      field: 'site',
      lookup: valueLookups.site,
      defaultFilter: filters.site || [],
      hidden: !visibleColumns.includes('site'),
      render: row => row.site
    }, {
      title: 'Date',
      field: 'yearMonth',
      lookup: valueLookups.yearMonth,
      defaultFilter: filters.yearMonth || [],
      hidden: !visibleColumns.includes('date'),
      render: row => row.yearMonth
    }, {
      title: 'Visit',
      field: 'visit',
      lookup: valueLookups.visit,
      defaultFilter: filters.visit || [],
      hidden: !visibleColumns.includes('visit'),
      render: row => row.visit
    }, {
      title: 'Name',
      field: 'name',
      defaultFilter: filters.name || '',
      hidden: !visibleColumns.includes('name'),
      render: row => row.name
    }, {
      title: 'Type',
      field: 'type',
      lookup: valueLookups.type,
      defaultFilter: filters.type || [],
      hidden: !visibleColumns.includes('type'),
      render: row => row.type
    }, {
      title: 'Size',
      field: 'size',
      filtering: false,
      removable: false,
      render: row => (0, _manifestUtil.formatBytes)(row.size)
    }];
    const debouncedFilterDispatch = (0, _lodash.debounce)((filter, value) => {
      dispatch({
        type: 'setS3FilesFilterValue',
        filter,
        value
      });
    }, 200);
    const noFiltersApplied = Object.keys(filters).every(col => !filters[col].length);
    /* eslint-disable react/jsx-one-expression-per-line */
    const postSizeError = estimatedPostSize >= _manifestUtil.MAX_POST_BODY_SIZE ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 12,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Card.default, {
        style: {
          marginBottom: _Theme.default.spacing(2),
          backgroundColor: _Theme.COLORS.GOLD[300]
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_CardContent.default, {
          className: classes.startFlex,
          style: {
            justifyContent: 'center'
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Warning.default, {
            fontSize: "large",
            className: classes.calloutIcon,
            style: {
              color: _Theme.COLORS.GOLD[800]
            }
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
            variant: "body1",
            children: ["Too many files requested! Current selection will make an estimated ", /*#__PURE__*/(0, _jsxRuntime.jsx)("b", {
              children: (0, _manifestUtil.formatBytes)(estimatedPostSize)
            }), " request; max size is ", /*#__PURE__*/(0, _jsxRuntime.jsx)("b", {
              children: (0, _manifestUtil.formatBytes)(_manifestUtil.MAX_POST_BODY_SIZE)
            }), ". Please select fewer files in order to proceed."]
          })]
        })
      })
    }) : null;
    /* eslint-disable react/jsx-one-expression-per-line */
    const tooManyFilesWarning = !allowSelectAll && !allowSelectFiltered ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 12,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Card.default, {
        style: {
          marginBottom: _Theme.default.spacing(2),
          backgroundColor: _Theme.COLORS.GOLD[300]
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_CardContent.default, {
          className: classes.startFlex,
          style: {
            justifyContent: 'center'
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Warning.default, {
            fontSize: "large",
            className: classes.calloutIcon,
            style: {
              color: _Theme.COLORS.GOLD[800]
            }
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "body1",
            children: "Too many files available for bulk selection. Please narrow your selection by selecting fewer sites, a more restrictive date range, or a more restrictive set of filters."
          })]
        })
      })
    }) : null;
    const filterButtonLoadingLabel = ` (${isLoading ? '…' : filteredFileCount})`;
    const filterButtonLabel = noFiltersApplied ? '' : filterButtonLoadingLabel;
    const components = {
      Container: _Box.default,
      Toolbar: toolbarProps => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        container: true,
        spacing: 2,
        alignItems: "flex-start",
        style: {
          marginBottom: '24px'
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
          item: true,
          xs: 12,
          md: 6,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            style: {
              marginBottom: _Theme.default.spacing(1)
            },
            children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ToggleButtonGroup.default, {
              size: "small",
              value: visibleColumns,
              onChange: (event, newVisibleColumns) => dispatch({
                type: 'setS3FilesVisibleColumns',
                visibleColumns: newVisibleColumns
              }),
              "aria-label": "show and hide columns",
              "data-selenium": "download-data-dialog.s3-files.show-hide-columns-button-group",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButton.default, {
                value: "label",
                className: classes.showColumnsLabel,
                disabled: true,
                children: "Show Columns:"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButton.default, {
                value: "site",
                children: "Site"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButton.default, {
                value: "visit",
                children: "Visit"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButton.default, {
                value: "date",
                children: "Date"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButton.default, {
                value: "name",
                children: "Name"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButton.default, {
                value: "type",
                children: "Type"
              })]
            })
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            style: {
              marginBottom: _Theme.default.spacing(1)
            },
            children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Button.default, {
              "data-selenium": "download-data-dialog.s3-files.select-all-button",
              size: "small",
              color: "primary",
              variant: "outlined",
              onClick: () => {
                dispatch({
                  type: 'setS3FilesValueSelectAll'
                });
              },
              disabled: isLoading || !appliedValidValues.length || !allowSelectAll,
              style: {
                whiteSpace: 'nowrap'
              },
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_DoneAll.default, {
                fontSize: "small",
                style: {
                  marginRight: _Theme.default.spacing(1)
                }
              }), "Select All (", isLoading ? '…' : appliedValidValues.length, ")"]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Button.default, {
              "data-selenium": "download-data-dialog.s3-files.select-none-button",
              size: "small",
              color: "primary",
              variant: "outlined",
              onClick: () => {
                dispatch({
                  type: 'setS3FilesValueSelectNone'
                });
              },
              disabled: isLoading || !appliedValidValues.length,
              style: {
                marginLeft: _Theme.default.spacing(1),
                whiteSpace: 'nowrap'
              },
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Clear.default, {
                fontSize: "small",
                style: {
                  marginRight: _Theme.default.spacing(1)
                }
              }), "Select None"]
            })]
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Button.default, {
              "data-selenium": "download-data-dialog.s3-files.select-filtered-button",
              size: "small",
              color: "primary",
              variant: "outlined",
              onClick: () => {
                dispatch({
                  type: 'setS3FilesValueSelectFiltered'
                });
              },
              disabled: noFiltersApplied || isLoading || !allowSelectFiltered,
              style: {
                whiteSpace: 'nowrap'
              },
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_FilterList.default, {
                fontSize: "small",
                style: {
                  marginRight: _Theme.default.spacing(1)
                }
              }), "Select Filtered", filterButtonLabel]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Button.default, {
              "data-selenium": "download-data-dialog.s3-files.clear-filters-button",
              size: "small",
              color: "primary",
              variant: "outlined",
              disabled: noFiltersApplied || isLoading,
              onClick: () => {
                dispatch({
                  type: 'clearS3FilesFilterValues'
                });
              },
              style: {
                marginLeft: _Theme.default.spacing(1),
                whiteSpace: 'nowrap'
              },
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_DeleteSweep.default, {
                fontSize: "small",
                style: {
                  marginRight: _Theme.default.spacing(1)
                }
              }), "Clear Filters"]
            })]
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 12,
          md: 6,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_materialTable.MTableToolbar, {
            ...toolbarProps
          })
        }), postSizeError, tooManyFilesWarning, !excludeProvisionalData || !areProvDataExcluded ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          style: {
            marginLeft: '8px',
            marginRight: '8px',
            width: '100%'
          },
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_InfoMessageCard.default, {
            title: "Provisional Data",
            messageContent: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
              variant: "body1",
              children: "Provisional data are currently being excluded from selection. To make those data available for selection, include those data from within the Provisional Data step."
            })
          })
        })]
      }),
      FilterRow: filterRowProps => /*#__PURE__*/(0, _jsxRuntime.jsx)(_materialTable.MTableFilterRow, {
        ...filterRowProps,
        onFilterChanged: (columnId, value) => {
          const {
            onFilterChanged
          } = filterRowProps;
          onFilterChanged(columnId, value);
          const filter = columns[columnId].field;
          const current = filters[filter];
          if (filter === 'name' && value !== current) {
            debouncedFilterDispatch(filter, value);
            return;
          }
          if (current && (value.length !== current.length || value.some(v => !current.includes(v)))) {
            dispatch({
              type: 'setS3FilesFilterValue',
              filter,
              value
            });
          }
        }
      })
    };
    /* eslint-enable react/jsx-one-expression-per-line */
    const localization = {
      pagination: {
        labelRowsSelect: 'files'
      },
      toolbar: {
        nRowsSelected: `{0} file${selection.length === 1 ? '' : 's'} selected (${(0, _manifestUtil.formatBytes)(totalSize)} uncompressed)`
      },
      body: {
        emptyDataSourceMessage: 'No files to display. Select more sites, broaden date range, or broaden search / filters.'
      }
    };
    return appliedValidValues.length || isLoading ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.fileTable,
      id: "s3Files-selection-table-container",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_materialTable.default, {
        icons: _MaterialTableIcons.default,
        components: components,
        columns: columns,
        data: appliedValidValues,
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
          isLoading
        },
        onSelectionChange: (rows, file) => {
          dispatch({
            type: 'setIndividualS3FileSelected',
            url: file.url,
            selected: file.tableData.checked
          });
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.loadingOverlay,
        style: {
          display: isLoading ? 'block' : 'none'
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "h6",
          style: {
            marginBottom: _Theme.default.spacing(4)
          },
          children: `Loading files (${Math.floor(s3FileFetchProgress || 0)}%)...`
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_CircularProgress.default, {
          variant: "determinate",
          value: s3FileFetchProgress
        })]
      })]
    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "subtitle1",
      style: {
        marginTop: _Theme.default.spacing(3)
      },
      children: "Select sites and date range in order to generate a list of files to choose from."
    });
  };
  const renderPackageTypeStep = () => {
    const {
      value,
      validValues
    } = state.packageType;
    let {
      productBasicDescription,
      productExpandedDescription
    } = state.productData;
    if (!productBasicDescription) {
      productBasicDescription = 'Includes the data product, summary statistics, expanded uncertainty, and final quality flag';
    }
    if (!productExpandedDescription) {
      productExpandedDescription = 'Includes the basic package information plus quality metrics for all of the quality assessment and quality control analysis';
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControl.default, {
      "data-selenium": "download-data-dialog.step-form.package-type",
      component: "fieldset",
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_RadioGroup.default, {
        "aria-label": "Package Type",
        name: "package-type",
        value: value || '',
        onChange: e => {
          setState('packageType', e.target.value);
          changeToNextUncompletedStep();
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControlLabel.default, {
          className: classes.radio,
          value: validValues[0],
          control: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Radio.default, {}),
          label: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            className: classes.radioLabel,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
              variant: "h6",
              children: "Basic"
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ComponentErrorBoundary.default
            // eslint-disable-next-line react/no-unstable-nested-components
            , {
              fallbackComponent: () => /*#__PURE__*/(0, _jsxRuntime.jsx)(MarkdownFallbackComponent, {
                content: productBasicDescription
              }),
              onReset: () => {/* noop for boundary reset */},
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactMarkdown.default, {
                remarkPlugins: [_remarkGfm.default],
                className: `${classes.markdownWrapper} MuiTypography-root MuiTypography-body2`,
                children: productBasicDescription
              })
            })]
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControlLabel.default, {
          className: classes.radio,
          value: validValues[1],
          control: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Radio.default, {}),
          label: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            className: classes.radioLabel,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
              variant: "h6",
              children: "Expanded"
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ComponentErrorBoundary.default
            // eslint-disable-next-line react/no-unstable-nested-components
            , {
              fallbackComponent: () => /*#__PURE__*/(0, _jsxRuntime.jsx)(MarkdownFallbackComponent, {
                content: productExpandedDescription
              }),
              onReset: () => {/* noop for boundary reset */},
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactMarkdown.default, {
                remarkPlugins: [_remarkGfm.default],
                className: `${classes.markdownWrapper} MuiTypography-root MuiTypography-body2`,
                children: productExpandedDescription
              })
            })]
          })
        })]
      })
    });
  };
  const renderExternalExclusiveStep = () => {
    const externalHost = _ExternalHost.default.getByProductCode(state.productData.productCode);
    if (!externalHost) {
      return null;
    }
    const hostLink = externalHost.renderLink(state.productData.productCode);
    const availableSiteCodes = (state.productData.siteCodes || []).map(site => site.siteCode);
    const externalHostProduct = _ExternalHost.default.getProductSpecificInfo(state.productData.productCode);
    const allowNoAvailability = (0, _typeUtil.exists)(externalHostProduct) && externalHostProduct.allowNoAvailability === true;
    const noData = !(0, _typeUtil.existsNonEmpty)(availableSiteCodes);
    const noLinks = allowNoAvailability && noData;
    let blurb;
    if (noLinks) {
      blurb = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: ["Data for this product is not currently available for download through the NEON Data Portal. Please use this link to access data for this product for a particular site from ", hostLink, "."]
      });
    } else {
      blurb = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: ["Data for this product is not currently available for download through the NEON Data Portal. Please use the links below to access data for this product for a particular site from the ", hostLink, "."]
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      "data-selenium": `download-data-dialog.step-form.external-links.${externalHost.id.toLowerCase()}`,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_InfoMessageCard.default, {
        title: "External Host",
        messageContent: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "subtitle2",
          children: blurb
        })
      }), noLinks ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_ExternalHostProductSpecificLinks.default, {
        productCode: state.productData.productCode,
        siteCodes: availableSiteCodes
      })]
    });
  };
  const renderPoliciesStep = () => {
    const {
      value: agreed
    } = state.policies;
    const checkbox = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Checkbox.default, {
      color: "primary",
      value: "policies",
      checked: agreed,
      disabled: agreed,
      onChange: () => {
        setState('policies', true);
        changeToNextUncompletedStep();
      }
    });
    /* eslint-disable react/jsx-one-expression-per-line */
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      "data-selenium": "download-data-dialog.step-form.policies",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
        variant: "subtitle1",
        gutterBottom: true,
        children: ["In order to proceed to download NEON data you must agree to the ", dataUsageAndCitationPoliciesLink, "."]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControlLabel.default, {
        control: checkbox,
        className: classes.formControlBold,
        label: "I agree to the NEON Data Usage and Citation Policies."
      })]
    });
    /* eslint-enable react/jsx-one-expression-per-line */
  };
  const renderSummaryStep = () => {
    const stepSummary = /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      "data-selenium": "download-data-dialog.step-form.summary",
      children: [state.requiredSteps.map((step, index) => {
        if (['summary', 'policies'].includes(step.key)) {
          return null;
        }
        const {
          isComplete
        } = state.requiredSteps[index];
        return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: classes.stepSummary,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            role: "button",
            tabIndex: 0,
            className: classes.stepSummaryHeader,
            onClick: () => changeToStep(index),
            onKeyPress: () => changeToStep(index),
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Chip.default, {
              color: isComplete ? 'primary' : 'default',
              label: index + 1,
              className: classes.summaryChip
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
              variant: "h6",
              style: {
                flexGrow: 1
              },
              children: _DownloadDataContext.default.ALL_STEPS[step.key].label
            })]
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            className: classes.stepSummaryContent,
            children: isComplete ? renderStepSummary[step.key](classes, state) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
              variant: "body2",
              className: classes.summaryTextIncomplete,
              children: "Incomplete"
            })
          })]
        }, step.key);
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.stepSummary,
        children: renderDownloadButton()
      }, "download")]
    });
    const downloadAndExploreLink = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
      target: "_blank",
      href: _RouteService.default.getDownloadExplorePath(),
      "data-gtm": "download-data-dialog.download-and-explore-link",
      children: "Download and Explore NEON Data"
    });
    const downloadAndExploreCallout = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Card.default, {
      style: {
        margin: _Theme.default.spacing(0.5, 0, 3, 0)
      },
      "data-selenium": "download-data-dialog.step-form.summary.download-and-explore",
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_CardContent.default, {
        className: classes.startFlex,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Explore.default, {
          fontSize: "large",
          className: classes.calloutIcon
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
          variant: "subtitle2",
          children: ["Tip: Check out our ", downloadAndExploreLink, " tutorial. This tutorial will explain how our neonUtilities package can be used to unzip and join data tables with just a few lines of code."]
        })]
      })
    });
    const fileNamingConventionsLink = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
      target: "_blank",
      href: _RouteService.default.getFileNamingConventionsPath(),
      "data-gtm": "download-data-dialog.file-naming-conventions-link",
      children: "NEON File Naming Conventions"
    });
    const fileNamingCallout = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Card.default, {
      style: {
        margin: _Theme.default.spacing(0.5, 0, 3, 0)
      },
      "data-selenium": "download-data-dialog.step-form.summary.file-naming",
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_CardContent.default, {
        className: classes.startFlex,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Description.default, {
          fontSize: "large",
          className: classes.calloutIcon
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
          variant: "subtitle2",
          children: ["Files in this download will follow ", fileNamingConventionsLink, "."]
        })]
      })
    });
    let citationProductCode = '';
    let citationRelease;
    if ((0, _typeUtil.exists)(state.productData) && (0, _typeUtil.isStringNonEmpty)(state.productData.productCode)) {
      citationProductCode = state.productData.productCode;
    }
    if ((0, _typeUtil.exists)(state.release) && (0, _typeUtil.isStringNonEmpty)(state.release.value)) {
      citationRelease = state.release.value;
    }
    const citationCallout = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Card.default, {
      style: {
        margin: _Theme.default.spacing(0.5, 0, 3, 0)
      },
      "data-selenium": "download-data-dialog.step-form.summary.citation",
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_CardContent.default, {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_DataProductCitation.default, {
          showQuoteIcon: true,
          productCode: citationProductCode,
          release: citationRelease
        })
      })
    });
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
      container: true,
      spacing: 2,
      alignItems: "flex-start",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12,
        md: 6,
        children: stepSummary
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        item: true,
        xs: 12,
        md: 6,
        children: [downloadAndExploreCallout, fileNamingCallout, citationCallout]
      })]
    });
  };
  const renderStepForm = () => {
    switch (stepKey) {
      case 'sitesAndDateRange':
        return renderSitesAndDateRangeStep();
      case 'documentation':
        return renderDocumentationStep();
      case 'provisionalData':
        return renderProvisionalDataStep();
      case 's3Files':
        return renderS3FilesStep();
      case 'packageType':
        return renderPackageTypeStep();
      case 'externalExclusive':
        return renderExternalExclusiveStep();
      case 'policies':
        return renderPoliciesStep();
      case 'summary':
        return renderSummaryStep();
      default:
        return null;
    }
  };
  return renderStepForm();
};
DownloadStepForm.propTypes = {
  stepKey: _propTypes.default.oneOf(Object.keys(_DownloadDataContext.default.ALL_STEPS)).isRequired,
  changeToStep: _propTypes.default.func,
  changeToNextUncompletedStep: _propTypes.default.func,
  renderDownloadButton: _propTypes.default.func
};
var _default = exports.default = DownloadStepForm;