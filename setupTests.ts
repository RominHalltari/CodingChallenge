/* tslint:disable:max-classes-per-file no-var-requires */

// Warnings are errors
/* tslint:disable:no-console */
// const warn = console.warn;
// console.warn = (...args: any[]) => {
//     warn(...args);
//     throw new Error("Warnings must be fixed.");
// };
/* tslint:enable:no-console */

// Fetch mock
import { GlobalWithFetchMock } from "jest-fetch-mock";
import { NativeModules } from "react-native";

// @ts-ignore
const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;

customGlobal.fetch = require("jest-fetch-mock");
customGlobal.fetchMock = customGlobal.fetch;

// mock the map module
jest.mock("react-native-maps", () => {
    const React = require.requireActual("react");
    const MapView = require.requireActual("react-native-maps");

    class MockCallout extends React.Component {
        public render() {
            return React.createElement("Callout", this.props, this.props.children);
        }
    }

    class MockMarker extends React.Component {
        public render() {
            return React.createElement("Marker", this.props, this.props.children);
        }
    }

    class MockMapView extends React.Component {
        public fitToCoordinates = jest.fn();
        public render() {
            return React.createElement("MapView", this.props, this.props.children);
        }
    }

    class MockPolyline extends React.Component {
        public render() {
            return React.createElement("Polyline", this.props, this.props.children);
        }
    }

    MockCallout.propTypes = MapView.Callout.propTypes;
    MockMarker.propTypes = MapView.Marker.propTypes;
    MockPolyline.propTypes = MapView.Polyline.propTypes;
    MockMapView.propTypes = MapView.propTypes;
    MockMapView.Marker = MockMarker;
    MockMapView.Callout = MockCallout;
    MockMapView.Polyline = MockPolyline;
    return MockMapView;
});

// mock the icon modules
jest.mock("react-native-vector-icons/Entypo", () => "EntypoIcon");
jest.mock("react-native-vector-icons/EvilIcons", () => "EvilIconsIcon");
jest.mock("react-native-vector-icons/Feather", () => "FeatherIcon");
jest.mock("react-native-vector-icons/FontAwesome", () => "FontAwesomeIcon");
jest.mock("react-native-vector-icons/FontAwesome5", () => "FontAwesome5Icon");
jest.mock("react-native-vector-icons/Foundation", () => "FoundationIcon");
jest.mock("react-native-vector-icons/Ionicons", () => "IoniconsIcon");
jest.mock("react-native-vector-icons/MaterialIcons", () => "MaterialIconsIcon");
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "MaterialCommunityIconsIcon");
jest.mock("react-native-vector-icons/Octicons", () => "OcticonsIcon");
jest.mock("react-native-vector-icons/Zocial", () => "ZocialIcon");
jest.mock("react-native-vector-icons/SimpleLineIcons", () => "SimpleLineIconsIcon");

// mock the geolocation module
jest.mock("react-native-geolocation-service", () => ({
    watchPosition: () => ({latitude: 2.0, longitude: 3.0}),
}));

// mock react native firebase
jest.mock("react-native-firebase", () => ({
    analytics: jest.fn(() => ({
        logEvent: jest.fn(),
        setAnalyticsCollectionEnabled: jest.fn(),
        setCurrentScreen: jest.fn(),
        setMinimumSessionDuration: jest.fn(),
        setSessionTimeoutDuration: jest.fn(),
        setUserId: jest.fn(),
        setUserProperty: jest.fn(),
    })),
    crashlytics: jest.fn(() => ({
        crash: jest.fn(),
        log: jest.fn(),
        recordError: jest.fn(),
        setBoolValue: jest.fn(),
        setFloatValue: jest.fn(),
        setIntValue: jest.fn(),
        setStringValue: jest.fn(),
        setUserIdentifier: jest.fn(),
    })),
    messaging: jest.fn(() => ({
        getToken: jest.fn(async () => "myMockToken"),
        hasPermission: jest.fn(async () => true),
        requestPermission: jest.fn(async () => true),
        subscribeToTopic: jest.fn(),
        unsubscribeFromTopic: jest.fn(),
    })),
    notifications: jest.fn(() => ({
        cancelAllNotifications: jest.fn(),
        cancelNotification: jest.fn(),
        displayNotification: jest.fn(),
        getBadge: jest.fn(async () => 1),
        getInitialNotification: jest.fn(),
        getScheduledNotifications: jest.fn(),
        onNotification: jest.fn(),
        onNotificationDisplayed: jest.fn(),
        onNotificationOpened: jest.fn(),
        removeAllDeliveredNotifications: jest.fn(),
        removeDeliveredNotification: jest.fn(),
        scheduleNotification: jest.fn(),
        setBadge: jest.fn(),
    })),
}));

// mock the NetInfo Native Module
NativeModules.RNCNetInfo = {
    addListener: jest.fn(),
    getCurrentState: jest.fn(() => Promise.resolve()),
    removeListeners: jest.fn(),
};

// mock the I18nManager Native Module
NativeModules.I18nManager = {
    localeIdentifier: "nl_BG",
};

// mock the SettingsManager Native Module
NativeModules.SettingsManager = {
    settings: jest.fn(() => ({
        AppleLocale: "nl_BG",
    })),
};

// mock the NetInfo Native Module
NativeModules.RNCNetInfo = {
    addListener: jest.fn(),
    getCurrentState: jest.fn(() => Promise.resolve()),
    removeListeners: jest.fn(),
};

jest.mock("app/ui/OfflineNotice");
