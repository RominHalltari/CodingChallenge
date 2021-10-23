import { Action } from "redux";

import {
    InstanceAction,
    ModelInstance,
    SetInstanceAction,
    SetInstanceErrorAction,
    SetResultListAction,
} from "app/api/types";

import {
    apiCallReducer,
    modelApiCallReducer,
    modelDataReducer,
} from "./reducers";

const GET_TEST_INSTANCE_ACTION = "GET_TEST_INSTANCE_ACTION";
const SET_TEST_INSTANCE_ACTION = "SET_TEST_INSTANCE_ACTION";
const SET_TEST_LIST_ACTION = "SET_TEST_LIST_ACTION";
const SET_TEST_ERROR_ACTION = "SET_TEST_ERROR_ACTION";
const RESET_ACTION = "RESET_ACTION";

type GET_TEST_INSTANCE_ACTION = typeof GET_TEST_INSTANCE_ACTION;
type SET_TEST_INSTANCE_ACTION = typeof SET_TEST_INSTANCE_ACTION;
type SET_TEST_LIST_ACTION = typeof SET_TEST_LIST_ACTION;
type SET_TEST_ERROR_ACTION = typeof SET_TEST_ERROR_ACTION;
type RESET_ACTION = typeof RESET_ACTION;

interface TestModel extends ModelInstance {
    name: string;
}

interface GetTestInstanceAction extends InstanceAction<
    GET_TEST_INSTANCE_ACTION
    > { }
interface SetTestInstanceAction extends SetInstanceAction<
    TestModel, SET_TEST_INSTANCE_ACTION
    > { }
interface SetTestListAction extends SetResultListAction<
    TestModel, SET_TEST_LIST_ACTION
    > { }
interface SetTestErrorAction extends SetInstanceErrorAction<
    SET_TEST_ERROR_ACTION
    > { }
interface ResetAction extends Action<RESET_ACTION> { }

describe("modelDataReducer", () => {

    const reducer = modelDataReducer<
        TestModel,
        SetTestListAction,
        SetTestInstanceAction
    >(
        [SET_TEST_LIST_ACTION],
        [SET_TEST_INSTANCE_ACTION],
        [RESET_ACTION],
    );

    it("initiates an empty ModelState", () => {
        const state = reducer(undefined, {type: "@@INIT"});
        expect(state).toEqual({});
    });

    it("adds a new instance on a SetInstanceAction", () => {
        const action: SetTestInstanceAction = {
            data: {id: "1", name: "New"},
            id: "1",
            type: SET_TEST_INSTANCE_ACTION,
        };

        const state = reducer({}, action);

        expect(state).toEqual({
            1: {id: "1", name: "New"},
        });
    });

    it("updates an existing instance on a SetInstanceAction", () => {
        const action: SetTestInstanceAction = {
            data: {id: "1", name: "New"},
            id: "1",
            type: SET_TEST_INSTANCE_ACTION,
        };

        const state = reducer({
            1: {id: "1", name: "Old"},
        }, action);

        expect(state).toEqual({
            1: {id: "1", name: "New"},
        });
    });

    it("sets a result list of instances on a SetResultListAction", () => {
        const action: SetTestListAction = {
            data: {
                count: 2,
                next: null,
                previous: null,
                results: [{id: "1", name: "New1"}, {id: "2", name: "New2"}],
            },
            type: SET_TEST_LIST_ACTION,
        };

        const state = reducer({}, action);

        expect(state).toEqual({
            1: {id: "1", name: "New1"},
            2: {id: "2", name: "New2"},
        });
    });

    it("updates a result list of instances on a SetResultListAction", () => {
        const action: SetTestListAction = {
            data: {
                count: 2,
                next: null,
                previous: null,
                results: [{id: "1", name: "New1"}, {id: "2", name: "New2"}],
            },
            type: SET_TEST_LIST_ACTION,
        };

        const state = reducer({1: {id: "1", name: "Old1"}}, action);

        expect(state).toEqual({
            1: {id: "1", name: "New1"},
            2: {id: "2", name: "New2"},
        });
    });

    it("resets the list on a reset action", () => {
        const action: ResetAction = {
            type: RESET_ACTION,
        };

        const state = reducer({1: {id: "1", name: "Old1"}}, action);

        expect(state).toEqual({});
    });

});

describe("apiCallReducer", () => {

    const reducer = apiCallReducer<
        GetTestInstanceAction,
        SetTestInstanceAction,
        SetTestErrorAction
    >(
        GET_TEST_INSTANCE_ACTION,
        SET_TEST_INSTANCE_ACTION,
        SET_TEST_ERROR_ACTION,
    );

    it("initiates an empty state", () => {
        const state = reducer(undefined, {type: "@@INIT"});
        expect(state).toEqual({
            error: null,
            requesting: false,
        });
    });

    it("sets requesting to true on a start action", () => {
        const action: GetTestInstanceAction = {
            id: "1",
            type: GET_TEST_INSTANCE_ACTION,
        };

        const state = reducer({
            error: null,
            requesting: false,
        }, action);

        expect(state.requesting).toBe(true);
    });

    it("sets requesting to true on a success action", () => {
        const action: SetTestInstanceAction = {
            data: {id: "1", name: "test"},
            id: "1",
            type: SET_TEST_INSTANCE_ACTION,
        };

        const state = reducer({
            error: null,
            requesting: true,
        }, action);

        expect(state.requesting).toBe(false);
    });

    it("sets requesting to true on an error action", () => {
        const action: SetTestErrorAction = {
            code: "error",
            id: "1",
            message: "test",
            type: SET_TEST_ERROR_ACTION,
        };

        const state = reducer({
            error: null,
            requesting: true,
        }, action);

        expect(state.requesting).toBe(false);
    });

    it("sets the error code on an error action", () => {
        const action: SetTestErrorAction = {
            code: "error",
            id: "1",
            message: "test",
            type: SET_TEST_ERROR_ACTION,
        };

        const state = reducer({
            error: null,
            requesting: true,
        }, action);

        expect(state.error).toEqual(action.code);
    });

    it("sets the error to null on a success action", () => {
        const action: SetTestInstanceAction = {
            data: {id: "1", name: "test"},
            id: "1",
            type: SET_TEST_INSTANCE_ACTION,
        };

        const state = reducer({
            error: "error",
            requesting: true,
        }, action);

        expect(state.error).toBeNull();
    });

});

describe("modelApiCallReducer", () => {

    const reducer = modelApiCallReducer<
        GetTestInstanceAction,
        SetTestInstanceAction,
        SetTestErrorAction
    >(
        GET_TEST_INSTANCE_ACTION,
        SET_TEST_INSTANCE_ACTION,
        SET_TEST_ERROR_ACTION,
    );

    it("initiates an empty state", () => {
        const state = reducer(undefined, {type: "@@INIT"});
        expect(state).toEqual({});
    });

    it("sets the state on a start action", () => {
        const action: GetTestInstanceAction = {
            id: "1",
            type: GET_TEST_INSTANCE_ACTION,
        };

        const state = reducer({}, action);

        expect(state).toEqual({
            1: {
                error: null,
                requesting: true,
            },
        });
    });

    it("clears the state on a success action", () => {
        const action: SetTestInstanceAction = {
            data: {id: "1", name: "test"},
            id: "1",
            type: SET_TEST_INSTANCE_ACTION,
        };

        const state = reducer({
            1: {
                error: null,
                requesting: true,
            },
        }, action);

        expect(state).toEqual({});
    });

    it("updates the state on an error action", () => {
        const action: SetTestErrorAction = {
            code: "error",
            id: "1",
            message: "test",
            type: SET_TEST_ERROR_ACTION,
        };

        const state = reducer({
            1: {
                error: null,
                requesting: true,
            },
        }, action);

        expect(state).toEqual({
            1: {
                error: action.code,
                requesting: false,
            },
        });
    });

});
