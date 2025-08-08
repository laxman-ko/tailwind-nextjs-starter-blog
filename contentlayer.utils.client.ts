import translationsText from '@/data/translations.json'
import tagData from 'app/tag-data.json'
import siteMetadata from '@/data/siteMetadata'
import { useSearchParams } from 'next/navigation'

type Locale = keyof typeof siteMetadata

type SiteMetadata = (typeof siteMetadata)[Locale]

const getLocale = (): Locale => {
  const locale = useSearchParams().get('locale') as Locale
  return locale
}

const getAllTagsByLocale = (): Record<string, number> => {
  const locale = getLocale()
  return tagData[locale]
}

type TranslationText = keyof typeof translationsText
type TranslationFn = (text: TranslationText, ...args: (string | number)[]) => string

const getTranslationByLocale = () => {
  const locale = getLocale()
  const translateFn: TranslationFn = (text, ...args) => {
    const template = translationsText[text][locale] || text

    let i = 0
    return template.replace(/%%/g, () => {
      return args[i++]?.toString() || ''
    })
  }

  return translateFn
}

const getSiteMetadataByLocale = (): SiteMetadata => {
  const locale = getLocale()
  return siteMetadata[locale]
}

export { getAllTagsByLocale, getTranslationByLocale, getSiteMetadataByLocale }

export type { Blog, Authors } from '.contentlayer/generated'
export type { Locale, TranslationText }
