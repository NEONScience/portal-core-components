/**
 * Async action type
 */ export var AsyncStateType = /*#__PURE__*/ function(AsyncStateType) {
    AsyncStateType[AsyncStateType["IDLE"] = 0] = "IDLE";
    AsyncStateType[AsyncStateType["WORKING"] = 1] = "WORKING";
    AsyncStateType[AsyncStateType["FULLFILLED"] = 2] = "FULLFILLED";
    AsyncStateType[AsyncStateType["FAILED"] = 3] = "FAILED";
    return AsyncStateType;
}({});
