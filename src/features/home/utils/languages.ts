// currentFile: constants/languages.ts
type Language = {
    dropdownValue: string
    countryName: string
  }
  export enum PageDirection {
    RTL = "rtl",
    LTR = "ltr"
  }
  export const defaultLanguage = "en"
  export const supportedLanguagesMap: Record<string, Language> = {
    ar: { dropdownValue: "عربي", countryName: "Arab" },
    en: { dropdownValue: "English", countryName: "England" }
  }
  export const supportedLanguages = Object.keys(supportedLanguagesMap)
  
  export function humanReadableLanguage(key = defaultLanguage) {
    return supportedLanguagesMap[key].dropdownValue
  }
  
  export function getCountryName(key = defaultLanguage) { 
    return supportedLanguagesMap[key]?.countryName
  }