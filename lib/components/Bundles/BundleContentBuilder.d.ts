import React from 'react';
import { IDataProductLike } from '../../types/internal';
export interface IBundleContentBuilder {
    getParentProductLink: (dataProduct: IDataProductLike, release?: string) => React.JSX.Element;
    getBundledLink: () => React.JSX.Element;
    buildManyParentsMainContent: (dataProducts: IDataProductLike[], release?: string) => React.JSX.Element;
    buildDefaultTitleContent: (dataProduct: IDataProductLike, release?: string) => React.JSX.Element;
    buildDefaultSplitTitleContent: (isRelease: boolean, terminalChar?: string) => React.JSX.Element;
    buildDefaultSubTitleContent: (forwardAvailability: boolean, hasManyParents: boolean) => React.JSX.Element;
}
declare const BundleContentBuilder: IBundleContentBuilder;
export default BundleContentBuilder;
