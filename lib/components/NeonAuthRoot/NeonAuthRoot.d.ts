export default NeonAuthRoot;
declare class NeonAuthRoot extends React.Component<any, any, any> {
    constructor(props: any);
    auth: Authenticate;
    render(): JSX.Element;
}
import React from "react";
import Authenticate from "../../auth/authenticate";
