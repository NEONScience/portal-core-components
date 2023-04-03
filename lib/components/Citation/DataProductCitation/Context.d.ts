import React, { Dispatch } from 'react';
import { AnyAction, Nullable, Undef } from '../../../types/core';
import { DataProductCitationState } from './State';
export interface ProviderProps {
    productCode?: string;
    release?: Nullable<string>;
    contextControlled?: boolean;
    children?: React.ReactNode | React.ReactNode[];
}
declare const DataProductCitationContext: {
    Provider: React.FC<ProviderProps>;
    useDataProductCitationContextState: () => DataProductCitationState;
    useDataProductCitationContextDispatch: () => Undef<Dispatch<AnyAction>>;
};
export default DataProductCitationContext;
