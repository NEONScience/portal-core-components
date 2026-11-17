import React, { useEffect, useMemo, useState } from 'react';

import { forkJoin, map, Observable } from 'rxjs';
import { type AjaxResponse } from 'rxjs/ajax';

import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import DataProductAvailability from '@/components/DataProductAvailability/DataProductAvailability';
import {
  AVAILABILITY_COLOR_SCHEMES,
  AVAILABILITY_COLOR_SCHEME_LABELS,
  DEFAULT_AVAILABILITY_COLOR_SCHEME,
} from '@/components/DataProductAvailability/AvailabilityUtils';
import {
  AVAILABILITY_INHERITANCE_MODES,
  AvailabilityInheritanceMode,
  DEFAULT_AVAILABILITY_INHERITANCE_MODE,
} from '@/components/DataProductAvailability/EnhancedAvailabilityInheritance';
import {
  AVAILABILITY_DATA_LEVELS,
  AvailabilityDataLevel,
  detectAvailabilityDataLevel,
} from '@/components/DataProductAvailability/EnhancedAvailabilitySchema';
import { DEFAULT_FETCH_DATA_LEVEL } from '@/components/DataProductAvailability/EnhancedAvailabilitySource';
import NeonApi from '@/components/NeonApi/NeonApi';
import NeonEnvironment from '@/components/NeonEnvironment/NeonEnvironment';
import NeonGraphQL from '@/components/NeonGraphQL/NeonGraphQL';
import ReleaseFilter from '@/components/ReleaseFilter/ReleaseFilter';
import { makeStyles } from '@/components/Theme/makeStyles';
import { NeonTheme } from '@/components/Theme/types';
import { Nullable, UnknownRecord } from '@/types/core';

import DocBlock from '../../../../components/DocBlock';
import CodeBlock from '../../../../components/CodeBlock';
import ExampleBlock from '../../../../components/ExampleBlock';

import ENHANCED_AVAILABILITY_PRODUCTS from '../../../../sampleData/DataProductAvailability/enhanced-availability-products';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  demoOptions: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: theme.spacing(2, 3),
    marginBottom: theme.spacing(3),
  },
  fetchSelections: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: theme.spacing(2, 3),
    flex: '1 1 100%',
  },
  fetchSelection: {
    flex: '1 1 320px',
    minWidth: 0,
  },
  demoProps: {
    margin: theme.spacing(0, 0, 3, 0),
    padding: theme.spacing(1.5, 2),
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    fontFamily: 'monospace',
    fontSize: '0.8125rem',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
}));

const ENHANCED_PRODUCT_CODES = Object.keys(ENHANCED_AVAILABILITY_PRODUCTS);
const ROW_LABEL_WIDTHS = [60, 100, 140, 180];
type RowLabelWidthOption = 'fit' | number;

// <tt> is not a JSX intrinsic element in TypeScript, but DocBlock styles inline code with it
const Tt = ({ children }: { children: React.ReactNode }) => React.createElement('tt', null, children);

interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ExclusiveToggleProps<T extends string> {
  value: T;
  options: ToggleOption<T>[];
  onChange: (value: T) => void;
  labelId: string;
  size: 'small' | 'medium' | 'large';
}

const ExclusiveToggle = <T extends string>(props: ExclusiveToggleProps<T>) => {
  const {
    value,
    options,
    onChange,
    labelId,
    size,
  } = props;
  return (
    <ToggleButtonGroup
      exclusive
      color="primary"
      size={size}
      value={value}
      aria-labelledby={labelId}
      onChange={(event: React.MouseEvent<HTMLElement>, newValue: Nullable<T>) => {
        // Clicking the selected button would otherwise leave nothing selected
        if (newValue) { onChange(newValue); }
      }}
    >
      {options.map((option: ToggleOption<T>) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

const COLOR_SCHEME_OPTIONS: ToggleOption<string>[] = Object.values(AVAILABILITY_COLOR_SCHEMES)
  .map((value: string) => ({ value, label: AVAILABILITY_COLOR_SCHEME_LABELS[value] }));

interface ColorSchemeToggleProps {
  colorScheme: string;
  onChange: (colorScheme: string) => void;
  labelId: string;
  size: 'small' | 'medium' | 'large';
}

const ColorSchemeToggle = (props: ColorSchemeToggleProps) => {
  const {
    colorScheme,
    onChange,
    labelId,
    size,
  } = props;
  return (
    <ExclusiveToggle
      value={colorScheme}
      options={COLOR_SCHEME_OPTIONS}
      onChange={onChange}
      labelId={labelId}
      size={size}
    />
  );
};

/**
   Enhanced availability demo: sample data passed in directly, or availability fetched for a
   product and release from the data availability API endpoint
*/
enum DemoSource {
  SAMPLE = 'SAMPLE',
  FETCH = 'FETCH',
}
const DEMO_SOURCE_OPTIONS: ToggleOption<DemoSource>[] = [
  { value: DemoSource.SAMPLE, label: 'Sample Data' },
  { value: DemoSource.FETCH, label: 'Fetch From API' },
];

const AUTO_DETECT = 'AUTO';
type SampleDataLevelOption = AvailabilityDataLevel | typeof AUTO_DETECT;
const DATA_LEVEL_OPTIONS: ToggleOption<AvailabilityDataLevel>[] = AVAILABILITY_DATA_LEVELS
  .map((dataLevel: AvailabilityDataLevel) => ({ value: dataLevel, label: dataLevel }));
const SAMPLE_DATA_LEVEL_OPTIONS: ToggleOption<SampleDataLevelOption>[] = [
  { value: AUTO_DETECT, label: 'Auto-detect' },
  ...DATA_LEVEL_OPTIONS,
];

const INHERITANCE_MODE_LABELS: Record<AvailabilityInheritanceMode, string> = {
  [AvailabilityInheritanceMode.TECHNICAL_AVAILABILITY]: 'Technical Availability',
  [AvailabilityInheritanceMode.CATEGORICAL_STATUS]: 'Categorical Status',
  [AvailabilityInheritanceMode.NONE]: 'None',
};
const INHERITANCE_MODE_OPTIONS: ToggleOption<AvailabilityInheritanceMode>[] = (
  AVAILABILITY_INHERITANCE_MODES.map((inheritanceMode: AvailabilityInheritanceMode) => ({
    value: inheritanceMode,
    label: INHERITANCE_MODE_LABELS[inheritanceMode],
  }))
);

const DEFAULT_DEMO_PRODUCT_CODE = 'DP1.10033.001';

interface SampleFile {
  default: { data: unknown };
}
type SampleLoader = () => Promise<SampleFile>;

// The generated per-product loaders import large JSON files so are not typed from their contents
const PRODUCT_SAMPLE_LOADERS = ENHANCED_AVAILABILITY_PRODUCTS as unknown as Record<
  string,
  SampleLoader
>;

interface SampleDataSource {
  label: string;
  load: SampleLoader;
}
const SAMPLE_DATA_SOURCES: Record<string, SampleDataSource> = {
  'site-month': {
    label: 'enhanced-availability-site-month.json',
    load: () => import('../../../../sampleData/DataProductAvailability/enhanced-availability-site-month.json'),
  },
  components: {
    label: 'enhanced-availability-components.json',
    load: () => import('../../../../sampleData/DataProductAvailability/enhanced-availability-components.json'),
  },
  ...Object.fromEntries(ENHANCED_PRODUCT_CODES.map((productCode: string) => [
    productCode,
    {
      label: `${productCode} (converted from legacy table availability)`,
      load: PRODUCT_SAMPLE_LOADERS[productCode],
    },
  ])),
};
const SAMPLE_DATA_SOURCE_KEYS = Object.keys(SAMPLE_DATA_SOURCES);

interface LoadedSample {
  key: string;
  data: unknown;
}

interface DemoProduct {
  productCode: string;
  productName: string;
}

interface DemoSelectOptions {
  products: DemoProduct[];
  releases: UnknownRecord[];
}

interface DemoSelectOptionsState {
  options: Nullable<DemoSelectOptions>;
  error: Nullable<string>;
}

/**
   Fetch the data products and releases to select from, in the same way as the time series and
   wind rose viewer examples
*/
const fetchDemoSelectOptions = (): Observable<DemoSelectOptions> => forkJoin([
  NeonGraphQL.getAllDataProducts(null) as Observable<AjaxResponse<any>>,
  NeonApi.getReleasesObservable() as Observable<any>,
]).pipe(
  map(([productsResponse, releasesResponse]: [AjaxResponse<any>, any]): DemoSelectOptions => {
    const products = productsResponse?.response?.data?.products;
    const releases = releasesResponse?.data;
    if (!Array.isArray(products) || !products.length) {
      throw new Error('No data products found');
    }
    if (!Array.isArray(releases)) {
      throw new Error('No releases found');
    }
    return {
      products: products
        .map(({ productCode, productName }: DemoProduct) => ({ productCode, productName }))
        .sort((a: DemoProduct, b: DemoProduct) => a.productCode.localeCompare(b.productCode)),
      releases,
    };
  }),
);

/**
   Get the data products and releases to select from, fetched once enabled
*/
const useDemoSelectOptions = (isEnabled: boolean): DemoSelectOptionsState => {
  const [state, setState] = useState<DemoSelectOptionsState>({ options: null, error: null });
  const isLoaded = !!state.options;
  useEffect(() => {
    if (!isEnabled || isLoaded) { return undefined; }
    const subscription = fetchDemoSelectOptions().subscribe({
      next: (options: DemoSelectOptions) => { setState({ options, error: null }); },
      error: (error: unknown) => {
        setState({ options: null, error: (error as Nullable<Error>)?.message || 'Unknown error' });
      },
    });
    return () => { subscription.unsubscribe(); };
  }, [isEnabled, isLoaded]);
  return state;
};

interface EnhancedAvailabilityProps {
  colorScheme: string;
  onColorSchemeChange: (colorScheme: string) => void;
}

const EnhancedAvailability = (props: EnhancedAvailabilityProps) => {
  const { colorScheme, onColorSchemeChange } = props;
  const { classes } = useStyles();
  const theme = useTheme();
  const [source, setSource] = useState<DemoSource>(DemoSource.FETCH);
  const [rowLabelWidth, setRowLabelWidth] = useState<RowLabelWidthOption>('fit');
  const [sampleKey, setSampleKey] = useState<string>(SAMPLE_DATA_SOURCE_KEYS[0]);
  const [loadedSample, setLoadedSample] = useState<Nullable<LoadedSample>>(null);
  const [sampleDataLevel, setSampleDataLevel] = useState<SampleDataLevelOption>(AUTO_DETECT);
  const [fetchDataLevel, setFetchDataLevel] = useState<AvailabilityDataLevel>(
    DEFAULT_FETCH_DATA_LEVEL,
  );
  const [inheritanceMode, setInheritanceMode] = useState<AvailabilityInheritanceMode>(
    DEFAULT_AVAILABILITY_INHERITANCE_MODE,
  );
  const [productCode, setProductCode] = useState<string>(DEFAULT_DEMO_PRODUCT_CODE);
  // Null fetches availability across releases, the "Latest and Provisional" release option
  const [release, setRelease] = useState<Nullable<string>>(null);

  const isSampleSource = source === DemoSource.SAMPLE;
  const { options: selectOptions, error: selectOptionsError } = useDemoSelectOptions(
    !isSampleSource,
  );
  useEffect(() => {
    if (!isSampleSource) { return undefined; }
    let isCurrent = true;
    SAMPLE_DATA_SOURCES[sampleKey].load().then(({ default: sample }: SampleFile) => {
      if (isCurrent) { setLoadedSample({ key: sampleKey, data: sample.data }); }
    });
    return () => { isCurrent = false; };
  }, [isSampleSource, sampleKey]);
  const detectedDataLevel = useMemo(() => (
    loadedSample ? detectAvailabilityDataLevel(loadedSample.data) : null
  ), [loadedSample]);

  // The previous sample stays rendered while the newly selected one loads
  const isSampleLoading = isSampleSource && (loadedSample?.key !== sampleKey);
  const appliedSampleDataLevel = (sampleDataLevel === AUTO_DETECT) ? null : sampleDataLevel;
  const appliedRowLabelWidth = (rowLabelWidth === 'fit') ? null : rowLabelWidth;
  // Fall back to the first product when the selected product is not available to select
  const products = selectOptions?.products || [];
  const appliedProductCode = (products.length
    && !products.some((product: DemoProduct) => product.productCode === productCode))
    ? products[0].productCode
    : productCode;

  const renderFetchOptions = () => {
    if (selectOptionsError) {
      return (
        <Typography color="error" style={{ flex: '1 1 100%' }}>
          {`Unable to load data products and releases to select from: ${selectOptionsError}`}
        </Typography>
      );
    }
    if (!selectOptions) {
      return (
        <div className={classes.fetchSelections} role="status" aria-label="Loading data products and releases">
          <Skeleton variant="rectangular" height={88} className={classes.fetchSelection} />
          <Skeleton variant="rectangular" height={88} className={classes.fetchSelection} />
        </div>
      );
    }
    return (
      <div className={classes.fetchSelections}>
        <div className={classes.fetchSelection}>
          <Typography variant="h6" id="enhanced-availability-product-select-label" gutterBottom>
            Select Data Product
          </Typography>
          <Select
            id="enhanced-availability-product-select"
            aria-labelledby="enhanced-availability-product-select-label"
            variant="outlined"
            value={appliedProductCode}
            onChange={(event: SelectChangeEvent<string>) => { setProductCode(event.target.value); }}
            style={{ width: '100%' }}
          >
            {products.map((product: DemoProduct) => (
              <MenuItem key={product.productCode} value={product.productCode}>
                {`${product.productCode} - ${product.productName}`}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={classes.fetchSelection}>
          <ReleaseFilter
            showGenerationDate
            showProductCount
            releases={selectOptions.releases}
            selected={release}
            onChange={(newRelease: Nullable<string>) => { setRelease(newRelease); }}
          />
        </div>
      </div>
    );
  };

  const renderSourceOptions = () => {
    if (isSampleSource) {
      let detectedText = 'Detecting data level...';
      if (!isSampleLoading) {
        detectedText = detectedDataLevel
          ? `Detected data level: ${detectedDataLevel}`
          : 'Not valid availability data for any data level';
      }
      return (
        <div style={{ flex: '1 1 100%' }}>
          <Typography variant="h6" id="enhanced-availability-sample-select-label" gutterBottom>
            Sample Data
          </Typography>
          <Select
            id="enhanced-availability-sample-select"
            aria-labelledby="enhanced-availability-sample-select-label"
            variant="outlined"
            value={sampleKey}
            onChange={(event: SelectChangeEvent<string>) => { setSampleKey(event.target.value); }}
            style={{ width: '100%' }}
          >
            {SAMPLE_DATA_SOURCE_KEYS.map((key: string) => (
              <MenuItem key={key} value={key}>
                {SAMPLE_DATA_SOURCES[key].label}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="body2" style={{ marginTop: theme.spacing(1) }}>
            {detectedText}
          </Typography>
        </div>
      );
    }
    return renderFetchOptions();
  };

  const renderDemoProps = () => {
    const inheritanceModeProp = ` inheritanceMode="${inheritanceMode}"`;
    if (isSampleSource) {
      const dataLevelProp = appliedSampleDataLevel ? ` dataLevel="${appliedSampleDataLevel}"` : '';
      return `<DataProductAvailability enhancedAvailability={sample.data}${dataLevelProp}`
        + `${inheritanceModeProp} />`;
    }
    const releaseProp = release ? ` release="${release}"` : '';
    const releasePath = release ? `/${release}` : '';
    const requestUrl = `${NeonEnvironment.getFullApiPath('dataAvailability')}/products/`
      + `${appliedProductCode}${releasePath}?dataLevel=${fetchDataLevel}`;
    return `<DataProductAvailability productCode="${appliedProductCode}"${releaseProp} `
      + `dataLevel="${fetchDataLevel}"${inheritanceModeProp} />\n\nGET ${requestUrl}`;
  };

  const renderChart = () => {
    if (!isSampleSource) {
      return (
        <DataProductAvailability
          key={DemoSource.FETCH}
          productCode={appliedProductCode}
          release={release}
          dataLevel={fetchDataLevel}
          inheritanceMode={inheritanceMode}
          rowLabelWidth={appliedRowLabelWidth}
          colorScheme={colorScheme}
        />
      );
    }
    if (!loadedSample) { return null; }
    return (
      <DataProductAvailability
        key={DemoSource.SAMPLE}
        enhancedAvailability={loadedSample.data}
        dataLevel={appliedSampleDataLevel}
        inheritanceMode={inheritanceMode}
        rowLabelWidth={appliedRowLabelWidth}
        colorScheme={colorScheme}
      />
    );
  };

  return (
    <Paper style={{ width: '100%', padding: theme.spacing(3) }}>
      <div className={classes.demoOptions}>
        <div>
          <Typography variant="h6" id="enhanced-availability-source-label" gutterBottom>
            Availability Source
          </Typography>
          <ExclusiveToggle
            value={source}
            options={DEMO_SOURCE_OPTIONS}
            onChange={setSource}
            labelId="enhanced-availability-source-label"
            size="medium"
          />
        </div>
        <div>
          <Typography variant="h6" id="enhanced-availability-data-level-label" gutterBottom>
            Data Level
          </Typography>
          {isSampleSource ? (
            <ExclusiveToggle
              value={sampleDataLevel}
              options={SAMPLE_DATA_LEVEL_OPTIONS}
              onChange={setSampleDataLevel}
              labelId="enhanced-availability-data-level-label"
              size="medium"
            />
          ) : (
            <ExclusiveToggle
              value={fetchDataLevel}
              options={DATA_LEVEL_OPTIONS}
              onChange={setFetchDataLevel}
              labelId="enhanced-availability-data-level-label"
              size="medium"
            />
          )}
        </div>
        <div>
          <Typography variant="h6" id="enhanced-availability-inheritance-mode-label" gutterBottom>
            Inheritance Mode
          </Typography>
          <ExclusiveToggle
            value={inheritanceMode}
            options={INHERITANCE_MODE_OPTIONS}
            onChange={setInheritanceMode}
            labelId="enhanced-availability-inheritance-mode-label"
            size="medium"
          />
        </div>
        {renderSourceOptions()}
        <div style={{ flex: '0 1 200px' }}>
          <Typography variant="h6" id="enhanced-availability-label-width-select-label" gutterBottom>
            Row Label Width
          </Typography>
          <Select
            id="enhanced-availability-label-width-select"
            aria-labelledby="enhanced-availability-label-width-select-label"
            variant="outlined"
            value={rowLabelWidth}
            onChange={(event: SelectChangeEvent<RowLabelWidthOption>) => {
              const { value } = event.target;
              setRowLabelWidth(value === 'fit' ? 'fit' : Number(value));
            }}
            style={{ width: '100%' }}
          >
            <MenuItem value="fit">Fit labels</MenuItem>
            {ROW_LABEL_WIDTHS.map((width: number) => (
              <MenuItem key={width} value={width}>
                {`${width}px`}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div style={{ flex: '0 1 auto' }}>
          <Typography variant="h6" id="enhanced-availability-color-scheme-label" gutterBottom>
            Color Scheme
          </Typography>
          <ColorSchemeToggle
            colorScheme={colorScheme}
            onChange={onColorSchemeChange}
            labelId="enhanced-availability-color-scheme-label"
            size="medium"
          />
        </div>
      </div>
      <div className={classes.demoProps}>{renderDemoProps()}</div>
      {isSampleLoading ? <LinearProgress style={{ marginBottom: '32px' }} /> : null}
      {renderChart()}
    </Paper>
  );
};

export default function StyleGuide() {
  const [colorScheme, setColorScheme] = useState<string>(DEFAULT_AVAILABILITY_COLOR_SCHEME);

  return (
    <>

      <Typography variant="h6" component="h4" gutterBottom>
        Enhanced Data Product Availability Chart
      </Typography>

      <DocBlock>
        An experimental mode exists to show enhanced availability with a more nuanced and complete
        set of statuses for a given site/month. It allows for arbitrary rollups by state, domain,
        and site and, when the data includes component detail, breaks out product packages and
        tables.
      </DocBlock>
      <DocBlock>
        Enhanced mode is invoked in one of two ways:
        <ul>
          <li>
            <Tt>enhancedAvailability</Tt>: availability passed in directly, the <Tt>data</Tt> object
            of a data availability API response.
          </li>
          <li>
            <Tt>productCode</Tt>: availability is fetched for the product from the data
            availability API endpoint, scoped to the optional <Tt>release</Tt>. Availability is
            fetched again whenever <Tt>productCode</Tt>, <Tt>release</Tt>,
            or <Tt>dataLevel</Tt> change. Provided <Tt>enhancedAvailability</Tt> takes precedence
            over fetching.
          </li>
        </ul>
        Each site lists its months by release, and each month reports whether data are available
        along with a status for months where they are not. Availability in
        the <Tt>PROVISIONAL</Tt> release is shown as provisional, and availability in both a
        release and <Tt>PROVISIONAL</Tt> for the same month is shown as mixed.
      </DocBlock>
      <DocBlock>
        Months may also include <Tt>packages</Tt> of table <Tt>components</Tt>, each with its own
        status. When present, the <b>packages</b> and <b>tables</b> view options are available,
        with rows for the packages and tables each site reports, so a site (and its state and
        domain) only appears alongside the packages and tables it reports. Every package and table
        a site reports has a row, even when it has no statuses, so a table without any statuses
        shows as not available. A site-month shows the status of each table it lists, and tables
        it does not list show no status for that month. What tables inherit from their site-month
        depends on the inheritance mode, see below. Availability in any release takes precedence
        over statuses reported for the same month in other releases. Site rows (states, domains,
        and sites views) show the status of the site-month, or the statuses of its tables when it
        has no status of its own.
      </DocBlock>
      <DocBlock>
        The availability of a site-month is technical availability, which the data availability
        API determines separately from the categorical statuses (Expected, Partial, etc.) of
        site-months and the packages and tables they list. The <Tt>inheritanceMode</Tt> prop sets
        what packages and tables inherit from their site-month, one of the inheritance modes
        listed in <Tt>AvailabilityInheritanceMode</Tt> exported
        from <Tt>EnhancedAvailabilityInheritance</Tt>:
        <ul>
          <li>
            <Tt>TECHNICAL_AVAILABILITY</Tt> (default): an available site-month shows its
            availability for all packages and tables the site reports, overriding any status of a
            package or table. Packages and tables also inherit categorical statuses as
            with <Tt>CATEGORICAL_STATUS</Tt>.
          </li>
          <li>
            <Tt>CATEGORICAL_STATUS</Tt>: technical availability is not inherited. A table the
            site-month lists without a status of its own (null or empty) shows the status of the
            site-month.
          </li>
          <li>
            <Tt>NONE</Tt>: nothing is inherited, so packages and tables only show their own
            statuses.
          </li>
        </ul>
        Site rows (states, domains, and sites views) are the same in every inheritance mode, so the
        inheritance mode only changes views that include packages or tables.
        The <b>Inheritance Mode</b> toggle in the example below switches between them.
      </DocBlock>
      <DocBlock>
        Availability is reported at one of two data levels, listed
        in <Tt>AvailabilityDataLevel</Tt> exported from <Tt>EnhancedAvailabilitySchema</Tt>:
        <ul>
          <li>
            <Tt>MONTHLY</Tt>: each site-month reports its availability and status.
          </li>
          <li>
            <Tt>COMPONENT</Tt>: site-months may also report the status of
            each <Tt>packages</Tt> table component.
          </li>
        </ul>
        Both data levels share the same schema, validated with zod. The data level of
        provided <Tt>enhancedAvailability</Tt> is detected from the schema it validates against,
        where availability without any package components is detected as <Tt>MONTHLY</Tt>. Set
        the <Tt>dataLevel</Tt> prop to require provided availability to agree with a data level:
        availability with package components does not agree with <Tt>MONTHLY</Tt>. Fetched
        availability is requested at the <Tt>dataLevel</Tt> (<Tt>MONTHLY</Tt> by default) and
        validated against it. Availability that is not valid or does not agree with
        the <Tt>dataLevel</Tt> shows an error in place of the chart.
      </DocBlock>
      <DocBlock>
        Availability is fetched from
        the <Tt>/api/v0/data-availability/products/{'{productCode}'}</Tt> endpoint, or
        the <Tt>/api/v0/data-availability/products/{'{productCode}'}/{'{releaseTag}'}</Tt> endpoint
        with a <Tt>release</Tt>. Requests include the <Tt>dataLevel</Tt> query parameter.
      </DocBlock>
      <DocBlock>
        Valid statuses: <Tt>Expected</Tt>, <Tt>Potential</Tt>, <Tt>Not Planned</Tt>,
        <Tt>Not Collected</Tt>, <Tt>Partial</Tt>
      </DocBlock>
      <DocBlock>
        The row label column fits the longest label by default. Set <Tt>rowLabelWidth</Tt> to a
        width in pixels to use a fixed width instead. Labels that don&apos;t fit can be scrolled by
        dragging them, dragging the scrollbar above them, or scrolling horizontally over them.
      </DocBlock>
      <ExampleBlock>
        <EnhancedAvailability colorScheme={colorScheme} onColorSchemeChange={setColorScheme} />
      </ExampleBlock>
      <CodeBlock>
        {`
import DataProductAvailability from 'portal-core-components/lib/components/DataProductAvailability';

const enhancedAvailability = {
  productCode: 'DP1.10033.001',
  siteCodes: [
    {
      siteCode: 'ABBY',
      availableReleases: [
        {
          release: 'PROVISIONAL',
          months: [
            {
              month: '2021-03',
              available: false,
              status: null,
              packages: [
                {
                  packageType: 'basic',
                  components: [
                    { name: 'ltr_fielddata', type: 'tablename', status: 'Expected' },
                    ...
                  ],
                },
                ...
              ],
            },
            { month: '2025-01', available: true, status: null },
            ...
          ],
        },
        {
          release: 'RELEASE-2026',
          months: [
            { month: '2016-10', available: true, status: null },
            ...
          ],
        },
      ],
    },
    ...
  ],
};

// Availability passed in directly, with its data level detected
<DataProductAvailability enhancedAvailability={enhancedAvailability} />

// Availability passed in directly, required to agree with the COMPONENT data level
<DataProductAvailability enhancedAvailability={enhancedAvailability} dataLevel="COMPONENT" />

// Availability passed in directly, with packages and tables only showing their own statuses
<DataProductAvailability enhancedAvailability={enhancedAvailability} inheritanceMode="NONE" />

// Availability fetched for a product and release at the COMPONENT data level
<DataProductAvailability productCode="DP1.10033.001" release="RELEASE-2026" dataLevel="COMPONENT" />
        `}
      </CodeBlock>

    </>
  );
}
