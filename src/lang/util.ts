// Transforms the translations.json into a i18next-compatible format

import { Translations } from './model'


/**
 * 
 * translations.json:
 * {
 *      "language": {
 *          "de": "deutsch",
 *          "en": "german",
 *      },
 *      "welcome": {
 *          "de": "Willkommen"
 *      }
 * }
 * 
 * this gets transformed into
 * 
 * {
 *      "de": {
 *          "language": "deutsch",
 *          "welcome": "Willkommen"
 *      },
 *      "en": {
 *          "language": "german"
 *      }
 * }
 * 
 * The structure of translations.json is key-based, which is easier to maintain if you have hundreds of keys.
 * 
 */
function getByLangKey(json: Translations) {

    const nls = { de: { translation: {} } }
    for (const propKey in json) { // Loop through properties
        for (const langKey in json[propKey]) { // Loop through translations
            if (!nls[langKey]) nls[langKey] = { translation: {}} // Add language if necessary
            nls[langKey].translation[propKey] = json[propKey][langKey] // Add value to nls
        }
    }
    return nls
}

export default getByLangKey