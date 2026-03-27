import NeonContextService from './NeonContextService';
import { exists, existsNonEmpty, isStringNonEmpty } from '../util/typeUtil';
import { ReleaseProps } from '../types/internal';
import { DoiStatusType } from '../types/neonApi';
export const LATEST_AND_PROVISIONAL = 'LATEST_AND_PROVISIONAL';
export const PROVISIONAL_RELEASE = 'provisional';
const ReleaseService = {
    // eslint-disable-next-line prefer-regex-literals
    getProvReleaseRegex: ()=>new RegExp(/^[A-Z]+$/),
    isLatestNonProv: (releaseTag)=>{
        const matches = ReleaseService.getProvReleaseRegex().exec(releaseTag);
        return exists(matches) && matches.length > 0;
    },
    isNonRelease: (releaseTag)=>{
        const regexLatestProv = new RegExp(`^${LATEST_AND_PROVISIONAL}$`, 'i');
        const regexProv = new RegExp(`^${PROVISIONAL_RELEASE}$`, 'i');
        const matchesLatestProv = regexLatestProv.exec(releaseTag);
        const matchesProv = regexProv.exec(releaseTag);
        const isLatestProv = exists(matchesLatestProv) && matchesLatestProv.length > 0;
        const isProv = exists(matchesProv) && matchesProv.length > 0;
        return isLatestProv || isProv;
    },
    isProv: (releaseTag)=>{
        if (!isStringNonEmpty(releaseTag)) {
            return true;
        }
        const regexProv = new RegExp(`^${PROVISIONAL_RELEASE}$`, 'i');
        const matchesProv = regexProv.exec(releaseTag);
        return exists(matchesProv) && matchesProv.length > 0;
    },
    isInternalReleaseLike: (release)=>{
        let isLike = true;
        // eslint-disable-next-line no-restricted-syntax
        for(const p in ReleaseProps){
            if (Object.prototype.hasOwnProperty.call(ReleaseProps, p)) {
                if (!(p in release)) {
                    isLike = false;
                    break;
                }
            }
        }
        return isLike;
    },
    sortReleases: (unsortedReleases)=>{
        const releases = [
            ...unsortedReleases
        ];
        if (existsNonEmpty(releases) && releases.length > 1) {
            releases.sort((a, b)=>a.generationDate < b.generationDate ? 1 : -1);
        }
        return releases;
    },
    getMostRecentReleaseTag: (releases)=>{
        if (!existsNonEmpty(releases)) {
            return null;
        }
        const sorted = ReleaseService.sortReleases(releases).filter((releaseLike)=>!ReleaseService.isLatestNonProv(releaseLike.release) && !(LATEST_AND_PROVISIONAL.localeCompare(releaseLike.release) === 0) && !(PROVISIONAL_RELEASE.localeCompare(releaseLike.release) === 0));
        if (!existsNonEmpty(sorted)) {
            return null;
        }
        return sorted[0].release;
    },
    applyUserReleases: (neonContextState, currentReleases)=>{
        const userReleases = NeonContextService.getContextUserReleases(neonContextState);
        if (!Array.isArray(currentReleases) || !Array.isArray(userReleases)) {
            return [];
        }
        const combinedReleases = [];
        currentReleases.forEach((release)=>{
            let r;
            // Ensure we don't override any current releases that have been
            // initialized as internal release representations.
            if (ReleaseService.isInternalReleaseLike(release)) {
                r = {
                    ...release,
                    release: release.release,
                    generationDate: exists(release.generationDate) ? new Date(release.generationDate).toISOString() : new Date().toISOString()
                };
            } else {
                r = {
                    ...release,
                    release: release.release,
                    description: release.release,
                    generationDate: exists(release.generationDate) ? new Date(release.generationDate).toISOString() : new Date().toISOString(),
                    showCitation: true,
                    showDoi: true,
                    showViz: true
                };
            }
            combinedReleases.push(r);
        });
        userReleases.forEach((userRelease)=>{
            const hasRelease = currentReleases.some((value)=>exists(value) && isStringNonEmpty(value.release) && isStringNonEmpty(userRelease.releaseTag) && value.release.localeCompare(userRelease.releaseTag) === 0);
            if (!hasRelease) {
                const r = {
                    ...userRelease,
                    release: userRelease.releaseTag,
                    description: userRelease.description,
                    generationDate: exists(userRelease.generationDate) ? new Date(userRelease.generationDate).toISOString() : new Date().toISOString(),
                    showCitation: false,
                    showDoi: false,
                    showViz: true
                };
                combinedReleases.push(r);
            }
        });
        return combinedReleases;
    },
    transformDoiStatusRelease: (doiStatus)=>{
        if (!exists(doiStatus)) {
            return null;
        }
        const appliedDoiStatus = doiStatus;
        const transformed = {
            url: '',
            productDoi: {
                url: appliedDoiStatus.url,
                generationDate: appliedDoiStatus.generationDate
            },
            release: appliedDoiStatus.release,
            generationDate: appliedDoiStatus.releaseGenerationDate,
            description: appliedDoiStatus.release,
            showCitation: true,
            showDoi: true,
            showViz: exists(appliedDoiStatus.status) && appliedDoiStatus.status === DoiStatusType.FINDABLE
        };
        return transformed;
    },
    determineDelineateAvaRelease: (releaseTag)=>!isStringNonEmpty(releaseTag) || releaseTag === LATEST_AND_PROVISIONAL || ReleaseService.isLatestNonProv(releaseTag)
};
export default ReleaseService;
