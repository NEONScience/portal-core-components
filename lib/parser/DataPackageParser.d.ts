import { Nullable, UnknownRecord } from '../types/core';
import { SensorPosition } from '../types/internal';
export interface IDataPackageParser {
    /**
     * Parse a data package sensor position record into an
     * internal shape based on detected schema version.
     * @param position The position to parse
     * @returns The parsed position to an internal, normalized shape.
     */
    parseSensorPosition: (position: Nullable<UnknownRecord>) => Nullable<SensorPosition>;
}
declare const DataPackageParser: IDataPackageParser;
export default DataPackageParser;
