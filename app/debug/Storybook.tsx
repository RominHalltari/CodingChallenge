import React from "react";

import { getStorybookUI } from "@storybook/react-native";

// Goes over all different modules and loads the stories linked to
// that module. Dynamic require to avoid circular dependency
export function loadStories() {
    const modules = require("app/modules").default;
    for (const moduleName of Object.keys(modules)) {
        const moduleLoadStories: (() => void)|undefined = modules[moduleName].loadStories;
        if (moduleLoadStories && moduleLoadStories !== undefined) {
            moduleLoadStories();
        }
    }
}

// This assumes that storybook is running on the same host as your RN packager,
// to set manually use, e.g. host: 'localhost' option
// We initially set the StorybookUIRoot to null to prevent it from being
// loaded when the module is imported.
let StorybookUIRoot: ReturnType<typeof getStorybookUI> | null = null;

// Variable to make sure stories are only loaded once
let storiesLoaded = false;

// react-native hot module loader must take in a Class - https://github.com/facebook/react-native/issues/10991
// https://github.com/storybooks/storybook/issues/2081
class StorybookUI extends React.Component {
    // Hide react-native-navigation stuff to leave more space for
    // rendering the stories

    public static options = {
        bottomTabs: {
            drawBehind: true,
            visible: false,
        },
        topBar: {
            drawBehind: true,
            visible: false,
        },
    };

    public constructor(props: {}) {
        super(props);
        // Load the stories -- only once!
        // Cannot be at top level, because that would cause
        // importing modules to fail (circular dependency)
        if (StorybookUIRoot === null) {
            StorybookUIRoot = getStorybookUI({ port: 7007, onDeviceUI: true });
        }
        if (!storiesLoaded) {
            loadStories();
            storiesLoaded = true;
        }
    }

    public render() {
        const Element = StorybookUIRoot!;
        return <Element />;
    }

    public componentDidMount() {
        // Initiate loki config
        // This need to be done after the first render as that
        // will make the storybook addon channel available
        require("loki/configure-react-native");
    }
}

export default StorybookUI;
