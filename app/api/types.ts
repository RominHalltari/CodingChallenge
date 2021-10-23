import { Action } from "redux";

export type SET_INSTANCE = "api.SET_INSTANCE";
export type SET_LIST = "api.SET_LIST";

export interface ResultList<T> {
    readonly count: number;
    readonly results: T[];
    readonly next: string | null;
    readonly previous: string | null;
}

export interface ModelInstance {
    readonly id: string;
}

export interface ApiCallState {
    requesting: boolean;
    error: string | null;
}

export interface ModelApiCallState {
    [id: string]: ApiCallState;
}

export interface ModelDataState<T extends ModelInstance> {
    [id: string]: T;
}

export interface SetErrorAction<Y = any> extends Action<Y> {
    code: string;
    message: string;
}

export interface InstanceAction<Y = any> extends Action<Y> {
    id: string;
}

export interface SetInstanceErrorAction<Y = any>
    extends InstanceAction<Y>, SetErrorAction<Y> {}

export interface SetInstanceAction<
    T extends ModelInstance,
    Y = any,
> extends InstanceAction<Y> {
    data: T;
}

export interface SetResultListAction<
    T extends ModelInstance,
    Y = any,
> extends Action<Y> {
    clear?: boolean;
    data: ResultList<T>;
}
