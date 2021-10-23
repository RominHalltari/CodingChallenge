import { Shapes } from "app/auth/types";
import BaseText from "app/ui/BaseText";
import React from "react";
import { withNamespaces, WithNamespaces } from "react-i18next";
import { Alert, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";

interface LandingScreenState {
    data: Array<Array<Shapes | null>>;
    userTurn: Shapes;
}

class LandingScreen extends React.PureComponent<WithNamespaces, LandingScreenState> {
    public constructor(props: WithNamespaces) {
        super(props);
        this.state = {
            data: [[null, null, null], [null, null, null], [null, null, null]],
            userTurn: Shapes.SQUARE,
        };
    }

    public render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.renderRows()}
            </SafeAreaView>
        );
    }

    private renderRows = () => {
        return this.state.data?.map((shapes: Array<Shapes | null>, index: number) => {
            return (
                <View key={index} style={styles.row}>
                    {this.renderRow(shapes, index)}
                </View>
            );
        });
    }

    private renderRow = (shapes: Array<Shapes | null>, rowIndex: number) => {
        return shapes.map((shape: Shapes | null, index) => {
            return (
                <TouchableOpacity
                    key={index}
                    disabled={!!this.state.data[rowIndex][index]}
                    onPress={() => this.onShapePress(rowIndex, index)}
                    style={styles.rowItem}
                >
                    <View>{this.renderShape(shape)}</View>
                </TouchableOpacity>
            );
        });
    }

    private renderShape = (shape: Shapes | null) => {
        if (!shape) {
            return null;
        }
        return shape === Shapes.CIRCLE ?
            <BaseText style={styles.shape}>O</BaseText> : <BaseText style={styles.shape}>▢</BaseText>;
    }

    private onShapePress = (rowIndex: number, columnIndex: number) => {
        const { data, userTurn } = this.state;
        data[rowIndex][columnIndex] = userTurn;

        this.setState({
            data,
            userTurn: this.state.userTurn === Shapes.SQUARE ? Shapes.CIRCLE : Shapes.SQUARE,
        });

        // if (this.checkIfGameEnded(data, rowIndex, columnIndex)) {
        //     setTimeout(() => {
        //         Alert.alert("YOU WON!")
        //     }, 200);
        // }
    }

    private checkIfGameEnded = (data: Array<Array<Shapes | null>>, rowIndex: number, columnIndex: number) => {
        const focusedShape = data[rowIndex][columnIndex];
        // center
        // if (rowIndex === 1 && columnIndex === 1) {
        //     return data[0][1] === focusedShape && data[2][1] === focusedShape
        //         || data[0][0] === focusedShape && data[2][2] === focusedShape
        //         || data[2][2] === focusedShape && data[0][0] === focusedShape;
        // }

        const winLines = [
            [[0, 0], [0, 1], [0, 2]],
        ];

        let won = true;
        winLines.forEach((line, index: number) => {
            line.forEach((entry) => {
                if (data[line[index][entry[0]]][line[index][entry[1]]] !== focusedShape) {
                    won = false;
                }
            });
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        width: "100%",
    },
    rowItem: {
        alignItems: "center",
        borderColor: "black",
        borderWidth: 2,
        flexDirection: "row",
        height: 100,
        justifyContent: "center",
        width: "33%",
    },
    shape: {
        fontSize: 42,
        fontWeight: "bold",
    },
});

export default withNamespaces("auth")(LandingScreen);
