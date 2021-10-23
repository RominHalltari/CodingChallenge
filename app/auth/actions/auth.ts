import { ApiError } from "app/api/errors";
import { SetErrorAction } from "app/api/types";
import { Action } from "redux";

export const LOGIN = "cryptoTracker.LOGIN";
export const SET_LOGIN_SUCCESSFUL = "cryptoTracker.SET_LOGIN_SUCCESSFUL";
export const SET_LOGIN_ERROR = "cryptoTracker.SET_LOGIN_ERROR";

export type LOGIN = typeof LOGIN;
export type SET_LOGIN_SUCCESSFUL = typeof SET_LOGIN_SUCCESSFUL;
export type SET_LOGIN_ERROR = typeof SET_LOGIN_ERROR;

export interface LoginAction extends Action<LOGIN> {
    username: string;
    password: string;
}

export interface SetLoginSuccessfulAction extends Action<SET_LOGIN_SUCCESSFUL> {
    accessData: any;
}

export interface SetLoginErrorAction extends SetErrorAction<SET_LOGIN_ERROR> {}

export function login(username: string, password: string): LoginAction {
    return {
        type: LOGIN,

        password,
        username,
    };
}

export function setLoginSuccessful(accessData: any) {
    return {
        accessData,
        type: SET_LOGIN_SUCCESSFUL,
    };
}

export function setLoginError(
  error: Error | ApiError,
): SetLoginErrorAction {
    return {
        type: SET_LOGIN_ERROR,

        code: error instanceof ApiError ? error.code : "Error",
        message: error.toString(),
    };
}
