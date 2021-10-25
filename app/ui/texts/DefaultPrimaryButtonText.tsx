import BaseText from "app/ui/BaseText";
import React from "react";
import { StyleSheet, TextProps } from "react-native";

export class DefaultPrimaryButtonText extends React.PureComponent<TextProps> {
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
