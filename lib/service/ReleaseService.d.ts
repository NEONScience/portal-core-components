import { IReleaseLike } from '../types/internal';
export declare const LATEST_AND_PROVISIONAL = "LATEST_AND_PROVISIONAL";
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
     * Applies the set of user accessible releases for the currently
     * authenticated user with the set of current releases.
     * @param neonContextState The context state to build from
     * @param currentReleases The set of releases to apply
     * @return The combined set of accessible releases for the current user
     */
    applyUserReleases: <T extends IReleaseLike>(neonContextState: any, currentReleases: IReleaseLike[]) => T[];
}
declare const ReleaseService: IReleaseService;
export default ReleaseService;
