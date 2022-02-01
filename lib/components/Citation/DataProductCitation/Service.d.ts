import { Nullable } from '../../../types/core';
declare const Service: {
    getProvReleaseRegex: () => RegExp;
    fetchIsAwaitingCall: (fetchObject: Record<string, unknown>) => boolean;
    stateHasFetchesInStatus: (state: any, status: string) => boolean;
    calculateFetches: (state: any) => any;
    calculateAppStatus: (state: any) => any;
    sortReleases: (unsortedReleases: any) => any[];
    withContextReleases: (neonContextState: any) => any;
    applyUserRelease: (current: any, userReleases: any) => void;
    applyReleasesGlobally: (state: any, releases: any) => any;
    calculateBundles: (bundlesCtx: any, release: string, productCode: string) => {
        parentCodes: string[];
        doiProductCode: Nullable<string>;
        forwardAvailabilityFromParent: boolean | null;
    };
    calculateContextState: (newState: any, neonContextState: any, release: string, productCode: string) => any;
};
export default Service;
