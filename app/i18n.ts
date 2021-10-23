import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";

import BuildConfig from "app/settings/build-config";
import { Locale } from "date-fns";
import dateFnsEnGb from "date-fns/locale/en-GB";

i18n.use(reactI18nextModule).init({
    fallbackLng: BuildConfig.LANGUAGE,
    ns: ["common", "ui", "utils", "cryptoTracker"],
    returnEmptyString: false,

    react: {
        wait: true,
    },
    resources: {
        ar: {
            auth: require("./auth/i18n/ar"),
            common: require("./common/i18n/ar"),
            cryptoTracker: require("./cryptoTracker/i18n/ar"),
            ui: require("./ui/i18n/ar"),
            utils: require("./utils/i18n/ar"),
        },
        en: {
            auth: require("./auth/i18n/en"),
            common: require("./common/i18n/en"),
            cryptoTracker: require("./cryptoTracker/i18n/en"),
            ui: require("./ui/i18n/en"),
            utils: require("./utils/i18n/en"),
        },
        it: {
            auth: require("./auth/i18n/it"),
            common: require("./common/i18n/it"),
            cryptoTracker: require("./cryptoTracker/i18n/it"),
            ui: require("./ui/i18n/it"),
            utils: require("./utils/i18n/it"),
        },
    },
});

export { i18n };

export const dateFnsLocales: { [languageCode: string]: Locale } = {
    en: dateFnsEnGb,
};
