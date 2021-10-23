import {
    Action,
    ActionCreator,
    bindActionCreators,
    Dispatch,
    Reducer,
} from "redux";
import { ActionsObservable, Epic } from "redux-observable";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { mapObj } from "app/utils";

/**
 * Returns the application's global redux store.
 */
export const getStore = () => {
    // Use `require` to avoid a circular import as `app/index` imports
    // all modules, so when those modules import `app/index` during
    // their initialisation they may get an undefined store object
    // because app/index is not yet finished with its own imports.
    const app = require("app/index");
    return app.store;
};

/*
 * Action-related
 */

export function addContextToActions(
    actionCreators: {
        [actionCreator: string]: ActionCreator<Action>,
    },
): (context: string) => {
    [actionCreator: string]: ActionCreator<Action>,
} {
    return (context) => {
        function addContextToActionCreator(actionCreator: ActionCreator<Action>) {
            return (...args: Parameters<typeof actionCreator>) => ({
                ...actionCreator(...args),
                context,
            });
        }

        return mapObj(actionCreators, addContextToActionCreator);
    };
}

export interface DeepActionCreatorsMapObject<A = any> {
    [key: string]: ActionCreator<A> | DeepActionCreatorsMapObject<A>;
}

/*
 * Like bindActionCreators, but allows for deep objects
 */
export function deepBindActionCreators(
    actionCreators: DeepActionCreatorsMapObject<any> | ActionCreator<any>,
    dispatch: Dispatch,
): DeepActionCreatorsMapObject<any> | ActionCreator<any> {
    if (typeof actionCreators !== "object") {
        return bindActionCreators(actionCreators, dispatch);
    } else {
        const ret: DeepActionCreatorsMapObject<any> = {};
        for (const key of Object.keys(actionCreators)) {
            ret[key] = deepBindActionCreators(actionCreators[key], dispatch);
        }
        return ret;
    }
}

/*
 * Reducer-related
 */

export interface ActionContext {
    context: string;
}

export const INIT = "@@INIT";
export type INIT = typeof INIT;

export interface InitAction {
    type: INIT;
}

export const initAction: InitAction = {
    type: INIT,
};

export function filterReducerByContext<S, A extends Action>(
    reducer: Reducer<S, A | InitAction>,
): (context: string) => Reducer<S, A & ActionContext> {
    return (context) => {
        return (state: S | undefined, action: A & ActionContext): S => {
            // We should never return undefined, so get the default state
            if (state === undefined) {
                return reducer(state, initAction);
            }

            switch (action.context) {
                case context:
                    return reducer(state, action);
                default:
                    return state;
            }
        };
    };
}

/*
 * Epic-related
 */

export function withContext<A extends Action>(context: string) {
    return filter((action: A & ActionContext) => action.context === context);
}

export function epicWithContext(
    epic: Epic,
): (context: string) => Epic {
    return (context): Epic => (
        (
            action$: Observable<Action & ActionContext>,
            state$,
            dependencies,
        ): Observable<Action & ActionContext> => (
            action$.pipe(
                withContext(context),
                (filteredAction$) => epic(new ActionsObservable(filteredAction$), state$, dependencies),
                map((action: Action) => ({ ...action, context })),
            )
        )
    );
}
