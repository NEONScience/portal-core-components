"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sensorPositionV2Schema = exports.sensorPositionV1Schema = void 0;
var _zod = require("zod");
var _typeUtil = require("../util/typeUtil");
var transformStringToFloat = function transformStringToFloat(val, ctx) {
  if (!(0, _typeUtil.isStringNonEmpty)(val)) return null;
  return parseFloat(val);
};
var sensorPositionV1Schema = _zod.z.object({
  'HOR.VER': _zod.z.string(),
  name: _zod.z.string().optional().nullable(),
  description: _zod.z.string().optional().nullable(),
  start: _zod.z.string().optional().nullable(),
  end: _zod.z.string().optional().nullable(),
  referenceName: _zod.z.string().optional().nullable(),
  referenceDescription: _zod.z.string().optional().nullable(),
  referenceStart: _zod.z.string().optional().nullable(),
  referenceEnd: _zod.z.string().optional().nullable(),
  xOffset: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  yOffset: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  zOffset: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  pitch: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  roll: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  azimuth: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  referenceLatitude: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  referenceLongitude: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  referenceElevation: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  eastOffset: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  northOffset: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  xAzimuth: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  yAzimuth: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable()
});
exports.sensorPositionV1Schema = sensorPositionV1Schema;
var sensorPositionV2Schema = _zod.z.object({
  'HOR.VER': _zod.z.string(),
  sensorLocationID: _zod.z.string(),
  sensorLocationDescription: _zod.z.string().nullable(),
  positionStartDateTime: _zod.z.string().nullable(),
  positionEndDateTime: _zod.z.string().nullable(),
  referenceLocationID: _zod.z.string().optional().nullable(),
  referenceLocationIDDescription: _zod.z.string().optional().nullable(),
  referenceLocationIDStartDateTime: _zod.z.string().optional().nullable(),
  referenceLocationIDEndDateTime: _zod.z.string().optional().nullable(),
  xOffset: _zod.z.string().nullable().transform(transformStringToFloat).nullable(),
  yOffset: _zod.z.string().nullable().transform(transformStringToFloat).nullable(),
  zOffset: _zod.z.string().nullable().transform(transformStringToFloat).nullable(),
  pitch: _zod.z.string().nullable().transform(transformStringToFloat).nullable(),
  roll: _zod.z.string().nullable().transform(transformStringToFloat).nullable(),
  azimuth: _zod.z.string().nullable().transform(transformStringToFloat).nullable(),
  locationReferenceLatitude: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  locationReferenceLongitude: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  locationReferenceElevation: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  eastOffset: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  northOffset: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  xAzimuth: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable(),
  yAzimuth: _zod.z.string().optional().nullable().transform(transformStringToFloat).nullable()
});
exports.sensorPositionV2Schema = sensorPositionV2Schema;