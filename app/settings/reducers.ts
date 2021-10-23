import {
    RESET_SETTING,
    ResetSettingAction,
    SET_SETTING,
    SetSettingAction,
} from "app/settings/actions";
import { DEFAULT_SETTINGS, Settings } from "app/settings/types";

export default function handleSettingActions(
    state: Settings = DEFAULT_SETTINGS,
    action: ResetSettingAction | SetSettingAction<any>,
): Settings {
    switch (action.type) {
        case RESET_SETTING:
            return {
                ...state,
                [action.setting]: DEFAULT_SETTINGS[action.setting],
            };
        case SET_SETTING:
            return {
                ...state,
                [action.setting]: action.value,
            };
        default:
            return state;
    }
}
