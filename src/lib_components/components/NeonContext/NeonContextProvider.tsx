import React from 'react';

import NeonAuthContext from './NeonAuthContext';
import NeonContext from './NeonContext';
import NeonPageAssetsContext from './NeonPageAssetsContext';

interface NeonContextProviderProps {
  children: React.ReactNode;
}

const NeonContextProvider: React.FC<NeonContextProviderProps> = (
  props: NeonContextProviderProps,
): React.JSX.Element => {
  const { children }: NeonContextProviderProps = props;
  return (
    <NeonContext.Provider>
      <NeonPageAssetsContext.Provider fetchPartials>
        <NeonAuthContext.Provider>
          {children}
        </NeonAuthContext.Provider>
      </NeonPageAssetsContext.Provider>
    </NeonContext.Provider>
  );
};

export default NeonContextProvider;
