const NeonContextService = {
    getContextUserReleases: (neonContextState)=>neonContextState?.auth?.userData?.data?.releases || []
};
export default NeonContextService;
