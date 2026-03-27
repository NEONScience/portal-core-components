import { jsx as _jsx } from "react/jsx-runtime";
// This exists so that Material Table doesn't have to rely on loading the Material Icon font in
// the HTML <HEAD>. See https://github.com/mbrn/material-table/issues/51#issuecomment-508384214
import React, { forwardRef } from 'react';
import AddBox from '@mui/icons-material/AddBox';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import Check from '@mui/icons-material/Check';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Clear from '@mui/icons-material/Clear';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Edit from '@mui/icons-material/Edit';
import FilterList from '@mui/icons-material/FilterList';
import FirstPage from '@mui/icons-material/FirstPage';
import LastPage from '@mui/icons-material/LastPage';
import Remove from '@mui/icons-material/Remove';
import SaveAlt from '@mui/icons-material/SaveAlt';
import Search from '@mui/icons-material/Search';
import ViewColumn from '@mui/icons-material/TableChart';
const MaterialTableIcons = {
    Add: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(AddBox, {
            ...props,
            ref: ref
        })),
    Check: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(Check, {
            ...props,
            ref: ref
        })),
    Clear: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(Clear, {
            ...props,
            ref: ref
        })),
    Delete: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(DeleteOutline, {
            ...props,
            ref: ref
        })),
    DetailPanel: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(ChevronRight, {
            ...props,
            ref: ref
        })),
    Edit: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(Edit, {
            ...props,
            ref: ref
        })),
    Export: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(SaveAlt, {
            ...props,
            ref: ref
        })),
    Filter: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(FilterList, {
            ...props,
            ref: ref
        })),
    FirstPage: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(FirstPage, {
            ...props,
            ref: ref
        })),
    LastPage: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(LastPage, {
            ...props,
            ref: ref
        })),
    NextPage: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(ChevronRight, {
            ...props,
            ref: ref
        })),
    PreviousPage: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(ChevronLeft, {
            ...props,
            ref: ref
        })),
    ResetSearch: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(Clear, {
            ...props,
            ref: ref
        })),
    Search: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(Search, {
            ...props,
            ref: ref
        })),
    SortArrow: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(ArrowUpward, {
            ...props,
            ref: ref
        })),
    ThirdStateCheck: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(Remove, {
            ...props,
            ref: ref
        })),
    ViewColumn: /*#__PURE__*/ forwardRef((props, ref)=>/*#__PURE__*/ _jsx(ViewColumn, {
            ...props,
            ref: ref
        }))
};
export default MaterialTableIcons;
