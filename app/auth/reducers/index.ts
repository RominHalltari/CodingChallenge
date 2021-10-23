import { apiCallReducer } from "app/api/reducers";
import * as actions from "app/auth/actions/auth";
import { SET_LOGIN_SUCCESSFUL, SetLoginSuccessfulAction } from "app/auth/actions/auth";
import { combineReducers } from "redux";

export function accessData(state: any = null, action: SetLoginSuccessfulAction): any {
    switch (action.type) {
        case SET_LOGIN_SUCCESSFUL:
            return action.accessData;
        default:
            return state;
    }
}

export default combineReducers({
    accessData,
    requestLogin: apiCallReducer<
      actions.LoginAction,
      actions.SetLoginSuccessfulAction,
      actions.SetLoginErrorAction
      >(
      actions.LOGIN,
      actions.SET_LOGIN_SUCCESSFUL,
      actions.SET_LOGIN_ERROR,
    ),
});
