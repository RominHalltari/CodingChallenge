import { combineReducers } from "redux";
import { language } from "./language";
import { theme } from "./theme";

export default combineReducers({
    language,
    theme,
});
