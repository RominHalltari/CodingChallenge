import React from "react";
import { FlatList } from "react-native";
import TestRenderer from "react-test-renderer";

import { DeliveryDetails } from "app/delivery/components/DeliveryDetails";
import { DeliveriesListScreenProps, DeliveriesListScreenTranslated } from "app/delivery/screens/DeliveriesListScreen";
import { i18n } from "app/i18n";

describe("DeliveriesListScreen", () => {
    const defaultProps: DeliveriesListScreenProps = {
        i18n,
        t: (key) => (key),
        tReady: false,

        activeDeliveryId: null,
        deliveries: [{
            address: "test",
            city: "test",
            customer: "John Doe",
            id: "1",
            latitude: 43,
            longitude: 12,
            zipCode: "ABC123",
        }],

        getDeliveriesList: () => null,
        navigation: {push: () => null},
        setSelectedDelivery: () => null,
    };

    const component = (props = defaultProps) => TestRenderer.create(<DeliveriesListScreenTranslated {...props} />).root;

    it("renders a FlatList with data = props.deliveries", () => {
        const instance = component(defaultProps);
        const list = instance.findByType(FlatList);
        expect(list).toBeDefined();
        expect(list.props.data).toEqual(defaultProps.deliveries);
    });
    it("sets the selected delivery when a list item is called", () => {
        const pushFn = jest.fn();
        const instance = component({
            ...defaultProps,
            navigation: {push: pushFn},
        });
        instance.findByType(DeliveryDetails).props.onPress();
        expect(pushFn).toHaveBeenCalled();
    });
    it("navigates to DeliveryDetailsScreen when clicked on a list item", () => {
        const setSelectedDeliveryFn = jest.fn();
        const instance = component({
            ...defaultProps,
            setSelectedDelivery: setSelectedDeliveryFn,
        });
        instance.findByType(DeliveryDetails).props.onPress();
        expect(setSelectedDeliveryFn).toHaveBeenCalledWith(defaultProps.deliveries[0]);
    });
});
