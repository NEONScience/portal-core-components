export const requiredEnvironmentVars: string[];
export const optionalEnvironmentVars: string[];
export default NeonEnvironment;
declare namespace NeonEnvironment {
    export const isValid: boolean;
    export const isDevEnv: boolean;
    export const isProdEnv: boolean;
    export const isForeignEnv: boolean;
    export const useGraphql: boolean;
    export const showAopViewer: boolean;
    export const preventSilentAuth: boolean;
    export const preventSilentAuthBrowser: boolean;
    export function getApiName(): import("../../types/core").Undef<string>;
    export function getApiVersion(): import("../../types/core").Undef<string>;
    export function getRootApiPath(): string;
    export function getRootGraphqlPath(): import("../../types/core").Undef<string>;
    export function getRootJsonLdPath(): string;
    export function getRootAuthApiPath(): import("../../types/core").Undef<string>;
    export namespace getApiPath {
        export function aopDownload(): import("../../types/core").Undef<string>;
        export function data(): import("../../types/core").Undef<string>;
        export function documents(): import("../../types/core").Undef<string>;
        export function download(): import("../../types/core").Undef<string>;
        export function manifest(): import("../../types/core").Undef<string>;
        export function menu(): import("../../types/core").Undef<string>;
        export function products(): import("../../types/core").Undef<string>;
        export function sites(): import("../../types/core").Undef<string>;
        export function locations(): import("../../types/core").Undef<string>;
        export function arcgisAssets(): string;
    }
    export namespace getApiLdPath {
        export function repo(): import("../../types/core").Undef<string>;
    }
    export namespace getPagePath {
        export function fileNamingConventions(): import("../../types/core").Undef<string>;
    }
    export namespace getAuthPath {
        export function login(): import("../../types/core").Undef<string>;
        export function logout(): import("../../types/core").Undef<string>;
        export function userInfo(): import("../../types/core").Undef<string>;
        export function seamlessLogin(): string;
        export function silentLogin(): string;
        export function silentLogout(): string;
    }
    export namespace getAuthApiPath {
        export function ws(): import("../../types/core").Undef<string>;
    }
    export namespace authTopics {
        export function getAuth0(): import("../../types/core").Undef<string>;
    }
    export function getVisusProductsBaseUrl(): import("../../types/core").Undef<string>;
    export function getVisusIframeBaseUrl(): import("../../types/core").Undef<string>;
    export function getRouterBasePath(): import("../../types/core").Undef<string>;
    export function getRouterBaseHomePath(): import("../../types/core").Undef<string>;
    export function getHostOverride(): import("../../types/core").Undef<string>;
    export function getWsHostOverride(): import("../../types/core").Undef<string>;
    export namespace route {
        export function account(): string;
        export function getFullRoute(route: any): string;
        export function buildRouteFromHost(route: any): string;
        export function buildAccountRoute(): string;
    }
    export function getNeonServerData(): Object;
    export function getHost(): import("../../types/core").Undef<string>;
    export function getWebSocketHost(): import("../../types/core").Undef<string>;
    export function getApiTokenHeader(): string;
    export function getApiToken(): string;
    export function getFullApiPath(path?: string): string;
    export function getFullJsonLdApiPath(path?: string): string;
    export function getFullPagePath(path?: string): string;
    export function getFullAuthPath(path?: string): string;
    export function getFullAuthApiPath(path?: string, useWs?: boolean): string;
    export function getFullGraphqlPath(): string;
}
