import * as actions from "app/settings/actions";

describe("settingActions", () => {
    it("setsettingAction creates a SET_SETTING action", () => {
        const setting = "API_BASE_URL";
        const value = "http://test.test/api";
        const expectedAction = {
            setting,
            type: actions.SET_SETTING,
            value,

        };

        expect(actions.setSetting(setting, value)).toEqual(expectedAction);
    });

    it("resetsettingAction creates a RESET_SETTING action", () => {
        const setting = "API_BASE_URL";

        const expectedAction = {
            setting,
            type: actions.RESET_SETTING,
        };

        expect(actions.resetSetting(setting)).toEqual(expectedAction);
    });
});
