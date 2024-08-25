export declare enum NeonAuthType {
    REDIRECT = "REDIRECT",
    SILENT = "SILENT"
}
export declare enum NeonAuthDisplayType {
    MENU = "MENU",
    MENU_CUSTOM = "MENU_CUSTOM"
}
export interface NeonAuthProps {
    loginType: NeonAuthType;
    logoutType: NeonAuthType;
    displayType: NeonAuthDisplayType;
    loginPath: string;
    logoutPath: string;
    accountPath: string;
}
export interface AccountMenuProps {
    accountPath: string;
    handleLogout: () => void;
}
declare const WrappedNeonAuth: any;
export default WrappedNeonAuth;
