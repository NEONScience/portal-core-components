import { useState } from 'react';
import { BehaviorSubject } from 'rxjs';
/**
 * A function to use a distributed shared state for sharing state between components outside
 * of the component heirarchy. The subject would be defined in an
 * external module and then this function can be imported to incorporate the shared
 * state into a component.
 * @param subject A subject.
 * @returns The value and function to set the state.
 */
declare const useSharedState: <T>(subject: BehaviorSubject<T>) => [T, typeof useState];
export default useSharedState;
