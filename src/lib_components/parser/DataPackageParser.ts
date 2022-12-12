import { exists, isStringNonEmpty } from '../util/typeUtil';
import { Nullable, UnknownRecord } from '../types/core';
import { SensorPosition } from '../types/internal';
import {
  sensorPositionV2Schema,
  sensorPositionV1Schema,
  SensorPositionV2Type,
  SensorPositionV1Type,
} from '../types/neonDataPackage';

export interface IDataPackageParser {
  /**
   * Parse a data package sensor position record into an
   * internal shape based on detected schema version.
   * @param position The position to parse
   * @returns The parsed position to an internal, normalized shape.
   */
  parseSensorPosition: (position: Nullable<UnknownRecord>) => Nullable<SensorPosition>;
}

const DataPackageParser: IDataPackageParser = {
  parseSensorPosition: (position: Nullable<UnknownRecord>): Nullable<SensorPosition> => {
    if (!exists(position)) {
      return null;
    }
    let result: Nullable<SensorPosition> = null;
    const resultV2 = sensorPositionV2Schema.safeParse(position);
    if (!resultV2.success) {
      // Check for v1 schema
      const resultV1 = sensorPositionV1Schema.safeParse(position);
      if (!resultV1.success) {
        const v2ErrorFormat = resultV2.error.format();
        const v1ErrorFormat = resultV1.error.format();
        // eslint-disable-next-line no-console
        console.error('Failed to detect sensor position schema', v2ErrorFormat, v1ErrorFormat);
      } else {
        const parsedV1: SensorPositionV1Type = resultV1.data;
        result = {
          horVer: parsedV1['HOR.VER'],
          sensorName: isStringNonEmpty(parsedV1.name) ? parsedV1.name as string : 'N/A',
          sensorDescription: parsedV1.description,
          sensorStartDateTime: parsedV1.start,
          sensorEndDateTime: parsedV1.end,
          referenceLocationName: parsedV1.referenceName,
          referenceLocationDescription: parsedV1.referenceDescription,
          referenceLocationStartDateTime: parsedV1.referenceStart,
          referenceLocationEndDateTime: parsedV1.referenceEnd,
          xOffset: parsedV1.xOffset,
          yOffset: parsedV1.yOffset,
          zOffset: parsedV1.zOffset,
          pitch: parsedV1.pitch,
          roll: parsedV1.roll,
          azimuth: parsedV1.azimuth,
          referenceLocationLatitude: parsedV1.referenceLatitude,
          referenceLocationLongitude: parsedV1.referenceLongitude,
          referenceLocationElevation: parsedV1.referenceElevation,
          eastOffset: parsedV1.eastOffset,
          northOffset: parsedV1.northOffset,
          xAzimuth: parsedV1.xAzimuth,
          yAzimuth: parsedV1.yAzimuth,
        };
      }
    } else {
      const parsedV2: SensorPositionV2Type = resultV2.data;
      result = {
        horVer: parsedV2['HOR.VER'],
        sensorName: parsedV2.sensorLocationID,
        sensorDescription: parsedV2.sensorLocationDescription,
        sensorStartDateTime: parsedV2.positionStartDateTime,
        sensorEndDateTime: parsedV2.positionEndDateTime,
        referenceLocationName: parsedV2.referenceLocationID,
        referenceLocationDescription: parsedV2.referenceLocationIDDescription,
        referenceLocationStartDateTime: parsedV2.referenceLocationIDStartDateTime,
        referenceLocationEndDateTime: parsedV2.referenceLocationIDEndDateTime,
        xOffset: parsedV2.xOffset,
        yOffset: parsedV2.yOffset,
        zOffset: parsedV2.zOffset,
        pitch: parsedV2.pitch,
        roll: parsedV2.roll,
        azimuth: parsedV2.azimuth,
        referenceLocationLatitude: parsedV2.locationReferenceLatitude,
        referenceLocationLongitude: parsedV2.locationReferenceLongitude,
        referenceLocationElevation: parsedV2.locationReferenceElevation,
        eastOffset: parsedV2.eastOffset,
        northOffset: parsedV2.northOffset,
        xAzimuth: parsedV2.xAzimuth,
        yAzimuth: parsedV2.yAzimuth,
      };
    }
    return result;
  },
};

Object.freeze(DataPackageParser);

export default DataPackageParser;
