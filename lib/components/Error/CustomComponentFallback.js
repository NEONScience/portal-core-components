import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const CustomComponentFallback = (props)=>{
    const { FallbackComponent } = props;
    return /*#__PURE__*/ _jsx(FallbackComponent, {
        ...props
    });
};
export default CustomComponentFallback;
