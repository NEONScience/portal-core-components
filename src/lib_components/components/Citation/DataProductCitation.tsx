import React from 'react';

import ComponentErrorBoundary from '../Error/ComponentErrorBoundary';
import DataProductCitationContext from './DataProductCitation/Context';
import DataProductCitationView from './DataProductCitation/View';
import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';

import { CitationTextOnlyProps } from './DataProductCitation/ViewState';
import { Nullable } from '../../types/core';

interface DataProductCitationProps {
  productCode: string;
  release?: Nullable<string>;
  showQuoteIcon?: boolean;
  disableConditional?: boolean;
  disableSkeleton?: boolean;
  showTextOnly?: boolean;
  textOnlyProps?: CitationTextOnlyProps;
}

const DataProductCitation: React.FC<DataProductCitationProps> = (
  props: DataProductCitationProps,
): JSX.Element => {
  const {
    productCode,
    release,
    showQuoteIcon,
    disableConditional,
    disableSkeleton,
    showTextOnly,
    textOnlyProps,
  }: DataProductCitationProps = props;
  return (
    <ComponentErrorBoundary>
      <DataProductCitationContext.Provider productCode={productCode} release={release}>
        <DataProductCitationView
          showQuoteIcon={showQuoteIcon}
          disableConditional={disableConditional}
          disableSkeleton={disableSkeleton}
          showTextOnly={showTextOnly}
          textOnlyProps={textOnlyProps}
        />
      </DataProductCitationContext.Provider>
    </ComponentErrorBoundary>
  );
};

DataProductCitation.defaultProps = {
  release: undefined,
  showQuoteIcon: false,
  disableConditional: false,
  disableSkeleton: false,
  showTextOnly: false,
  textOnlyProps: undefined,
};

const WrappedDataProductCitation = (Theme as any).getWrappedComponent(
  NeonContext.getWrappedComponent(DataProductCitation),
);

export default WrappedDataProductCitation;
