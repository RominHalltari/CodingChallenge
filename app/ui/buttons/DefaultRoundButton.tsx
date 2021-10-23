import { Theme } from "@react-navigation/native";
import React from "react";
import {
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProperties,
    ViewStyle,
} from "react-native";

import { xLight } from "app/styles";

interface DefaultRoundButtonProps extends TouchableOpacityProperties {
    theme: Theme;
    disabledColor?: string;
    size?: number;
}

export class DefaultRoundButton extends React.PureComponent<DefaultRoundButtonProps> {

    public static defaultProps = {
        size: 40,
    };

    public render() {
        const size = this.props.size || DefaultRoundButton.defaultProps.size;
        let disabledColorStyle = {};
        if (this.props.disabled) {
            disabledColorStyle = {
                backgroundColor: this.props.disabledColor || xLight(this.props.theme.colors.primary),
            };
        }
        const style: StyleProp<ViewStyle> = [
            styles(this.props.theme).default,
            this.props.style,
            {
                borderRadius: size / 2,
                height: size,
                width: size,
            },
            disabledColorStyle,
        ];

        return (
            <TouchableOpacity
                {...this.props}
                style={style}
            />
        );
    }
}

const styles = (theme: Theme) => StyleSheet.create({
    default: {
        alignItems: "center",
        backgroundColor: theme.colors.primary,
        justifyContent: "center",
    },
});
