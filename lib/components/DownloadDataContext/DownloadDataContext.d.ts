export default DownloadDataContext;
export function getTestableItems(): {
    productDataIsValid?: undefined;
    yearMonthIsValid?: undefined;
    newStateIsAllowable?: undefined;
    newStateIsValid?: undefined;
    mutateNewStateIntoRange?: undefined;
    estimatePostSize?: undefined;
    getValidValuesFromProductData?: undefined;
    getInitialStateFromProps?: undefined;
    getS3FilesFilteredFileCount?: undefined;
    getAndValidateNewS3FilesState?: undefined;
    regenerateS3FilesFiltersAndValidValues?: undefined;
    getAndValidateNewState?: undefined;
    ALL_POSSIBLE_VALID_DATE_RANGE?: undefined;
    ALL_POSSIBLE_VALID_DOCUMENTATION?: undefined;
    ALL_POSSIBLE_VALID_PACKAGE_TYPE?: undefined;
    ALL_POSSIBLE_VALID_PROVISIONAL_DATA?: undefined;
} | {
    productDataIsValid: (productData: any) => boolean;
    yearMonthIsValid: (yearMonth?: string) => boolean;
    newStateIsAllowable: (key: any, value: any) => boolean;
    newStateIsValid: (key: any, value: any, validValues?: any[]) => any;
    mutateNewStateIntoRange: (key: any, value: any, validValues?: any[]) => any;
    estimatePostSize: (s3FilesState: any, sitesState: any) => any;
    getValidValuesFromProductData: (productData: any, key: any) => any;
    getInitialStateFromProps: (props: any) => {
        availabilityView: any;
        productData: any;
        downloadContextIsActive: boolean;
        broadcast: boolean;
        dialogOpen: boolean;
        awaitingHigherOrderUpdateWhenDialogOpens: boolean;
        cachedHigherOrderState: {};
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
        s3FileFetches: {};
        s3FileFetchProgress: number;
        s3Files: {
            maxNumFilesSelected: number;
            value: never[];
            valueMap: {};
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
        latestRelease: null;
        release: {
            value: null;
            validValues: never[];
            isValid: boolean;
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
        provisionalData: {
            value: string;
            validValues: string[];
            isValid: boolean;
        };
        policies: {
            value: boolean;
            validValues: null;
            isValid: boolean;
        };
    };
    getS3FilesFilteredFileCount: (state: any) => any;
    getAndValidateNewS3FilesState: (previousState: any, action: any, broadcast?: boolean) => any;
    regenerateS3FilesFiltersAndValidValues: (state: any) => any;
    getAndValidateNewState: (previousState: any, action: any, broadcast?: boolean) => any;
    ALL_POSSIBLE_VALID_DATE_RANGE: string[];
    ALL_POSSIBLE_VALID_DOCUMENTATION: string[];
    ALL_POSSIBLE_VALID_PACKAGE_TYPE: string[];
    ALL_POSSIBLE_VALID_PROVISIONAL_DATA: string[];
};
declare namespace DownloadDataContext {
    export { Provider };
    export { useDownloadDataState };
    export { reducer };
    export { DEFAULT_STATE };
    export { ALL_STEPS };
    export { getStateObservable };
}
declare function Provider(props: any): import("react/jsx-runtime").JSX.Element;
declare namespace Provider {
    namespace propTypes {
        const downloadDataContextUniqueId: PropTypes.Requireable<number>;
        const stateObservable: PropTypes.Requireable<(...args: any[]) => any>;
        const productData: PropTypes.Requireable<PropTypes.InferProps<{
            productCode: PropTypes.Validator<string>;
            productName: PropTypes.Validator<string>;
            siteCodes: PropTypes.Requireable<(PropTypes.InferProps<{
                siteCode: PropTypes.Validator<string>;
                availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
                availableReleases: PropTypes.Requireable<(PropTypes.InferProps<{
                    release: PropTypes.Validator<string>;
                    availableMonths: PropTypes.Validator<(string | null | undefined)[]>;
                }> | null | undefined)[]>;
            }> | null | undefined)[]>;
        }>>;
        const availabilityView: PropTypes.Requireable<string>;
        const release: PropTypes.Requireable<string>;
        const sites: PropTypes.Requireable<(string | null | undefined)[]>;
        const dateRange: PropTypes.Requireable<(string | null | undefined)[]>;
        const documentation: PropTypes.Requireable<string>;
        const packageType: PropTypes.Requireable<string>;
        const provisionalData: PropTypes.Requireable<string>;
        const children: PropTypes.Validator<NonNullable<NonNullable<PropTypes.ReactNodeLike>>>;
    }
    namespace defaultProps {
        const downloadDataContextUniqueId_1: number;
        export { downloadDataContextUniqueId_1 as downloadDataContextUniqueId };
        const stateObservable_1: null;
        export { stateObservable_1 as stateObservable };
        const productData_1: {};
        export { productData_1 as productData };
        import availabilityView_1 = DEFAULT_STATE.availabilityView;
        export { availabilityView_1 as availabilityView };
        import release_1 = value;
        export { release_1 as release };
        import sites_1 = value;
        export { sites_1 as sites };
        import dateRange_1 = value;
        export { dateRange_1 as dateRange };
        import documentation_1 = value;
        export { documentation_1 as documentation };
        import packageType_1 = value;
        export { packageType_1 as packageType };
        import provisionalData_1 = value;
        export { provisionalData_1 as provisionalData };
    }
}
declare function useDownloadDataState(): {
    downloadContextIsActive: boolean;
    broadcast: boolean;
    dialogOpen: boolean;
    awaitingHigherOrderUpdateWhenDialogOpens: boolean;
    cachedHigherOrderState: {};
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
        maxNumFilesSelected: number;
        value: never[];
        valueMap: {};
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
    latestRelease: null;
    release: {
        value: null;
        validValues: never[];
        isValid: boolean;
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
    provisionalData: {
        value: string;
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
        maxNumFilesSelected: number;
        value: never[];
        valueMap: {};
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
    latestRelease: null;
    release: {
        value: null;
        validValues: never[];
        isValid: boolean;
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
    provisionalData: {
        value: string;
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
    const productData_2: {};
    export { productData_2 as productData };
    export const requiredSteps: never[];
    export const allStepsComplete: boolean;
    export const fromManifest: boolean;
    export const fromAOPManifest: boolean;
    export const fromExternalHost: boolean;
    export namespace manifest {
        const status: string;
        const value: null;
        const error: null;
    }
    const availabilityView_2: null;
    export { availabilityView_2 as availabilityView };
    export const s3FileFetches: {};
    export const s3FileFetchProgress: number;
    export namespace s3Files {
        export const maxNumFilesSelected: number;
        const value_1: never[];
        export { value_1 as value };
        export const valueMap: {};
        export const cachedValues: never[];
        export const validValues: never[];
        export const isValid: boolean;
        export const bytesByUrl: {};
        export const totalSize: number;
        export const estimatedPostSize: number;
        export const filteredFileCount: number;
        export const lastFilterChanged: null;
        export namespace filters {
            const site: never[];
            const type: never[];
            const visit: never[];
            const yearMonth: never[];
        }
        export namespace valueLookups {
            const site_1: {};
            export { site_1 as site };
            const type_1: {};
            export { type_1 as type };
            const visit_1: {};
            export { visit_1 as visit };
            const yearMonth_1: {};
            export { yearMonth_1 as yearMonth };
        }
        export const visibleColumns: string[];
    }
    export const latestRelease: null;
    export namespace release_2 {
        const value_2: null;
        export { value_2 as value };
        const validValues_1: never[];
        export { validValues_1 as validValues };
        const isValid_1: boolean;
        export { isValid_1 as isValid };
    }
    export { release_2 as release };
    export namespace sites_2 {
        const value_3: never[];
        export { value_3 as value };
        const validValues_2: never[];
        export { validValues_2 as validValues };
        const isValid_2: boolean;
        export { isValid_2 as isValid };
    }
    export { sites_2 as sites };
    export namespace dateRange_2 {
        const value_4: string[];
        export { value_4 as value };
        const validValues_3: string[];
        export { validValues_3 as validValues };
        const isValid_3: boolean;
        export { isValid_3 as isValid };
    }
    export { dateRange_2 as dateRange };
    export namespace documentation_2 {
        const value_5: string;
        export { value_5 as value };
        const validValues_4: string[];
        export { validValues_4 as validValues };
        const isValid_4: boolean;
        export { isValid_4 as isValid };
    }
    export { documentation_2 as documentation };
    export namespace packageType_2 {
        const value_6: null;
        export { value_6 as value };
        const validValues_5: string[];
        export { validValues_5 as validValues };
        const isValid_5: boolean;
        export { isValid_5 as isValid };
    }
    export { packageType_2 as packageType };
    export namespace provisionalData_2 {
        const value_7: string;
        export { value_7 as value };
        const validValues_6: string[];
        export { validValues_6 as validValues };
        const isValid_6: boolean;
        export { isValid_6 as isValid };
    }
    export { provisionalData_2 as provisionalData };
    export namespace policies {
        const value_8: boolean;
        export { value_8 as value };
        const validValues_7: null;
        export { validValues_7 as validValues };
        const isValid_7: boolean;
        export { isValid_7 as isValid };
    }
}
declare namespace ALL_STEPS {
    export namespace documentation_3 {
        const requiredStateKeys: string[];
        const label: string;
        const title: string;
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
    export namespace provisionalData_3 {
        const requiredStateKeys_4: string[];
        export { requiredStateKeys_4 as requiredStateKeys };
        const label_4: string;
        export { label_4 as label };
        const title_3: string;
        export { title_3 as title };
    }
    export { provisionalData_3 as provisionalData };
    export namespace sitesAndDateRange {
        const requiredStateKeys_5: string[];
        export { requiredStateKeys_5 as requiredStateKeys };
        const label_5: string;
        export { label_5 as label };
        const title_4: string;
        export { title_4 as title };
    }
    export namespace policies_1 {
        const requiredStateKeys_6: string[];
        export { requiredStateKeys_6 as requiredStateKeys };
        const label_6: string;
        export { label_6 as label };
        const title_5: string;
        export { title_5 as title };
    }
    export { policies_1 as policies };
    export namespace summary {
        const requiredStateKeys_7: never[];
        export { requiredStateKeys_7 as requiredStateKeys };
        const label_7: string;
        export { label_7 as label };
        const title_6: string;
        export { title_6 as title };
    }
}
declare function getStateObservable(): import("rxjs").Observable<any>;
import PropTypes from "prop-types";
