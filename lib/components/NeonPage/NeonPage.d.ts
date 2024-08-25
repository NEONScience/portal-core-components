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
declare function NeonPage(inProps: any): React.JSX.Element;
declare namespace NeonPage {
    export namespace propTypes_1 {
        export let breadcrumbHomeHref: PropTypes.Requireable<string>;
        export let breadcrumbs: PropTypes.Requireable<(PropTypes.InferProps<{
            name: PropTypes.Validator<string>;
            href: PropTypes.Requireable<string>;
        }> | null | undefined)[]>;
        export let customHeader: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        export let customFooter: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        export let customizeAuthContainer: PropTypes.Requireable<boolean>;
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
}
declare const children: PropTypes.Requireable<NonNullable<PropTypes.ReactNodeLike>>;
