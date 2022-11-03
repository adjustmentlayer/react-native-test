import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as translationEN from '~locales/en/translation.json';
import { persistentStorage } from '~common/services/persistent-storage.service';

const resources = {
  en: {
    translation: translationEN
  }
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en',
    defaultNS: 'translation',
    resources,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  })
  .then(async () => {
    try {
      await persistentStorage.get('lang', false, (_, result) => {
        if (result) {
          i18n.changeLanguage(result);
        }
      });
    } catch (e) {
      console.error(e);
    }
  });

export { i18n };

export default i18n;
