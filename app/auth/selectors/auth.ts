import { State } from "app/modules";

export const getIsLoggingIn = (state: State) => state.auth.requestLogin.requesting;

export const getLoginError = (state: State) => state.auth.requestLogin.error;

export const getIsLoggedIn = (state: State) => !!state.auth.accessData?.access_token;
