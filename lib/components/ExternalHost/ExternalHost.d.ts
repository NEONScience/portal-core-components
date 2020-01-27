export default ExternalHost;
declare namespace ExternalHost {
    export { HOST_TYPES };
    export { LINK_TYPES };
    export { getByHostId };
    export { getByProductCode };
    export { renderExternalHostLink };
}
declare namespace HOST_TYPES {
    export const ADDITIONAL_DATA: string;
    export const REFORMATTED_DATA: string;
    export const EXCLUSIVE_DATA: string;
}
declare namespace LINK_TYPES {
    export const BY_SITE: string;
    export const BY_PRODUCT: string;
}
declare function getByHostId(hostId?: string): any;
declare function getByProductCode(productCode?: string): any;
declare function renderExternalHostLink(href?: string, text?: string, host?: string, productCode?: string): JSX.Element;
