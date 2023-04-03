/// <reference types="react" />
import { IDataProductLike } from '../../types/internal';
export interface IBundleContentBuilder {
    getParentProductLink: (dataProduct: IDataProductLike, release?: string) => JSX.Element;
    getBundledLink: () => JSX.Element;
    buildManyParentsMainContent: (dataProducts: IDataProductLike[], release?: string) => JSX.Element;
    buildDefaultTitleContent: (dataProduct: IDataProductLike, release?: string) => JSX.Element;
    buildDefaultSplitTitleContent: (isRelease: boolean, terminalChar?: string) => JSX.Element;
    buildDefaultSubTitleContent: (forwardAvailability: boolean, hasManyParents: boolean) => JSX.Element;
}
declare const BundleContentBuilder: IBundleContentBuilder;
export default BundleContentBuilder;
