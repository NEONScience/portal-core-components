import { Nullable } from './core';
export interface IReleaseLike {
    release: string;
    generationDate: string;
}
export interface Release extends IReleaseLike {
    description: string;
    showCitation: boolean;
    showDoi: boolean;
    showViz: boolean;
}
export interface CitationBundleState {
    parentCodes: string[];
    doiProductCode: Nullable<string>;
}
