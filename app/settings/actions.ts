import { Action } from "redux";

import { Settings } from "app/settings/types";

export const SET_SETTING = "SET_SETTING";
export type SET_SETTING = typeof SET_SETTING;

export const RESET_SETTING = "RESET_SETTING";
export type RESET_SETTING = typeof RESET_SETTING;

export interface SetSettingAction<T extends keyof Settings> extends Action {
    setting: T;
    value: Settings[T];
    type: SET_SETTING;
}

export interface ResetSettingAction extends Action {
    setting: keyof Settings;
    type: RESET_SETTING;
}

export function setSetting<T extends keyof Settings>(
    setting: T, value: Settings[T],
): SetSettingAction<T> {
    return {
        setting,
        type: SET_SETTING,
        value,
    };
}

export function resetSetting(setting: keyof Settings): ResetSettingAction {
    return {
        setting,
        type: RESET_SETTING,
    };
}
