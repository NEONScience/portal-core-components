import NeonContextService from './NeonContextService';
import { exists, existsNonEmpty, isStringNonEmpty } from '../util/typeUtil';
import { UserRelease } from '../types/neonContext';
import { Release as InternalRelease, IReleaseLike, ReleaseProps } from '../types/internal';
import { DataProductDoiStatus, DataProductRelease, DoiStatusType } from '../types/neonApi';
import { Nullable } from '../types/core';

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
  getMostRecentReleaseTag: (releases: IReleaseLike[]) => string|null;
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

const ReleaseService: IReleaseService = {
  // eslint-disable-next-line prefer-regex-literals
  getProvReleaseRegex: (): RegExp => new RegExp(/^[A-Z]+$/),
  isLatestNonProv: (releaseTag: string): boolean => {
    const matches: RegExpExecArray|null = ReleaseService.getProvReleaseRegex().exec(releaseTag);
    return exists(matches) && ((matches as RegExpExecArray).length > 0);
  },
  isNonRelease: (releaseTag: string): boolean => {
    // eslint-disable-next-line prefer-regex-literals
    const regexLatestProv: RegExp = new RegExp(`^${LATEST_AND_PROVISIONAL}$`, 'i');
    // eslint-disable-next-line prefer-regex-literals
    const regexProv: RegExp = new RegExp(`^${PROVISIONAL_RELEASE}$`, 'i');
    const matchesLatestProv: RegExpExecArray|null = regexLatestProv.exec(releaseTag);
    const matchesProv: RegExpExecArray|null = regexProv.exec(releaseTag);
    const isLatestProv = exists(matchesLatestProv)
      && ((matchesLatestProv as RegExpExecArray).length > 0);
    const isProv = exists(matchesProv)
      && ((matchesProv as RegExpExecArray).length > 0);
    return isLatestProv || isProv;
  },
  isProv: (releaseTag: string): boolean => {
    if (!isStringNonEmpty(releaseTag)) {
      return true;
    }
    // eslint-disable-next-line prefer-regex-literals
    const regexProv: RegExp = new RegExp(`^${PROVISIONAL_RELEASE}$`, 'i');
    const matchesProv: RegExpExecArray|null = regexProv.exec(releaseTag);
    return exists(matchesProv) && ((matchesProv as RegExpExecArray).length > 0);
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
  getMostRecentReleaseTag: (releases: IReleaseLike[]): string|null => {
    if (!existsNonEmpty(releases)) {
      return null;
    }
    const sorted: IReleaseLike[] = ReleaseService.sortReleases(releases)
      .filter((releaseLike: IReleaseLike): boolean => (
        !ReleaseService.isLatestNonProv(releaseLike.release)
          && !(LATEST_AND_PROVISIONAL.localeCompare(releaseLike.release) === 0)
          && !(PROVISIONAL_RELEASE.localeCompare(releaseLike.release) === 0)
      ));
    if (!existsNonEmpty(sorted)) {
      return null;
    }
    return sorted[0].release;
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
  transformDoiStatusRelease: (
    doiStatus: Nullable<DataProductDoiStatus>,
  ): Nullable<IReleaseLike> => {
    if (!exists(doiStatus)) {
      return null;
    }
    const appliedDoiStatus: DataProductDoiStatus = doiStatus as DataProductDoiStatus;
    const transformed: DataProductRelease & InternalRelease = {
      url: '',
      productDoi: {
        url: appliedDoiStatus.url,
        generationDate: appliedDoiStatus.generationDate,
      },
      release: appliedDoiStatus.release,
      generationDate: appliedDoiStatus.releaseGenerationDate,
      description: appliedDoiStatus.release,
      showCitation: true,
      showDoi: true,
      showViz: exists(appliedDoiStatus.status)
        && (appliedDoiStatus.status === DoiStatusType.FINDABLE),
    };
    return transformed as IReleaseLike;
  },
  determineDelineateAvaRelease: (releaseTag: Nullable<string>): boolean => (
    !isStringNonEmpty(releaseTag)
      || (releaseTag === LATEST_AND_PROVISIONAL)
      || ReleaseService.isLatestNonProv(releaseTag as string)
  ),
};

export default ReleaseService;
