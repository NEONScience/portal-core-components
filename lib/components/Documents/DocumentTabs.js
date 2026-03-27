import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { makeStyles, createStyles } from '@mui/styles';
import DocumentListItem from './DocumentListItem';
import DocumentService from '../../service/DocumentService';
import DocumentViewer from './DocumentViewer';
import NeonEnvironment from '../NeonEnvironment';
import Theme from '../Theme/Theme';
import WarningCard from '../Card/WarningCard';
import { existsNonEmpty } from '../../util/typeUtil';
const useStyles = makeStyles((muiTheme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        container: {
            width: '100%',
            display: 'flex',
            margin: muiTheme.spacing(0, -0.5, -0.5, -0.5),
            flexDirection: 'column'
        },
        tabPanels: {
            width: '100%',
            backgroundColor: '#fff'
        },
        tabContentContainer: {
            width: '100%',
            padding: muiTheme.spacing(3, 3, 3, 3)
        }
    }));
const useTabsStyles = makeStyles((muiTheme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        scroller: {
            backgroundColor: muiTheme.palette.grey[200]
        },
        scrollButtons: {
            '&.Mui-disabled': {
                opacity: 0.6
            }
        }
    }));
const useTabStyles = makeStyles((muiTheme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        root: {
            textTransform: 'none',
            opacity: 1,
            maxWidth: 464
        },
        wrapper: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            '& svg': {
                margin: `${muiTheme.spacing(0, 1, 0, 0)} !important`
            }
        },
        selected: {
            borderBottom: 'none'
        }
    }));
const DocumentTabs = (props)=>{
    const classes = useStyles(Theme);
    const tabClasses = useTabStyles(Theme);
    const tabsClasses = useTabsStyles(Theme);
    const { documents } = props;
    const initialTabIdx = 0;
    const [selectedTab, setSelectedTab] = useState(initialTabIdx);
    if (!existsNonEmpty(documents)) {
        return /*#__PURE__*/ _jsx("div", {
            className: classes.container,
            children: /*#__PURE__*/ _jsx(WarningCard, {
                title: "No Documents",
                message: "No documents available to display"
            })
        });
    }
    const docTabs = documents.map((doc, index)=>({
            document: doc,
            index
        }));
    const renderTabs = ()=>/*#__PURE__*/ _jsx(Tabs, {
            orientation: "horizontal",
            scrollButtons: true,
            variant: "scrollable",
            value: selectedTab,
            "aria-label": "Document Tabs",
            classes: tabsClasses,
            onChange: (event, newTab)=>{
                setSelectedTab(newTab);
            },
            TabIndicatorProps: {
                style: {
                    display: 'none'
                }
            },
            allowScrollButtonsMobile: true,
            children: docTabs.map((docTab)=>/*#__PURE__*/ _jsx(Tab, {
                    value: docTab.index,
                    label: /*#__PURE__*/ _jsx(DocumentListItem, {
                        id: docTab.index,
                        document: docTab.document,
                        makeDownloadableLink: false
                    }),
                    "aria-label": docTab.document.name,
                    classes: tabClasses,
                    id: `document-tabs-tab-${docTab.index}`,
                    "aria-controls": `document-tabs-tabpanel-${docTab.index}`
                }, docTab.index))
        });
    const renderTabContent = (documentTab)=>{
        const { document, index } = documentTab;
        const fullUrlPath = DocumentService.isQuickStartGuide(document) ? `${NeonEnvironment.getFullApiPath('quickStartGuides')}` : `${NeonEnvironment.getFullApiPath('documents')}`;
        return /*#__PURE__*/ _jsx("div", {
            role: "tabpanel",
            id: `document-tabs-tabpanel-${index}`,
            "aria-labelledby": `document-tabs-tab-${index}`,
            style: {
                display: selectedTab === index ? 'block' : 'none'
            },
            className: classes.tabContentContainer,
            children: selectedTab !== index ? null : /*#__PURE__*/ _jsx(DocumentViewer, {
                document: document,
                width: 600,
                fullUrlPath: fullUrlPath
            })
        }, index);
    };
    const renderTabPanels = ()=>/*#__PURE__*/ _jsx("div", {
            className: classes.tabPanels,
            children: docTabs.map((docTab)=>renderTabContent(docTab))
        });
    return /*#__PURE__*/ _jsxs("div", {
        className: classes.container,
        children: [
            renderTabs(),
            renderTabPanels()
        ]
    });
};
const WrappedDocumentTabs = Theme.getWrappedComponent(DocumentTabs);
export default WrappedDocumentTabs;
