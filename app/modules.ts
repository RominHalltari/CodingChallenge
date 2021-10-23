import { Module } from "./types";

import api from "./api";
import auth from "./auth";
import common from "./common";
import cryptoTracker from "./cryptoTracker";
import settings from "./settings";
import ui from "./ui";

const allmodules: any = {
    // debug,
    api,
    auth,
    common,
    cryptoTracker,
    settings,
    ui,
};

// Use only the modules that the build flavor needs
const requiredModules = Object.keys(allmodules)
    .reduce((obj: { [moduleName: string]: Module }, key: any) => {
        obj[key] = allmodules[key];
        return obj;
    }, {});

export interface State {
    _date: Date;
    api: ReturnType<typeof allmodules.api.reducer>;
    auth: ReturnType<typeof allmodules.auth.reducer>;
    common: ReturnType<typeof allmodules.common.reducer>;
    core: ReturnType<typeof allmodules.core.reducer>;
    settings: ReturnType<typeof allmodules.settings.reducer>;
    cryptoTracker: ReturnType<typeof allmodules.cryptoTracker.reducer>;
}

export default requiredModules as { [moduleName: string]: Module };
