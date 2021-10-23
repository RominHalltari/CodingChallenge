import {
    Action,
    applyMiddleware,
    createStore,
    Middleware,
    Reducer,
} from "redux";
import {
    createEpicMiddleware,
    Epic,
} from "redux-observable";

import rootReducer from "app/reducers";


/**
 * Middleware that logs all actions on the redux store which can be
 * very useful for debugging purposes.
 *
 * Example usage:
 *
 *     createStore(
 *         reducer,
 *         composeEnhancers(
 *             applyMiddleware(storeLogger, ...),
 *         ),
 *     );
 */

export const storeLogger: Middleware = (store) => (next) => (action) => {
    /* tslint:disable:no-console */
    console.group(action.type);
    console.info("[Redux] dispatching:\n", action);
    const result = next(action);
    console.log("[Redux] next state:\n", store.getState());
    console.groupEnd();
    return result;
    /* tslint:enable:no-console */
};

/**
 * Initialises a redux store for integration testing.
 *
 * @param initActions An array of actions that will be sent to the store's
 *                    reducers to set an initial state before starting up
 *                    the epic middleware.
 * @param epic The root epic that will be attached to the store.
 * @param reducer The root reducer that will be attached to the store.
 * @returns returns a clean redux store object
 */
export const testStore = (
    initActions: Action[] = [],
    epic: Epic<Action, Action> | null = null,
    reducer: Reducer = rootReducer,
    debug: boolean = false,
) => {
    const epicMiddleware = createEpicMiddleware();
    const middleware: Middleware[] = [epicMiddleware];

    if (debug) {
        middleware.unshift(storeLogger);
    }

    const store = createStore(
        reducer,
        applyMiddleware(...middleware),
    );

    // Initialise before connecting the epics and side effects
    for (const action of initActions) {
        store.dispatch(action);
    }

    // Set up epic
    if (epic) {
        epicMiddleware.run(epic);
    }
    return store;
};
