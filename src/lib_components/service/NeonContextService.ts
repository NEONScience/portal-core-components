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

const NeonContextService: INeonContextService = {
  getContextUserReleases: (neonContextState: any): UserRelease[] => (
    neonContextState?.auth?.userData?.data?.releases || []
  ),
};

export default NeonContextService;
