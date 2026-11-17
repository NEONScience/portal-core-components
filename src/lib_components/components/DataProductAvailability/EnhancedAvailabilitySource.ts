import { useEffect, useMemo, useState } from 'react';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import NeonApi from '../NeonApi/NeonApi';
import { AsyncStateType } from '../../types/asyncFlow';
import { Nullable } from '../../types/core';
import { exists, isStringNonEmpty } from '../../util/typeUtil';

import {
  AvailabilityDataLevel,
  EnhancedAvailabilityValidation,
  isAvailabilityDataLevel,
  validateEnhancedAvailability,
} from './EnhancedAvailabilitySchema';

// Data level availability is fetched at when no data level is specified
export const DEFAULT_FETCH_DATA_LEVEL = AvailabilityDataLevel.MONTHLY;

interface ApiErrorResponse {
  error?: Nullable<{ detail?: Nullable<string> }>;
}

interface FetchError {
  status?: number;
  response?: Nullable<ApiErrorResponse>;
}

/**
 * Get a message describing why fetching availability failed, with the status and error detail
 * reported by the API when present
 */
export const getFetchErrorMessage = (
  error: unknown,
  productCode: string,
  release: Nullable<string> = null,
): string => {
  const { status, response }: FetchError = (error || {}) as FetchError;
  const detail = response?.error?.detail;
  const target = isStringNonEmpty(release) ? `${productCode} (${release})` : productCode;
  const statusText = (status && (status > 0)) ? ` [${status}]` : '';
  const detailText = isStringNonEmpty(detail) ? `: ${detail}` : '';
  return `Unable to load data availability for ${target}${statusText}${detailText}`;
};

/**
 * Fetch availability for a product, optionally scoped to a release, at a data level from the
 * data availability API endpoint. Emits the validation of the fetched availability against the
 * data level, which reports any fetch error.
 */
export const fetchEnhancedAvailability = (
  productCode: string,
  release: Nullable<string>,
  dataLevel: AvailabilityDataLevel,
): Observable<EnhancedAvailabilityValidation> => (
  (NeonApi.getDataAvailabilityObservable(
    productCode,
    release || undefined,
    dataLevel,
  ) as Observable<unknown>)
    .pipe(
      map((response: unknown): EnhancedAvailabilityValidation => {
        const data = (response as Nullable<{ data?: unknown }>)?.data;
        if (!exists(data)) {
          return {
            availability: null,
            dataLevel,
            error: getFetchErrorMessage({ response }, productCode, release),
          };
        }
        return validateEnhancedAvailability(data, dataLevel);
      }),
      catchError((error: unknown): Observable<EnhancedAvailabilityValidation> => of({
        availability: null,
        dataLevel,
        error: getFetchErrorMessage(error, productCode, release),
      })),
    )
);

export interface EnhancedAvailabilitySourceProps {
  // Availability to present, the "data" object of a data availability API response
  enhancedAvailability?: unknown;
  // Product to fetch availability for when availability is not provided
  productCode?: Nullable<string>;
  // Release to scope fetched availability to, otherwise availability is fetched for all releases
  release?: Nullable<string>;
  // Data level provided availability must agree with, or to fetch availability at
  dataLevel?: Nullable<AvailabilityDataLevel>;
}

export interface EnhancedAvailabilitySource extends EnhancedAvailabilityValidation {
  // IDLE with neither availability nor a product, WORKING while fetching, then FULLFILLED once
  // availability is valid or FAILED with an error
  status: AsyncStateType;
}

interface FetchResult extends EnhancedAvailabilityValidation {
  requestKey: string;
}

const getRequestKey = (
  productCode: string,
  release: Nullable<string>,
  dataLevel: AvailabilityDataLevel,
): string => JSON.stringify([productCode, release, dataLevel]);

const getStatus = (validation: EnhancedAvailabilityValidation): AsyncStateType => (
  exists(validation.error) ? AsyncStateType.FAILED : AsyncStateType.FULLFILLED
);

/**
 * Resolve the enhanced availability to present. Provided availability is validated against the
 * data level when specified, otherwise its data level is detected. Without provided availability,
 * availability is fetched for the product and release at the data level (MONTHLY by default) and
 * fetched again whenever any of them change. While fetching, any previously fetched availability
 * is kept so it can stay presented until the newly fetched availability replaces it.
 */
export const useEnhancedAvailabilitySource = (
  props: EnhancedAvailabilitySourceProps,
): EnhancedAvailabilitySource => {
  const {
    enhancedAvailability,
    productCode,
    release,
    dataLevel,
  }: EnhancedAvailabilitySourceProps = props;
  const specifiedDataLevel = isAvailabilityDataLevel(dataLevel) ? dataLevel : null;
  const providedValidation = useMemo((): Nullable<EnhancedAvailabilityValidation> => (
    exists(enhancedAvailability)
      ? validateEnhancedAvailability(enhancedAvailability, specifiedDataLevel)
      : null
  ), [enhancedAvailability, specifiedDataLevel]);

  // Provided availability takes precedence over fetching availability for a product
  const fetchProductCode = (!exists(enhancedAvailability) && isStringNonEmpty(productCode))
    ? productCode as string
    : null;
  const fetchRelease = (fetchProductCode && isStringNonEmpty(release)) ? release as string : null;
  const fetchDataLevel = specifiedDataLevel || DEFAULT_FETCH_DATA_LEVEL;

  const [fetchResult, setFetchResult] = useState<Nullable<FetchResult>>(null);
  useEffect(() => {
    if (!fetchProductCode) { return undefined; }
    const requestKey = getRequestKey(fetchProductCode, fetchRelease, fetchDataLevel);
    const subscription = fetchEnhancedAvailability(fetchProductCode, fetchRelease, fetchDataLevel)
      .subscribe((validation: EnhancedAvailabilityValidation): void => {
        setFetchResult({ ...validation, requestKey });
      });
    return () => { subscription.unsubscribe(); };
  }, [fetchProductCode, fetchRelease, fetchDataLevel]);

  if (providedValidation) {
    return { ...providedValidation, status: getStatus(providedValidation) };
  }
  if (!fetchProductCode) {
    return {
      availability: null,
      dataLevel: specifiedDataLevel,
      error: null,
      status: AsyncStateType.IDLE,
    };
  }
  if (fetchResult?.requestKey === getRequestKey(fetchProductCode, fetchRelease, fetchDataLevel)) {
    const { availability, dataLevel: fetchedDataLevel, error }: FetchResult = fetchResult;
    return {
      availability,
      dataLevel: fetchedDataLevel,
      error,
      status: getStatus(fetchResult),
    };
  }
  return {
    availability: fetchResult?.availability || null,
    dataLevel: fetchDataLevel,
    error: null,
    status: AsyncStateType.WORKING,
  };
};
