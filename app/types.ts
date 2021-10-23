import { ComponentClass } from "react";
import { Reducer } from "redux";
import { Epic } from "redux-observable";

export interface Module {
    init?: (() => void);
    epic: Epic | null;
    loadStories?: (() => void);
    reducer: Reducer<any, any> | null;
    screens: { [screenName: string]: ComponentClass<any, any> };
}
