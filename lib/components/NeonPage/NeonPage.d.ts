export default NeonPage;
declare function NeonPage(props: any): JSX.Element;
declare namespace NeonPage {
    export namespace propTypes {
        export const breadcrumbs: PropTypes.Requireable<(PropTypes.InferProps<{
            name: PropTypes.Validator<string>;
            href: PropTypes.Requireable<string>;
        }> | null | undefined)[]>;
        export const error: PropTypes.Requireable<string>;
        export const loading: PropTypes.Requireable<string>;
        export const notification: PropTypes.Requireable<string>;
        export const outerPageContainerMaxWidth: PropTypes.Requireable<string>;
        export const progress: PropTypes.Requireable<number>;
        export { children as sidebarContent };
        export const sidebarContentClassName: PropTypes.Requireable<string>;
        export const sidebarLinks: PropTypes.Requireable<(PropTypes.InferProps<{
            name: PropTypes.Validator<string>;
            pageTitle: PropTypes.Requireable<string>;
            hash: PropTypes.Requireable<string>;
            icon: PropTypes.Requireable<object>;
            component: PropTypes.Requireable<object>;
        }> | null | undefined)[]>;
        export const sidebarLinksAsStandaloneChildren: PropTypes.Requireable<boolean>;
        export const sidebarSubtitle: PropTypes.Requireable<string>;
        export const sidebarTitle: PropTypes.Requireable<string>;
        export const sidebarWidth: PropTypes.Requireable<number>;
        export const subtitle: PropTypes.Requireable<string>;
        export const title: PropTypes.Requireable<string>;
        export const useCoreHeader: PropTypes.Requireable<boolean>;
        export const unstickyDrupalHeader: PropTypes.Requireable<boolean>;
        const children_1: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
        export { children_1 as children };
    }
    export namespace defaultProps {
        const breadcrumbs_1: never[];
        export { breadcrumbs_1 as breadcrumbs };
        const error_1: null;
        export { error_1 as error };
        const loading_1: null;
        export { loading_1 as loading };
        const notification_1: null;
        export { notification_1 as notification };
        const outerPageContainerMaxWidth_1: string;
        export { outerPageContainerMaxWidth_1 as outerPageContainerMaxWidth };
        const progress_1: null;
        export { progress_1 as progress };
        export const sidebarContent: null;
        const sidebarContentClassName_1: null;
        export { sidebarContentClassName_1 as sidebarContentClassName };
        const sidebarLinks_1: null;
        export { sidebarLinks_1 as sidebarLinks };
        const sidebarLinksAsStandaloneChildren_1: boolean;
        export { sidebarLinksAsStandaloneChildren_1 as sidebarLinksAsStandaloneChildren };
        const sidebarSubtitle_1: null;
        export { sidebarSubtitle_1 as sidebarSubtitle };
        const sidebarTitle_1: null;
        export { sidebarTitle_1 as sidebarTitle };
        const sidebarWidth_1: number;
        export { sidebarWidth_1 as sidebarWidth };
        const subtitle_1: null;
        export { subtitle_1 as subtitle };
        const title_1: null;
        export { title_1 as title };
        const useCoreHeader_1: boolean;
        export { useCoreHeader_1 as useCoreHeader };
        const unstickyDrupalHeader_1: boolean;
        export { unstickyDrupalHeader_1 as unstickyDrupalHeader };
    }
}
import PropTypes from "prop-types";
declare const children: PropTypes.Requireable<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
