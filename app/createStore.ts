import AsyncStorage from "@react-native-community/async-storage";
import { applyMiddleware, compose, createStore as reduxCreateStore } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { persistReducer } from "redux-persist";

import { mapImmutable, mapObjImmutable } from "app/utils";

import epic from "./epics";
import { State } from "./modules";
import reducer from "./reducers";

// Memoise intermediate results of transformInbound for performance
function createTransformInbound() {
    let prevMemoMap: Map<any, any> = new Map();
    let newMemoMap: Map<any, any> = new Map();

    // Retrieve the result from previous memoisation map, if not found compute
    // it, then in both cases store in the new memoisation map and return
    const memoisedTransform = (object: any) => {
        // Only memoize objects
        if (typeof object !== "object" || object === null || !Object.isExtensible(object)) {
            return transform(object);
        }

        let result = prevMemoMap.get(object);

        if (result === undefined) {
            result = transform(object);
        }

        newMemoMap.set(object, result);
        return result;
    };

    // Do the actual transformation
    const transform = (object: any) => {
        if (object instanceof Date) {
            return {
                "@type": "date",
                "@value": object.toISOString(),
            };
        } else {
            if (typeof object === "object" && object !== null) {
                if (Array.isArray(object)) {
                    object = mapImmutable(object, memoisedTransform);
                } else {
                    object = mapObjImmutable(object, memoisedTransform);
                }
            }
            return object;
        }
    };

    return (object: any) => {
        // Store the current memoisation map as "previous"
        prevMemoMap = newMemoMap;

        // Create new memoisation map
        newMemoMap = new Map();

        // Compute result using memoisation and return
        return memoisedTransform(object);
    };
}

export const transformInbound = createTransformInbound();

export const transformOutbound = (object: any) => {
    // Check typeof, to make sure string/arrays are skipped
    // Default to {} to make sure we can use the 'in' operator on null objects
    if (typeof object === "object" && "@type" in (object || {})) {
        switch (object["@type"]) {
            case "date":
                return new Date(object["@value"]);

            default:
                throw Error("unsupported transform type");
        }
    } else {
        if (typeof object === "object" && object !== null) {
            Object.keys(object).forEach((key) => {
                object[key] = transformOutbound(object[key]);
            });
        }
        return object;
    }
};

export const createStore = () => {
    // @ts-ignore TS2304: Window is global
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const epicMiddleware = createEpicMiddleware();

    const persistConfig = {
        key: "root",
        storage: AsyncStorage,
        transforms: [{
            in: transformInbound,
            out: transformOutbound,
        }],
    };

    const persistedReducer = persistReducer<State, any>(persistConfig, reducer);
    const store = reduxCreateStore(
        persistedReducer,
        composeEnhancers(
            applyMiddleware(epicMiddleware),
        ),
    );

    // Register the epics
    epicMiddleware.run(epic);

    return store;
};
