import { Action, AnyAction } from "redux";

import {
    ApiCallState,
    InstanceAction,
    ModelApiCallState,
    ModelDataState,
    ModelInstance,
    SetErrorAction,
    SetInstanceAction,
    SetInstanceErrorAction,
    SetResultListAction,
} from "app/api/types";

/* Utility reducers */

function isSetInstanceAction<
    T extends ModelInstance,
    I extends SetInstanceAction<T>,
>(
    types: Array<I["type"]>,
    action: Action<any>,
): action is SetInstanceAction<T> {
    return types.includes(action.type);
}

function isSetListAction<
    T extends ModelInstance,
    I extends SetResultListAction<T>,
>(
    types: Array<I["type"]>,
    action: Action<any>,
): action is SetResultListAction<T> {
    return types.includes(action.type);
}

/**
 * Creates a reducer that will manage an API call without a model.
 * This reducer is meant to be used in the backend state. It will
 * return `{error: null | string, requesting: boolean}`.
 *
 * @param BEGIN_ACTION
 *     action type that will be used to start a request
 * @param SUCCESS_ACTION
 *     action type that will be used to succesfully finish a request
 * @param ERROR_ACTION
 *     action type that will be used to indicate the request failed
 * @param RESET_ACTION
 *     action type that will be used to reset the state of the request
 */
export function apiCallReducer<
    B extends Action,
    S extends Action,
    E extends SetErrorAction,
    R extends Action = {type: null},
>(
    BEGIN_ACTION: B["type"],
    SUCCESS_ACTION: S["type"],
    ERROR_ACTION: E["type"],
    RESET_ACTION?: R["type"],
) {
    return (
        state: ApiCallState = {error: null, requesting: false},
        action: B | S | E | Action<any>,
    ): ApiCallState => {
        switch (action.type) {
            case BEGIN_ACTION:
                return {
                    error: null,
                    requesting: true,
                };
            case SUCCESS_ACTION:
                return {
                    error: null,
                    requesting: false,
                };
            case ERROR_ACTION:
                return {
                    error: (action as SetErrorAction).code,
                    requesting: false,
                };
            case RESET_ACTION:
                return {
                    error: null,
                    requesting: false,
                };
            default:
                return state;
        }
    };
}

/**
 * Creates a reducer that will manage an API call for a model.
 * This reducer is meant to be used in the backend state. It will
 * return an index of `{id: {error: null | string, requesting: boolean}}`.
 *
 * @param BEGIN_ACTION
 *     action type that will be used to start a request
 * @param SUCCESS_ACTION
 *     action type that will be used to succesfully finish a request
 * @param ERROR_ACTION
 *     action type that will be used to indicate the request failed
 */
export function modelApiCallReducer<
    B extends InstanceAction,
    S extends InstanceAction,
    E extends SetInstanceErrorAction,
>(
    BEGIN_ACTION: B["type"],
    SUCCESS_ACTION: S["type"],
    ERROR_ACTION: E["type"],
) {
    const actions = [BEGIN_ACTION, SUCCESS_ACTION, ERROR_ACTION];
    const reducer = apiCallReducer(BEGIN_ACTION, SUCCESS_ACTION, ERROR_ACTION);
    return (
        state: ModelApiCallState = {},
        action: B | S | E | AnyAction,
    ): ModelApiCallState => {
        if (! actions.includes(action.type)) {
            return state;
        }

        const newState = Object.assign({}, state);
        const instanceAction = action as InstanceAction;
        const id = instanceAction.id;

        if (action.type === SUCCESS_ACTION) {
            delete newState[id];
        } else {
            newState[id] = reducer(newState[id], instanceAction);
        }
        return newState;
    };
}

/**
 * Creates a reducer that will manage the data of API model instances.
 * This reducer is meant to be used in the backend state. It will
 * keep an index of `{id: object}`.
 *
 * @param SET_LIST_ACTIONS
 *     types of the actions that will be used to add a list of objects
 * @param SET_INSTANCE_ACTIONS
 *     types of the actions that will be used to add a single object
 * @param RESET_ACTIONSS
 *     types of the actions that will be used to clear the list
 */
export function modelDataReducer<
    T extends ModelInstance,
    L extends SetResultListAction<T>,
    I extends SetInstanceAction<T>,
>(
    SET_LIST_ACTIONS: Array<L["type"]> = [],
    SET_INSTANCE_ACTIONS: Array<I["type"]> = [],
    RESET_ACTIONS: any[] = [],
) {
    return (
        state: ModelDataState<T> = {},
        action: I | L | Action<any>,
    ): ModelDataState<T> => {
        if (isSetInstanceAction<T, I>(SET_INSTANCE_ACTIONS, action)) {
            const newState = Object.assign({}, state);
            newState[action.data.id] = action.data;
            return newState;
        } else if (isSetListAction<T, L>(SET_LIST_ACTIONS, action)) {
            const newState: ModelDataState<T> = {};
            if (action.clear !== true) {
                Object.assign(newState, state);
            }
            action.data.results.forEach((item) => {
                newState[item.id] = {...state[item.id], ...item};
            });
            return newState;
        } else if (RESET_ACTIONS.includes(action.type)) {
            return {};
        } else {
            return state;
        }
    };
}

