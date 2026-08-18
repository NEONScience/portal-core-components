import { UserRelease } from '../types/neonContext';

export interface INeonAuthContextService {
  /**
   * Gets the set of user accessible releases for the currently
   * authenticated user.
   * @param neonAuthContextState The auth context state to retrieve from
   * @return The set of user accessible releases
   */
  getAuthContextUserReleases: (neonAuthContextState: any) => UserRelease[];
}

const NeonAuthContextService: INeonAuthContextService = {
  getAuthContextUserReleases: (neonAuthContextState: any): UserRelease[] => (
    neonAuthContextState?.auth?.userData?.data?.releases || []
  ),
};

export default NeonAuthContextService;
