import {
  of,
  defer,
  forkJoin,
  Subject,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  map,
  tap,
  catchError,
  takeUntil,
  finalize,
} from 'rxjs/operators';

/**
 * Convenience method for utiliizing RxJS ajax.getJSON
 * @param {string} url
 * @param {any} callback
 * @param {any} errorCallback
 * @param {any} cancellationSubject$
 * @param {Object|undefined} headers
 * @return RxJS subscription
 */
export const getJson = (
  url,
  callback,
  errorCallback,
  cancellationSubject$,
  headers = undefined,
) => {
  const rxObs$ = ajax.getJSON(url, headers).pipe(
    map((response) => {
      if (typeof callback === 'function') {
        return of(callback(response));
      }
      return of(response);
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
  return rxObs$.subscribe(
    response => response,
    error => error,
    complete => complete,
  );
};

export default getJson;

/**
  Convert an array of obbservables into a single observable block that reports
  progress as the number of completed observables out of the total.
 */
export const forkJoinWithProgress = arrayOfObservables => defer(() => {
  let counter = 0;
  const percent$ = new Subject();
  const modifiedObservablesList = arrayOfObservables.map(
    item => item.pipe(
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
