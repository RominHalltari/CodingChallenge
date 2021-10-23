import React from "react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";

import { getLanguage } from "app/common/selectors/language";
import { i18n } from "app/i18n";
import ScreensContainer from "app/ScreensContainer";
import { createStore } from "./createStore";
import modules from "./modules";

export const store = createStore();

interface AppState {
    bootstrapped: false;
}

export default class App extends React.Component<AppState> {
    public state = {bootstrapped: false};

    public componentDidMount() {
        // Goes over all different modules and initialises them
        for (const moduleName of Object.keys(modules)) {
            const init = modules[moduleName].init;
            if (init) {
                init();
            }
        }

        const persistor = persistStore(store);

        let unsubscribe: () => void;
        const initNavigationWhenHydrated = () => {
            if (persistor.getState().bootstrapped) {
                this.setState({bootstrapped: true});
                i18n.changeLanguage(getLanguage(store.getState()).code);
                if (unsubscribe) {
                    unsubscribe();
                }
            }
        };

        unsubscribe = persistor.subscribe(initNavigationWhenHydrated);
        initNavigationWhenHydrated();
    }

    public render() {
        return (
            <I18nextProvider i18n={i18n}>
                <Provider store={store}>
                    {this.state.bootstrapped && <ScreensContainer/>}
                </Provider>
            </I18nextProvider>
        );
    }
}
