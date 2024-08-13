export function NeonErrorPage(props: any): React.JSX.Element;
export namespace NeonErrorPage {
    namespace propTypes {
        let error: PropTypes.Validator<NonNullable<PropTypes.InferProps<{
            message: PropTypes.Validator<string>;
            stack: PropTypes.Requireable<string>;
        }>>>;
        let resetErrorBoundary: PropTypes.Validator<(...args: any[]) => any>;
    }
}
export default NeonPage;
import React from 'react';
import PropTypes from 'prop-types';
declare function NeonPage(props: any): React.JSX.Element;
declare namespace NeonPage {
    export namespace propTypes_1 {
        export let breadcrumbHomeHref: PropTypes.Requireable<string>;
        export let breadcrumbs: PropTypes.Requireable<(PropTypes.InferProps<{
            name: PropTypes.Validator<string>;
            href: PropTypes.Requireable<string>;
        }> | null | undefined)[]>;
        export let customHeader: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        export let customFooter: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        export let showHeaderSkeleton: PropTypes.Requireable<boolean>;
        export let showFooterSkeleton: PropTypes.Requireable<boolean>;
        let error_1: PropTypes.Requireable<string>;
        export { error_1 as error };
        export let loading: PropTypes.Requireable<string>;
        export let notification: PropTypes.Requireable<string>;
        export let outerPageContainerMaxWidth: PropTypes.Requireable<string>;
        export let progress: PropTypes.Requireable<number>;
        export let resetStateAfterRuntimeError: PropTypes.Requireable<(...args: any[]) => any>;
        export { children as sidebarContent };
        export let sidebarContentResponsive: PropTypes.Requireable<boolean>;
        export let sidebarContainerClassName: PropTypes.Requireable<string>;
        export let sidebarLinks: PropTypes.Requireable<(PropTypes.InferProps<{
            name: PropTypes.Validator<string>;
            pageTitle: PropTypes.Requireable<string>;
            hash: PropTypes.Requireable<string>;
            icon: PropTypes.Requireable<object>;
            component: PropTypes.Requireable<object>;
        }> | null | undefined)[]>;
        export { children as sidebarLinksAdditionalContent };
        export let sidebarLinksAsStandaloneChildren: PropTypes.Requireable<boolean>;
        export let sidebarSubtitle: PropTypes.Requireable<string>;
        export let sidebarTitle: PropTypes.Requireable<string>;
        export let sidebarWidth: PropTypes.Requireable<number>;
        export let sidebarUnsticky: PropTypes.Requireable<boolean>;
        export let subtitle: PropTypes.Requireable<NonNullable<NonNullable<PropTypes.ReactNodeLike> | null | undefined>>;
        export let title: PropTypes.Requireable<NonNullable<NonNullable<PropTypes.ReactNodeLike> | null | undefined>>;
        export let unstickyDrupalHeader: PropTypes.Requireable<boolean>;
        export let NeonContextProviderProps: PropTypes.Requireable<PropTypes.InferProps<{
            children: PropTypes.Requireable<NonNullable<PropTypes.ReactNodeLike>>;
            fetchPartials: PropTypes.Requireable<boolean>;
            useCoreAuth: PropTypes.Requireable<boolean>;
            whenFinal: PropTypes.Requireable<(...args: any[]) => any>;
        }>>;
        let children_1: PropTypes.Validator<NonNullable<NonNullable<PropTypes.ReactNodeLike>>>;
        export { children_1 as children };
    }
    export { propTypes_1 as propTypes };
    export namespace defaultProps {
        let breadcrumbHomeHref_1: string;
        export { breadcrumbHomeHref_1 as breadcrumbHomeHref };
        let breadcrumbs_1: never[];
        export { breadcrumbs_1 as breadcrumbs };
        let customHeader_1: null;
        export { customHeader_1 as customHeader };
        let customFooter_1: null;
        export { customFooter_1 as customFooter };
        let showHeaderSkeleton_1: boolean;
        export { showHeaderSkeleton_1 as showHeaderSkeleton };
        let showFooterSkeleton_1: boolean;
        export { showFooterSkeleton_1 as showFooterSkeleton };
        let error_2: null;
        export { error_2 as error };
        let loading_1: null;
        export { loading_1 as loading };
        let notification_1: null;
        export { notification_1 as notification };
        let outerPageContainerMaxWidth_1: string;
        export { outerPageContainerMaxWidth_1 as outerPageContainerMaxWidth };
        let progress_1: null;
        export { progress_1 as progress };
        export function resetStateAfterRuntimeError_1(): void;
        export { resetStateAfterRuntimeError_1 as resetStateAfterRuntimeError };
        export let sidebarContent: null;
        let sidebarContentResponsive_1: boolean;
        export { sidebarContentResponsive_1 as sidebarContentResponsive };
        let sidebarContainerClassName_1: null;
        export { sidebarContainerClassName_1 as sidebarContainerClassName };
        let sidebarLinks_1: null;
        export { sidebarLinks_1 as sidebarLinks };
        export let sidebarLinksAdditionalContent: null;
        let sidebarLinksAsStandaloneChildren_1: boolean;
        export { sidebarLinksAsStandaloneChildren_1 as sidebarLinksAsStandaloneChildren };
        let sidebarSubtitle_1: null;
        export { sidebarSubtitle_1 as sidebarSubtitle };
        let sidebarTitle_1: null;
        export { sidebarTitle_1 as sidebarTitle };
        let sidebarWidth_1: number;
        export { sidebarWidth_1 as sidebarWidth };
        let sidebarUnsticky_1: boolean;
        export { sidebarUnsticky_1 as sidebarUnsticky };
        let subtitle_1: null;
        export { subtitle_1 as subtitle };
        let title_1: null;
        export { title_1 as title };
        let unstickyDrupalHeader_1: boolean;
        export { unstickyDrupalHeader_1 as unstickyDrupalHeader };
        let NeonContextProviderProps_1: {};
        export { NeonContextProviderProps_1 as NeonContextProviderProps };
    }
}
declare const children: PropTypes.Requireable<NonNullable<PropTypes.ReactNodeLike>>;
