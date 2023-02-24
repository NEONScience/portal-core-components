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
    'available-provisional': {
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
    tombstoned: {
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
    const basicSiteCodes: PropTypes.Requireable<(PropTypes.InferProps<{
        siteCode: PropTypes.Validator<string>;
        availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
        availableReleases: PropTypes.Requireable<(PropTypes.InferProps<{
            release: PropTypes.Validator<string>;
            availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
        }> | null | undefined)[]>;
    }> | null | undefined)[]>;
    const enhancedSites: PropTypes.Requireable<(PropTypes.InferProps<{
        siteCode: PropTypes.Validator<string>;
        tables: PropTypes.Validator<(PropTypes.InferProps<{
            name: PropTypes.Validator<string>;
            description: PropTypes.Validator<string>;
            waitInterval: PropTypes.Validator<string>;
            months: PropTypes.Validator<{
                [x: string]: string | null | undefined;
            }>;
        }> | null | undefined)[]>;
    }> | null | undefined)[]>;
    const dataProducts: PropTypes.Requireable<(PropTypes.InferProps<{
        dataProductCode: PropTypes.Validator<string>;
        dataProductTitle: PropTypes.Validator<string>;
        availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
        availableReleases: PropTypes.Requireable<(PropTypes.InferProps<{
            release: PropTypes.Validator<string>;
            availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
        }> | null | undefined)[]>;
    }> | null | undefined)[]>;
}
export namespace SVG {
    const MIN_WIDTH: number;
    const MIN_HEIGHT: number;
    const YEAR_MONTH_WIDTH: number;
    const YEAR_WIDTH: number;
    const ABS_MAX_DATA_WIDTH: number;
}
export namespace TIME {
    const MIN_YEAR_MONTH: string;
    const MAX_YEAR_MONTH: string;
    const YEARS: number[];
    const MONTHS: string[];
    const YEAR_MONTHS: any;
}
export namespace SVG_STYLES {
    /**
       Function: apply
       Parse an object literal style definition into d3 selection.style()
       calls to apply styles defined in the styles object literal to a node
    */
    function apply(node: any, styleName: any): void;
    /**
       Function: touchRipple
       For click interactions pass a d3 selection in and the fill will transition
       from an "active" semi-transparent orange color to near-transparent. We don't go
       full transparent as the ripple is typically followed by a delayed state update
       that will trigger a rerender and thus a full style reset.
    */
    function touchRipple(selection: any, duration?: number): void;
}
import PropTypes from "prop-types";
