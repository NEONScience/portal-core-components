import { Observable, MonoTypeOperatorFunction } from 'rxjs';
import { AjaxConfig, ajax as AjaxCreationMethod } from 'rxjs/ajax';
import { AnyAction } from 'redux';
import { WorkingAction, SuccessAction, ErrorAction, AjaxBodyCreator, EpicCreator, AjaxRequestInjector, EpicCreationProps } from '../types/epic';
import { AnyObject } from '../types/core';
export interface IEpicService {
    /**
     * Creator to decorate an EpicCreator function that creates the Epic
     * @param ofTypeFilter
     * @param ajaxConfig
     * @param workingAction
     * @param successAction
     * @param errorAction
     * @param takeUntilTypeFilter
     * @param ajaxBodyCreator
     * @param ajaxRequestInjector
     * @param useForkJoin
     * @type A The type of action
     * @type S The type of state
     */
    createEpic: <A extends AnyAction, S extends AnyObject>(ofTypeFilter: string | string[], ajaxConfig: AjaxConfig | AjaxConfig[], workingAction: WorkingAction, successAction: SuccessAction<A>, errorAction: ErrorAction<A>, takeUntilTypeFilter?: string, ajaxBodyCreator?: AjaxBodyCreator<A>, ajaxRequestInjector?: AjaxRequestInjector<A>, useForkJoin?: boolean) => EpicCreator<A, S>;
    /**
     * Creator to decorate an EpicCreator function that creates the Epic
     * @param ofTypeFilter
     * @param ajaxConfig
     * @param workingAction
     * @param successAction
     * @param errorAction
     * @param takeUntilTypeFilter
     * @param ajaxBodyCreator
     * @param ajaxRequestInjector
     * @param useForkJoin
     * @type A The type of action
     * @type S The type of state
     */
    createMergeEpic: <A extends AnyAction, S extends AnyObject>(ofTypeFilter: string | string[], ajaxConfig: AjaxConfig | AjaxConfig[], workingAction: WorkingAction, successAction: SuccessAction<A>, errorAction: ErrorAction<A>, takeUntilTypeFilter?: string, ajaxBodyCreator?: AjaxBodyCreator<A>, ajaxRequestInjector?: AjaxRequestInjector<A>, useForkJoin?: boolean) => EpicCreator<A, S>;
    /**
     * Creator to decorate an EpicCreator function that creates the Epic
     * @param props
     * @type A The type of action
     * @type S The type of state
     */
    createEpicFromProps: <A extends AnyAction, S extends AnyObject>(props: EpicCreationProps<A>) => EpicCreator<A, S>;
    /**
     * Creator to decorate an EpicCreator function that creates the Epic
     * @param props
     * @type A The type of action
     * @type S The type of state
     */
    createMergeEpicFromProps: <A extends AnyAction, S extends AnyObject>(props: EpicCreationProps<A>) => EpicCreator<A, S>;
    /**
     * Creator to decorate an AJAX observable
     * @param ajax
     * @param ajaxConfig
     * @param successAction
     * @param errorAction
     * @param action
     * @param takeUntilOperator
     * @param ajaxBodyCreator
     * @param ajaxHeaderInjector
     * @param useForkJoin
     * @type A The type of action
     */
    createAjaxObservable: <A extends AnyAction>(ajax: typeof AjaxCreationMethod, ajaxConfig: AjaxConfig | AjaxConfig[], successAction: SuccessAction<A>, errorAction: ErrorAction<A>, action?: A, takeUntilOperator?: MonoTypeOperatorFunction<any>, ajaxBodyCreator?: AjaxBodyCreator<A>, ajaxRequestInjector?: AjaxRequestInjector<A>, useForkJoin?: boolean) => Observable<A>;
}
declare const EpicService: IEpicService;
export default EpicService;
