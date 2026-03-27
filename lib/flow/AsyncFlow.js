/* eslint-disable class-methods-use-this */ function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment';
import { exists } from '../util/typeUtil';
import { AsyncStateType } from '../types/asyncFlow';
class AsyncFlowProvider {
    constructor(){
        /**
   * Core async flow reducer.
   * @param actionTypes The actions types to apply reduction for
   * @param parserFunction The parse function for parsing the completed action's response
   * @param state The redux state to update
   * @param action The current action to apply reduction for
   * @return The updated state
   */ _define_property(this, "createCoreReducer", (actionTypes, parserFunction, state, action)=>{
            let update;
            if (exists(state)) {
                update = state;
            } else {
                update = {};
            }
            switch(action.type){
                case actionTypes.working:
                    update = {
                        ...update,
                        asyncState: AsyncStateType.WORKING,
                        error: null
                    };
                    break;
                case actionTypes.completed:
                    update = {
                        ...update,
                        asyncState: AsyncStateType.FULLFILLED,
                        data: parserFunction(action.data),
                        error: null
                    };
                    break;
                case actionTypes.error:
                    console.error(action.error); // eslint-disable-line no-console
                    update = {
                        ...update,
                        asyncState: AsyncStateType.FAILED,
                        error: {
                            ...update.error,
                            error: action.error,
                            message: action.message
                        }
                    };
                    break;
                case actionTypes.reset:
                    update = {
                        ...update,
                        asyncState: AsyncStateType.IDLE,
                        data: null,
                        error: null
                    };
                    break;
                default:
                    break;
            }
            return update;
        });
        /**
   * Creates the reducer for handling all async actions within the flow
   * @param actionTypes The action types for the flow
   * @param parserFunction The parser function for the flow
   * @return The decorated core flow reducer
   */ _define_property(this, "createAsyncFlowReducer", (actionTypes, parserFunction)=>(state, action)=>{
                let update = this.createCoreReducer(actionTypes, parserFunction, state, action);
                switch(action.type){
                    case actionTypes.fetch:
                        update = {
                            ...update,
                            error: null
                        };
                        break;
                    default:
                        break;
                }
                return update;
            });
        /**
   * Creates the set of async flow action creators to dispatch
   * @param actionTypes The action types to create for
   * @param parserFunction The parser function to apply
   * @return The set of action creators
   */ _define_property(this, "createCoreAsyncFlowActions", (actionTypes, parserFunction)=>{
            let resetAction = null;
            if (exists(actionTypes.reset)) {
                resetAction = ()=>({
                        type: actionTypes.reset
                    });
            }
            return {
                asyncWorkingAction: (param)=>({
                        type: actionTypes.working,
                        param
                    }),
                asyncCompletedAction: (data)=>({
                        type: actionTypes.completed,
                        data
                    }),
                asyncErrorAction: (error, message, data)=>({
                        type: actionTypes.error,
                        error,
                        message,
                        data
                    }),
                asyncResetAction: resetAction,
                parserFunction
            };
        });
        /**
   * Creates an async flow handler for unifying asynchronous flows within redux
   * state manipulation and reducing boilerplate for doing so
   * @param actionTypes The action types for the flow
   * @param parserFunction The parser function for the flow
   * @param ignoreWhenDevEnv Optionally execute the flow
   * @returns The decorated async flow handler
   */ _define_property(this, "create", (actionTypes, parserFunction, ignoreWhenDevEnv)=>{
            const reducer = this.createAsyncFlowReducer(actionTypes, parserFunction);
            return {
                asyncAction: (param)=>{
                    if (NeonEnvironment.isDevEnv && ignoreWhenDevEnv) {
                        return {
                            type: '__DEV_NEON_CORE_ASYNCFLOW_IGNORE_ACTION'
                        };
                    }
                    return {
                        type: actionTypes.fetch,
                        param
                    };
                },
                reducer,
                ...this.createCoreAsyncFlowActions(actionTypes, parserFunction)
            };
        });
        /**
   * Handles the reduction of an asynchronous flow by propagating the
   * result data object from the async state object to the owning state
   * upon completion
   * @param reducer The async flow reducer to handle async state reduction
   * @param state The owning state to reduce
   * @param action The current action
   * @param fetchStateProp The async state property on the owning state
   * @param completedActionType The completed action type to responsd to
   * @param stateResultProp The result property on the owning state to set
   * @return The resulting owning state
   */ _define_property(this, "reduce", (reducer, state, action, fetchStateProp, completedActionType, stateResultProp)=>{
            const update = {
                ...state,
                [fetchStateProp]: reducer(state[fetchStateProp], action)
            };
            switch(action.type){
                case completedActionType:
                    return {
                        ...state,
                        [fetchStateProp]: {
                            ...update[fetchStateProp],
                            data: null
                        },
                        [stateResultProp]: update[fetchStateProp].data
                    };
                default:
                    return update;
            }
        });
    }
}
const AsyncFlow = new AsyncFlowProvider();
export default AsyncFlow;
