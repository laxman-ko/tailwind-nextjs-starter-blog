import { DocumentTypes } from '.contentlayer/generated'
import { allBlogs, allAuthors } from '.contentlayer/generated'
import type { Blog, Authors } from '.contentlayer/generated'
import translationsText from '@/data/translations.json'
import { headers } from 'next/headers'

import siteMetadata from '@/data/siteMetadata'

const LOCALES = siteMetadata.locales
const LANGUAGE_COUNTRY_MATCH_REGEX = /^\/([a-z]{2})(?:\/([a-z]{2}))?(?=\/|$)/
const LOCALE_HEADER = 'x-locale'

type Locale = keyof typeof LOCALES
type LocaleName = (typeof LOCALES)[Locale]

type LocalizedSiteMetadata = typeof siteMetadata

const getCurrentLocale = async (): Promise<Locale> => {
  const locale = (await headers()).get(LOCALE_HEADER)
  if (!locale || !isValidLocale(locale)) throw new Error('Invalid locale page request:' + locale)
  return locale
}

const isValidLocale = (locale: string): boolean => {
  return Object.keys(LOCALES).includes(locale)
}

const getLocaleByPathname = (pathname: string): Locale | 400 | null => {
  // match /us/en/ (country/language) or /en/ (language)
  const [_, countryOrLanguageCode, languageCode] =
    pathname.match(LANGUAGE_COUNTRY_MATCH_REGEX) ?? []

  if (!countryOrLanguageCode) return null

  const locale = (
    languageCode ? `${languageCode}-${countryOrLanguageCode.toUpperCase()}` : countryOrLanguageCode
  ) as Locale

  if (!isValidLocale(locale)) return 400

  return locale
}

const getAllContentByLocale = (content: DocumentTypes[], locale: Locale) => {
  return content.filter((item) => item.locale === locale) as DocumentTypes[]
}

const getAllBlogs = async (): Promise<Blog[]> => {
  const locale = await getCurrentLocale()
  return getAllContentByLocale(allBlogs as Blog[], locale) as Blog[]
}

const getAllAuthors = async (): Promise<Authors[]> => {
  const locale = await getCurrentLocale()
  return getAllContentByLocale(allAuthors as Authors[], locale) as Authors[]
}

type TranslateFn = (text: keyof typeof translationsText, ...args: (string | number)[]) => string

const getTranslation = (locale: Locale) => {
  const translateFn: TranslateFn = (text, ...args) => {
    const template = translationsText[text][locale] || text

    let i = 0
    return template.replace(/%%/g, () => {
      return args[i++]?.toString() || ''
    })
  }

  return translateFn
}

const getTranslationPage = async (): Promise<TranslateFn> => {
  const locale = await getCurrentLocale()
  return getTranslation(locale)
}

const getSiteMetadata = async (): Promise<LocalizedSiteMetadata> => {
  const locale = await getCurrentLocale()
  return siteMetadata[locale]
}

export { allBlogs, allAuthors } from '.contentlayer/generated'
export type { Blog, Authors } from '.contentlayer/generated'

export {
  getLocaleByPathname,
  getAllBlogs,
  getAllAuthors,
  getTranslation,
  getTranslationPage,
  getSiteMetadata,
}

export type { Locale, LocaleName, TranslateFn }
