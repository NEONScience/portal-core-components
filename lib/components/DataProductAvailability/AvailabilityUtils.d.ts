/**
  All possible valid statuses (enhanced availability only)
*/
export const VALID_ENHANCED_STATUSES: {
    expected: {
        title: string;
        description: string;
    };
    'being processed': {
        title: string;
        description: string;
    };
    available: {
        title: string;
        description: string;
    };
    delayed: {
        title: string;
        description: string;
    };
    tentative: {
        title: string;
        description: string;
    };
    'not expected': {
        title: string;
        description: string;
    };
    'not collected': {
        title: string;
        description: string;
    };
    'not available': {
        title: string;
        description: string;
    };
    'mixed some availability': {
        title: string;
        description: string;
    };
    'mixed no availability': {
        title: string;
        description: string;
    };
};
export function calcRollupStatus(statuses?: any[]): any;
export namespace AvailabilityPropTypes {
    export const basicSiteCodes: PropTypes.Requireable<(PropTypes.InferProps<{
        siteCode: PropTypes.Validator<string>;
        availableMonths: PropTypes.Validator<import("../../types/core").Nullable<string>[]>;
        availableReleases: PropTypes.Requireable<(PropTypes.InferProps<{
            release: PropTypes.Validator<string>;
            availableMonths: PropTypes.Validator<import("../../types/core").Nullable<string>[]>;
        }> | null | undefined)[]>;
    }> | null | undefined)[]>;
    export const enhancedSites: PropTypes.Requireable<(PropTypes.InferProps<{
        siteCode: PropTypes.Validator<string>;
        tables: PropTypes.Validator<(PropTypes.InferProps<{
            name: PropTypes.Validator<string>;
            description: PropTypes.Validator<string>;
            waitInterval: PropTypes.Validator<string>;
            months: PropTypes.Validator<{
                [x: string]: import("../../types/core").Nullable<string>;
            }>;
        }> | null | undefined)[]>;
    }> | null | undefined)[]>;
}
export namespace SVG {
    export const MIN_WIDTH: number;
    export const MIN_HEIGHT: number;
    export const YEAR_MONTH_WIDTH: number;
    export const YEAR_WIDTH: number;
    export const ABS_MAX_DATA_WIDTH: number;
}
export namespace TIME {
    export const MIN_YEAR_MONTH: string;
    export const MAX_YEAR_MONTH: string;
    export const YEARS: number[];
    export const MONTHS: string[];
    export const YEAR_MONTHS: any;
}
export namespace SVG_STYLES {
    export function apply(node: any, styleName: any): void;
    export function touchRipple(selection: any, duration?: number): void;
}
import PropTypes from "prop-types";
