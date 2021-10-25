import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DeliveriesListScreen from "app/delivery/screens/DeliveriesListScreen";
import DeliveryDetailsScreen from "app/delivery/screens/DeliveryDetailsScreen";
import { withNamespaces, WithNamespaces } from "react-i18next";

class ScreensContainer extends React.PureComponent<WithNamespaces> {
    public render() {
        const Stack = createStackNavigator();

        return (
            <NavigationContainer fallback={this.renderFallback()}>
                <Stack.Navigator>
                    <Stack.Screen
                        options={{headerShown: true, title: this.props.t("deliveries")}}
                        name="DeliveriesListScreen"
                        component={DeliveriesListScreen}
                    />
                    <Stack.Screen
                        options={{headerShown: true, title: this.props.t("delivery-details")}}
                        name="DeliveryDetailsScreen"
                        component={DeliveryDetailsScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    private renderFallback = () => {
        return (
            <View style={styles.fallbackContainer}>
                <ActivityIndicator size="large"/>
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

export default withNamespaces("common")(ScreensContainer);
