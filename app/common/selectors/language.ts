import { getCommonState } from "app/common/selectors/common";
import { State } from "app/modules";

export const getLanguage = (state: State) => getCommonState(state).language;
