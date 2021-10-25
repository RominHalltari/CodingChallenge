import React from "react";
import { withNamespaces, WithNamespaces } from "react-i18next";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { connect } from "react-redux";

import { finishDelivery, setActiveDeliveryId } from "app/delivery/actions/delivery";
import DeliveryDetails from "app/delivery/components/DeliveryDetails";
import {
    getActiveDeliveryId,
    getIsRequestingFinishDelivery,
    getRequestFinishDeliveryError,
    getSelectedDelivery,
} from "app/delivery/selectors";
import { Delivery, DeliveryStatus } from "app/delivery/types";
import { State } from "app/modules";
import { DefaultButton } from "app/ui/buttons/DefaultButton";
import { DefaultPrimaryButtonText } from "app/ui/texts/DefaultPrimaryButtonText";

export interface DeliveryDetailsScreenProps extends WithNamespaces {
    requestingFinishDelivery: boolean;
    requestFinishDeliveryError: string | null;
    selectedDelivery: Delivery | null;
    activeDeliveryId: string | null;
    setActiveDeliveryId: (id: string | null) => void;
    finishDelivery: (delivery: Delivery, status: DeliveryStatus) => void;
    navigation: {pop: () => void; };
}

class DeliveryDetailsScreen extends React.PureComponent<DeliveryDetailsScreenProps> {
    public render() {
        return (
            <View style={styles.container}>
                {this.renderActivityIndicator()}
                <DeliveryDetails
                    active={this.props.activeDeliveryId === this.props.selectedDelivery!.id}
                    delivery={this.props.selectedDelivery!}
                    style={{borderBottomWidth: 0}}
                />
                {this.renderMakeActiveButton()}
                {this.renderActiveDeliveryButtons()}
            </View>
        );
    }

    public componentDidUpdate(prevProps: DeliveryDetailsScreenProps) {
        if (prevProps.requestingFinishDelivery && !this.props.requestingFinishDelivery) {
            if (this.props.requestFinishDeliveryError) {
                Alert.alert(this.props.t("something-went-wrong"), this.props.t("something-went-wrong-message"));
            } else {
                Alert.alert(
                    this.props.t("success"),
                    this.props.t("status-updated-successfully"),
                    [{
                        onPress: () => {
                            this.props.setActiveDeliveryId(null);
                            this.props.navigation.pop();
                        },
                        text: this.props.t("got-it"),
                    }],
                    {cancelable: false},
                );
            }
        }
    }

    private renderActivityIndicator = () => {
        if (this.props.requestingFinishDelivery) {
            return (
                <ActivityIndicator/>
            );
        }
        return null;
    }

    private renderMakeActiveButton = () => {
        const label = this.props.selectedDelivery?.id === this.props.activeDeliveryId ?
            this.props.t("deactivate") : this.props.t("make-active");
        const disabled = !!this.props.activeDeliveryId
            && this.props.selectedDelivery?.id !== this.props.activeDeliveryId;
        const onPress = () => this.props.activeDeliveryId ?
            this.props.setActiveDeliveryId(null) : this.props.setActiveDeliveryId(this.props.selectedDelivery!.id);
        return (
            <DefaultButton
                style={styles.button}
                disabled={disabled}
                onPress={onPress}
                testID="makeActiveButton"
            >
                <DefaultPrimaryButtonText>
                    {label}
                </DefaultPrimaryButtonText>
            </DefaultButton>
        );
    }

    private renderActiveDeliveryButtons = () => {
        if (this.props.activeDeliveryId !== this.props.selectedDelivery?.id) {
            return null;
        }
        return (
            <>
                <DefaultButton
                    style={styles.button}
                    onPress={() => this.props.finishDelivery(this.props.selectedDelivery!, DeliveryStatus.DELIVERED)}
                    testID="setDeliveredButton"
                >
                    <DefaultPrimaryButtonText>
                        {this.props.t("set-delivered")}
                    </DefaultPrimaryButtonText>
                </DefaultButton>
                <DefaultButton
                    style={styles.button}
                    onPress={() => this.props.finishDelivery(this.props.selectedDelivery!, DeliveryStatus.UNDELIVERED)}
                    testID="setUndeliveredButton"
                >
                    <DefaultPrimaryButtonText>
                        {this.props.t("set-undelivered")}
                    </DefaultPrimaryButtonText>
                </DefaultButton>
            </>

        );
    }
}

const styles = StyleSheet.create({
    button: {
        marginTop: 16,
    },
    container: {
        padding: 8,
    },
});

const mapStateToProps = (state: State) => {
    return {
        activeDeliveryId: getActiveDeliveryId(state),
        requestFinishDeliveryError: getRequestFinishDeliveryError(state),
        requestingFinishDelivery: getIsRequestingFinishDelivery(state),
        selectedDelivery: getSelectedDelivery(state),
    };
};

const mapDispatchToProps = {
    finishDelivery,
    setActiveDeliveryId,
};

export const DeliveryDetailsScreenTranslated = withNamespaces("delivery")(DeliveryDetailsScreen);
export default connect(mapStateToProps, mapDispatchToProps)(DeliveryDetailsScreenTranslated);
