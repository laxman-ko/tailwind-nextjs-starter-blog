import headerNavLinks from '@/data/headerNavLinks'
import siteMetadata from '@/data/siteMetadata'
import translationsText from '@/data/translations.json'
import projectsData from '@/data/projectsData'

const LOCALES = {
  en: 'en',
  ne: 'ne',
}

export const LOCALE_DEFAULT: Locale = 'ne'

export const LANGUAGE_COUNTRY_MATCH_REGEX = /^\/([a-z]{2})(?:\/([a-z]{2}))?(?=\/|$)/
export const LOCALE_HEADER = 'x-locale'

export type Locale = keyof typeof LOCALES
export type LocaleName = (typeof LOCALES)[Locale]
export type HeaderNavLink = (typeof headerNavLinks)[Locale][number]
export type SiteMetadata = (typeof siteMetadata)[Locale]

export type Project = (typeof projectsData)[Locale][number]

export type TranslationText = keyof typeof translationsText
export type TranslationFn = (text: TranslationText, ...args: (string | number)[]) => string
export type TranslationHelperFn = (
  locale: Locale,
  text: TranslationText,
  ...args: (string | number)[]
) => string

export const translationHelperFn: TranslationHelperFn = (locale, text, ...args) => {
  if (!text) return text

  const template = translationsText[text]?.[locale] || text
  let i = 0
  return template.replace(/%%/g, () => {
    return args[i++]?.toString() || ''
  })
}

export const isValidLocale = (locale: string): boolean => {
  return Object.keys(LOCALES).includes(locale)
}

export const getLocaleFromPathname = (pathname: string): Locale | 400 | null => {
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
