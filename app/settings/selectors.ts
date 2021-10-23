import { State } from "app/modules";
import reducer from "app/settings/reducers";
import { Settings } from "app/settings/types";

export const getSettings = (state: State): ReturnType<typeof reducer> =>
    state.settings;

export const getSetting = (state: State, key: keyof Settings) =>
    getSettings(state)[key];
