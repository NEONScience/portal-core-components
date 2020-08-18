import React from 'react';
interface NeonRouterProps {
    cleanPath?: boolean;
    disableRedirect?: boolean;
    children?: React.ReactNode;
}
declare const NeonRouter: (props: NeonRouterProps) => JSX.Element;
export default NeonRouter;
