export namespace ROUTES {
    export const BASE: string | undefined;
    export const HOME: string | undefined;
    export const LOGIN: string;
    export const LOGOUT: string;
    export const ACCOUNT: string;
}
export function getHomeRoute(): string | undefined;
export function getFullRoute(route: any): string;
export function buildRouteFromHost(route: any): string;
export function buildAccountRoute(): string;
export default ROUTES;
