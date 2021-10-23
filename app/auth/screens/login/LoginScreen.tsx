import { getLoginError } from "app/auth/selectors/auth";
import BaseText from "app/ui/BaseText";
import React from "react";
import {
    withNamespaces,
    WithNamespaces,
} from "react-i18next";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";

import { DefaultTheme } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { login } from "app/auth/actions/auth";
import { State } from "app/modules";
import { DefaultButton } from "app/ui/buttons/DefaultButton";
import { DefaultTextInput } from "app/ui/TextInput";
import { DefaultPrimaryButtonText } from "app/ui/texts/DefaultPrimaryButtonText";

interface LoginScreenProps extends StackScreenProps<{}>, WithNamespaces {
    login: (username: string, password: string) => void;
    loginError: string | null;
}

interface LoginScreenState {
    username: string;
    password: string;
}

class LoginScreen extends React.PureComponent<LoginScreenProps, LoginScreenState> {
    public constructor(props: LoginScreenProps) {
        super(props);
        this.state = {
            password: "",
            username: "",
        };
    }

    public componentDidUpdate(prevProps: Readonly<LoginScreenProps>) {
        if (!prevProps.loginError && this.props.loginError) {
            alert("Something went wrong, please try again!");
        }
    }

    public render() {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <BaseText variant="H1">{this.props.t("welcome-back")}</BaseText>
                    <BaseText variant="H3">{this.props.t("enter-auth-info")}</BaseText>
                    <DefaultTextInput
                        theme={DefaultTheme}
                        placeholder={this.props.t("email-address")}
                        containerStyle={styles.textInputContainer}
                        value={this.state.username}
                        onChangeText={(username) => this.setState({ username })}
                        textContentType="emailAddress"
                    />
                    <DefaultTextInput
                        theme={DefaultTheme}
                        placeholder={this.props.t("enter-your-password")}
                        containerStyle={styles.textInputContainer}
                        value={this.state.password}
                        onChangeText={(password) => this.setState({ password })}
                        secureTextEntry={true}
                    />
                </View>
                <View style={[styles.container, { justifyContent: "flex-end" }]}>
                    <DefaultButton
                        theme={DefaultTheme}
                        disabled={!(this.state.password && this.state.username)}
                        style={styles.button}
                        onPress={this.onLoginPress}
                    >
                        <DefaultPrimaryButtonText theme={DefaultTheme}>
                            {this.props.t("login")}
                        </DefaultPrimaryButtonText>
                    </DefaultButton>
                </View>
                <Ionicons
                    name="close"
                    size={44}
                    style={styles.closeButton}
                    onPress={() => this.props.navigation.pop()}
                />
            </SafeAreaView>
        );
    }

    private onLoginPress = () => {
        this.props.login(this.state.username, this.state.password);
    }
}

const styles = StyleSheet.create({
    button: {
        marginTop: 24,
    },
    closeButton: {
        color: "#FFFFFF",
        position: "absolute",
        right: 32,
        top: 56,
    },
    container: {
        flex: 1,
        marginHorizontal: 30,
        marginTop: 100,
    },
    safeArea: {
        backgroundColor: "#14192F",
        flex: 1,
    },
    textInputContainer: {
        marginVertical: 16,
    },
});

const mapStateToProps = (state: State) => {
    return {
        loginError: getLoginError(state),
    };
};

const mapDispatchToProps = {
    login,
};

const LoginScreenTranslated = withNamespaces("auth")(LoginScreen);
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreenTranslated);
