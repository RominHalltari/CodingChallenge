import React from "react";
import {
    Button,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { connect } from "react-redux";

import { resetState } from "app/actions";

import { Theme } from "@react-navigation/native";
import { postData } from "app/api/client";
import BuildConfig from "app/settings/build-config";

export interface MenuProps {
    theme: Theme;
    onResetState: () => void;
}

class Menu extends React.Component<MenuProps> {
    public render() {
        return (
            <SafeAreaView style={styles(this.props.theme).container}>
                <View style={styles(this.props.theme).buttonContainer}>
                    <Button
                        onPress={this.openStorybook}
                        title="Open Storybook"
                    />
                </View>
                <View style={styles(this.props.theme).buttonContainer}>
                    <Button
                        onPress={this.props.onResetState}
                        title="Reset State"
                    />
                </View>
                <View style={styles(this.props.theme).buttonContainer}>
                    <Button
                        onPress={this.onSendPushNotificationPress}
                        title="Send Push Notification"
                    />
                </View>
                <Text>Node environment: {process.env.NODE_ENV || "undefined"}</Text>
                <Text>
                    {`Build config: ${process.env.BUILD_FLAVOR} \n`}
                    {`BASE_URL = ${BuildConfig.BASE_URL} \n`}
                    {`STYLE = ${BuildConfig.STYLE} \n`}
                </Text>
            </SafeAreaView>
        );
    }

    private onSendPushNotificationPress = () => {
        postData("/user/notificationdevice/test", {}, {
            body: "Notification body",
            delay: 0,
            tab: "debug",
            title: "Notification Title",
        });
    }

    private openStorybook = () => {
        // Navigation.push(this.props.componentId, {
        //         component: {
        //             name: "debug.Storybook",
        //         },
        //     },
        // );
    }
}

const styles = (_: Theme) => StyleSheet.create({
    buttonContainer: {
        justifyContent: "center",
        marginHorizontal: 16,
    },
    container: {
        flex: 1,
        padding: 8,
    },
    text: {
        textAlign: "center",
    },
});

export const mapDispatchToProps = {
    onResetState: resetState,
};

export default connect(null, mapDispatchToProps)(Menu);
