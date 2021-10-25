import React from "react";
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from "react-native";

import { DefaultTheme } from "@react-navigation/native";
import { xLight } from "app/styles";

interface DefaultButtonProps extends TouchableOpacityProps {
    disabledColor?: string;
    height?: number;
    loading?: boolean;
    onDisabledPress?: () => void;
}

export class DefaultButton extends React.PureComponent<DefaultButtonProps> {
    public static defaultProps = {
        height: 56,
        onDisabledPress: () => null,
        theme: DefaultTheme,
    };

    public render() {
        const disabled = this.props.disabled !== undefined ? this.props.disabled : this.props.loading;
        const height = this.props.height!; // initialized in defaultProps

        let disabledColorStyle = {};
        if (disabled) {
            disabledColorStyle = {
                backgroundColor: this.props.disabledColor || xLight(DefaultTheme.colors.primary),
            };
        }

        const style: StyleProp<ViewStyle> = [
            styles.default,
            {
                borderRadius: height / 2,
                height,
                width: "100%",
            },
            this.props.style,
            disabledColorStyle,
        ];

        let content;
        if (this.props.loading) {
            content = (
                <View style={styles.loadingContent}>
                    <ActivityIndicator
                        color={DefaultTheme.colors.background}
                        style={styles.spinner}
                    />
                    {this.props.children}
                </View>
            );
        } else {
            content = this.props.children;
        }

        return (
            <TouchableOpacity
                {...this.props}
                onPress={disabled ? this.props.onDisabledPress : this.props.onPress}
                style={style}
            >
                {content}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    default: {
        alignItems: "center",
        backgroundColor: "#2FE1B9",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    loadingContent: {
        flexDirection: "row",
    },
    spinner: {
        marginRight: 5,
    },
});
