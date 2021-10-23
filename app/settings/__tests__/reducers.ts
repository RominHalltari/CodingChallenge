import {
    RESET_SETTING,
    SET_SETTING,
} from "app/settings/actions";
import handleSettingActions from "app/settings/reducers";
import { DEFAULT_SETTINGS } from "app/settings/types";

describe("settingActions", () => {
    it("has a default value", () => {
        const newState = handleSettingActions(
            undefined,
            // @ts-ignore: Intentionally use wrong type
            {type: "WRONG_TYPE"},
        );
        expect(newState).toEqual(DEFAULT_SETTINGS);
    });

    it("should set setting on SET_SETTING", () => {
        const newValue = "http://testendpoint";

        const newState = handleSettingActions(
            DEFAULT_SETTINGS,
            {type: SET_SETTING, setting: "API_BASE_URL", value: newValue},
        );
        expect(newState.API_BASE_URL).toEqual(newValue);
    });

    it("should reset setting on RESET_SETTING", () => {
        const alteredState = Object.assign({}, DEFAULT_SETTINGS);
        alteredState.API_BASE_URL = "http://testendpoint";

        const newState = handleSettingActions(
            alteredState,
            {type: RESET_SETTING, setting: "API_BASE_URL"},
        );
        expect(DEFAULT_SETTINGS).toEqual(newState);
    });
});
