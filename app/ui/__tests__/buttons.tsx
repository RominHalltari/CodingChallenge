import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import renderer from "react-test-renderer";

import { lightTheme } from "app/styles/default/colors";
import { DefaultButton } from "app/ui/buttons/DefaultButton";
import { DefaultRoundButton } from "app/ui/buttons/DefaultRoundButton";

describe("DefaultButton", () => {
    it("adjusts all sizes according to height property", () => {
        const height = 100;

        const expectedRadius = 50;
        const expectedHeight = 100;
        const expectedWidth = "100%";

        const component = renderer.create(
            <DefaultButton height={height} />,
        ).root;
        const componentStyle: ViewStyle = StyleSheet.flatten(
            component.findByType(TouchableOpacity).props.style,
        );

        expect(componentStyle.borderRadius).toBe(expectedRadius);
        expect(componentStyle.height).toBe(expectedHeight);
        expect(componentStyle.width).toBe(expectedWidth);
    });
});

describe("DefaultRoundButton", () => {

    it("applies default size", () => {

        const expectedRadius = 20;
        const expectedHeight = 40;
        const expectedWidth = 40;

        const component = renderer.create(
            <DefaultRoundButton theme={lightTheme} />,
        ).root;
        const componentStyle: ViewStyle = StyleSheet.flatten(
            component.findByType(TouchableOpacity).props.style,
        );
        expect(componentStyle.borderRadius).toBe(expectedRadius);
        expect(componentStyle.height).toBe(expectedHeight);
        expect(componentStyle.width).toBe(expectedWidth);
    });

    it("adjusts all sizes according to size property", () => {

        const size = 100;

        const expectedRadius = 50;
        const expectedHeight = 100;
        const expectedWidth = 100;

        const component = renderer.create(
            <DefaultRoundButton theme={lightTheme} size={size} />,
        ).root;
        const componentStyle: ViewStyle = StyleSheet.flatten(
            component.findByType(TouchableOpacity).props.style,
        );

        expect(componentStyle.borderRadius).toBe(expectedRadius);
        expect(componentStyle.height).toBe(expectedHeight);
        expect(componentStyle.width).toBe(expectedWidth);
    });
});
