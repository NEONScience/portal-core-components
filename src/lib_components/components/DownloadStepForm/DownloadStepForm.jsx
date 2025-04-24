/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { debounce } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import FileIcon from '@material-ui/icons/Description';
import SelectAllIcon from '@material-ui/icons/DoneAll';
import SelectNoneIcon from '@material-ui/icons/Clear';
import SelectFilteredIcon from '@material-ui/icons/FilterList';
import ClearFiltersIcon from '@material-ui/icons/DeleteSweep';
import WarningIcon from '@material-ui/icons/Warning';
import ExploreIcon from '@material-ui/icons/Explore';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import moment from 'moment';

import MaterialTable, { MTableToolbar, MTableFilterRow } from 'material-table';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import ComponentErrorBoundary from '../Error/ComponentErrorBoundary';
import CustomComponentFallback from '../Error/CustomComponentFallback';
import DataProductCitation from '../Citation/DataProductCitation';
import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';
import DataProductAvailability from '../DataProductAvailability/DataProductAvailability';
import InfoMessageCard from '../Card/InfoMessageCard';
import ExternalHost from '../ExternalHost/ExternalHost';
import ExternalHostProductSpecificLinks from '../ExternalHostProductSpecificLinks/ExternalHostProductSpecificLinks';
import MaterialTableIcons from '../MaterialTableIcons/MaterialTableIcons';
import SiteChip from '../SiteChip/SiteChip';
import Theme, { COLORS } from '../Theme/Theme';

import ReleaseService from '../../service/ReleaseService';
import RouteService from '../../service/RouteService';
import { formatBytes, MAX_POST_BODY_SIZE } from '../../util/manifestUtil';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../util/typeUtil';

const useStyles = makeStyles((theme) => ({
  copyButton: {
    marginLeft: theme.spacing(2),
  },
  fileTable: {
    position: 'relative',
    '& td': {
      whiteSpace: 'nowrap',
    },
    '& label + .MuiInput-formControl': {
      marginTop: '0px',
    },
  },
  formControlBold: {
    '& span': {
      fontWeight: 600,
    },
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
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  calloutIcon: {
    color: theme.palette.grey[300],
    marginRight: theme.spacing(2),
  },
  radio: {
    marginBottom: theme.spacing(1),
  },
  radioLabel: {
    marginTop: theme.spacing(1.5),
  },
  showColumnsLabel: {
    backgroundColor: theme.palette.grey[50],
    '& span': {
      color: '#000',
    },
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  stepSummary: {
    marginBottom: theme.spacing(3),
  },
  stepSummaryHeader: {
    userSelect: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  stepSummaryContent: {
    marginLeft: theme.spacing(4.25),
  },
  summaryChip: {
    cursor: 'pointer',
    marginTop: theme.spacing(0.25),
    marginRight: theme.spacing(1),
    fontSize: '1rem',
    fontWeight: 600,
    height: theme.spacing(3),
    '& span': {
      padding: theme.spacing(0, 1),
    },
  },
  summaryText: {
    fontSize: '1.2rem',
  },
  summaryTextIncomplete: {
    fontSize: '1.2rem',
    fontStyle: 'italic',
    color: theme.palette.error.main,
  },
  markdownWrapper: {
    '& p': {
      margin: 0,
    },
  },
}));

const TextComponent = (props) => {
  const { content } = props;
  return (
    <Typography variant="body2" component="p">
      {content}
    </Typography>
  );
};
TextComponent.propTypes = {
  content: PropTypes.string,
};
TextComponent.defaultProps = {
  content: null,
};

const MarkdownFallbackComponent = (props) => ((
  <CustomComponentFallback
    // eslint-disable-next-line react/no-unstable-nested-components
    FallbackComponent={() => ((<TextComponent {...props} />))}
  />
));

const dataUsageAndCitationPoliciesLink = (
  <Link
    target="_blank"
    href={RouteService.getDataPoliciesPath()}
    data-gtm="download-data-dialog.policies-link"
  >
    Data Usage and Citation Policies
  </Link>
);

const renderStepSummary = {
  sitesAndDateRange: (classes, state) => {
    const { value: sites } = state.sites;
    const { value: dateRange } = state.dateRange;
    const sitesPlural = sites.length > 1 ? 's' : '';
    const getYearMonthMoment = (yearMonth) => moment(`${yearMonth}-01`);
    const startDateRange = `${getYearMonthMoment(dateRange[0]).format('MMM YYYY')}`;
    const endDateRange = `${getYearMonthMoment(dateRange[1]).format('MMM YYYY')}`;
    const humanDateRange = `${startDateRange} - ${endDateRange}`;
    const siteChipLabel = `${sites.length} site${sitesPlural} — ${humanDateRange}`;
    return (
      <SiteChip size="large" variant="default" label={siteChipLabel} />
    );
  },
  documentation: (classes, state) => {
    const { value: documentation } = state.documentation;
    return (
      <Typography variant="body2" className={classes.summaryText}>
        {`${documentation.charAt(0).toUpperCase()}${documentation.substring(1)}`}
      </Typography>
    );
  },
  packageType: (classes, state) => {
    const { value: packageType } = state.packageType;
    return (
      <Typography variant="body2" className={classes.summaryText}>
        {`${packageType.charAt(0).toUpperCase()}${packageType.substring(1)}`}
      </Typography>
    );
  },
  provisionalData: (classes, state) => {
    const { value: provisionalData } = state.provisionalData;
    return (
      <Typography variant="body2" className={classes.summaryText}>
        {`${provisionalData.charAt(0).toUpperCase()}${provisionalData.substring(1)}`}
      </Typography>
    );
  },
  s3Files: (classes, state) => {
    const { value: files, totalSize } = state.s3Files;
    return (
      <Typography variant="body2" className={classes.summaryText}>
        {`${files.length} file${files.length === 1 ? '' : 's'} (${formatBytes(totalSize)} uncompressed)`}
      </Typography>
    );
  },
};

const DownloadStepForm = (props) => {
  const classes = useStyles(Theme);

  const {
    stepKey,
    changeToStep,
    changeToNextUncompletedStep,
    renderDownloadButton,
  } = props;
  const [state, dispatch] = DownloadDataContext.useDownloadDataState();
  const { release } = state;
  const delineateAvaRelease = ReleaseService.determineDelineateAvaRelease(release.value);

  // Effect to keep focus on the file name search field if it was the last filter updated
  useEffect(() => {
    if (state.s3Files.lastFilterChanged !== 'name') { return; }
    const mTable = document.querySelector('#s3Files-selection-table-container');
    if (!mTable) { return; }
    const nameSearch = mTable.querySelector('input[type="search"]');
    if (!nameSearch) { return; }
    nameSearch.focus();
  });

  const setState = (stateKey, newValue) => dispatch({
    type: 'setValidatableValue',
    key: stateKey,
    value: newValue,
  });

  const renderSitesAndDateRangeStep = () => {
    const { requiredSteps, provisionalData } = state;
    const hasProvisionalDataStep = requiredSteps.some((step) => (
      (step.key === 'provisionalData')
    ));
    const excludeProvisionalData = hasProvisionalDataStep && (provisionalData.value === 'exclude');
    return (
      <>
        {!excludeProvisionalData ? null : (
          <InfoMessageCard
            title="Provisional Data"
            messageContent={(
              <Typography variant="body1">
                Provisional data are currently being excluded from the download package.
                To make those data available, include those data from within the
                Provisional Data step.
              </Typography>
            )}
          />
        )}
        <DataProductAvailability
          data-selenium="download-data-dialog.step-form.sites-and-date-range"
          delineateRelease={delineateAvaRelease}
        />
      </>
    );
  };

  const renderDocumentationStep = () => {
    const neonFaqLink = (
      <Link
        target="_blank"
        href={RouteService.getFaqPath()}
        data-gtm="download-data-dialog.neon-faq-link"
      >
        NEON FAQ
      </Link>
    );
    const knbLink = ExternalHost.renderExternalHostLink(
      'https://eml.ecoinformatics.org',
      'KNB',
      'KNB',
      state.productData.productCode,
    );
    const { value, validValues } = state.documentation;
    return (
      <Grid
        container
        spacing={2}
        alignItems="flex-start"
        data-selenium="download-data-dialog.step-form.documentation"
      >
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="Documentation"
              name="documentation"
              value={value || ''}
              onChange={(e) => {
                setState('documentation', e.target.value);
                changeToNextUncompletedStep();
              }}
            >
              <FormControlLabel
                className={classes.radio}
                value={validValues[0]}
                control={<Radio />}
                label={(
                  <div className={classes.radioLabel}>
                    <Typography variant="h6">Include</Typography>
                    <Typography variant="body2">
                      Include relevant documents for this Data Product
                    </Typography>
                  </div>
                )}
              />
              <FormControlLabel
                className={classes.radio}
                value={validValues[1]}
                control={<Radio />}
                label={(
                  <div className={classes.radioLabel}>
                    <Typography variant="h6">Exclude</Typography>
                    <Typography variant="body2">
                      Data only, no relevant documents for this Data Product
                    </Typography>
                  </div>
                )}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ marginTop: Theme.spacing(1.5) }}>
            <CardContent className={classes.startFlex}>
              <InfoIcon fontSize="large" className={classes.calloutIcon} />
              <Typography variant="body1">
                {/* eslint-disable react/jsx-one-expression-per-line */}
                EML files for this Data Product are included in all downloads.
                Learn more about EML files in the {neonFaqLink} and at {knbLink}.
                {/* eslint-enable react/jsx-one-expression-per-line */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderProvisionalDataStep = () => {
    const neonDataRevisionReleaseLink = (
      <Link
        target="_blank"
        href={RouteService.getDataRevisionsReleasePath()}
        data-gtm="download-data-dialog.neon-data-revisions-releases-link"
      >
        NEON Data Revisions and Releases
      </Link>
    );
    const { value, validValues } = state.provisionalData;
    return (
      <Grid
        container
        spacing={2}
        alignItems="flex-start"
        data-selenium="download-data-dialog.step-form.provisional-data"
      >
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="Provisional Data"
              name="provisional-data"
              value={value || ''}
              onChange={(e) => {
                setState('provisionalData', e.target.value);
                changeToNextUncompletedStep();
              }}
            >
              <FormControlLabel
                className={classes.radio}
                value={validValues[0]}
                control={<Radio />}
                label={(
                  <div className={classes.radioLabel}>
                    <Typography variant="h6">Include</Typography>
                    <Typography variant="body2">
                      {/* eslint-disable react/jsx-one-expression-per-line */}
                      Include provisional data in this download package
                      (<b>Warning:</b> subject to change and not reproducible)
                      {/* eslint-enable react/jsx-one-expression-per-line */}
                    </Typography>
                  </div>
                )}
              />
              <FormControlLabel
                className={classes.radio}
                value={validValues[1]}
                control={<Radio />}
                label={(
                  <div className={classes.radioLabel}>
                    <Typography variant="h6">Exclude</Typography>
                    <Typography variant="body2">
                      Release data only, no provisional data included in this download package
                    </Typography>
                  </div>
                )}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ marginTop: Theme.spacing(1.5) }}>
            <CardContent className={classes.startFlex}>
              <InfoIcon fontSize="large" className={classes.calloutIcon} />
              <Typography variant="body1">
                {/* eslint-disable react/jsx-one-expression-per-line */}
                Learn more about data product revisions, releases and provisional data
                at {neonDataRevisionReleaseLink}.
                {/* eslint-enable react/jsx-one-expression-per-line */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderS3FilesStep = () => {
    const {
      s3FileFetches,
      s3FileFetchProgress,
      requiredSteps,
      provisionalData,
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
      maxNumFilesSelected,
    } = state.s3Files;
    const isLoading = Object.keys(s3FileFetches)
      .some((key) => ['awaitingFetchCall', 'fetching'].includes(s3FileFetches[key]));
    const hasProvisionalDataStep = requiredSteps.some((step) => (
      (step.key === 'provisionalData')
    ));
    const excludeProvisionalData = hasProvisionalDataStep && (provisionalData.value === 'exclude');
    let appliedValidValues = validValues;
    let areProvDataExcluded = false;
    if (excludeProvisionalData) {
      appliedValidValues = appliedValidValues.filter((value) => {
        const includeValue = isStringNonEmpty(value.release)
          && !ReleaseService.isNonRelease(value.release);
        if (!includeValue) {
          areProvDataExcluded = true;
        }
        return includeValue;
      });
    }
    const allowSelectAll = (appliedValidValues.length <= maxNumFilesSelected);
    const allowSelectFiltered = (filteredFileCount <= maxNumFilesSelected);
    const columns = [
      {
        title: 'Site',
        field: 'site',
        lookup: valueLookups.site,
        defaultFilter: filters.site || [],
        hidden: !visibleColumns.includes('site'),
        render: (row) => row.site,
      },
      {
        title: 'Date',
        field: 'yearMonth',
        lookup: valueLookups.yearMonth,
        defaultFilter: filters.yearMonth || [],
        hidden: !visibleColumns.includes('date'),
        render: (row) => row.yearMonth,
      },
      {
        title: 'Visit',
        field: 'visit',
        lookup: valueLookups.visit,
        defaultFilter: filters.visit || [],
        hidden: !visibleColumns.includes('visit'),
        render: (row) => row.visit,
      },
      {
        title: 'Name',
        field: 'name',
        defaultFilter: filters.name || '',
        hidden: !visibleColumns.includes('name'),
        render: (row) => row.name,
      },
      {
        title: 'Type',
        field: 'type',
        lookup: valueLookups.type,
        defaultFilter: filters.type || [],
        hidden: !visibleColumns.includes('type'),
        render: (row) => row.type,
      },
      {
        title: 'Size',
        field: 'size',
        filtering: false,
        removable: false,
        render: (row) => formatBytes(row.size),
      },
    ];
    const debouncedFilterDispatch = debounce((filter, value) => {
      dispatch({ type: 'setS3FilesFilterValue', filter, value });
    }, 200);
    const noFiltersApplied = Object.keys(filters).every((col) => !filters[col].length);
    /* eslint-disable react/jsx-one-expression-per-line */
    const postSizeError = (estimatedPostSize >= MAX_POST_BODY_SIZE) ? (
      <Grid item xs={12}>
        <Card style={{ marginBottom: Theme.spacing(2), backgroundColor: COLORS.GOLD[300] }}>
          <CardContent className={classes.startFlex} style={{ justifyContent: 'center' }}>
            <WarningIcon
              fontSize="large"
              className={classes.calloutIcon}
              style={{ color: COLORS.GOLD[800] }}
            />
            <Typography variant="body1">
              Too many files requested! Current selection will make an
              estimated <b>{formatBytes(estimatedPostSize)}</b> request; max
              size is <b>{formatBytes(MAX_POST_BODY_SIZE)}</b>.
              Please select fewer files in order to proceed.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ) : null;
    /* eslint-disable react/jsx-one-expression-per-line */
    const tooManyFilesWarning = (!allowSelectAll && !allowSelectFiltered) ? (
      <Grid item xs={12}>
        <Card style={{ marginBottom: Theme.spacing(2), backgroundColor: COLORS.GOLD[300] }}>
          <CardContent className={classes.startFlex} style={{ justifyContent: 'center' }}>
            <WarningIcon
              fontSize="large"
              className={classes.calloutIcon}
              style={{ color: COLORS.GOLD[800] }}
            />
            <Typography variant="body1">
              Too many files available for bulk selection.
              Please narrow your selection by selecting fewer sites,
              a more restrictive date range, or a more restrictive set of filters.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ) : null;
    const filterButtonLoadingLabel = ` (${isLoading ? '…' : filteredFileCount})`;
    const filterButtonLabel = noFiltersApplied ? '' : filterButtonLoadingLabel;
    const components = {
      Container: Box,
      Toolbar: (toolbarProps) => (
        <Grid container spacing={2} alignItems="flex-start" style={{ marginBottom: '24px' }}>
          <Grid item xs={12} md={6}>
            <div style={{ marginBottom: Theme.spacing(1) }}>
              <ToggleButtonGroup
                size="small"
                value={visibleColumns}
                onChange={(event, newVisibleColumns) => dispatch({
                  type: 'setS3FilesVisibleColumns',
                  visibleColumns: newVisibleColumns,
                })}
                aria-label="show and hide columns"
                data-selenium="download-data-dialog.s3-files.show-hide-columns-button-group"
              >
                <ToggleButton value="label" className={classes.showColumnsLabel} disabled>
                  Show Columns:
                </ToggleButton>
                <ToggleButton value="site">
                  Site
                </ToggleButton>
                <ToggleButton value="visit">
                  Visit
                </ToggleButton>
                <ToggleButton value="date">
                  Date
                </ToggleButton>
                <ToggleButton value="name">
                  Name
                </ToggleButton>
                <ToggleButton value="type">
                  Type
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div style={{ marginBottom: Theme.spacing(1) }}>
              <Button
                data-selenium="download-data-dialog.s3-files.select-all-button"
                size="small"
                color="primary"
                variant="outlined"
                onClick={() => { dispatch({ type: 'setS3FilesValueSelectAll' }); }}
                disabled={isLoading || !appliedValidValues.length || !allowSelectAll}
                style={{ whiteSpace: 'nowrap' }}
              >
                <SelectAllIcon fontSize="small" style={{ marginRight: Theme.spacing(1) }} />
                Select All ({isLoading ? '…' : appliedValidValues.length})
              </Button>
              <Button
                data-selenium="download-data-dialog.s3-files.select-none-button"
                size="small"
                color="primary"
                variant="outlined"
                onClick={() => { dispatch({ type: 'setS3FilesValueSelectNone' }); }}
                disabled={isLoading || !appliedValidValues.length}
                style={{ marginLeft: Theme.spacing(1), whiteSpace: 'nowrap' }}
              >
                <SelectNoneIcon fontSize="small" style={{ marginRight: Theme.spacing(1) }} />
                Select None
              </Button>
            </div>
            <div>
              <Button
                data-selenium="download-data-dialog.s3-files.select-filtered-button"
                size="small"
                color="primary"
                variant="outlined"
                onClick={() => { dispatch({ type: 'setS3FilesValueSelectFiltered' }); }}
                disabled={noFiltersApplied || isLoading || !allowSelectFiltered}
                style={{ whiteSpace: 'nowrap' }}
              >
                <SelectFilteredIcon fontSize="small" style={{ marginRight: Theme.spacing(1) }} />
                Select Filtered{filterButtonLabel}
              </Button>
              <Button
                data-selenium="download-data-dialog.s3-files.clear-filters-button"
                size="small"
                color="primary"
                variant="outlined"
                disabled={noFiltersApplied || isLoading}
                onClick={() => { dispatch({ type: 'clearS3FilesFilterValues' }); }}
                style={{ marginLeft: Theme.spacing(1), whiteSpace: 'nowrap' }}
              >
                <ClearFiltersIcon fontSize="small" style={{ marginRight: Theme.spacing(1) }} />
                Clear Filters
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <MTableToolbar {...toolbarProps} />
          </Grid>
          {postSizeError}
          {tooManyFilesWarning}
          {!excludeProvisionalData || !areProvDataExcluded ? null : (
            <div style={{ marginLeft: '8px', marginRight: '8px', width: '100%' }}>
              <InfoMessageCard
                title="Provisional Data"
                messageContent={(
                  <Typography variant="body1">
                    Provisional data are currently being excluded from selection.
                    To make those data available for selection, include those data from within the
                    Provisional Data step.
                  </Typography>
                )}
              />
            </div>
          )}
        </Grid>
      ),
      FilterRow: (filterRowProps) => (
        <MTableFilterRow
          {...filterRowProps}
          onFilterChanged={(columnId, value) => {
            const { onFilterChanged } = filterRowProps;
            onFilterChanged(columnId, value);
            const filter = columns[columnId].field;
            const current = filters[filter];
            if (filter === 'name' && value !== current) {
              debouncedFilterDispatch(filter, value);
              return;
            }
            if (
              current
              && (value.length !== current.length || value.some((v) => !current.includes(v)))
            ) {
              dispatch({ type: 'setS3FilesFilterValue', filter, value });
            }
          }}
        />
      ),
    };
    /* eslint-enable react/jsx-one-expression-per-line */
    const localization = {
      pagination: {
        labelRowsSelect: 'files',
      },
      toolbar: {
        nRowsSelected: `{0} file${selection.length === 1 ? '' : 's'} selected (${formatBytes(totalSize)} uncompressed)`,
      },
      body: {
        emptyDataSourceMessage: 'No files to display. Select more sites, broaden date range, or broaden search / filters.',
      },
    };
    return (appliedValidValues.length || isLoading) ? (
      <div className={classes.fileTable} id="s3Files-selection-table-container">
        <MaterialTable
          icons={MaterialTableIcons}
          components={components}
          columns={columns}
          data={appliedValidValues}
          localization={localization}
          options={{
            selection: true,
            showSelectAllCheckbox: false,
            padding: 'dense',
            filtering: true,
            columnsButton: false,
            pageSize: 10,
            pageSizeOptions: [5, 10, 50, 100],
            showTitle: false,
            search: false,
            isLoading,
          }}
          onSelectionChange={(rows, file) => {
            dispatch({
              type: 'setIndividualS3FileSelected',
              url: file.url,
              selected: file.tableData.checked,
            });
          }}
        />
        <div className={classes.loadingOverlay} style={{ display: isLoading ? 'block' : 'none' }}>
          <Typography variant="h6" style={{ marginBottom: Theme.spacing(4) }}>
            {`Loading files (${Math.floor(s3FileFetchProgress || 0)}%)...`}
          </Typography>
          <CircularProgress variant="determinate" value={s3FileFetchProgress} />
        </div>
      </div>
    ) : (
      <Typography variant="subtitle1" style={{ marginTop: Theme.spacing(3) }}>
        Select sites and date range in order to generate a list of files to choose from.
      </Typography>
    );
  };

  const renderPackageTypeStep = () => {
    const { value, validValues } = state.packageType;
    let { productBasicDescription, productExpandedDescription } = state.productData;
    if (!productBasicDescription) {
      productBasicDescription = 'Includes the data product, summary statistics, expanded uncertainty, and final quality flag';
    }
    if (!productExpandedDescription) {
      productExpandedDescription = 'Includes the basic package information plus quality metrics for all of the quality assessment and quality control analysis';
    }
    return (
      <FormControl
        data-selenium="download-data-dialog.step-form.package-type"
        component="fieldset"
      >
        <RadioGroup
          aria-label="Package Type"
          name="package-type"
          value={value || ''}
          onChange={(e) => {
            setState('packageType', e.target.value);
            changeToNextUncompletedStep();
          }}
        >
          <FormControlLabel
            className={classes.radio}
            value={validValues[0]}
            control={<Radio />}
            label={(
              <div className={classes.radioLabel}>
                <Typography variant="h6">Basic</Typography>
                <ComponentErrorBoundary
                  // eslint-disable-next-line react/no-unstable-nested-components
                  fallbackComponent={() => ((
                    <MarkdownFallbackComponent content={productBasicDescription} />
                  ))}
                  onReset={() => { /* noop for boundary reset */ }}
                >
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    className={`${classes.markdownWrapper} MuiTypography-root MuiTypography-body2`}
                  >
                    {productBasicDescription}
                  </Markdown>
                </ComponentErrorBoundary>
              </div>
            )}
          />
          <FormControlLabel
            className={classes.radio}
            value={validValues[1]}
            control={<Radio />}
            label={(
              <div className={classes.radioLabel}>
                <Typography variant="h6">Expanded</Typography>
                <ComponentErrorBoundary
                  // eslint-disable-next-line react/no-unstable-nested-components
                  fallbackComponent={() => ((
                    <MarkdownFallbackComponent content={productExpandedDescription} />
                  ))}
                  onReset={() => { /* noop for boundary reset */ }}
                >
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    className={`${classes.markdownWrapper} MuiTypography-root MuiTypography-body2`}
                  >
                    {productExpandedDescription}
                  </Markdown>
                </ComponentErrorBoundary>
              </div>
            )}
          />
        </RadioGroup>
      </FormControl>
    );
  };

  const renderExternalExclusiveStep = () => {
    const externalHost = ExternalHost.getByProductCode(state.productData.productCode);
    if (!externalHost) { return null; }
    const hostLink = externalHost.renderLink(state.productData.productCode);
    const availableSiteCodes = (state.productData.siteCodes || []).map((site) => site.siteCode);
    const externalHostProduct = ExternalHost.getProductSpecificInfo(
      state.productData.productCode,
    );
    const allowNoAvailability = exists(externalHostProduct)
      && (externalHostProduct.allowNoAvailability === true);
    const noData = !existsNonEmpty(availableSiteCodes);
    const noLinks = allowNoAvailability && noData;
    let blurb;
    if (noLinks) {
      blurb = (
        <>
          {/* eslint-disable react/jsx-one-expression-per-line */}
          Data for this product is not currently available for download through
          the NEON Data Portal. Please use this link to access data for
          this product for a particular site from {hostLink}.
          {/* eslint-enable react/jsx-one-expression-per-line */}
        </>
      );
    } else {
      blurb = (
        <>
          {/* eslint-disable react/jsx-one-expression-per-line */}
          Data for this product is not currently available for download through
          the NEON Data Portal. Please use the links below to access data for
          this product for a particular site from the {hostLink}.
          {/* eslint-enable react/jsx-one-expression-per-line */}
        </>
      );
    }
    return (
      <div data-selenium={`download-data-dialog.step-form.external-links.${externalHost.id.toLowerCase()}`}>
        <InfoMessageCard
          title="External Host"
          messageContent={(
            <Typography variant="subtitle2">
              {blurb}
            </Typography>
          )}
        />
        {noLinks ? null : (
          <ExternalHostProductSpecificLinks
            productCode={state.productData.productCode}
            siteCodes={availableSiteCodes}
          />
        )}
      </div>
    );
  };

  const renderPoliciesStep = () => {
    const { value: agreed } = state.policies;
    const checkbox = (
      <Checkbox
        color="primary"
        value="policies"
        checked={agreed}
        disabled={agreed}
        onChange={() => {
          setState('policies', true);
          changeToNextUncompletedStep();
        }}
      />
    );
    /* eslint-disable react/jsx-one-expression-per-line */
    return (
      <div data-selenium="download-data-dialog.step-form.policies">
        <Typography variant="subtitle1" gutterBottom>
          In order to proceed to download NEON data you must agree to
          the {dataUsageAndCitationPoliciesLink}.
        </Typography>
        <FormControlLabel
          control={checkbox}
          className={classes.formControlBold}
          label="I agree to the NEON Data Usage and Citation Policies."
        />
      </div>
    );
    /* eslint-enable react/jsx-one-expression-per-line */
  };

  const renderSummaryStep = () => {
    const stepSummary = (
      <div data-selenium="download-data-dialog.step-form.summary">
        {state.requiredSteps.map((step, index) => {
          if (['summary', 'policies'].includes(step.key)) { return null; }
          const { isComplete } = state.requiredSteps[index];
          return (
            <div key={step.key} className={classes.stepSummary}>
              <div
                role="button"
                tabIndex={0}
                className={classes.stepSummaryHeader}
                onClick={() => changeToStep(index)}
                onKeyPress={() => changeToStep(index)}
              >
                <Chip
                  color={isComplete ? 'primary' : 'default'}
                  label={index + 1}
                  className={classes.summaryChip}
                />
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                  {DownloadDataContext.ALL_STEPS[step.key].label}
                </Typography>
              </div>
              <div className={classes.stepSummaryContent}>
                {isComplete ? renderStepSummary[step.key](classes, state) : (
                  <Typography variant="body2" className={classes.summaryTextIncomplete}>
                    Incomplete
                  </Typography>
                )}
              </div>
            </div>
          );
        })}
        <div key="download" className={classes.stepSummary}>
          {renderDownloadButton()}
        </div>
      </div>
    );
    const downloadAndExploreLink = (
      <Link
        target="_blank"
        href={RouteService.getDownloadExplorePath()}
        data-gtm="download-data-dialog.download-and-explore-link"
      >
        Download and Explore NEON Data
      </Link>
    );
    const downloadAndExploreCallout = (
      <Card
        style={{ margin: Theme.spacing(0.5, 0, 3, 0) }}
        data-selenium="download-data-dialog.step-form.summary.download-and-explore"
      >
        <CardContent className={classes.startFlex}>
          <ExploreIcon fontSize="large" className={classes.calloutIcon} />
          {/* eslint-disable react/jsx-one-expression-per-line */}
          <Typography variant="subtitle2">
            Tip: Check out our {downloadAndExploreLink} tutorial.
            This tutorial will explain how our neonUtilities package can
            be used to unzip and join data tables with just a few lines of code.
          </Typography>
          {/* eslint-enable react/jsx-one-expression-per-line */}
        </CardContent>
      </Card>
    );
    const fileNamingConventionsLink = (
      <Link
        target="_blank"
        href={RouteService.getFileNamingConventionsPath()}
        data-gtm="download-data-dialog.file-naming-conventions-link"
      >
        NEON File Naming Conventions
      </Link>
    );
    const fileNamingCallout = (
      <Card
        style={{ margin: Theme.spacing(0.5, 0, 3, 0) }}
        data-selenium="download-data-dialog.step-form.summary.file-naming"
      >
        <CardContent className={classes.startFlex}>
          <FileIcon fontSize="large" className={classes.calloutIcon} />
          {/* eslint-disable react/jsx-one-expression-per-line */}
          <Typography variant="subtitle2">
            Files in this download will follow {fileNamingConventionsLink}.
          </Typography>
          {/* eslint-enable react/jsx-one-expression-per-line */}
        </CardContent>
      </Card>
    );
    let citationProductCode = '';
    let citationRelease;
    if (exists(state.productData) && isStringNonEmpty(state.productData.productCode)) {
      citationProductCode = state.productData.productCode;
    }
    if (exists(state.release) && isStringNonEmpty(state.release.value)) {
      citationRelease = state.release.value;
    }
    const citationCallout = (
      <Card
        style={{ margin: Theme.spacing(0.5, 0, 3, 0) }}
        data-selenium="download-data-dialog.step-form.summary.citation"
      >
        <CardContent>
          <DataProductCitation
            showQuoteIcon
            productCode={citationProductCode}
            release={citationRelease}
          />
        </CardContent>
      </Card>
    );
    return (
      <Grid
        container
        spacing={2}
        alignItems="flex-start"
      >
        <Grid item xs={12} md={6}>
          {stepSummary}
        </Grid>
        <Grid item xs={12} md={6}>
          {downloadAndExploreCallout}
          {fileNamingCallout}
          {citationCallout}
        </Grid>
      </Grid>
    );
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
  stepKey: PropTypes.oneOf(Object.keys(DownloadDataContext.ALL_STEPS)).isRequired,
  changeToStep: PropTypes.func,
  changeToNextUncompletedStep: PropTypes.func,
  renderDownloadButton: PropTypes.func,
};

DownloadStepForm.defaultProps = {
  changeToStep: () => {},
  changeToNextUncompletedStep: () => {},
  renderDownloadButton: () => null,
};

export default DownloadStepForm;
