import LandingScreen from "app/auth/screens/login/LandingScreen";
import LoginScreen from "app/auth/screens/login/LoginScreen";
import CoinDetailsScreen from "app/cryptoTracker/screens/CoinDetailsScreen";
import React from "react";
import {
    withNamespaces,
    WithNamespaces,
} from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { connect } from "react-redux";

import { NavigationContainer, Theme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getIsLoggedIn } from "app/auth/selectors/auth";
import { getTheme } from "app/common/selectors/theme";
import { State } from "app/modules";

interface NavigationContainerProps extends WithNamespaces {
    isLoggedIn: boolean;
    theme: Theme;
}

class ScreensContainer extends React.PureComponent<NavigationContainerProps> {
    public render() {
        const Stack = createStackNavigator();
        const landingScreen = (
            <Stack.Screen
                options={{headerShown: false}}
                name="LandingScreen"
                component={LandingScreen}
            />
        );
        const loginScreen = (
            <Stack.Screen
                options={{headerShown: false}}
                name="LoginScreen"
                component={LoginScreen}
            />
        );

        return (
            <NavigationContainer theme={this.props.theme} fallback={this.renderFallback()}>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    {!this.props.isLoggedIn && landingScreen}
                    {!this.props.isLoggedIn && loginScreen}
                    <Stack.Screen name="HomeScreen" component={CoinDetailsScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    private renderFallback = () => {
        return (
            <View style={styles.fallbackContainer}>
                <ActivityIndicator color={this.props.theme.colors.primary} size="large"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fallbackContainer: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
});

const mapStateToProps = (state: State) => {
    return {
        isLoggedIn: getIsLoggedIn(state),
        theme: getTheme(state),
    };
};

const ScreensContainerTranslated = withNamespaces("auth")(ScreensContainer);
export default connect(mapStateToProps)(ScreensContainerTranslated);
