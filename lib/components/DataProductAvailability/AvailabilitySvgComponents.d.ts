export function SvgDefs(): React.JSX.Element;
export const CELL_ATTRS: {
    available: {
        stroke: null;
        strokeWidth: null;
        width: string;
        height: string;
        rx: string;
        nudge: number;
        fill: string;
    };
    'available-provisional': {
        strokeWidth: string;
        width: string;
        height: string;
        rx: string;
        nudge: number;
        fill: string;
        stroke: string;
    };
    'mixed-available-provisional': {
        strokeWidth: string;
        width: string;
        height: string;
        rx: string;
        nudge: number;
        fill: string;
        stroke: string;
    };
    'not available': {
        stroke: null;
        strokeWidth: null;
        width: string;
        height: string;
        rx: string;
        nudge: number;
        fill: string;
    };
    tombstoned: {
        stroke: null;
        strokeWidth: null;
        width: string;
        height: string;
        rx: string;
        nudge: number;
        fill: string;
    };
    'not collected': {
        stroke: null;
        strokeWidth: null;
        width: string;
        height: string;
        rx: string;
        nudge: number;
        fill: string;
    };
    expected: {
        strokeWidth: string;
        width: string;
        height: string;
        rx: string;
        nudge: number;
        fill: string;
        stroke: string;
    };
    tentative: {
        strokeWidth: string;
        width: string;
        height: string;
        rx: string;
        nudge: number;
        fill: string;
        stroke: string;
    };
    'not expected': {
        strokeWidth: string;
        width: string;
        height: string;
        rx: string;
        nudge: number;
        fill: string;
        stroke: string;
    };
    'being processed': {
        strokeWidth: string;
        width: string;
        height: string;
        rx: string;
        nudge: number;
        fill: string;
        stroke: string;
    };
    delayed: {
        strokeWidth: string;
        width: string;
        height: string;
        rx: string;
        nudge: number;
        fill: string;
        stroke: string;
    };
    'mixed some availability': {
        strokeWidth: string;
        width: string;
        height: string;
        rx: string;
        nudge: number;
        fill: string;
        stroke: string;
    };
    'mixed no availability': {
        strokeWidth: string;
        width: string;
        height: string;
        rx: string;
        nudge: number;
        fill: string;
        stroke: string;
    };
};
export function JsxCell(props: any): React.JSX.Element;
export namespace JsxCell {
    namespace propTypes {
        let status: PropTypes.Validator<string>;
        let x: PropTypes.Requireable<number>;
        let y: PropTypes.Requireable<number>;
    }
    namespace defaultProps {
        let x_1: number;
        export { x_1 as x };
        let y_1: number;
        export { y_1 as y };
    }
}
import React from 'react';
import PropTypes from 'prop-types';
