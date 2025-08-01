import { Locale } from '@/data/types'

export const LANGUAGE_COUNTRY_MATCH_REGEX = /^\/([a-z]{2})(?:\/([a-z]{2}))?(?=\/|$)/

export const getLocaleByPathname = (pathname: string): Locale | null => {
  // match /us/en/ (country/language) or /en/ (language)
  const [_, countryOrLanguageCode, languageCode] =
    pathname.match(LANGUAGE_COUNTRY_MATCH_REGEX) ?? []

  if (!countryOrLanguageCode) return null

  if (!languageCode) return `${countryOrLanguageCode}` as Locale

  return `${languageCode}-${countryOrLanguageCode.toUpperCase()}` as Locale
}
