import { Theme } from "@react-navigation/native";
import React from "react";
import {
    I18nManager,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

export interface DefaultTextInputProps extends TextInputProps {
    theme: Theme;
    containerStyle?: ViewStyle;
    error?: string | null;
    startIconName?: string;
    startIconColors?: string;
    showClearTextButton?: boolean;
    blurredStyle?: ViewStyle;
    focusedStyle?: ViewStyle;
    disableFocus?: boolean;
    textInputStyle?: StyleProp<TextStyle>;
}

export interface DefaultTextState {
    focused: boolean;
    value: string | undefined;
}

export class DefaultTextInput extends React.PureComponent<DefaultTextInputProps, DefaultTextState> {
    private inputFieldReference: TextInput | null = null;

    constructor(props: DefaultTextInputProps) {
        super(props);
        this.state = {
            focused: false,
            value: props.value ? props.value : props.defaultValue,
        };
    }

    public clear() {
        if (this.inputFieldReference) {
            this.inputFieldReference.clear();
        }
    }

    public focus() {
        if (this.inputFieldReference) {
            this.inputFieldReference.focus();
        }
    }

    public isFocused() {
        if (this.inputFieldReference) {
            return this.inputFieldReference.isFocused();
        }
        return false;
    }

    public render() {
        const viewStyle = [
            styles(this.props.theme).formField,
            this.props.error ? styles(this.props.theme).errorBorder : null,
            this.props.style ? this.props.style : null,
            this.props.blurredStyle && !this.state.focused ? this.props.blurredStyle : null,
        ];

        return (
            <View style={this.props.containerStyle}>
                <View
                    style={viewStyle}
                    testID="inputView"
                >
                    {this.startIcon()}
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholderTextColor="lightgrey"
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        ref={(ref) => this.inputFieldReference = ref}
                        {...this.props}
                        style={[styles(this.props.theme).default, this.props.textInputStyle]}
                        testID="input"
                        onChangeText={this.onChangeTextCallback}
                    />
                </View>
                {this.showError()}
            </View>
        );
    }

    private onFocus = () => {
        if (!this.props.disableFocus) {
            this.setState({focused: true});
        }
    }

    private onBlur = () => {
        this.setState({focused: false});
    }

    private onChangeTextCallback = (text: string) => {
        this.setState({value: text});
        if (this.props.onChangeText) {
            this.props.onChangeText(text);
        }
    }

    private showError = () => {
        if (this.props.error) {
            return (
                <View style={styles(this.props.theme).errorView}>
                    <Icon
                        style={styles(this.props.theme).errorIcon}
                        name="exclamation-circle"
                        size={15}
                        color={this.props.startIconColors}
                    />
                    <Text style={styles(this.props.theme).errorText}>{this.props.error}</Text>
                </View>
            );
        } else {
            return null;
        }
    }

    private startIcon = () => {
        if (this.props.startIconName) {
            return (
                <Icon
                    style={{...styles(this.props.theme).icon, textShadowColor: this.props.startIconColors}}
                    name={this.props.startIconName}
                    size={15}
                    color={this.props.startIconColors}
                />
            );
        } else {
            return null;
        }
    }
}

const styles = (theme: Theme) => StyleSheet.create({
    clearButton: {
        height: 20,
        width: 20,
    },
    clearIcon: {
        color: "lightgrey",
    },
    default: {
        color: "#FFFFFF",
        flex: 1,
        textAlign: I18nManager.isRTL ? "right" : "left",
    },
    errorBorder: {
        borderColor: theme.colors.text,
        borderWidth: 1,
    },
    errorIcon: {
        color: theme.colors.text,
    },
    errorText: {
        color: theme.colors.text,
        marginLeft: 5,
    },
    errorView: {
        flexDirection: "row",
        marginTop: 4,
    },
    focusBorder: {
        borderColor: theme.colors.primary,
        borderWidth: 1,
    },
    formField: {
        alignItems: "center",
        backgroundColor: "#14192F",
        borderBottomColor: "#24253D",
        borderBottomWidth: 1,
        borderWidth: 0,
        flexDirection: "row",
        height: 40,
        justifyContent: "center",
        paddingHorizontal: 15,
    },
    icon: {
        paddingRight: 5,
    },
});
