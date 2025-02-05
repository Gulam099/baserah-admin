// currentFile: ./i18n.config.ts

import {
  defaultLanguage,
  supportedLanguages,
} from "@/features/home/utils/languages";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
i18n.use(initReactI18next).init({
  fallbackLng: defaultLanguage,
  supportedLngs: supportedLanguages,
  load: "currentOnly",
  lowerCaseLng: true,
  preload: [defaultLanguage, "ar"],
  resources: {
    // 👇 Translations loaded from ./locales/**/*.json
    // ...translationFiles,
  },
}); // Add a comma here

export default i18n;
