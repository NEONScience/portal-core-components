import React from 'react';
interface NeonRouterProps {
    cleanPath?: boolean;
    disableRedirect?: boolean;
    children?: React.ReactNode;
}
declare const NeonRouter: (props: NeonRouterProps) => React.JSX.Element;
export default NeonRouter;
