import siteMetadata from '@/data/siteMetadata'

export const LOCALES = siteMetadata.locales

export const LANGUAGE_COUNTRY_MATCH_REGEX = /^\/([a-z]{2})(?:\/([a-z]{2}))?(?=\/|$)/

export type Locale = keyof typeof LOCALES
export type LocaleName = (typeof LOCALES)[Locale]

export const isValidLocale = (locale: string): boolean => {
  return Object.keys(LOCALES).includes(locale)
}

export const getLocaleByPathname = (pathname: string): Locale | 400 | null => {
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

export const getSiteLanguage = async (locale: Locale): Promise<string> => {
  return locale?.split('-')[0] || siteMetadata.language
}

export const getLocaleFromQuery = (query: string): Locale | null => {
  const locale = query.split('-')[0]
  if (!isValidLocale(locale)) return null
  return locale as Locale
}
