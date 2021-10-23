import { Theme } from "@react-navigation/native";

import { SET_THEME, SetThemeAction } from "app/common/actions/theme";
import { lightTheme } from "app/styles/default/colors";

export function theme(
    state: Theme = lightTheme,
    action: SetThemeAction,
): Theme {
    switch (action.type) {
        case SET_THEME:
            return action.theme;
        default:
            return state;
    }
}
