import { SetLanguageAction } from "app/common/actions";
import { SET_LANGUAGE } from "app/common/actions/language";
import { english, Language } from "app/common/types";

export function language(
    state: Language = english,
    action: SetLanguageAction,
): Language {
    switch (action.type) {
        case SET_LANGUAGE:
            return action.language;
        default:
            return state;
    }
}
