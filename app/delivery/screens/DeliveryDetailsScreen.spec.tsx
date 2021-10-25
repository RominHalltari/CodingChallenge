import React from "react";
import TestRenderer from "react-test-renderer";

import {
    DeliveryDetailsScreenProps,
    DeliveryDetailsScreenTranslated,
} from "app/delivery/screens/DeliveryDetailsScreen";
import { DeliveryStatus } from "app/delivery/types";
import { i18n } from "app/i18n";

describe("DeliveryDetailsScreen", () => {
    const defaultProps: DeliveryDetailsScreenProps = {
        i18n,
        t: (key) => (key),
        tReady: false,

        activeDeliveryId: null,
        requestFinishDeliveryError: null,
        requestingFinishDelivery: false,
        selectedDelivery: {
            address: "test",
            city: "test",
            customer: "John Doe",
            id: "1",
            latitude: 43,
            longitude: 12,
            zipCode: "ABC123",
        },

        finishDelivery: () => null,
        navigation: {pop: () => null},
        setActiveDeliveryId: () => null,
    };

    const component = (props = defaultProps) =>
        TestRenderer.create(<DeliveryDetailsScreenTranslated {...props} />).root;

    it("renders the active `make active` button, when activeDeliveryId is not equal to selectedDelivery.id", () => {
        const instance = component(defaultProps);
        const button = instance.findByProps({testID: "makeActiveButton"});
        expect(button).toBeDefined();
        expect(button.props.disabled).toEqual(false);
    });
    it("calls setActiveDeliveryId when clicking the `make active` button", () => {
        const setActiveDeliveryIdFn = jest.fn();
        const instance = component({
            ...defaultProps,
            setActiveDeliveryId: setActiveDeliveryIdFn,
        });
        const button = instance.findByProps({testID: "makeActiveButton"});
        button.props.onPress();
        expect(setActiveDeliveryIdFn).toHaveBeenCalledWith(defaultProps.selectedDelivery!.id);
    });
    it("renders the disabled `make active` button, when activeDeliveryId is not equal to selectedDelivery.id", () => {
        const instance = component({
            ...defaultProps,
            activeDeliveryId: "different",
        });
        const button = instance.findByProps({testID: "makeActiveButton"});
        expect(button).toBeDefined();
        expect(button.props.disabled).toEqual(true);
    });
    it("renders the `deactivate` button, when activeDeliveryId is equal to selectedDelivery.id", () => {
        const instance = component({
            ...defaultProps,
            activeDeliveryId: defaultProps.selectedDelivery!.id,
        });
        const button = instance.findByProps({testID: "makeActiveButton"});
        expect(button).toBeDefined();
        expect(button.props.disabled).toEqual(false);
    });
    it("doesn't render the delivered/undelivered buttons when delivery is not active", () => {
        const instance = component({
            ...defaultProps,
            activeDeliveryId: "different",
        });
        expect(instance.findAllByProps({testID: "setDeliveredButton"}).length).toEqual(0);
        expect(instance.findAllByProps({testID: "setUndeliveredButton"}).length).toEqual(0);
    });
    it("renders the delivered/undelivered buttons when delivery is active", () => {
        const instance = component({
            ...defaultProps,
            activeDeliveryId: defaultProps.selectedDelivery!.id,
        });
        expect(instance.findByProps({testID: "setDeliveredButton"})).toBeDefined();
        expect(instance.findByProps({testID: "setUndeliveredButton"})).toBeDefined();
    });
    it("calls finishDelivery when setDeliveredButton is pressed", () => {
        const finishDeliveryFn = jest.fn();
        const instance = component({
            ...defaultProps,
            activeDeliveryId: defaultProps.selectedDelivery!.id,
            finishDelivery: finishDeliveryFn,
        });
        instance.findByProps({testID: "setDeliveredButton"}).props.onPress();
        expect(finishDeliveryFn).toHaveBeenCalledWith(defaultProps.selectedDelivery, DeliveryStatus.DELIVERED);
    });
    it("calls finishDelivery when setUndeliveredButton is pressed", () => {
        const finishDeliveryFn = jest.fn();
        const instance = component({
            ...defaultProps,
            activeDeliveryId: defaultProps.selectedDelivery!.id,
            finishDelivery: finishDeliveryFn,
        });
        instance.findByProps({testID: "setUndeliveredButton"}).props.onPress();
        expect(finishDeliveryFn).toHaveBeenCalledWith(defaultProps.selectedDelivery, DeliveryStatus.UNDELIVERED);
    });
});
