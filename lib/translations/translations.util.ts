import siteMetadata from '@/data/siteMetadata'
import translationsText from './translations.text.json'

type TranslationTextKey = keyof typeof translationsText
type TranslationLocale = keyof typeof translationsText[TranslationTextKey]

export const _t = (text: TranslationTextKey, ...args: (string | number)[]): string => {
  const template = translationsText[text][siteMetadata.locale as TranslationLocale] || text

  let i = 0
  return template.replace(/%%/g, () => {
    return args[i++]?.toString() || ''
  })
}
