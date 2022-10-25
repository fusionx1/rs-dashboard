import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import getByLangKey from './lang/util'
import translations from './lang/translations.json'

i18n
.use(initReactI18next)
.init({
    lng: navigator.language,
    fallbackLng: 'de',
    resources: getByLangKey(translations),
    interpolation: {
        escapeValue: false
    }
})

export default i18n