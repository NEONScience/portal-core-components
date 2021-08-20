// eslint-disable-next-line import/no-cycle
import DownloadDataContext from './DownloadDataContext';

/**
 * Alter the current state for valid JSON serialization. Set objects
 * must be converted to Array objects for serialization.
 * @param currentState The current state
 */
const convertStateForStorage = (state: any): any => {
  if (state.fromAOPManifest) {
    // AOP S3 Files will incur too much data to be saved in session state
    // Restore to default state in terms of s3Files and selection state.
    return {
      ...state,
      s3FileFetches: { ...DownloadDataContext.DEFAULT_STATE.s3FileFetches },
      s3FileFetchProgress: DownloadDataContext.DEFAULT_STATE.s3FileFetchProgress,
      s3Files: { ...DownloadDataContext.DEFAULT_STATE.s3Files },
      manifest: { ...DownloadDataContext.DEFAULT_STATE.manifest },
      allStepsComplete: DownloadDataContext.DEFAULT_STATE.allStepsComplete,
      sites: {
        ...state.sites,
        value: [...DownloadDataContext.DEFAULT_STATE.sites.value],
      },
    };
  }
  return state;
};

const convertAOPInitialState = (state: any, propsState: any): any => {
  if (!state.fromAOPManifest) return state;
  return {
    ...state,
    s3FileFetches: { ...propsState.s3FileFetches },
    s3FileFetchProgress: propsState.s3FileFetchProgress,
    s3Files: { ...propsState.s3Files },
    manifest: { ...propsState.manifest },
    allStepsComplete: propsState.allStepsComplete,
    policies: { ...propsState.policies },
  };
};

// eslint-disable-next-line import/prefer-default-export
export { convertStateForStorage, convertAOPInitialState };
