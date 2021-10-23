import epic from "app/auth/epics";
import reducer from "app/auth/reducers";
import LoginScreen from "app/auth/screens/login/LoginScreen";

export default {
    epic,
    init: null,
    loadStories: null,
    reducer,
    screens: {LoginScreen},
};
