import React from "react";
import {
    withNamespaces,
    WithNamespaces,
} from "react-i18next";
import { FlatList } from "react-native";
import { connect } from "react-redux";

import { getDeliveriesList, setSelectedDelivery } from "app/delivery/actions/delivery";
import DeliveryDetails from "app/delivery/components/DeliveryDetails";
import { getActiveDeliveryId, getDeliveriesList as getDeliveriesListSelector } from "app/delivery/selectors";
import { Delivery } from "app/delivery/types";
import { State } from "app/modules";

export interface DeliveriesListScreenProps extends WithNamespaces {
    deliveries: Delivery[];
    activeDeliveryId: string | null;
    getDeliveriesList: () => void;
    setSelectedDelivery: (delivery: Delivery) => void;
    navigation: {push: (screenId: string) => void; };
}

class DeliveriesListScreen extends React.PureComponent<DeliveriesListScreenProps> {
    public componentDidMount() {
        this.props.getDeliveriesList();
    }

    public render() {
        return (
            <FlatList
                data={this.props.deliveries}
                renderItem={this.renderItem}
                extraData={this.props.activeDeliveryId}
            />
        );
    }

    private renderItem = ({item}: {item: Delivery}) => {
        return (
            <DeliveryDetails
                delivery={item}
                active={item.id === this.props.activeDeliveryId}
                onPress={() => this.onItemPress(item)}
            />
        );
    }

    private onItemPress = (delivery: Delivery) => {
        this.props.setSelectedDelivery(delivery);
        this.props.navigation.push("DeliveryDetailsScreen");
    }
}

const mapStateToProps = (state: State) => {
    return {
        activeDeliveryId: getActiveDeliveryId(state),
        deliveries: getDeliveriesListSelector(state),
    };
};

const mapDispatchToProps = {
    getDeliveriesList,
    setSelectedDelivery,
};

export const DeliveriesListScreenTranslated = withNamespaces("delivery")(DeliveriesListScreen);
export default connect(mapStateToProps, mapDispatchToProps)(DeliveriesListScreenTranslated);
