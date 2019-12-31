import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, takeUntil } from 'rxjs/operators';
import { exists } from './typeUtil';

/**
 * Convenience method for utiliizing RxJS ajax.getJSON
 * @param {url} url
 * @param {callback} callback
 * @param {errorCallback} errorCallback
 * @param {cancellationSubject} cancellationSubject$
 * @return RxJS subscription
 */
export const getJson = (url, callback, errorCallback, cancellationSubject$) => {
  const rxObs$ = ajax.getJSON(url).pipe(
    map((response) => {
      if (exists(callback)) {
        return of(callback(response));
      }
      return of(response);
    }),
    catchError((error) => {
      console.error(error); // eslint-disable-line no-console
      if (exists(errorCallback)) {
        return of(errorCallback(error));
      }
      return of(error);
    }),
    takeUntil(cancellationSubject$),
  );

  // Placeholders for subscriber events, handled upstream in observable
  return rxObs$.subscribe(
    response => response,
    error => error,
    complete => complete,
  );
};

export default getJson;
