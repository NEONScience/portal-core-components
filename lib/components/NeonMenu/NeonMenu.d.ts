export default NeonMenu;
declare class NeonMenu extends React.Component<any, any, any> {
    constructor(props: any);
    auth: Authenticate;
    menuFromResponse(response: any): void;
    menuErrorCallback(): void;
    authCallback(response: any): void;
    authErrorCallback(error: any): void;
    handleDrawerOpen(): void;
    handleDrawerClose(): void;
    cancellationSubject$: Subject<any>;
    state: {
        fetched: boolean;
        menuItems: never[];
        isFetchingAuthentication: boolean;
        isAuthenticated: boolean;
        drawerIsOpen: boolean;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
declare namespace NeonMenu {
    export namespace propTypes {
        export const loginPath: PropTypes.Requireable<string>;
        export const logoutPath: PropTypes.Requireable<string>;
        export const accountPath: PropTypes.Requireable<string>;
    }
    export namespace defaultProps {
        const loginPath_1: string;
        export { loginPath_1 as loginPath };
        const logoutPath_1: string;
        export { logoutPath_1 as logoutPath };
        const accountPath_1: string;
        export { accountPath_1 as accountPath };
    }
}
import React from "react";
import Authenticate from "../../auth/authenticate";
import { Subject } from "rxjs";
import PropTypes from "prop-types";
