export default ExternalHost;
declare namespace ExternalHost {
    export { HOST_TYPES };
    export { LINK_TYPES };
    export { getByHostId };
    export { getByProductCode };
    export { getProductSpecificInfo };
    export { renderExternalHostLink };
}
declare namespace HOST_TYPES {
    let ADDITIONAL_DATA: string;
    let REFORMATTED_DATA: string;
    let EXCLUSIVE_DATA: string;
}
declare namespace LINK_TYPES {
    let BY_SITE: string;
    let BY_PRODUCT: string;
}
declare function getByHostId(hostId?: string): any;
declare function getByProductCode(productCode?: string): any;
declare function getProductSpecificInfo(productCode?: string): any;
declare function renderExternalHostLink(href?: string, text?: string, host?: string, productCode?: string): React.JSX.Element;
import React from 'react';
