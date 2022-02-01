import React from 'react';
import { Variant } from '@material-ui/core/styles/createTypography';
export interface CitationTextOnlyProps {
    variant?: Variant | undefined;
    cssClass?: string;
}
interface DataProductCitationViewProps {
    showQuoteIcon?: boolean;
    disableConditional?: boolean;
    disableSkeleton?: boolean;
    showTextOnly?: boolean;
    textOnlyProps?: CitationTextOnlyProps;
}
declare const DataProductCitationView: React.FC<DataProductCitationViewProps>;
export default DataProductCitationView;
