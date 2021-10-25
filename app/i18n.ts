import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";

import BuildConfig from "app/settings/build-config";
import { Locale } from "date-fns";
import dateFnsEnGb from "date-fns/locale/en-GB";

i18n.use(reactI18nextModule).init({
    fallbackLng: BuildConfig.LANGUAGE,
    ns: ["common", "ui", "utils", "delivery"],
    returnEmptyString: false,

    react: {
        wait: true,
    },
    resources: {
        en: {
            common: require("./common/i18n/en"),
            delivery: require("./delivery/i18n/en"),
            ui: require("./ui/i18n/en"),
            utils: require("./utils/i18n/en"),
        },
    },
});

export { i18n };

export const dateFnsLocales: { [languageCode: string]: Locale } = {
    en: dateFnsEnGb,
};
