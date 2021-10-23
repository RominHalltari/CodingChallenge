import { BASE_TEXT_VARIANTS } from "app/styles/text";
import React, { ReactNode } from "react";
import { StyleSheet, Text, TextProps } from "react-native";

export type IBaseTextProps = TextProps & {
    children?: ReactNode;
    variant?: BASE_TEXT_VARIANTS;
};

const DEFAULT_GEOMETRIC_FONT_VARIANT = "normal";

/* eslint-disable react-native/no-unused-styles */
// to disable wrong warnings of dynamically selected styles
const styles = StyleSheet.create({
    H1: {
        color: "#000000",
        fontSize: 28,
        fontWeight: "800",
    },
    H2: {
        color: "#000000",
        fontSize: 21,
        fontWeight: "800",
    },
    H3: {
        color: "#000000",
        fontSize: 17,
    },
    normal: {
        color: "#000000",
        fontSize: 12,
    },
});

const BaseText = (props: IBaseTextProps) => (
    <Text
        {...props}
        style={[styles[props.variant || DEFAULT_GEOMETRIC_FONT_VARIANT], props.style]}
        allowFontScaling={false}
    >
        {props.children}
    </Text>
);

export default BaseText;
