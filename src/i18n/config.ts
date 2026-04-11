import en from '@/locales/en.json'
import pl from '@/locales/pl.json'
import {
  type AppLanguage,
  persistLanguage,
  readPersistedLanguage,
} from '@/services/languageLocalStorage'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const initialLng = readPersistedLanguage() ?? 'en'

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pl: { translation: pl },
  },
  lng: initialLng,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng
  }
  persistLanguage(lng as AppLanguage)
})

if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLng
}

export default i18n
