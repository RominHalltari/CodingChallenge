import { getCommonState } from "app/common/selectors/common";
import { State } from "app/modules";

export const getTheme = (state: State) => getCommonState(state).theme;
