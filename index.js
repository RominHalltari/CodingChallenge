import AppContainer from "./app/index";
import { AppRegistry } from "react-native";
import React from "react";

const App: () => React$Node = () => <AppContainer/>;

AppRegistry.registerComponent('CodingChallenge', () => App);

