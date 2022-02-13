import { Nullable, UnknownRecord } from '../../../types/core';
import { DataProductRelease } from '../../../types/neonApi';
import { FetchStatusState, DataProductCitationState, CitationRelease } from './State';
import { DataProductCitationViewProps, DataProductCitationViewState } from './ViewState';
declare const Service: {
    fetchIsAwaitingCall: (fetchObject: Nullable<FetchStatusState>) => boolean;
    stateHasFetchesInStatus: (state: DataProductCitationState, status: string) => boolean;
    calculateFetches: (state: DataProductCitationState) => DataProductCitationState;
    calculateAppStatus: (state: DataProductCitationState) => DataProductCitationState;
    applyReleasesGlobally: (state: DataProductCitationState, releases: DataProductRelease[]) => DataProductCitationState;
    calculateContextState: (newState: DataProductCitationState, neonContextState: UnknownRecord, release: Nullable<string>, productCode: Nullable<string>) => DataProductCitationState;
    useViewState: (state: DataProductCitationState, props: DataProductCitationViewProps) => DataProductCitationViewState;
    getReleaseObject: (releases: CitationRelease[], release: Nullable<string>) => Nullable<CitationRelease>;
    getReleaseDoi: (releases: CitationRelease[], release: Nullable<string>) => Nullable<string>;
};
export default Service;
