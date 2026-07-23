import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import NeonApi from '../NeonApi/NeonApi';
import NeonContext from '../NeonContext/NeonContext';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import { exists, isStringNonEmpty } from '../../util/typeUtil';
export var FetchStatus = /*#__PURE__*/ function(FetchStatus) {
    FetchStatus["AWAITING_CALL"] = "AWAITING_CALL";
    FetchStatus["FETCHING"] = "FETCHING";
    FetchStatus["ERROR"] = "ERROR";
    FetchStatus["SUCCESS"] = "SUCCESS";
    FetchStatus["IDLE"] = "IDLE";
    return FetchStatus;
}({});
export var ControlStatus = /*#__PURE__*/ function(ControlStatus) {
    ControlStatus["VALID"] = "VALID";
    ControlStatus["INVALID"] = "INVALID";
    return ControlStatus;
}({});
export var BokehPlotStatus = /*#__PURE__*/ function(BokehPlotStatus) {
    BokehPlotStatus["RENDERING_DATA"] = "RENDERING_DATA";
    BokehPlotStatus["COMPLETED"] = "COMPLETED";
    BokehPlotStatus["IDLE"] = "IDLE";
    return BokehPlotStatus;
}({});
export var BokehDataStatus = /*#__PURE__*/ function(BokehDataStatus) {
    BokehDataStatus["DATA_AVAILABLE"] = "DATA_AVAILABLE";
    BokehDataStatus["NO_DATA"] = "NO_DATA";
    return BokehDataStatus;
}({});
const buildFilterProductsQuery = (productCodes)=>`query FilterProducts {
  products: filterProducts(
    filter: {
      productCodes: ${JSON.stringify(productCodes)}
    }
  ) {
    productCode
    productName
    productDescription
  }
}`;
const saeSites = [
    'ABBY',
    'BARR',
    'BART',
    'BLAN',
    'BONA',
    'CLBJ',
    'CPER',
    'DCFS',
    'DEJU',
    'DELA',
    'DSNY',
    'GRSM',
    'GUAN',
    'HARV',
    'HEAL',
    'JERC',
    'JORN',
    'KONA',
    'KONZ',
    'LAJA',
    'LENO',
    'MLBS',
    'MOAB',
    'NIWO',
    'NOGP',
    'OAES',
    'ONAQ',
    'ORNL',
    'OSBS',
    'PUUM',
    'RMNP',
    'SCBI',
    'SERC',
    'SJER',
    'SOAP',
    'SRER',
    'STEI',
    'STER',
    'TALL',
    'TEAK',
    'TOOL',
    'TREE',
    'UKFS',
    'UNDE',
    'WOOD',
    'WREF',
    'YELL'
];
const h2oSites = [
    'BARR',
    'BONA',
    'CLBJ',
    'CPER',
    'GUAN',
    'HARV',
    'KONZ',
    'NIWO',
    'ONAQ',
    'ORNL',
    'OSBS',
    'PUUM',
    'SRER',
    'SCBI',
    'SJER',
    'TALL',
    'TOOL',
    'UNDE',
    'WOOD',
    'WREF',
    'YELL'
];
const SAE_DATA_PRODUCTS = [
    {
        name: 'fluxCo2',
        productShortCodes: [
            'DP4.00067'
        ],
        productCodes: [
            'DP4.00067.001'
        ],
        variables: [
            {
                name: 'flux',
                units: 'umolCo2 m-2 s-1'
            }
        ]
    },
    {
        name: 'fluxH2o',
        productShortCodes: [
            'DP4.00137'
        ],
        productCodes: [
            'DP4.00137.001'
        ],
        variables: [
            {
                name: 'flux',
                units: 'W m-2'
            }
        ]
    },
    {
        name: 'fluxTemp',
        productShortCodes: [
            'DP4.00002'
        ],
        productCodes: [
            'DP4.00002.001'
        ],
        variables: [
            {
                name: 'flux',
                units: 'W m-2'
            }
        ]
    },
    {
        name: 'CH4',
        productShortCodes: [
            'DP1.00030'
        ],
        productCodes: [
            'DP1.00030.001'
        ],
        variables: [
            {
                name: 'rtioMoleDryCh4',
                units: 'umolCh4 mol-1'
            }
        ]
    },
    {
        name: 'CO2',
        productShortCodes: [
            'DP1.00034',
            'DP1.00036',
            'DP1.00099'
        ],
        productCodes: [
            'DP1.00034.001',
            'DP1.00036.001',
            'DP1.00099.001'
        ],
        variables: [
            {
                name: 'rtioMoleDryCo2',
                units: 'umolCo2 mol-1'
            }
        ]
    },
    {
        name: 'H2O',
        productShortCodes: [
            'DP1.00035',
            'DP1.00037',
            'DP1.00100'
        ],
        productCodes: [
            'DP1.00035.001',
            'DP1.00037.001',
            'DP1.00100.001'
        ],
        variables: [
            {
                name: 'rtioMoleDryH2o',
                units: 'mmolH2o mol-1'
            }
        ]
    },
    {
        name: 'isoCo2',
        productShortCodes: [
            'DP1.00036'
        ],
        productCodes: [
            'DP1.00036.001'
        ],
        variables: [
            {
                name: 'rtioMoleDry12CCo2',
                units: 'umolCo2 mol-1'
            },
            {
                name: 'rtioMoleDry13CCo2',
                units: 'umolCo2 mol-1'
            },
            {
                name: 'rtioMoleDryCo2',
                units: 'umolCo2 mol-1'
            },
            {
                name: 'dlta13CCo2',
                units: 'permill'
            }
        ]
    },
    {
        name: 'isoH2o',
        productShortCodes: [
            'DP1.00037'
        ],
        productCodes: [
            'DP1.00037.001'
        ],
        variables: [
            {
                name: 'rtioMoleDryH2o',
                units: 'mmolH2o mol-1'
            },
            {
                name: 'dlta180H2o',
                units: 'permill'
            },
            {
                name: 'dlta2HH2o',
                units: 'permill'
            }
        ]
    },
    {
        name: 'tempTriple',
        productShortCodes: [
            'DP1.00003'
        ],
        productCodes: [
            'DP1.00003.001'
        ],
        variables: [
            {
                name: 'temp',
                units: 'C'
            },
            {
                name: 'tempSoni',
                units: 'C'
            }
        ]
    },
    {
        name: 'windSpeed',
        productShortCodes: [
            'DP1.00007',
            'DP4.00007'
        ],
        productCodes: [
            'DP1.00007.001',
            'DP4.00007.001'
        ],
        variables: [
            {
                name: 'veloXaxsYaxsErth',
                units: 'm s-1'
            },
            {
                name: 'veloFric',
                units: 'm s-1'
            }
        ]
    }
];
const SAE_DATA_PRODUCT_MAP = {};
SAE_DATA_PRODUCTS.forEach((saeDataProduct)=>{
    SAE_DATA_PRODUCT_MAP[saeDataProduct.name] = saeDataProduct;
});
// When site without H2o chosen, remove isoH2o from dataProducts
const h2oProducts = [
    'isoH2o'
];
const nonH2oDataProducts = SAE_DATA_PRODUCTS.filter((p)=>!h2oProducts.includes(p.name));
// Indicates the product code for the SAE bundle product,
// that does not map to a query-able product within the data viewer.
export const SAE_BUNDLE_PRODUCT_CODE = 'DP4.00200.001';
const DEFAULT_SAE_PRODUCT = SAE_DATA_PRODUCT_MAP.fluxCo2;
const DEFAULT_SITE = 'CPER';
// Min date = 2016-02-01 with index based month
const DEFAULT_MIN_DATE = new Date(2016, 1, 1);
const INIT_MAX_DATE_FROM_DATE = new Date(new Date().setDate(new Date().getDate() - 7));
const DEFAULT_MAX_DATE = new Date(INIT_MAX_DATE_FROM_DATE.getFullYear(), INIT_MAX_DATE_FROM_DATE.getMonth(), INIT_MAX_DATE_FROM_DATE.getDate());
const determineInitialProduct = (product)=>{
    const index = SAE_DATA_PRODUCTS.findIndex((dp)=>dp.productShortCodes.includes(product));
    if (index >= 0) {
        return SAE_DATA_PRODUCTS[index];
    }
    return SAE_DATA_PRODUCTS[0];
};
const getDate = (dateStr, defaultDate)=>{
    if (!dateStr) {
        return defaultDate;
    }
    const date = new Date(dateStr);
    return date ?? defaultDate;
};
const formatDate = (date)=>{
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const calcDateRange = (isViewerLimited)=>{
    const now = new Date();
    const limitedMinDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const maxDate = new Date(DEFAULT_MAX_DATE);
    maxDate.setDate(maxDate.getDate() - 15);
    const defaultMinDate = isViewerLimited ? limitedMinDate : new Date(maxDate.getFullYear() - 1, maxDate.getMonth(), 1);
    const defaultMaxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    return [
        defaultMinDate,
        defaultMaxDate
    ];
};
const DEFAULT_STATE = {
    isViewerLimitedMode: true,
    saeProduct: DEFAULT_SAE_PRODUCT,
    site: DEFAULT_SITE,
    startDate: calcDateRange(true)[0],
    endDate: calcDateRange(true)[1],
    initProps: {
        productCode: undefined
    },
    productsFetch: {
        fetchStatus: "AWAITING_CALL"
    },
    bokehPlotFetch: {
        fetchStatus: "IDLE"
    },
    bokehPlot: {
        plotStatus: "IDLE",
        data: null,
        dataStatus: "DATA_AVAILABLE",
        message: null
    },
    controlsState: {
        status: "VALID",
        statusMessage: null,
        saeDataProducts: SAE_DATA_PRODUCTS,
        sites: saeSites,
        h2oSites,
        minDate: DEFAULT_MIN_DATE,
        maxDate: DEFAULT_MAX_DATE
    }
};
const StateContext = /*#__PURE__*/ createContext(cloneDeep(DEFAULT_STATE));
const DispatchContext = /*#__PURE__*/ createContext(undefined);
const useSaeDataViewerContextState = ()=>{
    let state = useContext(StateContext);
    if (!exists(state)) {
        state = cloneDeep(DEFAULT_STATE);
    }
    return state;
};
const useSaeDataViewerContextDispatch = ()=>{
    const dispatchContext = useContext(DispatchContext);
    if (!exists(dispatchContext)) {
        throw new Error('Failed to initialize dispatch context');
    }
    return dispatchContext;
};
const applyDateRange = (state, isViewerLimited)=>{
    const dateRange = calcDateRange(isViewerLimited);
    if (isViewerLimited) {
        // eslint-disable-next-line prefer-destructuring, no-param-reassign
        state.controlsState.minDate = dateRange[0];
    } else {
        // eslint-disable-next-line no-param-reassign
        state.controlsState.minDate = DEFAULT_MIN_DATE;
    }
    // eslint-disable-next-line prefer-destructuring, no-param-reassign
    state.startDate = dateRange[0];
    // eslint-disable-next-line prefer-destructuring, no-param-reassign
    state.endDate = dateRange[1];
};
const reducer = (state, action)=>{
    const newState = {
        ...state
    };
    const getDefaultProduct = (inState)=>inState.controlsState.saeDataProducts.find((checkSaeDataProduct)=>checkSaeDataProduct.name.localeCompare(DEFAULT_SAE_PRODUCT.name) === 0);
    const applyControlStatus = (inState)=>{
        if (inState.controlsState.status === "VALID") {
            // eslint-disable-next-line no-param-reassign
            inState.controlsState.statusMessage = null;
            // eslint-disable-next-line no-param-reassign
            inState.bokehPlotFetch.fetchStatus = "AWAITING_CALL";
        }
    };
    const checkH2oSelection = (inState)=>{
        const isH2oSite = inState.controlsState.h2oSites.includes(inState.site);
        if (!isH2oSite && h2oProducts.includes(inState.saeProduct.name)) {
            // Invalid state with non-H2o supporting site with H2o product
            // eslint-disable-next-line no-param-reassign
            inState.controlsState.status = "INVALID";
            const h2oSitesDisplay = h2oSites.join(', ');
            // eslint-disable-next-line no-param-reassign
            inState.controlsState.statusMessage = `The selected site ${inState.site}
        does not have data available for the isoH2o SAE data product. Please select
        a site with available data for the isoH2o SAE data product: ${h2oSitesDisplay}.
      `;
        }
    };
    switch(action.type){
        case 'reinitialize':
            newState.bokehPlotFetch.fetchStatus = "AWAITING_CALL";
            newState.bokehPlot.data = null;
            newState.bokehPlot.plotStatus = "IDLE";
            newState.isViewerLimitedMode = action.isViewerLimited;
            applyDateRange(newState, action.isViewerLimited);
            return newState;
        case 'fetchSaeProducts':
            newState.productsFetch.fetchStatus = "AWAITING_CALL";
            return newState;
        case 'fetchSaeProductsStarted':
            newState.productsFetch.fetchStatus = "FETCHING";
            return newState;
        case 'fetchSaeProductsSucceeded':
            newState.productsFetch.fetchStatus = "SUCCESS";
            action.products.forEach((productData)=>{
                newState.controlsState.saeDataProducts = newState.controlsState.saeDataProducts.map((saeDataProduct)=>{
                    const mergedDataProduct = {
                        ...saeDataProduct
                    };
                    if (mergedDataProduct.productCodes.includes(productData.productCode)) {
                        if (!mergedDataProduct.productData) {
                            mergedDataProduct.productData = {};
                        }
                        mergedDataProduct.productData[productData.productCode] = productData;
                    }
                    return mergedDataProduct;
                });
                if (newState.saeProduct.productCodes.includes(productData.productCode)) {
                    if (!newState.saeProduct.productData) {
                        newState.saeProduct.productData = {};
                    }
                    newState.saeProduct.productData[productData.productCode] = productData;
                }
            });
            return newState;
        case 'fetchSaeProductsError':
            newState.productsFetch.fetchStatus = "ERROR";
            return newState;
        case 'fetchBokehPlot':
            newState.bokehPlotFetch.fetchStatus = "AWAITING_CALL";
            return newState;
        case 'fetchBokehPlotStarted':
            newState.bokehPlotFetch.fetchStatus = "FETCHING";
            newState.bokehPlot.data = null;
            newState.bokehPlot.plotStatus = "IDLE";
            return newState;
        case 'fetchBokehPlotSucceeded':
            newState.bokehPlotFetch.fetchStatus = "SUCCESS";
            newState.bokehPlot.dataStatus = action.dataStatus;
            newState.bokehPlot.message = action.message;
            newState.bokehPlot.data = action.data;
            return newState;
        case 'fetchBokehPlotError':
            newState.bokehPlotFetch.fetchStatus = "ERROR";
            newState.bokehPlot.data = null;
            return newState;
        case 'setBokehPlotStatusRendering':
            newState.bokehPlot.plotStatus = "RENDERING_DATA";
            return newState;
        case 'setBokehPlotStatusCompleted':
            newState.bokehPlot.plotStatus = "COMPLETED";
            return newState;
        case 'setSelectedSite':
            newState.controlsState.status = "VALID";
            newState.site = action.site;
            checkH2oSelection(newState);
            applyControlStatus(newState);
            return newState;
        case 'setSelectedProduct':
            newState.controlsState.status = "VALID";
            // eslint-disable-next-line no-case-declarations
            const coercedProductName = action.productName;
            // eslint-disable-next-line no-case-declarations
            let saeDataProduct;
            if (!exists(SAE_DATA_PRODUCT_MAP[coercedProductName])) {
                saeDataProduct = getDefaultProduct(newState);
            } else {
                const findSaeDataProduct = newState.controlsState.saeDataProducts.find((checkSaeDataProduct)=>checkSaeDataProduct.name.localeCompare(coercedProductName) === 0);
                if (!findSaeDataProduct) {
                    saeDataProduct = getDefaultProduct(newState);
                } else {
                    saeDataProduct = findSaeDataProduct;
                }
            }
            newState.saeProduct = saeDataProduct;
            checkH2oSelection(newState);
            applyControlStatus(newState);
            return newState;
        case 'setSelectedDateRange':
            newState.controlsState.status = "VALID";
            newState.startDate = action.startDate;
            newState.endDate = action.endDate;
            applyControlStatus(newState);
            return newState;
        default:
            return state;
    }
};
const getInitialState = (propProductCode, isViewerLimited)=>{
    const clonedState = cloneDeep(DEFAULT_STATE);
    const initialState = {
        ...clonedState,
        initProps: {
            ...clonedState.initProps,
            productCode: propProductCode
        }
    };
    const query = new URLSearchParams(window.location.search);
    const urlQueryProduct = query.get('product');
    const urlQuerySite = query.get('site');
    const urlQueryStartDate = query.get('startDate');
    const urlQueryEndDate = query.get('endDate');
    let product;
    const site = urlQuerySite;
    if (isStringNonEmpty(propProductCode)) {
        product = propProductCode;
    } else if (isStringNonEmpty(urlQueryProduct)) {
        product = urlQueryProduct;
    }
    if (isStringNonEmpty(product) && product.length > 9) {
        product = product.substring(0, 9);
    }
    if (isStringNonEmpty(product)) {
        initialState.saeProduct = determineInitialProduct(product);
    }
    if (isStringNonEmpty(site)) {
        initialState.site = site;
    }
    // Determine the initial date range state
    const dateRange = calcDateRange(isViewerLimited);
    if (isViewerLimited) {
        // eslint-disable-next-line prefer-destructuring
        initialState.controlsState.minDate = dateRange[0];
    } else {
        initialState.controlsState.minDate = DEFAULT_MIN_DATE;
    }
    const selectedMinDate = getDate(urlQueryStartDate, dateRange[0]);
    const selectedMaxDate = getDate(urlQueryEndDate, dateRange[1]);
    initialState.startDate = selectedMinDate;
    initialState.endDate = selectedMaxDate;
    return initialState;
};
const buildFetchRequestHeaders = (neonContextSessionState)=>({
        ...NeonApi.getApiTokenHeader(),
        ...neonContextSessionState.sessionHeaders
    });
const fetchProductsData = (dispatch, neonContextSessionState, saeDataProducts)=>{
    dispatch({
        type: 'fetchSaeProductsStarted'
    });
    const productCodes = saeDataProducts.flatMap((saeDataProduct)=>saeDataProduct.productCodes).reduce((acc, current)=>{
        if (!acc.includes(current)) {
            acc.push(current);
        }
        return acc;
    }, []);
    const query = buildFilterProductsQuery(productCodes);
    const headers = {
        ...buildFetchRequestHeaders(neonContextSessionState),
        'Content-Type': 'application/json'
    };
    const requestInit = {
        method: 'POST',
        headers,
        body: JSON.stringify({
            query
        })
    };
    fetch(NeonEnvironment.getFullGraphqlPath(), requestInit).then((response)=>{
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then((data)=>{
        dispatch({
            type: 'fetchSaeProductsSucceeded',
            products: data.data.products
        });
    }).catch((error)=>{
        if (error instanceof Error && error.name === 'AbortError') {
            // eslint-disable-next-line no-console
            console.log('Fetch aborted');
        } else {
            // eslint-disable-next-line no-console
            console.error('Error fetching products data:', error);
            dispatch({
                type: 'fetchSaeProductsError',
                error
            });
        }
    });
};
const fetchBokehPlotData = (dispatch, neonContextSessionState, abortControllerRef, isViewerLimited, saeProduct, site, startDate, endDate)=>{
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    // eslint-disable-next-line no-param-reassign
    abortControllerRef.current = controller;
    dispatch({
        type: 'fetchBokehPlotStarted'
    });
    const queryParams = new URLSearchParams({
        // eslint-disable-next-line quote-props
        'site': site,
        // eslint-disable-next-line quote-props
        'product': saeProduct.name,
        'start-date': formatDate(startDate),
        'end-date': formatDate(endDate)
    }).toString();
    const rootApiUrl = isViewerLimited ? NeonEnvironment.getFullVizApiPath('saeDemoBokehPlot') : NeonEnvironment.getFullVizApiPath('saeBokehPlot');
    const apiUrl = `${rootApiUrl}?${queryParams}`;
    const headers = buildFetchRequestHeaders(neonContextSessionState);
    const requestInit = {
        method: 'GET',
        signal: controller.signal,
        headers
    };
    fetch(apiUrl, requestInit).then((response)=>{
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then((data)=>{
        if (!controller.signal.aborted) {
            let appliedDataStatus = "DATA_AVAILABLE";
            let message = null;
            if (exists(data) && exists(data.data)) {
                const coercedData = data.data;
                if (isStringNonEmpty(coercedData.status) && coercedData.status === 'NODATA') {
                    appliedDataStatus = "NO_DATA";
                    message = coercedData.message;
                }
            }
            const action = {
                type: 'fetchBokehPlotSucceeded',
                dataStatus: appliedDataStatus,
                message,
                data
            };
            dispatch(action);
        }
    }).catch((error)=>{
        if (error instanceof Error && error.name === 'AbortError') {
            // eslint-disable-next-line no-console
            console.log('Fetch aborted');
        } else {
            // eslint-disable-next-line no-console
            console.error('Error fetching plot data:', error);
            dispatch({
                type: 'fetchBokehPlotError',
                error
            });
        }
    });
};
const Provider = (props)=>{
    const { productCode: propProductCode, children } = props;
    const neonContextSessionState = NeonContext.useNeonContextSessionState();
    // Check preconditions for initial status
    const preconditionsSatisfied = neonContextSessionState.ready;
    const isViewerLimited = !neonContextSessionState.canAccessData;
    const initialState = getInitialState(propProductCode, isViewerLimited);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { saeProduct, site, startDate, endDate, productsFetch: { fetchStatus: productsFetchStatus }, bokehPlotFetch: { fetchStatus }, controlsState: { saeDataProducts } } = state;
    const abortControllerRef = useRef(new AbortController());
    // Reinitialize the context state when limited has changed
    useEffect(()=>{
        if (!preconditionsSatisfied) {
            return;
        }
        dispatch({
            type: 'reinitialize',
            isViewerLimited
        });
    }, [
        preconditionsSatisfied,
        isViewerLimited
    ]);
    // Fetch data product data
    useEffect(()=>{
        if (productsFetchStatus !== "AWAITING_CALL") {
            return;
        }
        fetchProductsData(dispatch, neonContextSessionState, saeDataProducts);
    }, [
        dispatch,
        neonContextSessionState,
        saeDataProducts,
        productsFetchStatus
    ]);
    // Fetch bokeh plot data
    useEffect(()=>{
        if (!preconditionsSatisfied) {
            return;
        }
        if (fetchStatus !== "AWAITING_CALL") {
            return;
        }
        fetchBokehPlotData(dispatch, neonContextSessionState, abortControllerRef, isViewerLimited, saeProduct, site, startDate, endDate);
    }, [
        dispatch,
        preconditionsSatisfied,
        isViewerLimited,
        neonContextSessionState,
        abortControllerRef,
        fetchStatus,
        saeProduct,
        site,
        startDate,
        endDate
    ]);
    return /*#__PURE__*/ _jsx(StateContext.Provider, {
        value: state,
        children: /*#__PURE__*/ _jsx(DispatchContext.Provider, {
            value: dispatch,
            children: children
        })
    });
};
const SaeDataViewerContext = {
    Provider,
    useSaeDataViewerContextState,
    useSaeDataViewerContextDispatch
};
export default SaeDataViewerContext;
