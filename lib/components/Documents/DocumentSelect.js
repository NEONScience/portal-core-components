import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles, createStyles } from '@mui/styles';
import DocumentListItem from './DocumentListItem';
import DocumentService from '../../service/DocumentService';
import DocumentViewer from './DocumentViewer';
import NeonEnvironment from '../NeonEnvironment';
import Theme from '../Theme/Theme';
import WarningCard from '../Card/WarningCard';
import { exists, existsNonEmpty, isStringNonEmpty } from '../../util/typeUtil';
const useStyles = makeStyles((muiTheme)=>// eslint-disable-next-line implicit-arrow-linebreak
    createStyles({
        container: {
            width: '100%'
        },
        selectContainer: {
            width: '100%',
            padding: muiTheme.spacing(3, 0)
        },
        selectFormControl: {
            width: '100%'
        }
    }));
const DocumentSelect = (props)=>{
    const classes = useStyles(Theme);
    const { documents } = props;
    const hasDocuments = existsNonEmpty(documents);
    let initialValue = '';
    if (hasDocuments) {
        initialValue = documents[0].name;
    }
    const [selectedDoc, setSelectedDoc] = useState(initialValue);
    if (!hasDocuments) {
        return /*#__PURE__*/ _jsx("div", {
            className: classes.container,
            children: /*#__PURE__*/ _jsx(WarningCard, {
                title: "No Documents",
                message: "No documents available to display"
            })
        });
    }
    const renderSelectedDocument = ()=>{
        const matchedDoc = documents.find((doc)=>exists(doc) && isStringNonEmpty(doc.name) && doc.name.localeCompare(selectedDoc) === 0);
        if (!exists(matchedDoc)) {
            return /*#__PURE__*/ _jsx(WarningCard, {
                title: "Document Not Found",
                message: "Document could not be found"
            });
        }
        const coercedMatchedDoc = matchedDoc;
        const fullUrlPath = DocumentService.isQuickStartGuide(coercedMatchedDoc) ? `${NeonEnvironment.getFullApiPath('quickStartGuides')}` : `${NeonEnvironment.getFullApiPath('documents')}`;
        return /*#__PURE__*/ _jsx(DocumentViewer, {
            document: coercedMatchedDoc,
            width: 600,
            fullUrlPath: fullUrlPath
        });
    };
    return /*#__PURE__*/ _jsx("div", {
        className: classes.container,
        children: /*#__PURE__*/ _jsxs(Grid, {
            container: true,
            spacing: 3,
            children: [
                /*#__PURE__*/ _jsx(Grid, {
                    item: true,
                    xs: 12,
                    children: /*#__PURE__*/ _jsxs(FormControl, {
                        variant: "outlined",
                        className: classes.selectFormControl,
                        children: [
                            /*#__PURE__*/ _jsx(InputLabel, {
                                htmlFor: "document-select-input",
                                children: "Select Document to View"
                            }),
                            /*#__PURE__*/ _jsx(Select, {
                                fullWidth: true,
                                id: "document-select",
                                inputProps: {
                                    name: 'Select Document to View',
                                    id: 'document-select-input'
                                },
                                label: "Select Document to View",
                                "aria-labelledby": "document-select-label",
                                value: selectedDoc,
                                onChange: (event, child)=>{
                                    const nextDoc = documents.find((doc)=>doc.name.localeCompare(event.target.value) === 0);
                                    if (exists(nextDoc)) {
                                        setSelectedDoc(nextDoc.name);
                                    }
                                },
                                children: documents.map((doc, index)=>/*#__PURE__*/ _jsx(MenuItem, {
                                        value: doc.name,
                                        children: /*#__PURE__*/ _jsx(DocumentListItem, {
                                            id: index,
                                            document: doc,
                                            makeDownloadableLink: false
                                        })
                                    }, doc.name))
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ _jsx(Grid, {
                    item: true,
                    xs: 12,
                    children: renderSelectedDocument()
                })
            ]
        })
    });
};
const WrappedDocumentSelect = Theme.getWrappedComponent(DocumentSelect);
export default WrappedDocumentSelect;
