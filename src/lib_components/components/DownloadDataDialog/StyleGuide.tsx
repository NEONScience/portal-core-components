import React, {
  useEffect,
  useReducer,
  useState,
  useSyncExternalStore,
} from 'react';

import { Observable } from 'rxjs';
import { type AjaxResponse } from 'rxjs/ajax';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/Add';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import RemoveIcon from '@mui/icons-material/DeleteOutlineOutlined';

import DownloadDataButton from '@/components/DownloadDataButton/DownloadDataButton';
import DownloadDataContext from '@/components/DownloadDataContext/DownloadDataContext';
import NeonApi from '@/components/NeonApi';
import NeonAuthContext from '@/components/NeonContext/NeonAuthContext';
import NeonEnvironment from '@/components/NeonEnvironment/NeonEnvironment';
import NeonGraphQL from '@/components/NeonGraphQL/NeonGraphQL';
import ReleaseFilter from '@/components/ReleaseFilter/ReleaseFilter';
import DownloadProgressRegistry, {
  MAX_CONCURRENT_DOWNLOADS,
} from '@/service/DownloadProgressRegistry';
import { COLORS } from '@/components/Theme/Theme';
import { makeStyles } from '@/components/Theme/makeStyles';
import { NeonTheme } from '@/components/Theme/types';
import { Nullable } from '@/types/core';

import DocBlock from '../../../components/DocBlock';
import CodeBlock from '../../../components/CodeBlock';
import ExampleBlock from '../../../components/ExampleBlock';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  divider: {
    margin: theme.spacing(3, 0),
  },
  fullWidth: {
    width: '100%',
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'max-content minmax(0, 1fr)',
    columnGap: theme.spacing(2),
    rowGap: theme.spacing(1),
    alignItems: 'center',
    margin: theme.spacing(0, 0, 3, 0),
    [theme.breakpoints.only('xs')]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      rowGap: theme.spacing(0.5),
    },
  },
  statusTerm: {
    fontWeight: 600,
  },
  statusValue: {
    margin: 0,
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
  url: {
    fontFamily: 'monospace',
    fontSize: '0.8125rem',
  },
  selectors: {
    marginBottom: theme.spacing(2),
  },
  benchHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    margin: theme.spacing(1, 0, 2, 0),
  },
  benchActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  card: {
    height: '100%',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  cardTitle: {
    fontWeight: 600,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    margin: theme.spacing(1, 0, 2, 0),
  },
  statusChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
  productCodeChip: {
    fontWeight: 600,
  },
  steps: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  errorText: {
    color: COLORS.RED[700],
  },
  loadingSelector: {
    marginBottom: theme.spacing(2),
  },
}));

type Classes = ReturnType<typeof useStyles>['classes'];

// <tt> is not a JSX intrinsic element in TypeScript, but DocBlock styles inline code with it
const Tt = ({ children }: { children: React.ReactNode }) => React.createElement('tt', null, children);

// Set these to initialize the product and release selection on a particular combination
const DEMO_PRODUCT_CODE: Nullable<string> = null;
const DEMO_RELEASE_TAG: Nullable<string> = null;

const LATEST_RELEASE_LABEL = 'Latest and Provisional';

enum FetchStatus {
  AWAITING_CALL = 'AWAITING_CALL',
  FETCHING = 'FETCHING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

interface ProductRelease {
  release: string;
  generationDate?: string;
  url?: string;
}

interface WorkbenchProduct {
  productCode: string;
  productName: string;
  releases: ProductRelease[];
}

interface DownloadCombinationConfig {
  id: number;
  productCode: string;
  productName: string;
  release: Nullable<string>;
}

interface WorkbenchState {
  fetchProductsStatus: FetchStatus;
  fetchProductsError: unknown;
  products: WorkbenchProduct[];
  selectedProductCode: Nullable<string>;
  selectedRelease: Nullable<string>;
  combinations: DownloadCombinationConfig[];
  nextCombinationId: number;
}

type WorkbenchAction = { type: 'fetchProductsSucceeded'; products: WorkbenchProduct[] }
  | { type: 'fetchProductsFailed'; error: unknown }
  | { type: 'selectProduct'; productCode: string }
  | { type: 'selectRelease'; release: Nullable<string> }
  | { type: 'addCombination' }
  | { type: 'removeCombination'; id: number }
  | { type: 'removeAllCombinations' };

// The subset of the session state the workflow status is presented from
interface SessionStateSubset {
  authenticated?: boolean;
  canAccessData?: boolean;
  sessionHeaders?: Record<string, string>;
}

// The subset of the download data context state the workflow summary is presented from
interface DownloadDataStateSubset {
  fromManifest: boolean;
  fromAOPManifest: boolean;
  fromExternalHost: boolean;
  requiredSteps: { key: string }[];
}

interface ProductFetchState {
  status: FetchStatus;
  productData: Nullable<Record<string, unknown>>;
  error: unknown;
}

const getReleaseLabel = (release: Nullable<string>): string => release || LATEST_RELEASE_LABEL;

const getErrorMessage = (error: unknown): string => {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (typeof error !== 'object') return String(error);
  const { message, status } = error as { message?: unknown; status?: unknown };
  const appliedMessage = (typeof message === 'string') && message.length
    ? message
    : 'Request failed';
  const appliedStatus = (typeof status === 'number') ? ` (${status})` : '';
  return `${appliedMessage}${appliedStatus}`;
};

const isAopPipelineProduct = (productData: Record<string, unknown>): boolean => {
  const isAopTeam = ['productScienceTeam', 'productScienceTeamAbbr'].some((key: string) => {
    const value = productData[key];
    return (typeof value === 'string') && value.includes('AOP');
  });
  const formatType = productData.productPublicationFormatType;
  return isAopTeam && (typeof formatType === 'string') && formatType.includes('AOP');
};

const getSiteCount = (productData: Nullable<Record<string, unknown>>): Nullable<number> => (
  (productData && Array.isArray(productData.siteCodes)) ? productData.siteCodes.length : null
);

const workbenchInitialState: WorkbenchState = {
  fetchProductsStatus: FetchStatus.AWAITING_CALL,
  fetchProductsError: null,
  products: [],
  selectedProductCode: null,
  selectedRelease: null,
  combinations: [],
  nextCombinationId: 1,
};

const findProduct = (
  state: WorkbenchState,
  productCode: Nullable<string>,
): Nullable<WorkbenchProduct> => (
  state.products.find((product: WorkbenchProduct) => product.productCode === productCode) || null
);

// Whether the product is available in the release
const hasRelease = (product: Nullable<WorkbenchProduct>, release: Nullable<string>): boolean => (
  !!product && !!release && product.releases.some((r: ProductRelease) => r.release === release)
);

const buildCombination = (
  state: WorkbenchState,
  id: number,
): Nullable<DownloadCombinationConfig> => {
  const product = findProduct(state, state.selectedProductCode);
  if (!product) return null;
  return {
    id,
    productCode: product.productCode,
    productName: product.productName,
    release: state.selectedRelease,
  };
};

const workbenchReducer = (state: WorkbenchState, action: WorkbenchAction): WorkbenchState => {
  switch (action.type) {
    case 'fetchProductsSucceeded': {
      const { products } = action;
      const selectedProduct = products.find((product: WorkbenchProduct) => (
        product.productCode === DEMO_PRODUCT_CODE
      )) || products[0];
      const nextState: WorkbenchState = {
        ...state,
        fetchProductsStatus: FetchStatus.SUCCESS,
        products,
        selectedProductCode: selectedProduct.productCode,
        selectedRelease: hasRelease(selectedProduct, DEMO_RELEASE_TAG) ? DEMO_RELEASE_TAG : null,
      };
      // Start the test bench with the initial selection
      const combination = buildCombination(nextState, state.nextCombinationId);
      return {
        ...nextState,
        combinations: combination ? [combination] : [],
        nextCombinationId: state.nextCombinationId + 1,
      };
    }
    case 'fetchProductsFailed':
      return {
        ...state,
        fetchProductsStatus: FetchStatus.ERROR,
        fetchProductsError: action.error,
      };
    case 'selectProduct': {
      const product = findProduct(state, action.productCode);
      if (!product) return state;
      return {
        ...state,
        selectedProductCode: product.productCode,
        // Retain the selected release when the product is available in it
        selectedRelease: hasRelease(product, state.selectedRelease) ? state.selectedRelease : null,
      };
    }
    case 'selectRelease':
      return { ...state, selectedRelease: action.release || null };
    case 'addCombination': {
      const combination = buildCombination(state, state.nextCombinationId);
      if (!combination) return state;
      return {
        ...state,
        combinations: [...state.combinations, combination],
        nextCombinationId: state.nextCombinationId + 1,
      };
    }
    case 'removeCombination':
      return {
        ...state,
        combinations: state.combinations.filter((combination: DownloadCombinationConfig) => (
          combination.id !== action.id
        )),
      };
    case 'removeAllCombinations':
      return { ...state, combinations: [] };
    default:
      return state;
  }
};

const renderStatusRow = (
  classes: Classes,
  term: string,
  value: React.ReactNode,
): React.JSX.Element => (
  <React.Fragment key={term}>
    <dt className={classes.statusTerm}>{term}</dt>
    <dd className={classes.statusValue}>{value}</dd>
  </React.Fragment>
);

interface StatusChipProps {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}

const StatusChip: React.FC<StatusChipProps> = (props: StatusChipProps): React.JSX.Element => {
  const { active, activeLabel, inactiveLabel }: StatusChipProps = props;
  return (
    <Chip
      size="small"
      variant={active ? 'filled' : 'outlined'}
      color={active ? 'primary' : 'default'}
      label={active ? activeLabel : inactiveLabel}
    />
  );
};

/**
 * Presents the environment and session state that determine how the download workflow behaves
 */
const DownloadWorkflowStatus: React.FC = (): React.JSX.Element => {
  const { classes } = useStyles();
  const sessionState = (
    NeonAuthContext.useNeonAuthContextSessionState() as unknown as SessionStateSubset
  );
  const activeDownloadCount = useSyncExternalStore<number>(
    DownloadProgressRegistry.subscribe,
    DownloadProgressRegistry.getActiveCount,
    () => 0,
  );
  const hasSessionHeaders = Object.keys(sessionState.sessionHeaders || {}).length > 0;
  const progressEnabled = NeonEnvironment.downloadProgressEnabled();
  const liveProgressAvailable = progressEnabled && hasSessionHeaders;
  const liveProgressValue = (
    <div className={classes.statusChips}>
      <StatusChip
        active={progressEnabled}
        activeLabel="Enabled"
        inactiveLabel="Disabled"
      />
      <StatusChip
        active={liveProgressAvailable}
        activeLabel="Available"
        inactiveLabel="Unavailable for this session"
      />
    </div>
  );
  const activeDownloadsValue = `${activeDownloadCount} of ${MAX_CONCURRENT_DOWNLOADS} `
    + 'allowed at once on this page';
  const renderUrl = (url: string): React.JSX.Element => (
    <span className={classes.url}>{url}</span>
  );
  return (
    <dl className={classes.statusGrid}>
      {renderStatusRow(classes, 'Live progress', liveProgressValue)}
      {renderStatusRow(classes, 'Active downloads', activeDownloadsValue)}
      {renderStatusRow(classes, 'API host', renderUrl(NeonEnvironment.getApiHost()))}
    </dl>
  );
};

/**
 * Describes the download workflow the context derived for the product and release
 */
const DownloadWorkflowSummary: React.FC = (): React.JSX.Element => {
  const { classes } = useStyles();
  const [downloadDataState] = (
    DownloadDataContext.useDownloadDataState() as unknown as [DownloadDataStateSubset, unknown]
  );
  const {
    fromManifest,
    fromAOPManifest,
    fromExternalHost,
    requiredSteps,
  }: DownloadDataStateSubset = downloadDataState;
  const workflows: string[] = [];
  if (fromManifest) workflows.push('Manifest');
  if (fromAOPManifest) workflows.push('AOP files');
  if (fromExternalHost) workflows.push('External host');
  const steps = requiredSteps.map((step: { key: string }) => step.key).join(', ');
  return (
    <Typography variant="body2" component="div" className={classes.steps}>
      <div>{`Workflow: ${workflows.length ? workflows.join(' + ') : 'None'}`}</div>
      <div>{`Steps: ${steps || 'None'}`}</div>
    </Typography>
  );
};

interface DownloadCombinationProps {
  combination: DownloadCombinationConfig;
  onRemove: (id: number) => void;
}

/**
 * Fetches the product data for a product and release combination and
 * presents the download data button for it
 */
const DownloadCombination: React.FC<DownloadCombinationProps> = (
  props: DownloadCombinationProps,
): React.JSX.Element => {
  const { classes } = useStyles();
  const { combination, onRemove }: DownloadCombinationProps = props;
  const { productCode, productName, release }: DownloadCombinationConfig = combination;
  const [productFetch, setProductFetch] = useState<ProductFetchState>({
    status: FetchStatus.FETCHING,
    productData: null,
    error: null,
  });
  useEffect(() => {
    const subscription = NeonApi.getProductObservable(productCode, release || undefined).subscribe({
      next: (response: unknown): void => {
        const data = ((typeof response === 'object') && (response !== null))
          ? (response as { data?: unknown }).data
          : null;
        const isProductData = (typeof data === 'object') && (data !== null)
          && (typeof (data as Record<string, unknown>).productCode === 'string');
        if (!isProductData) {
          setProductFetch({
            status: FetchStatus.ERROR,
            productData: null,
            error: 'Malformed product response',
          });
          return;
        }
        setProductFetch({
          status: FetchStatus.SUCCESS,
          productData: data as Record<string, unknown>,
          error: null,
        });
      },
      error: (error: unknown): void => {
        setProductFetch({ status: FetchStatus.ERROR, productData: null, error });
      },
    });
    return () => subscription.unsubscribe();
  }, [productCode, release]);

  const { status, productData, error }: ProductFetchState = productFetch;
  const siteCount = getSiteCount(productData);
  const releaseLabel = getReleaseLabel(release);

  const renderBody = (): React.JSX.Element => {
    if (status === FetchStatus.FETCHING) {
      return (
        <>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" width={180} height={36} />
        </>
      );
    }
    if (status === FetchStatus.ERROR) {
      return (
        <Typography variant="body2" className={classes.errorText}>
          {`Unable to load ${productCode} for ${releaseLabel}: ${getErrorMessage(error)}`}
        </Typography>
      );
    }
    return (
      <DownloadDataContext.Provider productData={productData} release={release || undefined}>
        <DownloadWorkflowSummary />
        <DownloadDataButton />
      </DownloadDataContext.Provider>
    );
  };

  return (
    <Card variant="outlined" className={classes.card}>
      <CardContent>
        <div className={classes.cardHeader}>
          <Typography variant="subtitle1" component="h4" className={classes.cardTitle}>
            {productName}
          </Typography>
          <Tooltip title="Remove from test bench">
            <IconButton
              size="small"
              aria-label={`Remove ${productCode} (${releaseLabel}) from test bench`}
              onClick={() => onRemove(combination.id)}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
        <div className={classes.chips}>
          <Chip size="small" className={classes.productCodeChip} label={productCode} />
          <Chip size="small" variant="outlined" label={releaseLabel} />
          {(siteCount === null) ? null : (
            <Chip
              size="small"
              variant="outlined"
              label={`${siteCount} site${siteCount === 1 ? '' : 's'}`}
            />
          )}
          {(!productData || !isAopPipelineProduct(productData)) ? null : (
            <Chip size="small" variant="outlined" label="AOP pipeline" />
          )}
        </div>
        {renderBody()}
      </CardContent>
    </Card>
  );
};

/**
 * Selects data product and release combinations and presents a download data
 * button for each to test the download workflow with
 */
const DownloadDataWorkbench: React.FC = (): React.JSX.Element => {
  const { classes } = useStyles();
  const [state, dispatch] = useReducer(workbenchReducer, workbenchInitialState);
  const {
    fetchProductsStatus,
    fetchProductsError,
    products,
    selectedProductCode,
    selectedRelease,
    combinations,
  }: WorkbenchState = state;

  useEffect(() => {
    const allProducts$ = NeonGraphQL.getAllDataProducts(null) as Observable<AjaxResponse<any>>;
    const subscription = allProducts$.subscribe({
      next: (response: AjaxResponse<any>): void => {
        const responseProducts: unknown = (response && response.response && response.response.data)
          ? response.response.data.products
          : null;
        if (!Array.isArray(responseProducts)) {
          dispatch({ type: 'fetchProductsFailed', error: 'Malformed products response' });
          return;
        }
        const allProducts: WorkbenchProduct[] = responseProducts
          .map((product: Record<string, unknown>): WorkbenchProduct => ({
            productCode: product.productCode as string,
            productName: product.productName as string,
            releases: Array.isArray(product.releases) ? product.releases as ProductRelease[] : [],
          }))
          .sort((a: WorkbenchProduct, b: WorkbenchProduct) => (
            a.productCode.localeCompare(b.productCode)
          ));
        if (!allProducts.length) {
          dispatch({ type: 'fetchProductsFailed', error: 'No data products found' });
          return;
        }
        dispatch({ type: 'fetchProductsSucceeded', products: allProducts });
      },
      error: (error: unknown): void => {
        dispatch({ type: 'fetchProductsFailed', error });
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  if (fetchProductsStatus === FetchStatus.ERROR) {
    return (
      <Typography variant="body2" className={classes.errorText}>
        {`Unable to load data products: ${getErrorMessage(fetchProductsError)}`}
      </Typography>
    );
  }
  if (fetchProductsStatus !== FetchStatus.SUCCESS) {
    return (
      <div className={classes.fullWidth}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={56}
          className={classes.loadingSelector}
        />
        <Skeleton variant="rectangular" width="100%" height={240} />
      </div>
    );
  }

  const selectedProduct = findProduct(state, selectedProductCode);
  const productReleases: ProductRelease[] = selectedProduct ? selectedProduct.releases : [];
  const handleProductChange = (event: SelectChangeEvent<string>): void => {
    dispatch({ type: 'selectProduct', productCode: event.target.value });
  };
  const handleReleaseChange = (release: Nullable<string>): void => {
    dispatch({ type: 'selectRelease', release });
  };
  const handleRemove = (id: number): void => {
    dispatch({ type: 'removeCombination', id });
  };
  return (
    <div className={classes.fullWidth}>
      <Grid container spacing={3} className={classes.selectors}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" id="download-data-product-select-label" gutterBottom>
            Select Data Product
          </Typography>
          <Select
            id="download-data-product-select"
            aria-labelledby="download-data-product-select-label"
            variant="outlined"
            value={selectedProductCode || ''}
            onChange={handleProductChange}
            className={classes.fullWidth}
            MenuProps={{ slotProps: { paper: { style: { maxHeight: 480 } } } }}
          >
            {products.map((product: WorkbenchProduct) => (
              <MenuItem key={product.productCode} value={product.productCode}>
                {`${product.productCode} - ${product.productName}`}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReleaseFilter
            key={selectedProductCode}
            showGenerationDate
            releases={productReleases}
            selected={selectedRelease}
            onChange={handleReleaseChange}
          />
        </Grid>
      </Grid>
      <div className={classes.benchHeader}>
        <Typography variant="h6" component="h3">
          {`Test Bench (${combinations.length})`}
        </Typography>
        <div className={classes.benchActions}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => dispatch({ type: 'addCombination' })}
            disabled={!selectedProduct}
          >
            {`Add ${selectedProductCode || 'product'} (${getReleaseLabel(selectedRelease)})`}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ClearAllIcon />}
            onClick={() => dispatch({ type: 'removeAllCombinations' })}
            disabled={!combinations.length}
          >
            Remove All
          </Button>
        </div>
      </div>
      {!combinations.length ? (
        <DocBlock>
          Add a data product and release combination to the test bench to test its
          download workflow.
        </DocBlock>
      ) : (
        <Grid container spacing={2}>
          {combinations.map((combination: DownloadCombinationConfig) => (
            <Grid key={combination.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <DownloadCombination combination={combination} onRemove={handleRemove} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default function StyleGuide(): React.JSX.Element {
  const { classes } = useStyles();

  return (
    <>

      <DocBlock>
        The download data workflow is launched by the <b>Download Data Button</b> and driven by
        the <b>Download Data Context</b>. The <b>Download Data Dialog</b> it opens determines the
        download steps required for a data product and release, estimates the download size, and
        submits the download. When live download progress is enabled, a download is tracked from
        the moment it is submitted: the progress dialog shows its status and progress, and can
        be minimized to a tray that persists while the download continues.
      </DocBlock>
      <CodeBlock>
        {`
import DownloadDataButton from 'portal-core-components/lib/components/DownloadDataButton';
import DownloadDataContext from 'portal-core-components/lib/components/DownloadDataContext';
import NeonApi from 'portal-core-components/lib/components/NeonApi';
        `}
      </CodeBlock>

      <Typography variant="h5" component="h3" gutterBottom>Usage</Typography>

      <DocBlock>
        Provide the context with the data product, as returned by the products API for the
        release to download from. Specify the <Tt>release</Tt> to download only data from that
        release, or leave it unspecified to download the latest released and provisional data.
      </DocBlock>
      <CodeBlock>
        {`
// The product data for the release, e.g. the response from:
// NeonApi.getProductObservable('DP1.00001.001', 'RELEASE-2025')
const productData = productResponse.data;

<DownloadDataContext.Provider productData={productData} release="RELEASE-2025">
  <DownloadDataButton />
</DownloadDataContext.Provider>
        `}
      </CodeBlock>

      <Divider className={classes.divider} />
      <Typography variant="h4" component="h2" gutterBottom>Test Bench</Typography>

      <DocBlock>
        Select any data product and one of its releases, then add the combination to the test
        bench to test its download workflow. Each combination loads the product data for the
        release from the products API and provides its own Download Data Button. Add several
        combinations to test downloading more than one data product at once, including the limit
        of {MAX_CONCURRENT_DOWNLOADS} downloads in progress at once on a page, and how minimized
        downloads stack in the download tray.
      </DocBlock>
      <DocBlock>
        Downloading data requires signing in with an account that has data access. Live download
        progress also requires the <Tt>NEXT_PUBLIC_NEON_DOWNLOAD_ENABLE_PROGRESS</Tt> environment
        variable set to <Tt>true</Tt>, live progress enabled for the download API.
      </DocBlock>
      <ExampleBlock column>
        <div className={classes.fullWidth}>
          <DownloadWorkflowStatus />
          <DownloadDataWorkbench />
        </div>
      </ExampleBlock>

    </>
  );
}
