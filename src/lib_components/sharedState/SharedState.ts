import { useState, useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';

/**
 * A function to use a distributed shared state.
 * @param subject A subject.
 * @returns The value and function to set the state.
 */
const useSharedState = <T>(subject: BehaviorSubject<T>): [T, typeof useState] => {
  const [value, setState] = useState(subject.getValue());
  useEffect(() => {
    const subscription = subject.pipe(skip(1)).subscribe((s) => setState(s));
    return () => subscription.unsubscribe();
  }, [subject]);
  const setDistributedState = (state: T) => subject.next(state);
  // @ts-ignore
  return [value, setDistributedState];
};

export default useSharedState;
