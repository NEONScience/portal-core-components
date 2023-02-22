import React from 'react';
import { IDataProductLike } from '../../types/internal';
export interface DataProductBundleCardClasses {
    card?: string;
    cardContent?: string;
    cardContentFlexContainer?: string;
    cardContentContainer?: string;
    cardIcon?: string;
}
export interface DataProductBundleCardProps {
    titleContent?: React.ReactNode;
    additionalTitleContent?: React.ReactNode;
    subTitleContent?: React.ReactNode;
    customContent?: React.ReactNode;
    isSplit?: boolean;
    showIcon?: boolean;
    classes?: DataProductBundleCardClasses;
}
export declare const getParentProductLink: (dataProduct: IDataProductLike, release?: string) => JSX.Element;
export declare const buildManyParentsAdditionalContent: (dataProducts: IDataProductLike[]) => JSX.Element;
export declare const buildDefaultTitleContent: (dataProduct: IDataProductLike, release?: string) => JSX.Element;
export declare const buildDefaultSplitTitleContent: (terminalChar?: string) => JSX.Element;
export declare const buildDefaultSubTitleContent: (forwardAvailability: boolean, hasManyParents: boolean) => JSX.Element;
declare const DataProductBundleCard: React.FC<DataProductBundleCardProps>;
export default DataProductBundleCard;
