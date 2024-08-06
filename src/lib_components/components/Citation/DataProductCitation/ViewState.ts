import { Variant } from '@mui/material/styles/createTypography';
import { Nullable } from '../../../types/core';
import {
  CitationRelease,
  ContextDataProduct,
  ContextStatus,
  FetchStatusState,
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
  showManyParents?: boolean;
}

export interface DataProductCitationItemViewProps extends DataProductCitationViewProps {
  citationItem: DataProductCitationItem;
  viewState: DataProductCitationViewState;
  hasManyParents: boolean;
}

export enum DisplayType {
  PROVISIONAL = 'PROVISIONAL',
  RELEASE = 'RELEASE',
  CONDITIONAL = 'CONDITIONAL',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export interface DataProductCitationItem {
  releaseObject: Nullable<CitationRelease>;
  doiUrl: Nullable<string>;
  citableBaseProduct: Nullable<ContextDataProduct>;
  citableReleaseProduct: Nullable<ContextDataProduct>;
  bundleParentCode: Nullable<string>;
  isTombstoned: boolean;
}

export interface DataProductCitationViewState {
  status: ContextStatus;
  displayType: DisplayType;
  isTombstoned: boolean;
  releases: CitationRelease[];
  citationItems: DataProductCitationItem[];
  citationDownloadsFetchStatus: Record<string, FetchStatusState>;
}
