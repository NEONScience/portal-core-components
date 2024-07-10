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
    const ADDITIONAL_DATA: string;
    const REFORMATTED_DATA: string;
    const EXCLUSIVE_DATA: string;
}
declare namespace LINK_TYPES {
    const BY_SITE: string;
    const BY_PRODUCT: string;
}
declare function getByHostId(hostId?: string): any;
declare function getByProductCode(productCode?: string): any;
declare function getProductSpecificInfo(productCode?: string): any;
declare function renderExternalHostLink(href?: string, text?: string, host?: string, productCode?: string): import("react/jsx-runtime").JSX.Element;
