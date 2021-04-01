export function NeonErrorPage(props: any): JSX.Element;
export namespace NeonErrorPage {
    export namespace propTypes {
        export const error: PropTypes.Validator<PropTypes.InferProps<{
            message: PropTypes.Validator<string>;
            stack: PropTypes.Requireable<string>;
        }>>;
        export const resetErrorBoundary: PropTypes.Validator<(...args: any[]) => any>;
    }
}
export default NeonPage;
import PropTypes from "prop-types";
declare function NeonPage(props: any): JSX.Element;
declare namespace NeonPage {
    export namespace propTypes_1 {
        export const breadcrumbHomeHref: PropTypes.Requireable<string>;
        export const breadcrumbs: PropTypes.Requireable<(PropTypes.InferProps<{
            name: PropTypes.Validator<string>;
            href: PropTypes.Requireable<string>;
        }> | null | undefined)[]>;
        export const customHeader: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        export const customFooter: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        const error_1: PropTypes.Requireable<string>;
        export { error_1 as error };
        export const loading: PropTypes.Requireable<string>;
        export const notification: PropTypes.Requireable<string>;
        export const outerPageContainerMaxWidth: PropTypes.Requireable<string>;
        export const progress: PropTypes.Requireable<number>;
        export const resetStateAfterRuntimeError: PropTypes.Requireable<(...args: any[]) => any>;
        export { children as sidebarContent };
        export const sidebarContainerClassName: PropTypes.Requireable<string>;
        export const sidebarLinks: PropTypes.Requireable<(PropTypes.InferProps<{
            name: PropTypes.Validator<string>;
            pageTitle: PropTypes.Requireable<string>;
            hash: PropTypes.Requireable<string>;
            icon: PropTypes.Requireable<object>;
            component: PropTypes.Requireable<object>;
        }> | null | undefined)[]>;
        export { children as sidebarLinksAdditionalContent };
        export const sidebarLinksAsStandaloneChildren: PropTypes.Requireable<boolean>;
        export const sidebarSubtitle: PropTypes.Requireable<string>;
        export const sidebarTitle: PropTypes.Requireable<string>;
        export const sidebarWidth: PropTypes.Requireable<number>;
        export const sidebarUnsticky: PropTypes.Requireable<boolean>;
        export const subtitle: PropTypes.Requireable<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
        export const title: PropTypes.Requireable<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
        export const unstickyDrupalHeader: PropTypes.Requireable<boolean>;
        export const NeonContextProviderProps: PropTypes.Requireable<PropTypes.InferProps<{
            children: PropTypes.Requireable<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
            fetchPartials: PropTypes.Requireable<boolean>;
            useCoreAuth: PropTypes.Requireable<boolean>;
            whenFinal: PropTypes.Requireable<(...args: any[]) => any>;
        }>>;
        const children_1: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
        export { children_1 as children };
    }
    export { propTypes_1 as propTypes };
    export namespace defaultProps {
        const breadcrumbHomeHref_1: string;
        export { breadcrumbHomeHref_1 as breadcrumbHomeHref };
        const breadcrumbs_1: never[];
        export { breadcrumbs_1 as breadcrumbs };
        const customHeader_1: null;
        export { customHeader_1 as customHeader };
        const customFooter_1: null;
        export { customFooter_1 as customFooter };
        const error_2: null;
        export { error_2 as error };
        const loading_1: null;
        export { loading_1 as loading };
        const notification_1: null;
        export { notification_1 as notification };
        const outerPageContainerMaxWidth_1: string;
        export { outerPageContainerMaxWidth_1 as outerPageContainerMaxWidth };
        const progress_1: null;
        export { progress_1 as progress };
        export function resetStateAfterRuntimeError_1(): void;
        export { resetStateAfterRuntimeError_1 as resetStateAfterRuntimeError };
        export const sidebarContent: null;
        const sidebarContainerClassName_1: null;
        export { sidebarContainerClassName_1 as sidebarContainerClassName };
        const sidebarLinks_1: null;
        export { sidebarLinks_1 as sidebarLinks };
        export const sidebarLinksAdditionalContent: null;
        const sidebarLinksAsStandaloneChildren_1: boolean;
        export { sidebarLinksAsStandaloneChildren_1 as sidebarLinksAsStandaloneChildren };
        const sidebarSubtitle_1: null;
        export { sidebarSubtitle_1 as sidebarSubtitle };
        const sidebarTitle_1: null;
        export { sidebarTitle_1 as sidebarTitle };
        const sidebarWidth_1: number;
        export { sidebarWidth_1 as sidebarWidth };
        const sidebarUnsticky_1: boolean;
        export { sidebarUnsticky_1 as sidebarUnsticky };
        const subtitle_1: null;
        export { subtitle_1 as subtitle };
        const title_1: null;
        export { title_1 as title };
        const unstickyDrupalHeader_1: boolean;
        export { unstickyDrupalHeader_1 as unstickyDrupalHeader };
        const NeonContextProviderProps_1: {};
        export { NeonContextProviderProps_1 as NeonContextProviderProps };
    }
}
declare const children: PropTypes.Requireable<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
