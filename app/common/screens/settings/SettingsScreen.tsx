import { darken } from "polished";
import React from "react";
import {
    withNamespaces,
    WithNamespaces,
} from "react-i18next";
import { I18nManager, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";

import { Theme } from "@react-navigation/native";
import { setLanguage, setTheme } from "app/common/actions";
import { getLanguage } from "app/common/selectors/language";
import { getTheme } from "app/common/selectors/theme";
import { Language, supportedLanguages } from "app/common/types";
import { State } from "app/modules";
import { light, xxLight } from "app/styles";
import { customTheme, darkTheme, lightTheme } from "app/styles/default/colors";

interface SettingsScreenProps extends WithNamespaces {
    language: Language;
    theme: Theme;
    setLanguage: (language: Language) => void;
    setTheme: (theme: Theme) => void;
}

interface SettingsScreenState {
    changedLanguage: boolean;
}

class SettingsScreen extends React.PureComponent<SettingsScreenProps, SettingsScreenState> {
    public constructor(props: SettingsScreenProps) {
        super(props);
        this.state = {
            changedLanguage: false,
        };
    }

    public render() {
        return (
            <SafeAreaView style={styles(this.props.theme).container}>
                {this.renderLanguagesPicker()}
                {this.renderThemePicker()}
            </SafeAreaView>
        );
    }

    private renderLanguagesPicker = () => {
        return (
            <>
                <View style={styles(this.props.theme).languagesContainer}>
                    <Text style={styles(this.props.theme).sectionTitle}>{this.props.t("language")}</Text>
                    {this.renderLanguages()}
                </View>
                {this.state.changedLanguage && <Text style={styles(this.props.theme).warning}>{this.props.t("restart-app")}</Text>}
            </>
        );
    }

    private renderLanguages = () => {
        return supportedLanguages.map((language: Language) => {
            const theme = this.props.theme;
            const current = this.props.language.code;
            return (
                <TouchableOpacity
                    style={[styles(theme).languageOptionContainer, current === language.code && styles(theme).selected]}
                    disabled={current === language.code}
                    key={language.code}
                    onPress={() => this.onLanguagePress(language)}
                >
                    <Text style={{textDecorationLine: current === language.code ? "underline" : "none"}}>
                        {this.props.t(language.code)}
                    </Text>
                </TouchableOpacity>
            );
        });
    }

    private renderThemePicker = () => {
        const previews = [lightTheme, darkTheme, customTheme].map((theme: Theme, index) => {
            return (
                <TouchableOpacity
                    key={index}
                    onPress={() => this.onThemePress(theme)}
                    style={[styles(this.props.theme).themeContainer, {backgroundColor: theme.colors.background}]}
                >
                    <Text style={{color: theme.colors.primary}}>{this.getThemeLabel(index)}</Text>
                </TouchableOpacity>
            );
        });
        return (
            <View style={styles(this.props.theme).themesContainer}>
                <Text style={styles(this.props.theme).sectionTitle}>{this.props.t("theme")}</Text>
                {previews}
            </View>
        );
    }

    private getThemeLabel = (index: number) => {
        switch (index) {
            case 0:
                return this.props.t("light");
            case 1:
                return this.props.t("dark");
            case 2:
                return this.props.t("custom");
        }
    }

    private onLanguagePress = (language: Language) => {
        this.props.setLanguage(language);
        I18nManager.forceRTL(language.isRTL);
        this.setState({changedLanguage: true});
    }

    private onThemePress = (theme: Theme) => {
        this.props.setTheme(theme);
    }
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
    },
    languageOptionContainer: {
        alignItems: "center",
        backgroundColor: "white",
        borderColor: theme.colors.border,
        borderRadius: 4,
        borderWidth: 1,
        justifyContent: "center",
        minWidth: 70,
        padding: 8,
    },
    languagesContainer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 40,
    },
    sectionTitle: {
        color: darken(0.2, theme.colors.primary),
        fontSize: 17,
        fontWeight: "bold",
        minWidth: 80,
        textAlign: I18nManager.isRTL ? "left" : "right",
    },
    selected: {
        backgroundColor: xxLight(theme.colors.primary),
        borderColor: light(theme.colors.primary),
    },
    themeContainer: {
        alignItems: "center",
        borderColor: theme.colors.border,
        borderWidth: 1,
        justifyContent: "center",
        minWidth: 70,
        padding: 8,
    },
    themesContainer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 32,
    },
    warning: {
        color: theme.colors.text,
        fontSize: 16,
        marginTop: 24,
        textAlign: "center",
    },
});

const mapStateToProps = (state: State) => {
    return {
        language: getLanguage(state),
        theme: getTheme(state),
    };
};

const mapDispatchToProps = {
    setLanguage,
    setTheme,
};

const SettingsScreenTranslated = withNamespaces("common")(SettingsScreen);
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreenTranslated);
