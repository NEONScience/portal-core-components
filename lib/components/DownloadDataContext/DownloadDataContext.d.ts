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
declare function Provider(inProps: any): React.JSX.Element;
declare namespace Provider {
    namespace propTypes {
        let downloadDataContextUniqueId: PropTypes.Requireable<number>;
        let stateObservable: PropTypes.Requireable<(...args: any[]) => any>;
        let productData: PropTypes.Requireable<PropTypes.InferProps<{
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
        let availabilityView: PropTypes.Requireable<string>;
        let release: PropTypes.Requireable<string>;
        let sites: PropTypes.Requireable<(string | null | undefined)[]>;
        let dateRange: PropTypes.Requireable<(string | null | undefined)[]>;
        let documentation: PropTypes.Requireable<string>;
        let packageType: PropTypes.Requireable<string>;
        let provisionalData: PropTypes.Requireable<string>;
        let children: PropTypes.Validator<NonNullable<NonNullable<PropTypes.ReactNodeLike>>>;
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
    export let downloadContextIsActive: boolean;
    export let broadcast: boolean;
    export let dialogOpen: boolean;
    export let awaitingHigherOrderUpdateWhenDialogOpens: boolean;
    export let cachedHigherOrderState: {};
    let productData_1: {};
    export { productData_1 as productData };
    export let requiredSteps: never[];
    export let allStepsComplete: boolean;
    export let fromManifest: boolean;
    export let fromAOPManifest: boolean;
    export let fromExternalHost: boolean;
    export namespace manifest {
        let status: string;
        let value: null;
        let error: null;
    }
    let availabilityView_1: null;
    export { availabilityView_1 as availabilityView };
    export let s3FileFetches: {};
    export let s3FileFetchProgress: number;
    export namespace s3Files {
        export let maxNumFilesSelected: number;
        let value_1: never[];
        export { value_1 as value };
        export let valueMap: {};
        export let cachedValues: never[];
        export let validValues: never[];
        export let isValid: boolean;
        export let bytesByUrl: {};
        export let totalSize: number;
        export let estimatedPostSize: number;
        export let filteredFileCount: number;
        export let lastFilterChanged: null;
        export namespace filters {
            let site: never[];
            let type: never[];
            let visit: never[];
            let yearMonth: never[];
        }
        export namespace valueLookups {
            let site_1: {};
            export { site_1 as site };
            let type_1: {};
            export { type_1 as type };
            let visit_1: {};
            export { visit_1 as visit };
            let yearMonth_1: {};
            export { yearMonth_1 as yearMonth };
        }
        export let visibleColumns: string[];
    }
    export let latestRelease: null;
    export namespace release_1 {
        let value_2: null;
        export { value_2 as value };
        let validValues_1: never[];
        export { validValues_1 as validValues };
        let isValid_1: boolean;
        export { isValid_1 as isValid };
    }
    export { release_1 as release };
    export namespace sites_1 {
        let value_3: never[];
        export { value_3 as value };
        let validValues_2: never[];
        export { validValues_2 as validValues };
        let isValid_2: boolean;
        export { isValid_2 as isValid };
    }
    export { sites_1 as sites };
    export namespace dateRange_1 {
        let value_4: string[];
        export { value_4 as value };
        let validValues_3: string[];
        export { validValues_3 as validValues };
        let isValid_3: boolean;
        export { isValid_3 as isValid };
    }
    export { dateRange_1 as dateRange };
    export namespace documentation_1 {
        let value_5: string;
        export { value_5 as value };
        let validValues_4: string[];
        export { validValues_4 as validValues };
        let isValid_4: boolean;
        export { isValid_4 as isValid };
    }
    export { documentation_1 as documentation };
    export namespace packageType_1 {
        let value_6: null;
        export { value_6 as value };
        let validValues_5: string[];
        export { validValues_5 as validValues };
        let isValid_5: boolean;
        export { isValid_5 as isValid };
    }
    export { packageType_1 as packageType };
    export namespace provisionalData_1 {
        let value_7: string;
        export { value_7 as value };
        let validValues_6: string[];
        export { validValues_6 as validValues };
        let isValid_6: boolean;
        export { isValid_6 as isValid };
    }
    export { provisionalData_1 as provisionalData };
    export namespace policies {
        let value_8: boolean;
        export { value_8 as value };
        let validValues_7: null;
        export { validValues_7 as validValues };
        let isValid_7: boolean;
        export { isValid_7 as isValid };
    }
}
declare namespace ALL_STEPS {
    export namespace documentation_2 {
        let requiredStateKeys: string[];
        let label: string;
        let title: string;
    }
    export { documentation_2 as documentation };
    export namespace externalExclusive {
        let requiredStateKeys_1: never[];
        export { requiredStateKeys_1 as requiredStateKeys };
        let label_1: string;
        export { label_1 as label };
    }
    export namespace s3Files_1 {
        let requiredStateKeys_2: string[];
        export { requiredStateKeys_2 as requiredStateKeys };
        let label_2: string;
        export { label_2 as label };
        let title_1: string;
        export { title_1 as title };
    }
    export { s3Files_1 as s3Files };
    export namespace packageType_2 {
        let requiredStateKeys_3: string[];
        export { requiredStateKeys_3 as requiredStateKeys };
        let label_3: string;
        export { label_3 as label };
        let title_2: string;
        export { title_2 as title };
    }
    export { packageType_2 as packageType };
    export namespace provisionalData_2 {
        let requiredStateKeys_4: string[];
        export { requiredStateKeys_4 as requiredStateKeys };
        let label_4: string;
        export { label_4 as label };
        let title_3: string;
        export { title_3 as title };
    }
    export { provisionalData_2 as provisionalData };
    export namespace sitesAndDateRange {
        let requiredStateKeys_5: string[];
        export { requiredStateKeys_5 as requiredStateKeys };
        let label_5: string;
        export { label_5 as label };
        let title_4: string;
        export { title_4 as title };
    }
    export namespace policies_1 {
        let requiredStateKeys_6: string[];
        export { requiredStateKeys_6 as requiredStateKeys };
        let label_6: string;
        export { label_6 as label };
        let title_5: string;
        export { title_5 as title };
    }
    export { policies_1 as policies };
    export namespace summary {
        let requiredStateKeys_7: never[];
        export { requiredStateKeys_7 as requiredStateKeys };
        let label_7: string;
        export { label_7 as label };
        let title_6: string;
        export { title_6 as title };
    }
}
declare function getStateObservable(): import("rxjs").Observable<any>;
import React from 'react';
import PropTypes from 'prop-types';
