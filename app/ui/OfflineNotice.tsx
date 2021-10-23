import NetInfo from "@react-native-community/netinfo";
import React, { PureComponent } from "react";
import { withNamespaces, WithNamespaces } from "react-i18next";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { Theme } from "@react-navigation/native";

interface OfflineNoticeProps extends WithNamespaces {
    theme: Theme;
}

export interface OfflineNoticeState {
    isConnected: boolean;
}

export class OfflineNotice extends PureComponent<
    OfflineNoticeProps,
       OfflineNoticeState
    > {

    private componentIsMounted: boolean;

    constructor(props: OfflineNoticeProps) {
        super(props);
        this.componentIsMounted = false;
        this.state = {
            isConnected: true,
        };
    }

    public componentDidMount = () => {
        this.componentIsMounted = true;
        // fetch initial connection status as it only acts on a change
        NetInfo.isConnected.fetch().then((isConnected) => {
            if (this.componentIsMounted) {
                this.setState({isConnected});
            }
        });
        NetInfo.isConnected.addEventListener(
            "connectionChange",
            this.handleConnectivityChange,
        );
    }

    public componentWillUnmount = () => {
        this.componentIsMounted = false;
        NetInfo.isConnected.removeEventListener(
            "connectionChange",
            this.handleConnectivityChange,
        );
    }

    public handleConnectivityChange = (isConnected: boolean) => {
        this.setState({ isConnected });
    }

    public render() {
        if (!this.state.isConnected) {
            return (
                <View style={styles(this.props.theme).offlineContainer}>
                    <SafeAreaView>
                        <Text style={styles(this.props.theme).offlineText}>
                            {this.props.t("check-internet-connection")}
                        </Text>
                    </SafeAreaView>
                </View>
            );
        } else {
            return null;
        }
    }
}

const styles = (_: Theme) => StyleSheet.create({
    offlineContainer: {
        alignItems: "center",
        backgroundColor: "red",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
    },
    offlineText: {
        color: "#fff",
        paddingVertical: 8,
    },
});

export default withNamespaces("ui")(OfflineNotice);
