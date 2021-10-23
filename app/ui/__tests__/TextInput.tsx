import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, ViewStyle } from "react-native";
import renderer from "react-test-renderer";

import { lightTheme } from "app/styles/default/colors";
import { DefaultTextInput } from "app/ui/TextInput";

describe("DefaultTextInput", () => {
    it("hides the clear text button when showClearTextButton is false", () => {
        const component = renderer.create(
            <DefaultTextInput
                theme={lightTheme}
                value={"test"}
                showClearTextButton={false}
            />,
        ).root;
        const button = component.findAllByType(TouchableOpacity);
        expect(button.length).toEqual(0);
    });

    it("calls the onChange callback on text change", () => {
        const onChangeText = jest.fn();
        const component = renderer.create(
            <DefaultTextInput
                theme={lightTheme}
                onChangeText={onChangeText}
            />,
        ).root;
        const input = component.findByType(TextInput);
        input.props.onChangeText("test");
        expect(onChangeText).toHaveBeenCalledWith("test");
    });

    it("hides border on blur", () => {
        const component = renderer.create(<DefaultTextInput theme={lightTheme} />).root;
        component.findByProps({testID: "input"}).props.onBlur();
        const componentStyle: ViewStyle = StyleSheet.flatten(
            component.findByProps({testID: "inputView"}).props.style,
        );
        expect(componentStyle.borderWidth).toBe(0);
    });

});
