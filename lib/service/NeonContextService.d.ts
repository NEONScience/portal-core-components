import { UserRelease } from '../types/neonContext';
export interface INeonContextService {
    /**
     * Gets the set of user accessible releases for the currently
     * authenticated user.
     * @param neonContextState The context state to retrieve from
     * @return The set of user accessible releases
     */
    getContextUserReleases: (neonContextState: any) => UserRelease[];
}
declare const NeonContextService: INeonContextService;
export default NeonContextService;
