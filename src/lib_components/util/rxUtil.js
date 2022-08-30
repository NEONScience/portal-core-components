import {
  of,
  defer,
  forkJoin,
  map,
  tap,
  catchError,
  takeUntil,
  finalize,
  Subject,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';

import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
import { exists } from './typeUtil';

/**
 * Convenience method for utiliizing RxJS ajax.getJSON
 * @param {string} url
 * @param {any} callback
 * @param {any} errorCallback
 * @param {any} cancellationSubject$
 * @param {Object|undefined} headers
 * @param {boolean} cors
 * @return RxJS subscription
 */
export const getJson = (
  url,
  callback,
  errorCallback,
  cancellationSubject$,
  headers = undefined,
  cors = false,
) => {
  const request = {
    method: 'GET',
    url,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      ...headers,
    },
  };
  if (cors && NeonEnvironment.requireCors()) {
    request.crossDomain = true;
    request.withCredentials = true;
  }
  const rxObs$ = ajax(request).pipe(
    map((response) => {
      const appliedResponse = (exists(response) && exists(response.response))
        ? response.response
        : response;
      if (typeof callback === 'function') {
        return of(callback(appliedResponse));
      }
      return of(appliedResponse);
    }),
    catchError((error) => {
      console.error(error); // eslint-disable-line no-console
      if (typeof errorCallback === 'function') {
        return of(errorCallback(error));
      }
      return of(error);
    }),
    takeUntil(cancellationSubject$),
  );

  // Placeholders for subscriber events, handled upstream in observable
  return rxObs$.subscribe({
    next: (response) => response,
    error: (error) => error,
    complete: (complete) => complete,
  });
};

export default getJson;

/**
  Convert an array of obbservables into a single observable block that reports progress
  (the number of completed observables out of the total) as a percentage from 0 to 100
 */
export const forkJoinWithProgress = (arrayOfObservables) => defer(() => {
  let counter = 0;
  const percent$ = new Subject();
  const modifiedObservablesList = arrayOfObservables.map(
    (item) => item.pipe(
      finalize(() => {
        counter += 1;
        const percentValue = (counter * 100) / arrayOfObservables.length;
        percent$.next(percentValue);
      }),
    ),
  );
  const finalResult$ = forkJoin(modifiedObservablesList).pipe(
    tap(() => {
      percent$.next(100);
      percent$.complete();
    }),
  );
  return of([finalResult$, percent$.asObservable()]);
});
