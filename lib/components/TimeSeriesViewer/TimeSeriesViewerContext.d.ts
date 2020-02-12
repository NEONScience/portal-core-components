export default TimeSeriesViewerContext;
declare namespace TimeSeriesViewerContext {
    export { Provider };
    export { useTimeSeriesViewerState };
    export { TimeSeriesViewerPropTypes };
}
declare function Provider(props: any): JSX.Element;
declare namespace Provider {
    export namespace propTypes {
        import productCode = productCode;
        export { productCode };
        import productData = productData;
        export { productData };
        export const children: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
    }
    export namespace defaultProps {
        const productCode_1: null;
        export { productCode_1 as productCode };
        const productData_1: null;
        export { productData_1 as productData };
    }
}
declare function useTimeSeriesViewerState(): {
    status: string;
    fetchProduct: {
        status: string;
        error: null;
    };
    fetches: {};
    variables: {};
    product: {
        productCode: null;
        productName: null;
        productDescription: null;
        productSensor: null;
        dateRange: null[];
        variables: {};
        sites: {};
    };
    selection: {
        dateRange: null[];
        variables: never[];
        sites: never[];
    };
} | ((() => void) | {
    status: string;
    fetchProduct: {
        status: string;
        error: null;
    };
    fetches: {};
    variables: {};
    product: {
        productCode: null;
        productName: null;
        productDescription: null;
        productSensor: null;
        dateRange: null[];
        variables: {};
        sites: {};
    };
    selection: {
        dateRange: null[];
        variables: never[];
        sites: never[];
    };
})[];
declare namespace TimeSeriesViewerPropTypes {
    export function productCode_2(props: any, propName: any, componentName: any): Error | null;
    export { productCode_2 as productCode };
    export function productData_2(props: any, propName: any, componentName: any): Error | null;
    export { productData_2 as productData };
}
import PropTypes from "prop-types";
