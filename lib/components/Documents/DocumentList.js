import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import List from '@mui/material/List';
import { makeStyles, createStyles } from '@mui/styles';
import DocumentListItem from './DocumentListItem';
import Theme from '../Theme/Theme';
import WarningCard from '../Card/WarningCard';
import { existsNonEmpty } from '../../util/typeUtil';
const useStyles = makeStyles((muiTheme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        list: {
            paddingTop: muiTheme.spacing(0)
        }
    }));
const DocumentList = (props)=>{
    const classes = useStyles(Theme);
    const { documents, makeDownloadableLink, enableDownloadButton, fetchVariants, enableVariantChips } = props;
    if (!existsNonEmpty(documents)) {
        return /*#__PURE__*/ _jsx("div", {
            className: classes.container,
            children: /*#__PURE__*/ _jsx(WarningCard, {
                title: "No Documents",
                message: "No documents available to display"
            })
        });
    }
    const renderDocuments = ()=>documents.map((document, index)=>/*#__PURE__*/ _jsx(DocumentListItem, {
                id: index,
                document: document,
                makeDownloadableLink: makeDownloadableLink === true,
                enableDownloadButton: enableDownloadButton,
                fetchVariants: fetchVariants,
                enableVariantChips: enableVariantChips
            }, document.name));
    return /*#__PURE__*/ _jsx("div", {
        children: /*#__PURE__*/ _jsx(List, {
            dense: true,
            className: classes.list,
            children: renderDocuments()
        })
    });
};
const WrappedDocumentList = Theme.getWrappedComponent(DocumentList);
export default WrappedDocumentList;
