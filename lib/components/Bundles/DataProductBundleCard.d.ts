import React from 'react';
export interface DataProductBundleCardClasses {
    card?: string;
    cardContent?: string;
    cardContentFlexContainer?: string;
    cardContentContainer?: string;
    cardIcon?: string;
}
export interface DataProductBundleCardProps {
    titleContent?: React.ReactNode;
    detailContent?: React.ReactNode;
    subTitleContent?: React.ReactNode;
    customContent?: React.ReactNode;
    isSplit?: boolean;
    showIcon?: boolean;
    classes?: DataProductBundleCardClasses;
}
declare const DataProductBundleCard: React.FC<DataProductBundleCardProps>;
export default DataProductBundleCard;
