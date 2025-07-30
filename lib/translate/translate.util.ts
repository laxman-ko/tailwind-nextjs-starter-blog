import siteMetadata from '@/data/siteMetadata'
import { Translations } from './translate.types'

type TranslationTextKey = keyof Translations
type TranslationLocale = keyof Translations[TranslationTextKey]

export const _t = (text: TranslationTextKey, ...args: (string | number)[]): string => {
    const template = siteMetadata.translations[text][siteMetadata.locale as TranslationLocale] || text

    let i = 0
    return template.replace(/%%/g, () => {
        return args[i++]
    })
}