import { LOGIN, LoginAction, setLoginError, setLoginSuccessful } from "app/auth/actions/auth";
import { requestLogin } from "app/auth/api";
import { combineEpics, Epic, ofType } from "redux-observable";
import { exhaustMap, mergeMap } from "rxjs/operators";

import { ApiError } from "app/api/errors";
import { apiRequest } from "app/api/rxjs";
import { handleError, logError } from "app/utils/rxjs";


function tryRequestLogin(email: string, password: string) {
    return apiRequest(() => requestLogin(email, password), {retryAttempts: 3});
}

export const requestLoginEpic: Epic = (action$) =>
    action$.pipe(
        ofType(LOGIN),
        exhaustMap((action: LoginAction) =>
            tryRequestLogin(action.username, action.password).pipe(
                mergeMap((response: any) => [
                    setLoginSuccessful(response),
                ]),
                handleError(ApiError, setLoginError),
                logError(),
            ),
        ),
    );

export default combineEpics(
    requestLoginEpic,
);
