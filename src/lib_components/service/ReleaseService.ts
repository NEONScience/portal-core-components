import NeonContextService from './NeonContextService';
import { exists, existsNonEmpty, isStringNonEmpty } from '../util/typeUtil';
import { UserRelease } from '../types/neonContext';
import { Release as InternalRelease, IReleaseLike, ReleaseProps } from '../types/internal';

export const LATEST_AND_PROVISIONAL = 'LATEST_AND_PROVISIONAL';
export const PROVISIONAL_RELEASE = 'provisional';

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
  applyUserReleases: <T extends IReleaseLike>(
    neonContextState: any,
    currentReleases: IReleaseLike[],
  ) => T[];
}

const ReleaseService: IReleaseService = {
  getProvReleaseRegex: (): RegExp => new RegExp(/^[A-Z]+$/),
  isLatestNonProv: (releaseTag: string): boolean => {
    const matches: RegExpExecArray|null = ReleaseService.getProvReleaseRegex().exec(releaseTag);
    return exists(matches) && ((matches as RegExpExecArray).length > 0);
  },
  isInternalReleaseLike: (release: IReleaseLike): boolean => {
    let isLike = true;
    for (const p in ReleaseProps) {
      if (Object.prototype.hasOwnProperty.call(ReleaseProps, p)) {
        if (!(p in release)) {
          isLike = false;
          break;
        }
      }
    }
    return isLike;
  },
  sortReleases: <T extends IReleaseLike>(unsortedReleases: IReleaseLike[]): T[] => {
    const releases: IReleaseLike[] = [...unsortedReleases];
    if (existsNonEmpty(releases) && (releases.length > 1)) {
      releases.sort((a: IReleaseLike, b: IReleaseLike): number => (
        a.generationDate < b.generationDate ? 1 : -1
      ));
    }
    return releases as T[];
  },
  applyUserReleases: <T extends IReleaseLike>(
    neonContextState: any,
    currentReleases: IReleaseLike[],
  ): T[] => {
    const userReleases: UserRelease[] = NeonContextService.getContextUserReleases(
      neonContextState,
    );
    if (!Array.isArray(currentReleases) || !Array.isArray(userReleases)) {
      return [];
    }
    const combinedReleases: IReleaseLike[] = [];
    currentReleases.forEach((release: IReleaseLike): void => {
      let r: IReleaseLike;
      // Ensure we don't override any current releases that have been
      // initialized as internal release representations.
      if (ReleaseService.isInternalReleaseLike(release)) {
        r = {
          ...release,
          release: release.release,
          generationDate: exists(release.generationDate)
            ? new Date(release.generationDate).toISOString()
            : new Date().toISOString(),
        } as IReleaseLike;
      } else {
        r = {
          ...release,
          release: release.release,
          description: release.release,
          generationDate: exists(release.generationDate)
            ? new Date(release.generationDate).toISOString()
            : new Date().toISOString(),
          showCitation: true,
          showDoi: true,
          showViz: true,
        } as IReleaseLike;
      }
      combinedReleases.push(r);
    });
    userReleases.forEach((userRelease: UserRelease): void => {
      const hasRelease: boolean = currentReleases.some((value: IReleaseLike): boolean => (
        exists(value)
        && isStringNonEmpty(value.release)
        && isStringNonEmpty(userRelease.releaseTag)
        && (value.release.localeCompare(userRelease.releaseTag) === 0)
      ));
      if (!hasRelease) {
        const r: InternalRelease = {
          ...userRelease,
          release: userRelease.releaseTag,
          description: userRelease.description,
          generationDate: exists(userRelease.generationDate)
            ? new Date(userRelease.generationDate as number).toISOString()
            : new Date().toISOString(),
          showCitation: false,
          showDoi: false,
          showViz: true,
        };
        combinedReleases.push(r);
      }
    });
    return combinedReleases as T[];
  },
};

export default ReleaseService;
