import { DocumentTypes } from '.contentlayer/generated'
import { allBlogs, allAuthors } from '.contentlayer/generated'
import type { Blog, Authors } from '.contentlayer/generated'
import translationsText from '@/data/translations.json'
import { headers } from 'next/headers'
import tagData from './tag-data.json'
import siteMetadata from '@/data/siteMetadata'

const LOCALES = {
  en: 'en',
  ne: 'ne',
}
const LANGUAGE_COUNTRY_MATCH_REGEX = /^\/([a-z]{2})(?:\/([a-z]{2}))?(?=\/|$)/
const LOCALE_HEADER = 'x-locale'

type Locale = keyof typeof LOCALES
type LocaleName = (typeof LOCALES)[Locale]

type SiteMetadata = (typeof siteMetadata)[Locale]

const getCurrentLocale = async (): Promise<Locale> => {
  const locale = (await headers()).get(LOCALE_HEADER)
  if (!locale || !isValidLocale(locale)) throw new Error('Invalid locale page request:' + locale)
  return locale as Locale
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

  return locale as Locale
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

const getAllTags = async (): Promise<Record<string, number>> => {
  const locale = await getCurrentLocale()
  return tagData[locale]
}

type TranslationText = keyof typeof translationsText
type TranslationFn = (text: TranslationText, ...args: (string | number)[]) => string

const getTranslationByLocale = (locale: Locale) => {
  const translateFn: TranslationFn = (text, ...args) => {
    const template = translationsText[text][locale] || text

    let i = 0
    return template.replace(/%%/g, () => {
      return args[i++]?.toString() || ''
    })
  }

  return translateFn
}

const getTranslation = async (): Promise<TranslationFn> => {
  const locale = await getCurrentLocale()
  return getTranslationByLocale(locale)
}

const getSiteMetadata = async (): Promise<SiteMetadata> => {
  const locale = await getCurrentLocale()
  return siteMetadata[locale]
}

const getSEOLocale = async (): Promise<string> => {
  const locale = await getCurrentLocale()
  return locale.replace('-', '_')
}

export type { Blog, Authors } from '.contentlayer/generated'

export {
  getLocaleByPathname,
  getAllBlogs,
  getAllAuthors,
  getAllTags,
  getTranslation,
  getCurrentLocale,
  getSiteMetadata,
  getSEOLocale,
}

export { LANGUAGE_COUNTRY_MATCH_REGEX, LOCALE_HEADER }

export type { Locale, TranslationFn, TranslationText }
