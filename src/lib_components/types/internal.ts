import { Nullable } from './core';

export interface IDataProductLike {
  productCode: string;
  productName: string;
}

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
  doiProductCode: Nullable<string|string[]>;
}

export interface SensorPosition {
  horVer: string;
  sensorName: string;
  sensorDescription: Nullable<string>;
  sensorStartDateTime: Nullable<string>;
  sensorEndDateTime: Nullable<string>;
  referenceLocationName: Nullable<string>;
  referenceLocationDescription: Nullable<string>;
  referenceLocationStartDateTime: Nullable<string>;
  referenceLocationEndDateTime: Nullable<string>;
  xOffset: Nullable<number>;
  yOffset: Nullable<number>;
  zOffset: Nullable<number>;
  pitch: Nullable<number>;
  roll: Nullable<number>;
  azimuth: Nullable<number>;
  referenceLocationLatitude: Nullable<number>;
  referenceLocationLongitude: Nullable<number>;
  referenceLocationElevation: Nullable<number>;
  eastOffset: Nullable<number>;
  northOffset: Nullable<number>;
  xAzimuth: Nullable<number>;
  yAzimuth: Nullable<number>;
}
