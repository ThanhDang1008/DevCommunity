import i18n from "i18n";
import path from "path";
import { Language } from "./language";

i18n.configure({
  locales: [Language.ENGLISH, Language.VIETNAMESE, Language.CHINESE], // Add more locales as needed
  defaultLocale: Language.VIETNAMESE, // Default locale
  directory: path.join("./data", "locales"), // Directory where translation files are stored
  autoReload: true, // Automatically reload translations when they change
  syncFiles: true, // Synchronize translation files
  objectNotation: true, // Enable object notation for translation keys
  updateFiles: false, // Prevent i18n from updating translation files
  api: {
    __: "t", // Use __() as the translation function
    __n: "tn", // Use __n() for pluralization
  },
  register: global, // dùng để sử dụng i18n trong express
});

export default i18n;
