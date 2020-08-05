export declare enum NeonAuthType {
    REDIRECT = "REDIRECT",
    SILENT = "SILENT"
}
export declare enum NeonAuthDisplayType {
    MENU = "MENU"
}
export interface NeonAuthProps {
    loginType: NeonAuthType;
    logoutType: NeonAuthType;
    displayType: NeonAuthDisplayType;
    loginPath: string;
    logoutPath: string;
    accountPath: string;
}
declare const WrappedNeonAuth: any;
export default WrappedNeonAuth;
