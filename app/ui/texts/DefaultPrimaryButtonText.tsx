import { Theme } from "@react-navigation/native";
import BaseText from "app/ui/BaseText";
import React from "react";
import { StyleSheet, TextProps } from "react-native";

interface DefaultPrimaryButtonTextProps extends TextProps {
    theme: Theme;
}

export class DefaultPrimaryButtonText extends React.PureComponent<DefaultPrimaryButtonTextProps> {
  public render() {
    return (
        <BaseText
            {...this.props}
            style={[ styles.default, this.props.style ]}
        />
    );
  }
}

const styles = StyleSheet.create({
    default: {
        color: "#1F2039",
        fontWeight: "bold",
        textTransform: "uppercase",
    },
});
