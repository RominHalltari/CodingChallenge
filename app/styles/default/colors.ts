import { DarkTheme, Theme } from "@react-navigation/native";
import { tint } from "polished";

export const lightTheme: Theme = {
    colors: {
        background: "rgb(232, 232, 232)",
        border: "rgb(199, 199, 204)",
        card: "rgb(255, 255, 255)",
        notification: "rgb(149, 184, 249)",
        primary: "rgb(66, 104, 176)",
        text: "rgb(10, 15, 15)",
    },
    dark: false,
};

export const customTheme: Theme = {
    colors: {
        background: "rgb(255, 255, 255)",
        border: "rgb(199, 199, 204)",
        card: "rgb(255, 255, 255)",
        notification: "rgb(255, 69, 58)",
        primary: "rgb(255, 45, 85)",
        text: "rgb(28, 28, 30)",
    },
    dark: false,
};

export const darkTheme = DarkTheme;

export const light = (color: string) => tint(0.60, color);
export const xLight = (color: string) => tint(0.80, color);
export const xxLight = (color: string) => tint(0.90, color);
export const xxxLight = (color: string) => tint(0.95, color);
