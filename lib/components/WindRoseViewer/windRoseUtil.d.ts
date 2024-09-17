export const VELOCITY_BINS: string[];
export const DIRECTION_BIN_LOOKUP: {
    0: {
        angle: number;
        direction: string;
    };
    22.5: {
        angle: number;
        direction: string;
    };
    45: {
        angle: number;
        direction: string;
    };
    67.5: {
        angle: number;
        direction: string;
    };
    90: {
        angle: number;
        direction: string;
    };
    112.5: {
        angle: number;
        direction: string;
    };
    135: {
        angle: number;
        direction: string;
    };
    157.5: {
        angle: number;
        direction: string;
    };
    180: {
        angle: number;
        direction: string;
    };
    202.5: {
        angle: number;
        direction: string;
    };
    225: {
        angle: number;
        direction: string;
    };
    247.5: {
        angle: number;
        direction: string;
    };
    270: {
        angle: number;
        direction: string;
    };
    292.5: {
        angle: number;
        direction: string;
    };
    315: {
        angle: number;
        direction: string;
    };
    337.5: {
        angle: number;
        direction: string;
    };
};
export namespace WIND_ROSE_CHANGE_TYPE {
    let SITE: string;
    let MONTH: string;
    let POSITIONS: string;
}
export function parseWindRoseDataFiles(data: any, query: any): {
    dataFileUrls: never[];
    dataFileMatcher: null;
    variablesFileUrl: null;
    positions: never[];
    positionOptions: never[];
};
export function putWindRoseBin(windRoseBins: any, dirBin: any, speedValue: any): void;
export function buildWindRoseData(data: any, dataFilesInfo: any): {
    positions: any;
    positionOptions: any;
    dataStateMessage: null;
    windRoseDailyBins: {};
    currentWindRose: {};
};
