import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Static imports for translations
import enCommon from "../../public/locales/en/common.json";
import arCommon from "../../public/locales/ar/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    ns: ["common"],
    defaultNS: "common",
    resources: {
      en: {
        common: enCommon,
      },
      ar: {
        common: arCommon,
      },
    },
    interpolation: {
      escapeValue: false,
    },
    react: { useSuspense: false },
  });

export default i18n;

