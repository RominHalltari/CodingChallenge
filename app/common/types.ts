export interface Language {
    code: string;
    isRTL: boolean;
}

export const english = {code: "en", isRTL: false};

export const supportedLanguages: ReadonlyArray<Language> = [english];

