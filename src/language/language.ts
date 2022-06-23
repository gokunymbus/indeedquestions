import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import ja from './ja.json';
import ko from './ko.json';

const languageData: any = {
    de,
    en,
    es,
    fr,
    ja,
    ko
}

const defaultLanguageCode = "en";

export function getLanguageCode(): string {
    const lang = navigator.language;
    let foundCode;

    switch (true) {
        case /^en\b/.test(lang):
            foundCode = "en";
            break;

        case /^es\b/.test(lang):
            foundCode = "es";
            break;

        case /^ja\b/.test(lang):
            foundCode = "ja";
            break;

        case /^uk\b/.test(lang):
            foundCode = "uk";
            break;

        default:
            foundCode = defaultLanguageCode;
            break;
    }

    return foundCode;
}

export function getLanguageData(): object {
   const languageCode = getLanguageCode();
   return languageData[languageCode];
   
}