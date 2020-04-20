export default DownloadDataContext;
declare namespace DownloadDataContext {
    export { Provider };
    export { useDownloadDataState };
    export { reducer };
    export { DEFAULT_STATE };
    export { ALL_STEPS };
    export { getStateObservable };
}
declare function Provider(props: any): JSX.Element;
declare namespace Provider {
    export namespace propTypes {
        export const stateObservable: PropTypes.Requireable<(...args: any[]) => any>;
        export const productData: PropTypes.Requireable<PropTypes.InferProps<{
            productCode: PropTypes.Validator<string>;
            productName: PropTypes.Validator<string>;
            siteCodes: PropTypes.Requireable<(PropTypes.InferProps<{
                siteCode: PropTypes.Validator<string>;
                availableMonths: PropTypes.Validator<import("../../types/coreTypes").Nullable<string>[]>;
            }> | null | undefined)[]>;
        }>>;
        export const availabilityView: PropTypes.Requireable<string>;
        export const sites: PropTypes.Requireable<import("../../types/coreTypes").Nullable<string>[]>;
        export const dateRange: PropTypes.Requireable<import("../../types/coreTypes").Nullable<string>[]>;
        export const documentation: PropTypes.Requireable<string>;
        export const packageType: PropTypes.Requireable<string>;
        export const children: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
    }
    export namespace defaultProps {
        const stateObservable_1: null;
        export { stateObservable_1 as stateObservable };
        const productData_1: {};
        export { productData_1 as productData };
        import availabilityView_1 = availabilityView;
        export { availabilityView_1 as availabilityView };
        import sites_1 = value;
        export { sites_1 as sites };
        import dateRange_1 = value;
        export { dateRange_1 as dateRange };
        import documentation_1 = value;
        export { documentation_1 as documentation };
        import packageType_1 = value;
        export { packageType_1 as packageType };
    }
}
declare function useDownloadDataState(): {
    downloadContextIsActive: boolean;
    broadcast: boolean;
    dialogOpen: boolean;
    awaitingHigherOrderUpdateWhenDialogOpens: boolean;
    cachedHigherOrderState: {};
    auth: {
        isAuthenticated: boolean;
        fetchStatus: string;
    };
    productData: {};
    requiredSteps: never[];
    allStepsComplete: boolean;
    fromManifest: boolean;
    fromAOPManifest: boolean;
    fromExternalHost: boolean;
    manifest: {
        status: string;
        value: null;
        error: null;
    };
    availabilityView: null;
    s3FileFetches: {};
    s3FileFetchProgress: number;
    s3Files: {
        value: never[];
        cachedValues: never[];
        validValues: never[];
        isValid: boolean;
        bytesByUrl: {};
        totalSize: number;
        estimatedPostSize: number;
        filteredFileCount: number;
        lastFilterChanged: null;
        filters: {
            site: never[];
            type: never[];
            visit: never[];
            yearMonth: never[];
        };
        valueLookups: {
            site: {};
            type: {};
            visit: {};
            yearMonth: {};
        };
        visibleColumns: string[];
    };
    sites: {
        value: never[];
        validValues: never[];
        isValid: boolean;
    };
    dateRange: {
        value: string[];
        validValues: string[];
        isValid: boolean;
    };
    documentation: {
        value: string;
        validValues: string[];
        isValid: boolean;
    };
    packageType: {
        value: null;
        validValues: string[];
        isValid: boolean;
    };
    policies: {
        value: boolean;
        validValues: null;
        isValid: boolean;
    };
} | ((() => void) | {
    requiredSteps: never[];
    downloadContextIsActive: boolean;
    broadcast: boolean;
    dialogOpen: boolean;
    awaitingHigherOrderUpdateWhenDialogOpens: boolean;
    cachedHigherOrderState: {};
    auth: {
        isAuthenticated: boolean;
        fetchStatus: string;
    };
    productData: {};
    allStepsComplete: boolean;
    fromManifest: boolean;
    fromAOPManifest: boolean;
    fromExternalHost: boolean;
    manifest: {
        status: string;
        value: null;
        error: null;
    };
    availabilityView: null;
    s3FileFetches: {};
    s3FileFetchProgress: number;
    s3Files: {
        value: never[];
        cachedValues: never[];
        validValues: never[];
        isValid: boolean;
        bytesByUrl: {};
        totalSize: number;
        estimatedPostSize: number;
        filteredFileCount: number;
        lastFilterChanged: null;
        filters: {
            site: never[];
            type: never[];
            visit: never[];
            yearMonth: never[];
        };
        valueLookups: {
            site: {};
            type: {};
            visit: {};
            yearMonth: {};
        };
        visibleColumns: string[];
    };
    sites: {
        value: never[];
        validValues: never[];
        isValid: boolean;
    };
    dateRange: {
        value: string[];
        validValues: string[];
        isValid: boolean;
    };
    documentation: {
        value: string;
        validValues: string[];
        isValid: boolean;
    };
    packageType: {
        value: null;
        validValues: string[];
        isValid: boolean;
    };
    policies: {
        value: boolean;
        validValues: null;
        isValid: boolean;
    };
})[];
declare function reducer(state: any, action: any): any;
declare namespace DEFAULT_STATE {
    export const downloadContextIsActive: boolean;
    export const broadcast: boolean;
    export const dialogOpen: boolean;
    export const awaitingHigherOrderUpdateWhenDialogOpens: boolean;
    export const cachedHigherOrderState: {};
    export namespace auth {
        export const isAuthenticated: boolean;
        export const fetchStatus: string;
    }
    const productData_2: {};
    export { productData_2 as productData };
    export const requiredSteps: never[];
    export const allStepsComplete: boolean;
    export const fromManifest: boolean;
    export const fromAOPManifest: boolean;
    export const fromExternalHost: boolean;
    export namespace manifest {
        export const status: string;
        export const value: null;
        export const error: null;
    }
    const availabilityView_2: null;
    export { availabilityView_2 as availabilityView };
    export const s3FileFetches: {};
    export const s3FileFetchProgress: number;
    export namespace s3Files {
        const value_1: never[];
        export { value_1 as value };
        export const cachedValues: never[];
        export const validValues: never[];
        export const isValid: boolean;
        export const bytesByUrl: {};
        export const totalSize: number;
        export const estimatedPostSize: number;
        export const filteredFileCount: number;
        export const lastFilterChanged: null;
        export const filters: {
            site: never[];
            type: never[];
            visit: never[];
            yearMonth: never[];
        };
        export const valueLookups: {
            site: {};
            type: {};
            visit: {};
            yearMonth: {};
        };
        export const visibleColumns: string[];
    }
    export namespace sites_2 {
        const value_2: never[];
        export { value_2 as value };
        const validValues_1: never[];
        export { validValues_1 as validValues };
        const isValid_1: boolean;
        export { isValid_1 as isValid };
    }
    export { sites_2 as sites };
    export namespace dateRange_2 {
        const value_3: string[];
        export { value_3 as value };
        const validValues_2: string[];
        export { validValues_2 as validValues };
        const isValid_2: boolean;
        export { isValid_2 as isValid };
    }
    export { dateRange_2 as dateRange };
    export namespace documentation_2 {
        const value_4: string;
        export { value_4 as value };
        const validValues_3: string[];
        export { validValues_3 as validValues };
        const isValid_3: boolean;
        export { isValid_3 as isValid };
    }
    export { documentation_2 as documentation };
    export namespace packageType_2 {
        const value_5: null;
        export { value_5 as value };
        const validValues_4: string[];
        export { validValues_4 as validValues };
        const isValid_4: boolean;
        export { isValid_4 as isValid };
    }
    export { packageType_2 as packageType };
    export namespace policies {
        const value_6: boolean;
        export { value_6 as value };
        const validValues_5: null;
        export { validValues_5 as validValues };
        const isValid_5: boolean;
        export { isValid_5 as isValid };
    }
}
declare namespace ALL_STEPS {
    export namespace documentation_3 {
        export const requiredStateKeys: string[];
        export const label: string;
        export const title: string;
    }
    export { documentation_3 as documentation };
    export namespace externalExclusive {
        const requiredStateKeys_1: never[];
        export { requiredStateKeys_1 as requiredStateKeys };
        const label_1: string;
        export { label_1 as label };
    }
    export namespace s3Files_1 {
        const requiredStateKeys_2: string[];
        export { requiredStateKeys_2 as requiredStateKeys };
        const label_2: string;
        export { label_2 as label };
        const title_1: string;
        export { title_1 as title };
    }
    export { s3Files_1 as s3Files };
    export namespace packageType_3 {
        const requiredStateKeys_3: string[];
        export { requiredStateKeys_3 as requiredStateKeys };
        const label_3: string;
        export { label_3 as label };
        const title_2: string;
        export { title_2 as title };
    }
    export { packageType_3 as packageType };
    export namespace sitesAndDateRange {
        const requiredStateKeys_4: string[];
        export { requiredStateKeys_4 as requiredStateKeys };
        const label_4: string;
        export { label_4 as label };
        const title_3: string;
        export { title_3 as title };
    }
    export namespace policies_1 {
        const requiredStateKeys_5: string[];
        export { requiredStateKeys_5 as requiredStateKeys };
        const label_5: string;
        export { label_5 as label };
        const title_4: string;
        export { title_4 as title };
    }
    export { policies_1 as policies };
    export namespace summary {
        const requiredStateKeys_6: never[];
        export { requiredStateKeys_6 as requiredStateKeys };
        const label_6: string;
        export { label_6 as label };
        const title_5: string;
        export { title_5 as title };
    }
}
declare function getStateObservable(): import("rxjs").Observable<any>;
import PropTypes from "prop-types";
