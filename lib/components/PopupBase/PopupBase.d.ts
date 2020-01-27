export default PopupBase;
/**
   DEPRECATED - Use DialogBase Instead!
*/
declare class PopupBase extends React.Component<any, any, any> {
    constructor(props: Readonly<any>);
    constructor(props: any, context?: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
import React from "react";
