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
    export function getApiName(): string | undefined;
    export function getApiVersion(): string | undefined;
    export function getRootApiPath(): string;
    export function getRootGraphqlPath(): string | undefined;
    export function getRootJsonLdPath(): string;
    export namespace getApiPath {
        export function aopDownload(): string | undefined;
        export function data(): string | undefined;
        export function documents(): string | undefined;
        export function download(): string | undefined;
        export function manifest(): string | undefined;
        export function menu(): string | undefined;
        export function products(): string | undefined;
        export function sites(): string | undefined;
    }
    export namespace getPagePath {
        export function fileNamingConventions(): string | undefined;
    }
    export namespace getAuthPath {
        export function login(): string | undefined;
        export function logout(): string | undefined;
        export function userInfo(): string | undefined;
    }
    export function getVisusProductsBaseUrl(): string | undefined;
    export function getVisusIframeBaseUrl(): string | undefined;
    export function getRouterBasePath(): string | undefined;
    export function getRouterBaseHomePath(): string | undefined;
    export function getHostOverride(): string | undefined;
    export function getNeonServerData(): Object;
    export function getHost(): string | undefined;
    export function getApiTokenHeader(): string;
    export function getApiToken(): string;
    export function getFullApiPath(path?: string): string;
    export function getFullJsonLdApiPath(path?: string): string;
    export function getFullPagePath(path?: string): string;
    export function getFullAuthPath(path?: string): string;
    export function getFullGraphqlPath(): string;
}
