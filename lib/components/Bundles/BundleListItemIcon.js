import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faBoxesStacked } from '@fortawesome/free-solid-svg-icons';
import Theme from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
const useStyles = makeStyles((theme)=>({
        bundleIcon: {
            padding: '5px',
            marginRight: theme.spacing(2)
        }
    }));
const defaultProps = {
    isSplit: false
};
const BundleListItemIcon = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const classes = useStyles(Theme);
    const { isSplit } = props;
    return /*#__PURE__*/ _jsx(ListItemIcon, {
        children: /*#__PURE__*/ _jsx(FontAwesomeIcon, {
            icon: isSplit ? faBoxesStacked : faBox,
            size: "2x",
            className: classes.bundleIcon
        })
    });
};
export default BundleListItemIcon;
