import BuildConfig from "./build-config";

export interface SettingsInterface {
    API_BASE_URL: string;
}

export type Settings = {
    [index in keyof SettingsInterface]: SettingsInterface[index];
};

export const DEFAULT_SETTINGS: Settings = {
    API_BASE_URL : BuildConfig.BASE_URL,
};
