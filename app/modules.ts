import { Module } from "./types";

import api from "./api";
import common from "./common";
import delivery from "./delivery";
import settings from "./settings";
import ui from "./ui";

const allmodules: any = {
    // debug,
    api,
    common,
    delivery,
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
    delivery: ReturnType<typeof allmodules.delivery.reducer>;
}

export default requiredModules as { [moduleName: string]: Module };
