import { combineReducers, Reducer, ReducersMapObject } from "redux";

import { MINUTE_TICK, MinuteTickAction, RESET_STATE } from "./actions";
import modules, { State } from "./modules";

const reducers: { [moduleName: string]: Reducer } = {};

for (const moduleName of Object.keys(modules)) {
    const reducer = modules[moduleName].reducer;

    if (reducer !== null) {
        reducers[moduleName] = reducer;
    }
}

// Workaround for react-redux not updating unless state changed
reducers._date = (state: Date, action: MinuteTickAction): Date => {
    switch (action.type) {
        case MINUTE_TICK:
            return new Date();
        default:
            return state || new Date();
    }
};

const combinedReducer = combineReducers<State>(reducers as ReducersMapObject<State>);

const rootReducer: Reducer<State> = (state, action) => {
    if (action.type === RESET_STATE) {
        state = undefined;
    }

    return combinedReducer(state, action);
};

export default rootReducer;
