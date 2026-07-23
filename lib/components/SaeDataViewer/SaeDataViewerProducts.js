import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { forwardRef } from 'react';
import Select from 'react-select';
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
import SaeDataViewerContext, { FetchStatus } from './SaeDataViewerContext';
import RouteService from '../../service/RouteService';
import { makeStyles } from '../Theme/makeStyles';
import { resolveProps } from '../../util/defaultProps';
const useStyles = makeStyles()((theme)=>({
        root: {
            flexGrow: 1,
            width: '100%'
        },
        valueContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            flex: 1,
            alignItems: 'center',
            overflow: 'hidden'
        },
        paper: {
            position: 'absolute',
            zIndex: 1,
            marginTop: theme.spacing(1),
            left: 0,
            right: 0
        },
        productsContainer: {
            display: 'flex',
            alignContent: 'flex-start',
            flexFlow: 'row wrap'
        },
        productCard: {
            width: '100%',
            padding: theme.spacing(1.5, 2, 1.5, 2),
            backgroundColor: theme.palette.grey[50],
            marginTop: theme.spacing(3)
        },
        productTitleContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing(1.5)
        },
        startFlex: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
        },
        optionSubtitle: {
            fontSize: '0.75rem',
            color: theme.palette.grey[500]
        }
    }));
const buildSelectStyles = (theme)=>({
        input: (base)=>({
                ...base,
                color: theme.palette.text.primary,
                '& input': {
                    font: 'inherit'
                }
            }),
        clearIndicator: (base)=>({
                ...base,
                display: 'none'
            }),
        indicatorSeparator: (base)=>({
                ...base,
                display: 'none'
            }),
        dropdownIndicator: (base)=>({
                ...base,
                cursor: 'pointer'
            }),
        groupHeading: (base)=>({
                ...base,
                fontSize: '1rem',
                fontWeight: 600,
                color: theme.palette.primary.main
            })
    });
const InputComponent = /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx("div", {
        ref: ref,
        ...props
    }));
const ValueContainer = (props)=>{
    const { classes } = useStyles();
    const { children } = props;
    return /*#__PURE__*/ _jsx("div", {
        className: classes.valueContainer,
        children: children
    });
};
const Menu = (props)=>{
    const { classes } = useStyles();
    const { innerProps, children } = props;
    return /*#__PURE__*/ _jsx(Paper, {
        square: true,
        className: classes.paper,
        ...innerProps,
        children: children
    });
};
const ProductsControl = (props)=>{
    const { children, innerProps, innerRef } = props;
    return /*#__PURE__*/ _jsx(TextField, {
        fullWidth: true,
        label: "Select Data Product",
        variant: "outlined",
        slotProps: {
            input: {
                inputComponent: InputComponent,
                inputProps: {
                    ref: innerRef,
                    children,
                    ...innerProps
                },
                endAdornment: /*#__PURE__*/ _jsx(InputAdornment, {
                    position: "end",
                    children: /*#__PURE__*/ _jsx(SearchIcon, {
                        color: "disabled"
                    })
                })
            }
        }
    });
};
const productOptionDefaultProps = {
    isDisabled: false,
    isSelected: false,
    isFocused: false
};
const ProductOption = (inProps)=>{
    const props = resolveProps(productOptionDefaultProps, inProps);
    const { classes } = useStyles();
    const { innerRef, isFocused, isDisabled, innerProps, data } = props;
    const { name, productCodes } = data;
    const optionContent = /*#__PURE__*/ _jsx("div", {
        className: classes.startFlex,
        children: /*#__PURE__*/ _jsxs("div", {
            style: {
                flexGrow: 1
            },
            children: [
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "body1",
                    children: name
                }),
                /*#__PURE__*/ _jsx(Typography, {
                    variant: "body2",
                    className: classes.optionSubtitle,
                    gutterBottom: true,
                    children: `${productCodes.join(' | ')}`
                })
            ]
        })
    });
    // Note: wrapping each of these MenuItem elements in a MenuList
    // is a workaround for no longer being able to utilize the MenuItem
    // component as a standalone component outside of a Menu or MenuList.
    // The MenuItem brings along desired characteristics for selection
    // interactions.
    return /*#__PURE__*/ _jsx(MenuList, {
        style: {
            padding: 0,
            margin: 0
        },
        children: /*#__PURE__*/ _jsx(MenuItem, {
            ref: innerRef,
            selected: isFocused && !isDisabled,
            component: "div",
            style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                cursor: isDisabled ? 'not-allowed' : 'pointer'
            },
            ...innerProps,
            children: optionContent
        }, name)
    });
};
const SelectedProduct = (props)=>{
    const { classes, theme } = useStyles();
    const { product } = props;
    const skeletonProps = {
        height: 10,
        style: {
            marginTop: '4px',
            marginBottom: '12px'
        }
    };
    let productsSummary = /*#__PURE__*/ _jsxs("div", {
        children: [
            /*#__PURE__*/ _jsx(Skeleton, {
                variant: "rectangular",
                ...skeletonProps,
                width: 200
            }),
            /*#__PURE__*/ _jsx(Skeleton, {
                variant: "rectangular",
                ...skeletonProps,
                width: "100%"
            }),
            /*#__PURE__*/ _jsx(Skeleton, {
                variant: "rectangular",
                ...skeletonProps,
                width: "100%"
            }),
            /*#__PURE__*/ _jsx(Skeleton, {
                variant: "rectangular",
                ...skeletonProps,
                width: 125
            })
        ]
    });
    if (product.productData) {
        productsSummary = Object.keys(product.productData).map((productCode)=>{
            const productHref = RouteService.getProductDetailPath(productCode);
            const coercedData = product.productData;
            const currentProductData = coercedData[productCode];
            return /*#__PURE__*/ _jsxs("div", {
                style: {
                    marginTop: theme.spacing(1)
                },
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        style: {
                            marginRight: theme.spacing(1)
                        },
                        children: /*#__PURE__*/ _jsx(Typography, {
                            variant: "body2",
                            children: /*#__PURE__*/ _jsx(Link, {
                                href: productHref,
                                target: "_blank",
                                style: {
                                    fontWeight: 600
                                },
                                children: `${currentProductData.productName} - (${currentProductData.productCode})`
                            })
                        })
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        children: /*#__PURE__*/ _jsx(Typography, {
                            variant: "body2",
                            children: currentProductData.productDescription
                        })
                    })
                ]
            }, productCode);
        });
    }
    return /*#__PURE__*/ _jsxs(Card, {
        variant: "outlined",
        className: classes.productCard,
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: classes.productTitleContainer,
                children: [
                    /*#__PURE__*/ _jsx(DatasetIcon, {
                        fontSize: "large",
                        style: {
                            marginRight: theme.spacing(1),
                            flexGrow: 0
                        }
                    }),
                    /*#__PURE__*/ _jsx(Typography, {
                        variant: "h6",
                        style: {
                            lineHeight: '1.4rem',
                            flexGrow: 1
                        },
                        children: product.name
                    })
                ]
            }),
            productsSummary
        ]
    }, product.name);
};
const ProductsSelectComponents = {
    Control: ProductsControl,
    Option: ProductOption,
    Menu,
    ValueContainer,
    Placeholder: ()=>null,
    MultiValue: ()=>null,
    IndicatorsContainer: ()=>null
};
const ProductsSelect = ()=>{
    const { theme } = useStyles();
    const state = SaeDataViewerContext.useSaeDataViewerContextState();
    const dispatch = SaeDataViewerContext.useSaeDataViewerContextDispatch();
    const { saeProduct, controlsState: { saeDataProducts } } = state;
    if (!saeDataProducts) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return /*#__PURE__*/ _jsx(_Fragment, {});
    }
    return /*#__PURE__*/ _jsx(NoSsr, {
        children: /*#__PURE__*/ _jsx("div", {
            style: {
                flex: 1
            },
            children: /*#__PURE__*/ _jsx(Select, {
                isSearchable: true,
                isClearable: false,
                styles: buildSelectStyles(theme),
                "aria-label": "Select Product",
                "data-gtm": "sae-data-viewer.select-product",
                options: saeDataProducts,
                components: ProductsSelectComponents,
                value: saeProduct,
                controlShouldRenderValue: false,
                filterOption: (option, searchText)=>{
                    if (option.data) {
                        return option.data.name.includes(searchText.toLowerCase());
                    }
                    return false;
                },
                onChange: (value, change)=>{
                    if (change.action !== 'select-option') {
                        return;
                    }
                    if (dispatch && value) {
                        const singleValue = value;
                        if (singleValue) {
                            dispatch({
                                type: 'setSelectedProduct',
                                productName: singleValue.name
                            });
                        }
                    }
                }
            })
        })
    });
};
const SaeDataViewerProducts = ()=>{
    const { classes } = useStyles();
    const state = SaeDataViewerContext.useSaeDataViewerContextState();
    const { saeProduct, productsFetch: { fetchStatus } } = state;
    const isCompleted = fetchStatus === FetchStatus.SUCCESS;
    if (!saeProduct || !isCompleted) {
        return /*#__PURE__*/ _jsx(Skeleton, {
            variant: "rectangular",
            width: "100%",
            height: 56
        });
    }
    return /*#__PURE__*/ _jsxs("div", {
        className: classes.root,
        children: [
            /*#__PURE__*/ _jsx("div", {
                style: {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center'
                },
                children: /*#__PURE__*/ _jsx(ProductsSelect, {})
            }),
            /*#__PURE__*/ _jsx("div", {
                className: classes.productsContainer,
                children: /*#__PURE__*/ _jsx(SelectedProduct, {
                    product: state.saeProduct
                }, state.saeProduct.name)
            })
        ]
    });
};
export default SaeDataViewerProducts;
