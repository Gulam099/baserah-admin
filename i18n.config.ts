import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Manual imports of JSON files
import enCommon from "@/../public/locales/en/common.json";
import arCommon from "@/../public/locales/ar/common.json";

import {
  defaultLanguage,
  supportedLanguages,
} from "@/features/home/utils/languages";

i18n.use(initReactI18next).init({
  fallbackLng: defaultLanguage,
  supportedLngs: supportedLanguages,
  lng: defaultLanguage,
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
});

export default i18n;
