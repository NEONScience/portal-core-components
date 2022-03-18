import { Nullable } from './core';

export interface IReleaseLike {
  release: string;
  generationDate: string;
}

export enum ReleaseProps {
  description = 'description',
  showCitation = 'showCitation',
  showDoi = 'showDoi',
  showViz = 'showViz',
}

export interface Release extends IReleaseLike {
  [ReleaseProps.description]: string;
  [ReleaseProps.showCitation]: boolean;
  [ReleaseProps.showDoi]: boolean;
  [ReleaseProps.showViz]: boolean;
}

export interface CitationBundleState {
  parentCodes: string[];
  doiProductCode: Nullable<string>;
}
