import en from './en.json';
import ja from './ja.json';

const languageData: {
    [name: string]: languageObject
} = {
    en,
    ja
}

export interface languageObject {
    [name: string]: string
}

const defaultLanguageCode = 'en';
export function getLanguageCode(): string {
    const lang = navigator.language;
    let foundCode: string;

    switch (true) {
        case /^en\b/.test(lang):
            foundCode = 'en';
            break;

        case /^ja\b/.test(lang):
            foundCode = 'ja';
            break;

        default:
            foundCode = defaultLanguageCode;
            break;
    }

    return foundCode;
}

export function getLanguageData(): languageObject {
   const languageCode = getLanguageCode();
   return languageData[languageCode];
}