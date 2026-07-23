import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useLayoutEffect, useRef, useId } from 'react';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import ErrorCard from '../Card/ErrorCard';
import WarningCard from '../Card/WarningCard';
import { makeStyles } from '../Theme/makeStyles';
import { exists, isStringNonEmpty } from '../../util/typeUtil';
import SaeDataViewerContext, { FetchStatus, BokehPlotStatus, ControlStatus, BokehDataStatus } from './SaeDataViewerContext';
import './bokeh-overrides.css';
const useStyles = makeStyles()((theme)=>({
        stateContainer: {
            margin: theme.spacing(4, 0, 4, 0)
        },
        loadingInfoContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: theme.spacing(6, 0, 3, 0)
        },
        progressContainer: {
            marginRight: theme.spacing(3)
        },
        skeletonTitle: {
            margin: theme.spacing(1, 0, 0, 0)
        },
        skeletonContainer: {
            padding: theme.spacing(0, 4, 0, 4)
        },
        skeleton: {
            margin: theme.spacing(1, 0, 4, 0)
        }
    }));
const SaeDataViewerBokehPlotContainer = ()=>{
    const { classes } = useStyles();
    const bokehPlotId = useId();
    const bokehPlotContainerRef = useRef(null);
    const state = SaeDataViewerContext.useSaeDataViewerContextState();
    const dispatch = SaeDataViewerContext.useSaeDataViewerContextDispatch();
    const { bokehPlot: { plotStatus, data, dataStatus, message: bokehPlotDataMessage }, bokehPlotFetch: { fetchStatus }, controlsState: { status: controlStatus, statusMessage: controlStatusMessage } } = state;
    const loading = fetchStatus === FetchStatus.FETCHING || fetchStatus === FetchStatus.IDLE || plotStatus === BokehPlotStatus.IDLE && dataStatus === BokehDataStatus.DATA_AVAILABLE;
    const hasInvalidControlState = controlStatus === ControlStatus.INVALID;
    const hasErrorState = fetchStatus === FetchStatus.ERROR;
    const plotRendering = plotStatus === BokehPlotStatus.RENDERING_DATA;
    const hasData = dataStatus === BokehDataStatus.DATA_AVAILABLE;
    const displayBokehPlot = plotStatus === BokehPlotStatus.COMPLETED && !hasInvalidControlState && hasData;
    useLayoutEffect(()=>{
        if (!exists(bokehPlotContainerRef) || !exists(bokehPlotContainerRef.current)) {
            return ()=>{};
        }
        const bokehPlotContainer = bokehPlotContainerRef.current;
        // Use MutationObserver to detect when the DOM updates with the plot
        const mutationObserver = new MutationObserver((mutations)=>{
            mutations.forEach((mutation)=>{
                if (mutation.addedNodes.length > 0) {
                    if (dispatch) {
                        dispatch({
                            type: 'setBokehPlotStatusCompleted'
                        });
                    }
                }
            });
        });
        // Start observing the plot element for changes
        mutationObserver.observe(bokehPlotContainer, {
            childList: true,
            subtree: true
        });
        return ()=>{
            if (!mutationObserver) {
                return;
            }
            mutationObserver.disconnect();
        };
    }, [
        dispatch,
        bokehPlotContainerRef
    ]);
    useLayoutEffect(()=>{
        if (!exists(bokehPlotContainerRef) || !exists(bokehPlotContainerRef.current)) {
            return;
        }
        const bokehPlotContainer = bokehPlotContainerRef.current;
        if (!exists(data) || !hasData) {
            bokehPlotContainer.innerHTML = '';
            return;
        }
        if (dispatch) {
            dispatch({
                type: 'setBokehPlotStatusRendering'
            });
        }
        // Intentionally disabling type checking here for the window.Bokeh property
        // as we would prefer to not have to leak the "Bokeh" property into
        // the portal-core-components library (and elsewhere) as a whole
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.Bokeh.embed.embed_item(data, bokehPlotContainer.id);
    }, [
        dispatch,
        bokehPlotContainerRef,
        data,
        hasData
    ]);
    const bokehPlotStyle = {
        display: displayBokehPlot ? 'block' : 'none'
    };
    const renderErrorState = ()=>{
        if (!hasErrorState) {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return /*#__PURE__*/ _jsx(_Fragment, {});
        }
        return /*#__PURE__*/ _jsx("div", {
            className: classes.stateContainer,
            children: /*#__PURE__*/ _jsx(ErrorCard, {
                title: "SAE Data Viewer Error",
                message: "An error occurred while generating the SAE Data Viewer. Please try again momentarily."
            })
        });
    };
    const renderNoDataState = ()=>{
        if (hasData || loading || plotRendering) {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return /*#__PURE__*/ _jsx(_Fragment, {});
        }
        const details = isStringNonEmpty(bokehPlotDataMessage) ? bokehPlotDataMessage : 'There is currently no data available for the specified data product, site, or date range.';
        return /*#__PURE__*/ _jsx("div", {
            className: classes.stateContainer,
            children: /*#__PURE__*/ _jsx(WarningCard, {
                title: "SAE Data Viewer - No Data Available for Selection",
                message: details
            })
        });
    };
    const renderInvalidControlState = ()=>{
        if (!hasInvalidControlState) {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return /*#__PURE__*/ _jsx(_Fragment, {});
        }
        return /*#__PURE__*/ _jsx("div", {
            className: classes.stateContainer,
            children: /*#__PURE__*/ _jsx(WarningCard, {
                title: "SAE Data Viewer Invalid Selection",
                message: controlStatusMessage || 'Invalid selection detected'
            })
        });
    };
    const renderLoadingState = ()=>{
        if (hasErrorState) {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return /*#__PURE__*/ _jsx(_Fragment, {});
        }
        if (!loading && !plotRendering) {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return /*#__PURE__*/ _jsx(_Fragment, {});
        }
        const details = plotRendering ? 'Generating plots...' : 'Loading data...';
        return /*#__PURE__*/ _jsxs("div", {
            className: classes.stateContainer,
            children: [
                /*#__PURE__*/ _jsxs("div", {
                    className: classes.loadingInfoContainer,
                    children: [
                        /*#__PURE__*/ _jsx(CircularProgress, {
                            className: classes.progressContainer
                        }),
                        /*#__PURE__*/ _jsx(Typography, {
                            variant: "h5",
                            component: "h3",
                            children: details
                        })
                    ]
                }),
                /*#__PURE__*/ _jsxs("div", {
                    className: classes.skeletonContainer,
                    children: [
                        /*#__PURE__*/ _jsx(Skeleton, {
                            variant: "rectangular",
                            height: 20,
                            width: 200,
                            className: classes.skeletonTitle
                        }),
                        /*#__PURE__*/ _jsx(Skeleton, {
                            variant: "rectangular",
                            height: 370,
                            width: "100%",
                            className: classes.skeleton
                        })
                    ]
                }),
                /*#__PURE__*/ _jsxs("div", {
                    className: classes.skeletonContainer,
                    children: [
                        /*#__PURE__*/ _jsx(Skeleton, {
                            variant: "rectangular",
                            height: 20,
                            width: 200,
                            className: classes.skeletonTitle
                        }),
                        /*#__PURE__*/ _jsx(Skeleton, {
                            variant: "rectangular",
                            height: 370,
                            width: "100%",
                            className: classes.skeleton
                        })
                    ]
                })
            ]
        });
    };
    return /*#__PURE__*/ _jsx(Grid, {
        container: true,
        spacing: 2,
        children: /*#__PURE__*/ _jsxs(Grid, {
            size: {
                xs: 12
            },
            children: [
                renderErrorState(),
                renderInvalidControlState(),
                renderNoDataState(),
                renderLoadingState(),
                /*#__PURE__*/ _jsx("div", {
                    id: `bokehPlot-${bokehPlotId}`,
                    className: "bokehPlot",
                    ref: bokehPlotContainerRef,
                    style: bokehPlotStyle
                })
            ]
        })
    });
};
export default SaeDataViewerBokehPlotContainer;
