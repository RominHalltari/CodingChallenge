export interface Language {
    code: string;
    isRTL: boolean;
}

export const english = {code: "en", isRTL: false};
export const arabic = {code: "ar", isRTL: true};
export const italian = {code: "it", isRTL: false};

export const supportedLanguages: ReadonlyArray<Language> = [english, arabic, italian];

