import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

/*
DATA_TYPES: {
  DATE_TIME: "dateTime",
  REAL: "real",
  SIGNED_INTEGER: "signed integer",
  UNSIGNED_INTEGER: "unsigned integer",
}
SITE: https://data.neonscience.org/api/v0/data/DP1.20264.001/BARC/2020-01
-> VARIABLES: NEON.D03.BARC.DP1.20264.001.variables.20200207T003031Z.csv
-> POSITIONS: NEON.D03.BARC.DP1.20264.001.sensor_positions.20200207T003031Z.csv
*/

const parseProductData = (productData = {}) => {
  console.log('PARSING', productData);
  const product = {
    productCode: productData.productCode,
    productName: productData.productName,
    productDescription: productData.productDescription,
    productSensor: productData.productSensor,
    dateRange: [null, null],
    variables: {},
    sites: {},
  };
  product.dateRange = (productData.siteCodes || []).reduce((acc, site) => {
    if (!Array.isArray(site.availableMonths) || !site.availableMonths.length) { return acc; }
    product.sites[site.siteCode] = {};
    const start = site.availableMonths[0];
    const end = site.availableMonths[site.availableMonths.length - 1];
    return [
      acc[0] === null || acc[0] > start ? start : acc[0],
      acc[1] === null || acc[1] < end ? end : acc[1],
    ];
  }, [null, null]);
  console.log('PARSED', product);
  return product;
};

const reducer = (state, action) => {
  console.log('DISPATCH', action, state);
  switch (action.type) {
    default:
      return state;
  }
};

export default function TimeSeriesViewer(props) {
  const {
    productCode: productCodeProp,
    productData: productDataProp,
  } = props;

  const productCode = productCodeProp || productDataProp.productCode;

  const initialState = {
    fetches: {
      product: {
        status: productDataProp ? 'fetched' : 'awaitingFetchCall',
        error: null,
      },
      site: {},
      data: {},
    },
    product: productDataProp ? parseProductData(productDataProp) : {
      productCode,
      productName: null,
      productDescription: null,
      productSensor: null,
      dateRange: [null, null],
      variables: {},
      sites: {},
    },
    selection: {
      dateRange: [null, null],
      variables: {},
      sites: {},
    },
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  /*
state = {

  fetches: {
    product: {
      status: 'awaitingFetchCall',
      error: null,
    },
    site: {
      ABBY: {
        variables: {
          status: 'awaitingFetchCall',
          error: null,
        },
        positions: {
          status: 'awaitingFetchCall',
          error: null,
        },
        months: {
          '2019-01': {
            status: 'awaitingFetchCall',
            error: null,
          },
        },
      },
    },
    data: {
    }
  },

  product: {
    productCode: "DP1.00001.001",
    availableDateRange: ['2019-06', '2019-10'],
    variables: {
      myVar1: {
        description: '...'
        dataType: oneOf(DATA_TYPES)
        units: '...'
        downloadPkg: 'BASIC'
        timeScales: ['1min', '30min']
        sites: ['ABBY', 'CPER']
      }
    },
    sites: {
      ABBY: {
        '000.000': {
          '2019-01': {
            'BASIC': {
              '001': 'https://...',
              '030': 'https://...',
            },
            'EXPANDED': {
              '001': 'https://...',
              '030': 'https://...',
            },
          },
        },
        '000.100': {
          '2019-01': {
            'BASIC': {
              '001': 'https://...',
              '030': 'https://...',
            },
            'EXPANDED': {
              '001': 'https://...',
              '030': 'https://...',
            },
          },
        },
      },
    },
  },

  selection: {
    dateRange: ['2019-06', '2019-10'],
    variables: ['myVar1', 'myVar2'],
    sites: [
      { siteCode: 'ABBY', position: '000.000' },
      { siteCode: 'ABBY', position: '000.100' },
      { siteCode: 'CPER', position: '000.100' }
    ],
  }
}
   */

  console.log(state, dispatch);
  return (
    <div>Time Series Viewer</div>
  );
}

const productDataShape = PropTypes.shape({
  productCode: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  siteCodes: PropTypes.arrayOf(
    PropTypes.shape({
      siteCode: PropTypes.string.isRequired,
      availableMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ),
});

TimeSeriesViewer.propTypes = {
  productCode: (props, propName, componentName) => {
    const { productCode, productData } = props;
    if (!productCode && !productData) {
      return new Error(`One of props 'productCode' or 'productData' was not specified in '${componentName}'.`);
    }
    if (productCode) {
      PropTypes.checkPropTypes(
        { productCode: PropTypes.string },
        { productCode },
        propName,
        componentName,
      );
    }
    return null;
  },
  productData: (props, propName, componentName) => {
    const { productCode, productData } = props;
    if (!productCode && !productData) {
      return new Error(`One of props 'productCode' or 'productData' was not specified in '${componentName}'.`);
    }
    if (productData) {
      PropTypes.checkPropTypes(
        { productData: productDataShape },
        { productData },
        propName,
        componentName,
      );
    }
    return null;
  },
};

TimeSeriesViewer.defaultProps = {
  productCode: null,
  productData: null,
};
