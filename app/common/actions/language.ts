import { Language } from "app/common/types";
import { Action } from "redux";

export const SET_LANGUAGE = "common.SET_LANGUAGE";
export type SET_LANGUAGE = typeof SET_LANGUAGE;


export interface SetLanguageAction extends Action {
    language: Language;
    type: SET_LANGUAGE;
}

export function setLanguage(language: Language): SetLanguageAction {
    return {
        language,
        type: SET_LANGUAGE,
    };
}
