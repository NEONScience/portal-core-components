import { z } from 'zod';
import { isStringNonEmpty } from '../util/typeUtil';
import { Nullable } from './core';

const transformStringToFloat = (
  val: string|null|undefined,
  ctx: z.RefinementCtx,
): Nullable<number> => {
  if (!isStringNonEmpty(val)) return null;
  return parseFloat(val as string);
};

const sensorPositionV1Schema = z.object({
  'HOR.VER': z.string(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  start: z.string().optional().nullable(),
  end: z.string().optional().nullable(),
  referenceName: z.string().optional().nullable(),
  referenceDescription: z.string().optional().nullable(),
  referenceStart: z.string().optional().nullable(),
  referenceEnd: z.string().optional().nullable(),
  xOffset: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  yOffset: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  zOffset: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  pitch: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  roll: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  azimuth: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  referenceLatitude: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  referenceLongitude: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  referenceElevation: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  eastOffset: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  northOffset: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  xAzimuth: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  yAzimuth: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
});
const sensorPositionV2Schema = z.object({
  'HOR.VER': z.string(),
  sensorLocationID: z.string(),
  sensorLocationDescription: z.string().nullable(),
  positionStartDateTime: z.string().nullable(),
  positionEndDateTime: z.string().nullable(),
  referenceLocationID: z.string().optional().nullable(),
  referenceLocationIDDescription: z.string().optional().nullable(),
  referenceLocationIDStartDateTime: z.string().optional().nullable(),
  referenceLocationIDEndDateTime: z.string().optional().nullable(),
  xOffset: z.string().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  yOffset: z.string().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  zOffset: z.string().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  pitch: z.string().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  roll: z.string().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  azimuth: z.string().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  locationReferenceLatitude: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  locationReferenceLongitude: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  locationReferenceElevation: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  eastOffset: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  northOffset: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  xAzimuth: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
  yAzimuth: z.string().optional().nullable()
    .transform(transformStringToFloat)
    .nullable(),
});

export type SensorPositionV1Type = z.infer<typeof sensorPositionV1Schema>;
export type SensorPositionV2Type = z.infer<typeof sensorPositionV2Schema>;

export {
  sensorPositionV1Schema,
  sensorPositionV2Schema,
};
