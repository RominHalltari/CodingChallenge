import { DefaultTheme } from "@react-navigation/native";
import React from "react";
import { withNamespaces, WithNamespaces } from "react-i18next";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

import { Delivery } from "app/delivery/types";
import BaseText from "app/ui/BaseText";

interface DeliveryDetailsProps extends TouchableOpacityProps, WithNamespaces {
    delivery: Delivery;
    active: boolean;
}

export class DeliveryDetails extends React.PureComponent<DeliveryDetailsProps> {
    public render() {
        const {delivery} = this.props;
        return (
            <TouchableOpacity {...this.props} style={[styles.container, this.props.style]}>
                <View>
                    <BaseText variant="H3">{delivery.customer}</BaseText>
                    <BaseText variant="H3">{delivery.city}</BaseText>
                    <BaseText variant="H3">{delivery.address}</BaseText>
                </View>
                <BaseText style={styles.activeLabel} variant="H3">
                    {this.props.active ? this.props.t("active") : ""}
                </BaseText>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    activeLabel: {
        color: DefaultTheme.colors.notification,
    },
    container: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 8,
    },
});

export default withNamespaces("delivery")(DeliveryDetails);
