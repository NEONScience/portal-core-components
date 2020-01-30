export default NeonPage;
declare function NeonPage(props: any): JSX.Element;
declare namespace NeonPage {
    export namespace propTypes {
        export const breadcrumbs: PropTypes.Requireable<(PropTypes.InferProps<{
            name: PropTypes.Validator<string>;
            href: PropTypes.Requireable<string>;
        }> | null | undefined)[]>;
        export const title: PropTypes.Requireable<string>;
        export const loading: PropTypes.Requireable<string>;
        export const progress: PropTypes.Requireable<number>;
        export const error: PropTypes.Requireable<string>;
        export const notification: PropTypes.Requireable<string>;
        export const children: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
    }
    export namespace defaultProps {
        const breadcrumbs_1: never[];
        export { breadcrumbs_1 as breadcrumbs };
        const title_1: null;
        export { title_1 as title };
        const loading_1: null;
        export { loading_1 as loading };
        const progress_1: null;
        export { progress_1 as progress };
        const error_1: null;
        export { error_1 as error };
        const notification_1: null;
        export { notification_1 as notification };
    }
}
import PropTypes from "prop-types";
