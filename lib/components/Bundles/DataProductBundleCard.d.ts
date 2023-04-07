import React from 'react';
export interface DataProductBundleCardClasses {
    cardIcon?: string;
}
export interface DataProductBundleCardProps {
    titleContent?: React.ReactNode;
    detailContent?: React.ReactNode;
    subTitleContent?: React.ReactNode;
    customContent?: React.ReactNode;
    isSplit?: boolean;
    classes?: DataProductBundleCardClasses;
}
declare const DataProductBundleCard: React.FC<DataProductBundleCardProps>;
export default DataProductBundleCard;
