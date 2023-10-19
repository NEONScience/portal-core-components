import { IReleaseLike } from '../types/internal';
import { DataProductDoiStatus } from '../types/neonApi';
import { Nullable } from '../types/core';
export declare const LATEST_AND_PROVISIONAL = "LATEST_AND_PROVISIONAL";
export declare const PROVISIONAL_RELEASE = "provisional";
export interface IReleaseService {
    /**
     * Gets a regex for determining if a release is latest non-provisional.
     * @return The regex object.
     */
    getProvReleaseRegex: () => RegExp;
    /**
     * Determines if the specified release tag is latest non-provisional like.
     * @param releaseTag The release tag to inspect.
     * @return True if the release tag is latest non-provisional like.
     */
    isLatestNonProv: (releaseTag: string) => boolean;
    /**
     * Determines if the specified release tag represents a "non" release.
     * (eg. provisional)
     * @param releaseTag The release tag to inspect.
     * @return True if the release tag is a non-release.
     */
    isNonRelease: (releaseTag: string) => boolean;
    /**
     * Determines if the specified release tag represents a provisional "release".
     * (eg. provisional)
     * @param releaseTag The release tag to inspect.
     * @return True if the release tag is a provisional "release".
     */
    isProv: (releaseTag: string) => boolean;
    /**
     * Determines if the IReleaseLike object adheres to an InternalRelease object.
     * @param release The release to check.
     * @return True if the release is like an InternalRelease object.
     */
    isInternalReleaseLike: (release: IReleaseLike) => boolean;
    /**
     * Sorts the set of release like objects by generationDate.
     * @param unsortedReleases The set of release like objects to sort.
     * @return The sorted set of release like objects.
     */
    sortReleases: <T extends IReleaseLike>(unsortedReleases: IReleaseLike[]) => T[];
    /**
     * Gets the most recently available release tag from the set of releases.
     * @param releases The set of releases to work from.
     * @return The most recently available release tag when applicable.
     */
    getMostRecentReleaseTag: (releases: IReleaseLike[]) => string | null;
    /**
     * Applies the set of user accessible releases for the currently
     * authenticated user with the set of current releases.
     * @param neonContextState The context state to build from
     * @param currentReleases The set of releases to apply
     * @return The combined set of accessible releases for the current user
     */
    applyUserReleases: <T extends IReleaseLike>(neonContextState: any, currentReleases: IReleaseLike[]) => T[];
    /**
     * Transforms the DOI status into a release like object
     * @param doiStatus The DOI status representation
     * @return The transformed release like representation
     */
    transformDoiStatusRelease: (doiStatus: Nullable<DataProductDoiStatus>) => Nullable<IReleaseLike>;
    /**
     * Determines if the release tag indicates that the data availability
     * chart should delineate release data
     * @param releaseTag The tag to check against
     * @returns True if the release should be delineated
     */
    determineDelineateAvaRelease: (releaseTag: Nullable<string>) => boolean;
}
declare const ReleaseService: IReleaseService;
export default ReleaseService;
