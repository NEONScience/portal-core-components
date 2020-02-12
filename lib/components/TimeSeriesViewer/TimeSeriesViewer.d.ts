declare function TimeSeriesViewer(props: any): JSX.Element;
declare namespace TimeSeriesViewer {
    export const propTypes: {
        productCode: (props: any, propName: any, componentName: any) => Error | null;
        productData: (props: any, propName: any, componentName: any) => Error | null;
    };
    export const defaultProps: {
        productCode: null;
        productData: null;
    };
}
export default TimeSeriesViewer;
