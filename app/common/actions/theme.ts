import { Theme } from "@react-navigation/native";
import { Action } from "redux";

export const SET_THEME = "common.SET_THEME";
export type SET_THEME = typeof SET_THEME;


export interface SetThemeAction extends Action {
    theme: Theme;
    type: SET_THEME;
}

export function setTheme(theme: Theme): SetThemeAction {
    return {
        theme,
        type: SET_THEME,
    };
}
