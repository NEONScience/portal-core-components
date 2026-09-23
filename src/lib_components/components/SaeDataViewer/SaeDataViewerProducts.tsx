import React, { forwardRef } from 'react';

import Select, {
  ActionMeta,
  ControlProps,
  CSSObjectWithLabel,
  FilterOptionOption,
  GroupBase,
  MenuProps,
  MultiValue,
  OptionProps,
  SelectComponentsConfig,
  SingleValue,
  StylesConfig,
  ValueContainerProps,
} from 'react-select';

import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import NoSsr from '@mui/material/NoSsr';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import SearchIcon from '@mui/icons-material/Search';
import DatasetIcon from '@mui/icons-material/DatasetOutlined';

import { InputBaseComponentProps } from '@mui/material/InputBase';

import SaeDataViewerContext, {
  FetchStatus,
  SaeDataProduct,
  SaeDataProductData,
  SaeDataViewerContextState,
} from './SaeDataViewerContext';
import RouteService from '../../service/RouteService';
import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';
import { NeonTheme } from '../Theme/types';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  productsContainer: {
    display: 'flex',
    alignContent: 'flex-start',
    flexFlow: 'row wrap',
  },
  productCard: {
    width: '100%',
    padding: theme.spacing(1.5, 2, 1.5, 2),
    backgroundColor: theme.palette.grey[50],
    marginTop: theme.spacing(3),
  },
  productTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  optionSubtitle: {
    fontSize: '0.75rem',
    color: theme.palette.grey[500],
  },
}));

const buildSelectStyles = (
  theme: NeonTheme,
): StylesConfig<SaeDataProduct, boolean, GroupBase<SaeDataProduct>> => ({
  input: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    color: theme.palette.text.primary,
    '& input': {
      font: 'inherit',
    },
  }),
  clearIndicator: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    display: 'none',
  }),
  indicatorSeparator: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    display: 'none',
  }),
  dropdownIndicator: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    cursor: 'pointer',
  }),
  groupHeading: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.palette.primary.main,
  }),
});

const InputComponent = forwardRef<
  HTMLDivElement,
  InputBaseComponentProps
>((props: InputBaseComponentProps, ref: React.ForwardedRef<HTMLDivElement>) => (
  <div ref={ref} {...props as React.HTMLAttributes<HTMLInputElement>} />
));

type ValueContainerPropsType = React.PropsWithChildren<ValueContainerProps<
  SaeDataProduct,
  boolean,
  GroupBase<SaeDataProduct>
>>;

const ValueContainer: React.FC<ValueContainerPropsType> = (
  props: ValueContainerPropsType,
): React.JSX.Element => {
  const { classes } = useStyles();
  const { children } = props;
  return <div className={classes.valueContainer}>{children}</div>;
};

type MenuPropsType = React.PropsWithChildren<MenuProps<
  SaeDataProduct,
  boolean,
  GroupBase<SaeDataProduct>
>>;

const Menu: React.FC<MenuPropsType> = (
  props: MenuPropsType,
): React.JSX.Element => {
  const { classes } = useStyles();
  const { innerProps, children } = props;
  return (
    <Paper square className={classes.paper} {...innerProps}>
      {children}
    </Paper>
  );
};

type ProductsControlPropsType = React.PropsWithChildren<ControlProps<
  SaeDataProduct,
  boolean,
  GroupBase<SaeDataProduct>
>>;

const ProductsControl: React.FC<ProductsControlPropsType> = (
  props: ProductsControlPropsType,
): React.JSX.Element => {
  const {
    children,
    innerProps,
    innerRef,
  } = props;
  return (
    <TextField
      fullWidth
      label="Select Data Product"
      variant="outlined"
      slotProps={{
        input: {
          inputComponent: InputComponent,
          inputProps: {
            ref: innerRef,
            children,
            ...innerProps as InputBaseComponentProps,
          },
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon color="disabled" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

type ProductOptionPropsType = React.PropsWithChildren<OptionProps<
  SaeDataProduct,
  boolean,
  GroupBase<SaeDataProduct>
>>;

type ProductOptionDefaultPropsType = {
  isDisabled: boolean;
  isSelected: boolean;
  isFocused: boolean;
};

const productOptionDefaultProps: ProductOptionDefaultPropsType = {
  isDisabled: false,
  isSelected: false,
  isFocused: false,
};

const ProductOption: React.FC<ProductOptionPropsType> = (
  inProps: ProductOptionPropsType,
): React.JSX.Element => {
  const props = resolveProps(
    productOptionDefaultProps,
    inProps,
  ) as ProductOptionPropsType;
  const { classes } = useStyles();
  const {
    innerRef,
    isFocused,
    isDisabled,
    innerProps,
    data,
  } = props;
  const {
    name,
    productCodes,
  } = data;
  const optionContent = (
    <div className={classes.startFlex}>
      <div style={{ flexGrow: 1 }}>
        <Typography variant="body1">
          {name}
        </Typography>
        <Typography variant="body2" className={classes.optionSubtitle} gutterBottom>
          {`${productCodes.join(' | ')}`}
        </Typography>
      </div>
    </div>
  );
  // Note: wrapping each of these MenuItem elements in a MenuList
  // is a workaround for no longer being able to utilize the MenuItem
  // component as a standalone component outside of a Menu or MenuList.
  // The MenuItem brings along desired characteristics for selection
  // interactions.
  return (
    <MenuList style={{ padding: 0, margin: 0 }}>
      <MenuItem
        key={name}
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
        {optionContent}
      </MenuItem>
    </MenuList>
  );
};

interface SelectedProductProps {
  product: SaeDataProduct;
}

const SelectedProduct: React.FC<SelectedProductProps> = (
  props: SelectedProductProps,
): React.JSX.Element => {
  const { classes, theme } = useStyles();
  const { product } = props;
  const skeletonProps = {
    height: 10,
    style: { marginTop: '4px', marginBottom: '12px' },
  };
  let productsSummary: React.JSX.Element|React.JSX.Element[] = (
    <div>
      <Skeleton variant="rectangular" {...skeletonProps} width={200} />
      <Skeleton variant="rectangular" {...skeletonProps} width="100%" />
      <Skeleton variant="rectangular" {...skeletonProps} width="100%" />
      <Skeleton variant="rectangular" {...skeletonProps} width={125} />
    </div>
  );
  if (product.productData) {
    productsSummary = Object.keys(product.productData)
      .map((productCode: string): React.JSX.Element => {
        const productHref = RouteService.getProductDetailPath(productCode);
        const coercedData = product.productData as Record<string, SaeDataProductData>;
        const currentProductData: SaeDataProductData = coercedData[productCode];
        return (
          <div key={productCode} style={{ marginTop: theme.spacing(1) }}>
            <div style={{ marginRight: theme.spacing(1) }}>
              <Typography variant="body2">
                <Link href={productHref} target="_blank" style={{ fontWeight: 600 }}>
                  {`${currentProductData.productName} - (${currentProductData.productCode})`}
                </Link>
              </Typography>
            </div>
            <div>
              <Typography variant="body2">
                {currentProductData.productDescription}
              </Typography>
            </div>
          </div>
        );
      });
  }
  return (
    <Card key={product.name} variant="outlined" className={classes.productCard}>
      <div className={classes.productTitleContainer}>
        <DatasetIcon
          fontSize="large"
          style={{ marginRight: theme.spacing(1), flexGrow: 0 }}
        />
        <Typography variant="h6" style={{ lineHeight: '1.4rem', flexGrow: 1 }}>
          {product.name}
        </Typography>
      </div>
      {productsSummary}
    </Card>
  );
};

const ProductsSelectComponents: SelectComponentsConfig<
  SaeDataProduct,
  boolean,
  GroupBase<SaeDataProduct>
> = {
  Control: ProductsControl,
  Option: ProductOption,
  Menu,
  ValueContainer,
  Placeholder: () => null,
  MultiValue: () => null,
  IndicatorsContainer: () => null,
};

const ProductsSelect: React.FC = (): React.JSX.Element => {
  const { theme } = useStyles();
  const state = SaeDataViewerContext.useSaeDataViewerContextState();
  const dispatch = SaeDataViewerContext.useSaeDataViewerContextDispatch();
  const {
    saeProduct,
    controlsState: {
      saeDataProducts,
    },
  } = state;
  if (!saeDataProducts) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  return (
    <NoSsr>
      <div style={{ flex: 1 }}>
        <Select
          isSearchable
          isClearable={false}
          styles={buildSelectStyles(theme)}
          aria-label="Select Product"
          data-gtm="sae-data-viewer.select-product"
          options={saeDataProducts}
          components={ProductsSelectComponents}
          value={saeProduct}
          controlShouldRenderValue={false}
          filterOption={
            (option: FilterOptionOption<SaeDataProduct>, searchText: string): boolean => {
              if (option.data) {
                return option.data.name.includes(searchText.toLowerCase());
              }
              return false;
            }
          }
          onChange={
            (
              value: SingleValue<SaeDataProduct>|MultiValue<SaeDataProduct>,
              change: ActionMeta<SaeDataProduct>,
            ): void => {
              if (change.action !== 'select-option') { return; }
              if (dispatch && value) {
                const singleValue = value as SingleValue<SaeDataProduct>;
                if (singleValue) {
                  dispatch({ type: 'setSelectedProduct', productName: singleValue.name });
                }
              }
            }
          }
        />
      </div>
    </NoSsr>
  );
};

const SaeDataViewerProducts: React.FC = (): React.JSX.Element => {
  const { classes } = useStyles();
  const state = SaeDataViewerContext.useSaeDataViewerContextState();
  const {
    saeProduct,
    productsFetch: {
      fetchStatus,
    },
  }: SaeDataViewerContextState = state;
  const isCompleted = (fetchStatus === FetchStatus.SUCCESS);
  if (!saeProduct || !isCompleted) {
    return <Skeleton variant="rectangular" width="100%" height={56} />;
  }
  return (
    <div className={classes.root}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <ProductsSelect />
      </div>
      <div className={classes.productsContainer}>
        <SelectedProduct key={state.saeProduct.name} product={state.saeProduct} />
      </div>
    </div>
  );
};

export default SaeDataViewerProducts;
