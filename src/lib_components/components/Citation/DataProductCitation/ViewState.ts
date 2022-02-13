import { Variant } from '@material-ui/core/styles/createTypography';
import { Nullable } from '../../../types/core';
import {
  CitationRelease,
  ContextDataProduct,
  ContextStatus,
} from './State';

export interface CitationTextOnlyProps {
  variant?: Variant | undefined;
  cssClass?: string;
}

export interface DataProductCitationViewProps {
  showQuoteIcon?: boolean;
  disableConditional?: boolean;
  disableSkeleton?: boolean;
  showTextOnly?: boolean;
  textOnlyProps?: CitationTextOnlyProps;
}

export enum DisplayType {
  PROVISIONAL = 'PROVISIONAL',
  RELEASE = 'RELEASE',
  CONDITIONAL = 'CONDITIONAL',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export interface DataProductCitationViewState {
  status: ContextStatus;
  displayType: DisplayType;
  releases: CitationRelease[];
  releaseObject: Nullable<CitationRelease>;
  doiUrl: Nullable<string>;
  citableBaseProduct: Nullable<ContextDataProduct>;
  citableReleaseProduct: Nullable<ContextDataProduct>;
  bundleParentCode: Nullable<string>;
}
