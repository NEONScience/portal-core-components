import React, { Dispatch } from 'react';
import { DataProductCitationState } from './State';
import { AnyAction, Nullable, Undef } from '../../../types/core';
export interface ProviderProps {
    productCode?: string;
    release?: Nullable<string>;
    contextControlled?: boolean;
    children?: React.ReactNode | React.ReactNodeArray;
}
declare const DataProductCitationContext: {
    Provider: React.FC<ProviderProps>;
    useDataProductCitationContextState: () => DataProductCitationState;
    useDataProductCitationContextDispatch: () => Undef<Dispatch<AnyAction>>;
};
export default DataProductCitationContext;
